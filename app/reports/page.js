'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Download,
  Filter,
  Calendar as CalendarIcon,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  MapPin,
  Eye,
  FileText,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [reportData, setReportData] = useState(null);

  const periods = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const events = [
    { id: 'all', name: 'Todos os Eventos' },
    { id: 'tech-conf-2024', name: 'Tech Conference 2024' },
    { id: 'workshop-design', name: 'Workshop de Design' },
    { id: 'startup-pitch', name: 'Startup Pitch Day' }
  ];

  // Simular dados de relatórios
  useEffect(() => {
    const generateReportData = () => {
      const baseDate = new Date();
      const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 365;
      
      const generateTimeSeriesData = (days, baseValue, variance) => {
        return Array.from({ length: days }, (_, i) => {
          const date = new Date(baseDate);
          date.setDate(date.getDate() - (days - i - 1));
          const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 a 1.2
          return {
            date: date.toISOString().split('T')[0],
            value: Math.floor(baseValue * randomFactor * (1 + (i / days) * 0.3))
          };
        });
      };

      const generateEventData = () => {
        return events.filter(e => e.id !== 'all').map(event => ({
          id: event.id,
          name: event.name,
          participants: Math.floor(Math.random() * 500) + 100,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          conversionRate: (Math.random() * 0.4) + 0.3, // 30-70%
          satisfaction: (Math.random() * 2) + 3, // 3-5 estrelas
          checkInRate: (Math.random() * 0.3) + 0.6, // 60-90%
          avgTicketPrice: Math.floor(Math.random() * 200) + 50
        }));
      };

      return {
        overview: {
          totalEvents: Math.floor(Math.random() * 20) + 10,
          totalParticipants: Math.floor(Math.random() * 5000) + 2000,
          totalRevenue: Math.floor(Math.random() * 500000) + 200000,
          avgConversionRate: (Math.random() * 0.3) + 0.4, // 40-70%
          avgSatisfaction: (Math.random() * 1) + 4, // 4-5 estrelas
          totalCheckIns: Math.floor(Math.random() * 4000) + 1500
        },
        trends: {
          participants: generateTimeSeriesData(days, 150, 0.3),
          revenue: generateTimeSeriesData(days, 8000, 0.4),
          registrations: generateTimeSeriesData(days, 200, 0.5),
          checkIns: generateTimeSeriesData(days, 120, 0.4)
        },
        events: generateEventData(),
        demographics: {
          ageGroups: [
            { group: '18-25', percentage: Math.floor(Math.random() * 20) + 15 },
            { group: '26-35', percentage: Math.floor(Math.random() * 30) + 25 },
            { group: '36-45', percentage: Math.floor(Math.random() * 25) + 20 },
            { group: '46-55', percentage: Math.floor(Math.random() * 20) + 15 },
            { group: '55+', percentage: Math.floor(Math.random() * 15) + 10 }
          ],
          locations: [
            { city: 'São Paulo', participants: Math.floor(Math.random() * 1000) + 500 },
            { city: 'Rio de Janeiro', participants: Math.floor(Math.random() * 800) + 400 },
            { city: 'Belo Horizonte', participants: Math.floor(Math.random() * 600) + 300 },
            { city: 'Brasília', participants: Math.floor(Math.random() * 500) + 200 },
            { city: 'Outros', participants: Math.floor(Math.random() * 800) + 400 }
          ],
          sources: [
            { source: 'Google Ads', percentage: Math.floor(Math.random() * 30) + 20 },
            { source: 'Redes Sociais', percentage: Math.floor(Math.random() * 25) + 20 },
            { source: 'Email Marketing', percentage: Math.floor(Math.random() * 20) + 15 },
            { source: 'Indicação', percentage: Math.floor(Math.random() * 15) + 10 },
            { source: 'Outros', percentage: Math.floor(Math.random() * 15) + 10 }
          ]
        },
        performance: {
          topEvents: generateEventData().sort((a, b) => b.revenue - a.revenue).slice(0, 5),
          topPerformers: [
            { name: 'João Silva', events: Math.floor(Math.random() * 10) + 5, revenue: Math.floor(Math.random() * 100000) + 50000 },
            { name: 'Maria Santos', events: Math.floor(Math.random() * 8) + 4, revenue: Math.floor(Math.random() * 80000) + 40000 },
            { name: 'Pedro Oliveira', events: Math.floor(Math.random() * 6) + 3, revenue: Math.floor(Math.random() * 60000) + 30000 }
          ]
        }
      };
    };

    setTimeout(() => {
      setReportData(generateReportData());
      setIsLoading(false);
    }, 1500);
  }, [selectedPeriod]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const exportReport = (format) => {
    if (!reportData) return;

    let content, filename, mimeType;

    if (format === 'csv') {
      const csvData = [
        ['Métrica', 'Valor'],
        ['Total de Eventos', reportData.overview.totalEvents],
        ['Total de Participantes', reportData.overview.totalParticipants],
        ['Receita Total', formatCurrency(reportData.overview.totalRevenue)],
        ['Taxa de Conversão Média', formatPercentage(reportData.overview.avgConversionRate)],
        ['Satisfação Média', reportData.overview.avgSatisfaction.toFixed(1) + ' estrelas'],
        ['Total de Check-ins', reportData.overview.totalCheckIns]
      ];

      content = csvData.map(row => row.join(',')).join('\n');
      filename = `relatorio-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'pdf') {
      // Simular geração de PDF
      content = 'Relatório em PDF seria gerado aqui';
      filename = `relatorio-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`;
      mimeType = 'application/pdf';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-300">Gerando relatórios...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Relatórios e Analytics
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Análise completa de performance e métricas dos eventos
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white px-4 py-2 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white px-4 py-2 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showFilters && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Filtros Avançados</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Categoria
                </label>
                <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option>Todas as Categorias</option>
                  <option>Tecnologia</option>
                  <option>Negócios</option>
                  <option>Educação</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total de Eventos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reportData.overview.totalEvents}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +12% vs período anterior
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Participantes</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reportData.overview.totalParticipants.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +8% vs período anterior
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Receita Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(reportData.overview.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +15% vs período anterior
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatPercentage(reportData.overview.avgConversionRate)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +5% vs período anterior
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tendência de Participantes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Tendência de Participantes
              </h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-1">
              {reportData.trends.participants.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{
                      height: `${(day.value / Math.max(...reportData.trends.participants.map(d => d.value))) * 200}px`
                    }}
                  ></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Crescimento consistente de {Math.floor(Math.random() * 20) + 10}% no período
              </p>
            </div>
          </div>

          {/* Receita por Evento */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Receita por Evento
              </h3>
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {reportData.events.slice(0, 5).map((event, index) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {event.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency(event.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análise Demográfica */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Faixa Etária */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Faixa Etária
              </h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-3">
              {reportData.demographics.ageGroups.map((group, index) => (
                <div key={group.group} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {group.group}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                      {group.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Localização
              </h3>
              <MapPin className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-3">
              {reportData.demographics.locations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {location.city}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {location.participants.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fontes de Tráfego */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Fontes de Tráfego
              </h3>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-3">
              {reportData.demographics.sources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {source.source}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance e Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Eventos */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Top Eventos por Receita
              </h3>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {reportData.performance.topEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {event.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {event.participants} participantes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(event.revenue)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatPercentage(event.conversionRate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Top Organizadores
              </h3>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {reportData.performance.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {performer.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {performer.events} eventos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(performer.revenue)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Média: {formatCurrency(performer.revenue / performer.events)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações e Exportação */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Exportar Relatório
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Baixe os dados em diferentes formatos para análise externa
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportReport('csv')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
              
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar PDF</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
