'use client';

import { useState } from 'react';
import { 
  Plus, 
  Users, 
  QrCode, 
  BarChart3, 
  Calendar,
  UserCheck,
  Settings,
  TrendingUp
} from 'lucide-react';

export default function QuickActionsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    {
      id: 'create-event',
      title: 'Criar Evento',
      description: 'Criar um novo evento com todas as configurações',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/events/create',
      stats: '12 eventos criados este mês'
    },
    {
      id: 'manage-participants',
      title: 'Gerenciar Participantes',
      description: 'Visualizar, editar e gerenciar inscrições',
      icon: Users,
      color: 'bg-green-500',
      href: '/participants',
      stats: '156 participantes ativos'
    },
    {
      id: 'generate-qr',
      title: 'Gerar QR Codes',
      description: 'Criar QR codes para check-in e validação',
      icon: QrCode,
      color: 'bg-purple-500',
      href: '/qr-generator',
      stats: '89 QR codes gerados'
    },
    {
      id: 'view-reports',
      title: 'Ver Relatórios',
      description: 'Analisar métricas e performance dos eventos',
      icon: BarChart3,
      color: 'bg-orange-500',
      href: '/reports',
      stats: '23 relatórios disponíveis'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Evento criado',
      title: 'Tech Conference 2024',
      time: '2 horas atrás',
      status: 'success'
    },
    {
      id: 2,
      action: 'QR Code gerado',
      title: 'Workshop de Design',
      time: '4 horas atrás',
      status: 'info'
    },
    {
      id: 3,
      action: 'Participante inscrito',
      title: 'João Silva',
      time: '6 horas atrás',
      status: 'success'
    }
  ];

  const handleQuickAction = async (actionId: string) => {
    setIsLoading(true);
    // Simular delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    
    // Navegar para a página correspondente
    const action = quickActions.find(a => a.id === actionId);
    if (action?.href) {
      window.location.href = action.href;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Ações Rápidas
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Acesse rapidamente as funcionalidades mais utilizadas
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-slate-200 dark:border-slate-700"
              onClick={() => handleQuickAction(action.id)}
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  {action.description}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {action.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Eventos Ativos
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  8
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Participantes
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  1,247
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Taxa de Conversão
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  68%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {activity.title}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-slate-900 dark:text-white">Carregando...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
