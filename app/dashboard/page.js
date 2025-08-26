'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Filter,
  MoreVertical,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 24,
    activeEvents: 8,
    totalParticipants: 1247,
    totalRevenue: 45680
  });

  const [recentEvents, setRecentEvents] = useState([
    {
      id: 1,
      name: 'Conferência de Tecnologia 2024',
      date: '2024-03-15',
      participants: 156,
      status: 'active',
      revenue: 15600
    },
    {
      id: 2,
      name: 'Workshop de Marketing Digital',
      date: '2024-03-20',
      participants: 89,
      status: 'upcoming',
      revenue: 8900
    },
    {
      id: 3,
      name: 'Seminário de Inovação',
      date: '2024-03-25',
      participants: 234,
      status: 'upcoming',
      revenue: 23400
    }
  ]);

  const [quickActions] = useState([
    { icon: Plus, label: 'Criar Evento', color: 'blue', action: () => console.log('Criar evento') },
    { icon: Users, label: 'Gerenciar Participantes', color: 'green', action: () => console.log('Gerenciar participantes') },
    { icon: QrCode, label: 'Gerar QR Codes', color: 'purple', action: () => console.log('Gerar QR codes') },
    { icon: BarChart3, label: 'Ver Relatórios', color: 'orange', action: () => console.log('Ver relatórios') }
  ]);

  const handleLogout = () => {
    // Em produção, limpar tokens de autenticação
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600">Bem-vindo ao EventSync</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar eventos, participantes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 sm:w-64 text-sm"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
              
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar eventos, participantes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
                
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 border border-gray-100 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total de Eventos</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500 ml-1 hidden sm:inline">vs mês passado</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 border border-gray-100 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Eventos Ativos</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-green-600">+8%</span>
              <span className="text-gray-500 ml-1 hidden sm:inline">vs mês passado</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 border border-gray-100 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalParticipants.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-green-600">+23%</span>
              <span className="text-gray-500 ml-1 hidden sm:inline">vs mês passado</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 border border-gray-100 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">R$ {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-green-600">+18%</span>
              <span className="text-gray-500 ml-1 hidden sm:inline">vs mês passado</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-white rounded-xl shadow-soft p-3 sm:p-4 border border-gray-100 hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${action.color}-600`} />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Eventos Recentes</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{event.name}</div>
                        <div className="text-xs text-gray-500">ID: #{event.id}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900">{new Date(event.date).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900">{event.participants}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'active' ? 'Ativo' : 'Próximo'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">R$ {event.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Participantes por Mês</h3>
            <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                <p className="text-sm sm:text-base">Gráfico de participantes</p>
                <p className="text-xs sm:text-sm">Integração com biblioteca de gráficos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Receita por Evento</h3>
            <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <CreditCard className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                <p className="text-sm sm:text-base">Gráfico de receita</p>
                <p className="text-xs sm:text-sm">Integração com biblioteca de gráficos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
