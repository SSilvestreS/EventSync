'use client';

import Link from 'next/link';
import { Plus, QrCode, BarChart3, Calendar, Users, Settings, Download, Share2 } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'Criar Evento',
      description: 'Configure um novo evento com todas as informações necessárias',
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/events/create',
      primary: true
    },
    {
      title: 'Gerar QR Codes',
      description: 'Crie QR codes para check-in dos participantes',
      icon: QrCode,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/qrcodes',
      primary: false
    },
    {
      title: 'Ver Relatórios',
      description: 'Analise métricas e performance dos seus eventos',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/analytics',
      primary: false
    },
    {
      title: 'Gerenciar Inscrições',
      description: 'Aprove, rejeite ou gerencie inscrições pendentes',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/registrations',
      primary: false
    },
    {
      title: 'Sincronizar Calendário',
      description: 'Integre com Google Calendar automaticamente',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/integrations/calendar',
      primary: false
    },
    {
      title: 'Configurações',
      description: 'Personalize notificações e preferências',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      href: '/settings',
      primary: false
    }
  ];

  const quickStats = [
    {
      label: 'Eventos Ativos',
      value: '3',
      change: '+1 este mês',
      positive: true
    },
    {
      label: 'Inscrições Pendentes',
      value: '12',
      change: '+5 hoje',
      positive: false
    },
    {
      label: 'Taxa de Conversão',
      value: '78%',
      change: '+3% este mês',
      positive: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Ações Rápidas */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`block p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${
                action.primary
                  ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Estatísticas Rápidas e Ferramentas */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Estatísticas Rápidas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Estatísticas Rápidas</h3>
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ferramentas Úteis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ferramentas Úteis</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Exportar Dados</p>
                  <p className="text-sm text-gray-600">CSV, Excel ou PDF</p>
                </div>
              </div>
              <span className="text-blue-600">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Share2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Compartilhar Evento</p>
                  <p className="text-sm text-gray-600">Links e redes sociais</p>
                </div>
              </div>
              <span className="text-green-600">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <QrCode className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Check-in Manual</p>
                  <p className="text-sm text-gray-600">Para participantes sem QR</p>
                </div>
              </div>
              <span className="text-purple-600">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Agendar Lembretes</p>
                  <p className="text-sm text-gray-600">Email e notificações</p>
                </div>
              </div>
              <span className="text-orange-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Nossa equipe de suporte está sempre pronta para ajudar você a organizar 
          eventos incríveis. Entre em contato para tirar dúvidas ou solicitar treinamento.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
            Falar com Suporte
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors">
            Ver Documentação
          </button>
        </div>
      </div>
    </div>
  );
}
