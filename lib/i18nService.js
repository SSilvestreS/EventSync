import { PrismaClient } from '@prisma/client';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const prisma = new PrismaClient();

class I18nService {
  constructor() {
    this.supportedLanguages = [
      { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
      { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
      { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
      { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
      { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
      { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
      { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
      { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
      { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' }
    ];

    this.defaultLanguage = 'pt-BR';
    this.fallbackLanguage = 'en-US';
    
    this.initializeI18n();
  }

  // Inicializa i18next
  initializeI18n() {
    i18next
      .use(Backend)
      .use(LanguageDetector)
      .init({
        fallbackLng: this.fallbackLanguage,
        debug: process.env.NODE_ENV === 'development',
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        },
        interpolation: {
          escapeValue: false,
        },
      });
  }

  // Obtém idioma atual
  getCurrentLanguage() {
    return i18next.language || this.defaultLanguage;
  }

  // Define idioma
  async setLanguage(languageCode) {
    try {
      if (!this.isLanguageSupported(languageCode)) {
        languageCode = this.fallbackLanguage;
      }

      await i18next.changeLanguage(languageCode);
      
      // Salva no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', languageCode);
      }

      return languageCode;
    } catch (error) {
      console.error('Erro ao definir idioma:', error);
      return this.fallbackLanguage;
    }
  }

  // Verifica se idioma é suportado
  isLanguageSupported(languageCode) {
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  // Obtém lista de idiomas suportados
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Obtém idioma do usuário
  async getUserLanguage(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { language: true }
      });

      if (user && user.language) {
        return user.language;
      }

      return this.defaultLanguage;
    } catch (error) {
      console.error('Erro ao obter idioma do usuário:', error);
      return this.defaultLanguage;
    }
  }

  // Define idioma do usuário
  async setUserLanguage(userId, languageCode) {
    try {
      if (!this.isLanguageSupported(languageCode)) {
        throw new Error('Idioma não suportado');
      }

      await prisma.user.update({
        where: { id: userId },
        data: { language: languageCode }
      });

      return true;
    } catch (error) {
      console.error('Erro ao definir idioma do usuário:', error);
      throw error;
    }
  }

  // Obtém preferências de idioma do usuário
  async getUserLanguagePreferences(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          preferences: true
        }
      });

      if (!user) {
        return this.getDefaultPreferences();
      }

      return {
        language: user.language || this.defaultLanguage,
        timezone: user.timezone || 'America/Sao_Paulo',
        dateFormat: user.preferences?.dateFormat || 'DD/MM/YYYY',
        timeFormat: user.preferences?.timeFormat || '24h',
        currency: user.preferences?.currency || 'BRL'
      };
    } catch (error) {
      console.error('Erro ao obter preferências de idioma:', error);
      return this.getDefaultPreferences();
    }
  }

  // Define preferências de idioma do usuário
  async setUserLanguagePreferences(userId, preferences) {
    try {
      const userPreferences = await prisma.userPreferences.upsert({
        where: { userId },
        update: {
          language: preferences.language,
          timezone: preferences.timezone,
          dateFormat: preferences.dateFormat,
          timeFormat: preferences.timeFormat,
          currency: preferences.currency,
          updatedAt: new Date()
        },
        create: {
          userId,
          language: preferences.language,
          timezone: preferences.timezone,
          dateFormat: preferences.dateFormat,
          timeFormat: preferences.timeFormat,
          currency: preferences.currency
        }
      });

      // Atualiza usuário também
      await prisma.user.update({
        where: { id: userId },
        data: {
          language: preferences.language,
          timezone: preferences.timezone
        }
      });

      return userPreferences;
    } catch (error) {
      console.error('Erro ao definir preferências de idioma:', error);
      throw error;
    }
  }

  // Obtém preferências padrão
  getDefaultPreferences() {
    return {
      language: this.defaultLanguage,
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'BRL'
    };
  }

  // Traduz texto
  translate(key, options = {}) {
    return i18next.t(key, options);
  }

  // Traduz texto com namespace
  translateWithNamespace(namespace, key, options = {}) {
    return i18next.t(key, { ns: namespace, ...options });
  }

  // Formata data de acordo com idioma
  formatDate(date, languageCode = null, format = null) {
    try {
      const lang = languageCode || this.getCurrentLanguage();
      const userPrefs = this.getDefaultPreferences();
      
      if (!format) {
        format = userPrefs.dateFormat;
      }

      const dateObj = new Date(date);
      
      // Formatação baseada no idioma
      switch (lang) {
        case 'pt-BR':
          return dateObj.toLocaleDateString('pt-BR');
        case 'en-US':
          return dateObj.toLocaleDateString('en-US');
        case 'es-ES':
          return dateObj.toLocaleDateString('es-ES');
        case 'fr-FR':
          return dateObj.toLocaleDateString('fr-FR');
        case 'de-DE':
          return dateObj.toLocaleDateString('de-DE');
        case 'it-IT':
          return dateObj.toLocaleDateString('it-IT');
        case 'ja-JP':
          return dateObj.toLocaleDateString('ja-JP');
        case 'ko-KR':
          return dateObj.toLocaleDateString('ko-KR');
        case 'zh-CN':
          return dateObj.toLocaleDateString('zh-CN');
        case 'ar-SA':
          return dateObj.toLocaleDateString('ar-SA');
        default:
          return dateObj.toLocaleDateString('pt-BR');
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return new Date(date).toLocaleDateString();
    }
  }

  // Formata hora de acordo com idioma
  formatTime(time, languageCode = null, format = null) {
    try {
      const lang = languageCode || this.getCurrentLanguage();
      const userPrefs = this.getDefaultPreferences();
      
      if (!format) {
        format = userPrefs.timeFormat;
      }

      const timeObj = new Date(`2000-01-01T${time}`);
      
      // Formatação baseada no idioma
      switch (lang) {
        case 'pt-BR':
        case 'es-ES':
        case 'fr-FR':
        case 'de-DE':
        case 'it-IT':
          return timeObj.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: format === '12h'
          });
        case 'en-US':
          return timeObj.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: format === '12h'
          });
        case 'ja-JP':
        case 'ko-KR':
        case 'zh-CN':
          return timeObj.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
          });
        case 'ar-SA':
          return timeObj.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
          });
        default:
          return timeObj.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: format === '12h'
          });
      }
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return time;
    }
  }

  // Formata moeda de acordo com idioma
  formatCurrency(amount, currency = null, languageCode = null) {
    try {
      const lang = languageCode || this.getCurrentLanguage();
      const curr = currency || this.getDefaultPreferences().currency;
      
      const formatter = new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 2
      });

      return formatter.format(amount);
    } catch (error) {
      console.error('Erro ao formatar moeda:', error);
      return `${amount} ${currency || 'BRL'}`;
    }
  }

  // Formata número de acordo com idioma
  formatNumber(number, options = {}) {
    try {
      const lang = this.getCurrentLanguage();
      
      const formatter = new Intl.NumberFormat(lang, {
        minimumFractionDigits: options.minimumFractionDigits || 0,
        maximumFractionDigits: options.maximumFractionDigits || 2,
        ...options
      });

      return formatter.format(number);
    } catch (error) {
      console.error('Erro ao formatar número:', error);
      return number.toString();
    }
  }

  // Obtém direção do texto (LTR/RTL)
  getTextDirection(languageCode = null) {
    const lang = languageCode || this.getCurrentLanguage();
    
    // Idiomas RTL
    const rtlLanguages = ['ar-SA', 'he-IL', 'fa-IR', 'ur-PK'];
    
    return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
  }

  // Obtém nome do idioma
  getLanguageName(languageCode) {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    return language ? language.name : languageCode;
  }

  // Obtém bandeira do idioma
  getLanguageFlag(languageCode) {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    return language ? language.flag : '🌐';
  }

  // Detecta idioma do navegador
  detectBrowserLanguage() {
    if (typeof window === 'undefined') {
      return this.defaultLanguage;
    }

    const browserLang = navigator.language || navigator.userLanguage;
    
    // Mapeia códigos de idioma do navegador para nossos códigos
    const languageMap = {
      'pt': 'pt-BR',
      'pt-BR': 'pt-BR',
      'pt-PT': 'pt-BR',
      'en': 'en-US',
      'en-US': 'en-US',
      'en-GB': 'en-US',
      'es': 'es-ES',
      'es-ES': 'es-ES',
      'es-MX': 'es-ES',
      'fr': 'fr-FR',
      'fr-FR': 'fr-FR',
      'fr-CA': 'fr-FR',
      'de': 'de-DE',
      'de-DE': 'de-DE',
      'de-AT': 'de-DE',
      'it': 'it-IT',
      'it-IT': 'it-IT',
      'ja': 'ja-JP',
      'ja-JP': 'ja-JP',
      'ko': 'ko-KR',
      'ko-KR': 'ko-KR',
      'zh': 'zh-CN',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-CN',
      'ar': 'ar-SA',
      'ar-SA': 'ar-SA'
    };

    const detectedLang = languageMap[browserLang] || this.defaultLanguage;
    
    return this.isLanguageSupported(detectedLang) ? detectedLang : this.defaultLanguage;
  }

  // Obtém idioma baseado na localização geográfica
  async getLanguageByLocation(ipAddress) {
    try {
      // Aqui você pode integrar com serviços como ipapi.co, ipinfo.io, etc.
      // Por enquanto, retorna idioma padrão
      return this.defaultLanguage;
    } catch (error) {
      console.error('Erro ao detectar idioma por localização:', error);
      return this.defaultLanguage;
    }
  }

  // Gera arquivo de traduções
  async generateTranslationFile(languageCode, namespace = 'common') {
    try {
      // Aqui você pode implementar a geração automática de arquivos de tradução
      // baseado no conteúdo do banco de dados
      
      const template = {
        language: languageCode,
        namespace,
        translations: {},
        generatedAt: new Date().toISOString()
      };

      return template;
    } catch (error) {
      console.error('Erro ao gerar arquivo de tradução:', error);
      throw error;
    }
  }

  // Sincroniza traduções com banco de dados
  async syncTranslationsWithDatabase() {
    try {
      // Aqui você pode implementar a sincronização de traduções
      // entre arquivos de idioma e banco de dados
      
      console.log('Sincronização de traduções concluída');
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar traduções:', error);
      throw error;
    }
  }

  // Obtém estatísticas de uso de idiomas
  async getLanguageUsageStats() {
    try {
      const users = await prisma.user.groupBy({
        by: ['language'],
        _count: {
          language: true
        }
      });

      const stats = users.map(stat => ({
        language: stat.language,
        count: stat._count.language,
        percentage: 0 // Será calculado abaixo
      }));

      const totalUsers = stats.reduce((sum, stat) => sum + stat.count, 0);
      
      stats.forEach(stat => {
        stat.percentage = totalUsers > 0 ? Math.round((stat.count / totalUsers) * 100 * 100) / 100 : 0;
      });

      return {
        totalUsers,
        stats: stats.sort((a, b) => b.count - a.count)
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de uso de idiomas:', error);
      return { totalUsers: 0, stats: [] };
    }
  }

  // Valida arquivo de tradução
  validateTranslationFile(translations) {
    try {
      const requiredKeys = ['language', 'namespace', 'translations'];
      const missingKeys = requiredKeys.filter(key => !(key in translations));
      
      if (missingKeys.length > 0) {
        throw new Error(`Chaves obrigatórias ausentes: ${missingKeys.join(', ')}`);
      }

      if (typeof translations.translations !== 'object') {
        throw new Error('Traduções devem ser um objeto');
      }

      return true;
    } catch (error) {
      console.error('Erro ao validar arquivo de tradução:', error);
      return false;
    }
  }

  // Obtém idiomas mais populares
  async getPopularLanguages(limit = 5) {
    try {
      const stats = await this.getLanguageUsageStats();
      
      return stats.stats
        .slice(0, limit)
        .map(stat => ({
          code: stat.language,
          name: this.getLanguageName(stat.language),
          flag: this.getLanguageFlag(stat.language),
          count: stat.count,
          percentage: stat.percentage
        }));
    } catch (error) {
      console.error('Erro ao obter idiomas populares:', error);
      return [];
    }
  }

  // Obtém idiomas por região
  getLanguagesByRegion() {
    return {
      'Americas': ['pt-BR', 'en-US', 'es-ES'],
      'Europe': ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'],
      'Asia': ['ja-JP', 'ko-KR', 'zh-CN'],
      'Middle East': ['ar-SA'],
      'Africa': ['en-US', 'fr-FR', 'ar-SA']
    };
  }

  // Obtém idiomas por família linguística
  getLanguagesByFamily() {
    return {
      'Romance': ['pt-BR', 'es-ES', 'fr-FR', 'it-IT'],
      'Germanic': ['en-US', 'de-DE'],
      'Slavic': [],
      'Uralic': [],
      'Semitic': ['ar-SA'],
      'Sino-Tibetan': ['zh-CN'],
      'Japonic': ['ja-JP'],
      'Koreanic': ['ko-KR']
    };
  }
}

export default new I18nService();
