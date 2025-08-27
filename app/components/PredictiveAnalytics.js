'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export default function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('all');

  const events = [
    { id: 'all', name: 'Todos os Eventos' },
    { id: 'tech-conf', name: 'Tech Conference 2024' },
    { id: 'workshop', name: 'Workshop de Design' },
    { id: 'startup-day', name: 'Startup Pitch Day' }
  ];

  // Simular dados de ML
  useEffect(() => {
    const generatePredictions = () => {
      const baseAttendance = Math.floor(Math.random() * 500) + 200;
      const conversionRate = (Math.random() * 0.3) + 0.6; // 60-90%
      const revenue = baseAttendance * 150 * conversionRate;
      
      return {
        attendance: {
          predicted: baseAttendance,
          confidence: (Math.random() * 0.2) + 0.8, // 80-100%
          trend: Math.random() > 0.5 ? 'up' : 'down',
          factors: ['Marketing digital', 'Redes sociais', 'Email marketing', 'Parcerias']
        },
        conversion: {
          predicted: (conversionRate * 100).toFixed(1),
          confidence: (Math.random() * 0.15) + 0.85,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          factors: ['Preço competitivo', 'Localização', 'Programação', 'Networking']
        },
        revenue: {
          predicted: Math.floor(revenue),
          confidence: (Math.random() * 0.2) + 0.8,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          factors: ['Preço do ingresso', 'Número de participantes', 'Patrocínios', 'Vendas extras']
        },
        recommendations: [
          {
            type: 'marketing',
            title: 'Otimizar Campanha Digital',
            description: 'Aumentar investimento em Google Ads e redes sociais',
            impact: 'Alto',
            effort: 'Médio',
            priority: 'Alta'
          },
          {
            type: 'pricing',
            title: 'Ajustar Estratégia de Preços',
            description: 'Implementar preços dinâmicos baseados na demanda',
            impact: 'Alto',
            effort: 'Baixo',
            priority: 'Média'
          },
          {
            type: 'timing',
            title: 'Melhorar Timing de Lançamento',
            description: 'Lançar inscrições 3 meses antes do evento',
            impact: 'Médio',
            effort: 'Baixo',
            priority: 'Alta'
          }
        ],
        insights: [
          {
            type: 'positive',
            title: 'Alta demanda para eventos de tecnologia',
            description: 'O mercado mostra forte interesse em eventos tech',
            icon: CheckCircle,
            color: 'text-green-500'
          },
          {
            type: 'warning',
            title: 'Concorrência aumentando',
            description: 'Novos eventos similares podem impactar conversões',
            icon: AlertTriangle,
            color: 'text-yellow-500'
          },
          {
            type: 'opportunity',
            title: 'Potencial para eventos híbridos',
            description: '70% dos participantes preferem opção híbrida',
            icon: Lightbulb,
            color: 'text-blue-500'
          }
        ]
      };
    };

    // Simular delay de processamento ML
    setTimeout(() => {
      setPredictions(generatePredictions());
      setIsLoading(false);
    }, 2000);
  }, [selectedEvent]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Analisando dados com IA...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!predictions) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Análise Preditiva com IA
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Insights baseados em machine learning para otimizar seus eventos
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Precisão: {(predictions.attendance.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Event Selector */}
        <div className="flex space-x-2">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedEvent === event.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Prediction */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Participantes Previstos
            </h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {predictions.attendance.predicted.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className={`w-4 h-4 ${
              predictions.attendance.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className={`text-sm ${
              predictions.attendance.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {predictions.attendance.trend === 'up' ? '+' : '-'}12% vs último evento
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fatores principais:
            </p>
            {predictions.attendance.factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-600 dark:text-slate-300">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Prediction */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Taxa de Conversão
            </h3>
            <BarChart3 className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {predictions.conversion.predicted}%
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className={`w-4 h-4 ${
              predictions.conversion.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className={`text-sm ${
              predictions.conversion.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {predictions.conversion.trend === 'up' ? '+' : '-'}8% vs último evento
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fatores principais:
            </p>
            {predictions.conversion.factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-600 dark:text-slate-300">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Prediction */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Receita Prevista
            </h3>
            <DollarSign className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            R$ {predictions.revenue.predicted.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className={`w-4 h-4 ${
              predictions.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className={`text-sm ${
              predictions.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {predictions.revenue.trend === 'up' ? '+' : '-'}15% vs último evento
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fatores principais:
            </p>
            {predictions.revenue.factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-slate-600 dark:text-slate-300">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Recomendações da IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {rec.title}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  rec.priority === 'Alta' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  rec.priority === 'Média' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                {rec.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Impacto: <span className="font-medium">{rec.impact}</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Esforço: <span className="font-medium">{rec.effort}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Insights Automáticos
        </h3>
        <div className="space-y-4">
          {predictions.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <insight.icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {insight.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
