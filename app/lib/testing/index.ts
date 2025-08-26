import { getConfig } from '../../config';
import { createModuleLogger } from '../logger';
import { monitoring } from '../monitoring';

// Logger específico para testes
const testingLogger = createModuleLogger('Testing');

// Interfaces para o sistema de testes
export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  status: 'passed' | 'failed' | 'partial';
}

export interface TestReport {
  suites: TestSuite[];
  totalSuites: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDuration: number;
  coverage: number;
  timestamp: number;
}

export interface TestConfig {
  timeout: number;
  retries: number;
  parallel: boolean;
  coverage: boolean;
  watch: boolean;
  verbose: boolean;
}

// Classe principal de testes
export class TestingSystem {
  private testSuites: Map<string, TestSuite> = new Map();
  private config: TestConfig;
  private startTime: number = 0;
  private isRunning: boolean = false;

  constructor() {
    this.config = {
      timeout: getConfig('testing').timeout || 30000,
      retries: getConfig('testing').retries || 1,
      parallel: getConfig('testing').parallel || false,
      coverage: getConfig('testing').coverage || false,
      watch: getConfig('testing').watch || false,
      verbose: getConfig('testing').verbose || false,
    };

    testingLogger.info('Sistema de testes inicializado', { config: this.config });
  }

  // Executa uma suíte de testes
  async runTestSuite(suiteName: string, testFunctions: Array<{ name: string; fn: () => Promise<void> }>): Promise<TestSuite> {
    const startTime = Date.now();
    const tests: TestResult[] = [];
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    testingLogger.info(`Iniciando suíte de testes: ${suiteName}`, { 
      totalTests: testFunctions.length,
      parallel: this.config.parallel 
    });

    try {
      if (this.config.parallel) {
        // Executa testes em paralelo
        const testPromises = testFunctions.map(test => this.runSingleTest(test.name, test.fn));
        const results = await Promise.allSettled(testPromises);
        
        results.forEach((result, index) => {
          const test = testFunctions[index];
          if (result.status === 'fulfilled') {
            tests.push(result.value);
            if (result.value.status === 'passed') passedTests++;
            else if (result.value.status === 'failed') failedTests++;
            else skippedTests++;
          } else {
            const testResult: TestResult = {
              name: test.name,
              status: 'failed',
              duration: 0,
              error: result.reason instanceof Error ? result.reason.message : String(result.reason),
            };
            tests.push(testResult);
            failedTests++;
          }
        });
      } else {
        // Executa testes sequencialmente
        for (const test of testFunctions) {
          const result = await this.runSingleTest(test.name, test.fn);
          tests.push(result);
          
          if (result.status === 'passed') passedTests++;
          else if (result.status === 'failed') failedTests++;
          else skippedTests++;
        }
      }

    } catch (error) {
      testingLogger.error(`Erro ao executar suíte de testes: ${suiteName}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const duration = Date.now() - startTime;
    const status: 'passed' | 'failed' | 'partial' = 
      failedTests === 0 ? 'passed' : 
      passedTests === 0 ? 'failed' : 'partial';

    const testSuite: TestSuite = {
      name: suiteName,
      tests,
      totalTests: testFunctions.length,
      passedTests,
      failedTests,
      skippedTests,
      duration,
      status,
    };

    this.testSuites.set(suiteName, testSuite);

    // Registra métricas de teste
    monitoring.metrics.record('test_suite_duration', duration, {
      unit: 'ms',
      tags: { suite: suiteName, status },
    });

    monitoring.metrics.record('test_suite_passed', passedTests, {
      unit: 'count',
      tags: { suite: suiteName, type: 'passed' },
    });

    monitoring.metrics.record('test_suite_failed', failedTests, {
      unit: 'count',
      tags: { suite: suiteName, type: 'failed' },
    });

    testingLogger.info(`Suíte de testes concluída: ${suiteName}`, {
      status,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      duration: `${duration}ms`,
    });

    return testSuite;
  }

  // Executa um teste individual
  private async runSingleTest(testName: string, testFunction: () => Promise<void>): Promise<TestResult> {
    const startTime = Date.now();
    let retries = 0;
    let lastError: Error | null = null;

    while (retries <= this.config.retries) {
      try {
        await Promise.race([
          testFunction(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`Timeout após ${this.config.timeout}ms`)), this.config.timeout)
          ),
        ]);

        const duration = Date.now() - startTime;
        const result: TestResult = {
          name: testName,
          status: 'passed',
          duration,
        };

        // Registra métrica de teste bem-sucedido
        monitoring.metrics.record('test_duration', duration, {
          unit: 'ms',
          tags: { test: testName, status: 'passed' },
        });

        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        retries++;

        if (retries <= this.config.retries) {
          testingLogger.warn(`Teste falhou, tentativa ${retries}/${this.config.retries + 1}: ${testName}`, {
            error: lastError.message,
            retry: retries,
          });

          // Aguarda um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    const duration = Date.now() - startTime;
    const result: TestResult = {
      name: testName,
      status: 'failed',
      duration,
      error: lastError?.message || 'Erro desconhecido',
    };

    // Registra métrica de teste falhado
    monitoring.metrics.record('test_duration', duration, {
      unit: 'ms',
      tags: { test: testName, status: 'failed' },
    });

    monitoring.metrics.error(lastError!, { test: testName, retries });

    return result;
  }

  // Executa todos os testes
  async runAllTests(): Promise<TestReport> {
    if (this.isRunning) {
      throw new Error('Testes já estão em execução');
    }

    this.isRunning = true;
    this.startTime = Date.now();

    testingLogger.info('Iniciando execução de todos os testes', {
      totalSuites: this.testSuites.size,
      config: this.config,
    });

    try {
      const suites = Array.from(this.testSuites.values());
      let totalTests = 0;
      let totalPassed = 0;
      let totalFailed = 0;
      let totalSkipped = 0;

      for (const suite of suites) {
        totalTests += suite.totalTests;
        totalPassed += suite.passedTests;
        totalFailed += suite.failedTests;
        totalSkipped += suite.skippedTests;
      }

      const totalDuration = Date.now() - this.startTime;
      const coverage = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

      const report: TestReport = {
        suites,
        totalSuites: suites.length,
        totalTests,
        totalPassed,
        totalFailed,
        totalSkipped,
        totalDuration,
        coverage,
        timestamp: Date.now(),
      };

      // Registra métricas finais
      monitoring.metrics.record('test_total_duration', totalDuration, {
        unit: 'ms',
        tags: { type: 'all_tests' },
      });

      monitoring.metrics.record('test_coverage', coverage, {
        unit: 'percentage',
        tags: { type: 'overall' },
      });

      monitoring.metrics.business('test_execution', totalTests, {
        passed: totalPassed,
        failed: totalFailed,
        skipped: totalSkipped,
        coverage,
      });

      testingLogger.info('Execução de todos os testes concluída', {
        totalTests,
        passed: totalPassed,
        failed: totalFailed,
        skipped: totalSkipped,
        coverage: `${coverage.toFixed(2)}%`,
        duration: `${totalDuration}ms`,
      });

      return report;

    } finally {
      this.isRunning = false;
    }
  }

  // Adiciona uma suíte de testes
  addTestSuite(suiteName: string, testFunctions: Array<{ name: string; fn: () => Promise<void> }>): void {
    const testSuite: TestSuite = {
      name: suiteName,
      tests: [],
      totalTests: testFunctions.length,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0,
      status: 'passed',
    };

    this.testSuites.set(suiteName, testSuite);

    testingLogger.info(`Suíte de testes adicionada: ${suiteName}`, {
      totalTests: testFunctions.length,
    });
  }

  // Remove uma suíte de testes
  removeTestSuite(suiteName: string): boolean {
    const removed = this.testSuites.delete(suiteName);
    
    if (removed) {
      testingLogger.info(`Suíte de testes removida: ${suiteName}`);
    }

    return removed;
  }

  // Obtém uma suíte de testes
  getTestSuite(suiteName: string): TestSuite | undefined {
    return this.testSuites.get(suiteName);
  }

  // Obtém todas as suítes de testes
  getAllTestSuites(): TestSuite[] {
    return Array.from(this.testSuites.values());
  }

  // Obtém estatísticas dos testes
  getTestStats(): { totalSuites: number; totalTests: number; totalPassed: number; totalFailed: number; totalSkipped: number } {
    const suites = Array.from(this.testSuites.values());
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const suite of suites) {
      totalTests += suite.totalTests;
      totalPassed += suite.passedTests;
      totalFailed += suite.failedTests;
      totalSkipped += suite.skippedTests;
    }

    return {
      totalSuites: suites.length,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
    };
  }

  // Limpa todos os resultados de testes
  clearTestResults(): void {
    for (const suite of this.testSuites.values()) {
      suite.tests = [];
      suite.passedTests = 0;
      suite.failedTests = 0;
      suite.skippedTests = 0;
      suite.duration = 0;
      suite.status = 'passed';
    }

    testingLogger.info('Resultados de testes limpos');
  }

  // Configura o sistema de testes
  configure(config: Partial<TestConfig>): void {
    this.config = { ...this.config, ...config };
    
    testingLogger.info('Configuração de testes atualizada', { config: this.config });
  }

  // Verifica se os testes estão rodando
  isTestRunning(): boolean {
    return this.isRunning;
  }

  // Obtém tempo de execução atual
  getCurrentExecutionTime(): number {
    if (!this.isRunning) return 0;
    return Date.now() - this.startTime;
  }
}

// Instância global do sistema de testes
export const testing = new TestingSystem();

// Funções de conveniência para testes
export const test = {
  // Executa um teste individual
  run: (name: string, testFunction: () => Promise<void>) => 
    testing.runSingleTest(name, testFunction),
  
  // Executa uma suíte de testes
  suite: (suiteName: string, testFunctions: Array<{ name: string; fn: () => Promise<void> }>) => 
    testing.runTestSuite(suiteName, testFunctions),
  
  // Executa todos os testes
  all: () => testing.runAllTests(),
  
  // Adiciona uma suíte de testes
  add: (suiteName: string, testFunctions: Array<{ name: string; fn: () => Promise<void> }>) => 
    testing.addTestSuite(suiteName, testFunctions),
  
  // Remove uma suíte de testes
  remove: (suiteName: string) => testing.removeTestSuite(suiteName),
  
  // Obtém estatísticas
  stats: () => testing.getTestStats(),
  
  // Limpa resultados
  clear: () => testing.clearTestResults(),
  
  // Configura o sistema
  configure: (config: Partial<TestConfig>) => testing.configure(config),
};

// Utilitários para testes
export const testUtils = {
  // Aguarda um tempo específico
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock de função
  mock: <T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> => {
    return jest.fn(fn) as jest.MockedFunction<T>;
  },
  
  // Mock de objeto
  mockObject: <T extends Record<string, any>>(obj: T): jest.Mocked<T> => {
    return jest.mocked(obj);
  },
  
  // Spy em função
  spy: <T extends (...args: any[]) => any>(fn: T): jest.SpyInstance => {
    return jest.spyOn(fn as any, 'call' as any);
  },
  
  // Limpa todos os mocks
  clearMocks: () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  },
  
  // Verifica se uma função foi chamada
  wasCalled: (fn: jest.MockedFunction<any>): boolean => {
    return fn.mock.calls.length > 0;
  },
  
  // Verifica quantas vezes uma função foi chamada
  callCount: (fn: jest.MockedFunction<any>): number => {
    return fn.mock.calls.length;
  },
  
  // Verifica os argumentos da última chamada
  lastCallArgs: (fn: jest.MockedFunction<any>): any[] => {
    const calls = fn.mock.calls;
    return calls.length > 0 ? calls[calls.length - 1] : [];
  },
  
  // Verifica todos os argumentos de todas as chamadas
  allCallArgs: (fn: jest.MockedFunction<any>): any[][] => {
    return fn.mock.calls;
  },
};

// Função para inicializar sistema de testes
export function initializeTesting(): void {
  try {
    testingLogger.info('Sistema de testes inicializado', {
      config: testing['config'],
    });
  } catch (error) {
    testingLogger.error('Erro ao inicializar sistema de testes', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Exporta o sistema padrão
export default testing;
