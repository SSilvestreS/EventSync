'use client';

import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, BarChart3 } from 'lucide-react';

export default function MetricsOverview({ metrics }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const metricCards = [
    {
      title: 'Total de Eventos',
      value: metrics.totalEvents,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 este mês',
      changeType: 'positive'
    },
    {
      title: 'Total de Inscrições',
      value: metrics.totalRegistrations,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+156 este mês',
      changeType: 'positive'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+R$ 3.200 este mês',
      changeType: 'positive'
    },
    {
      title: 'Taxa de Presença',
      value: formatPercentage(metrics.averageAttendance),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+2.5% este mês',
      changeType: 'positive'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
        <p className="text-gray-600">Resumo das métricas principais dos seus eventos</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className="flex items-center text-sm">
                {metric.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Métricas do Mês */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Este Mês</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Eventos</span>
              <span className="font-semibold text-gray-900">{metrics.thisMonth.events}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inscrições</span>
              <span className="font-semibold text-gray-900">{metrics.thisMonth.registrations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receita</span>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.thisMonth.revenue)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Workshop de Desenvolvimento Web</p>
                <p className="text-sm text-gray-600">15 de Fevereiro</p>
              </div>
              <span className="text-sm text-blue-600 font-medium">35/50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Palestra sobre IA</p>
                <p className="text-sm text-gray-600">20 de Fevereiro</p>
              </div>
              <span className="text-sm text-green-600 font-medium">78/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <p className="font-medium text-gray-900">Criar Novo Evento</p>
              <p className="text-sm text-gray-600">Configure datas e detalhes</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <p className="font-medium text-gray-900">Ver Relatórios</p>
              <p className="text-sm text-gray-600">Analise o desempenho</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <p className="font-medium text-gray-900">Gerenciar Inscrições</p>
              <p className="text-sm text-gray-600">Aprove ou rejeite</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
