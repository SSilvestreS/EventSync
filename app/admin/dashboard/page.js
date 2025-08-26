'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Gift, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    activeCoupons: 0,
    totalCertificates: 0,
    whatsappMessages: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas básicas
      const [eventsRes, usersRes, registrationsRes, couponsRes, certificatesRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/users'),
        fetch('/api/registrations'),
        fetch('/api/coupons'),
        fetch('/api/certificates')
      ]);

      if (eventsRes.ok) {
        const events = await eventsRes.json();
        setStats(prev => ({ ...prev, totalEvents: events.length }));
      }

      if (usersRes.ok) {
        const users = await usersRes.json();
        setStats(prev => ({ ...prev, totalUsers: users.length }));
      }

      if (registrationsRes.ok) {
        const registrations = await registrationsRes.json();
        setStats(prev => ({ ...prev, totalRegistrations: registrations.length }));
      }

      if (couponsRes.ok) {
        const coupons = await couponsRes.json();
        const activeCoupons = coupons.filter(c => c.isActive && new Date() >= new Date(c.validFrom) && new Date() <= new Date(c.validUntil));
        setStats(prev => ({ ...prev, activeCoupons: activeCoupons.length }));
      }

      if (certificatesRes.ok) {
        const certificates = await certificatesRes.json();
        setStats(prev => ({ ...prev, totalCertificates: certificates.length }));
      }

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Criar Evento',
      description: 'Adicionar novo evento ao sistema',
      icon: <Plus className="w-6 h-6" />,
      href: '/admin/events/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gerenciar Cupons',
      description: 'Criar e gerenciar cupons de desconto',
      icon: <Gift className="w-6 h-6" />,
      href: '/admin/cupons',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Gerar Certificados',
      description: 'Criar certificados para participantes',
      icon: <FileText className="w-6 h-6" />,
      href: '/admin/certificados',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'WhatsApp Business',
      description: 'Configurar integração WhatsApp',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/admin/whatsapp',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  const navigationCards = [
    {
      title: 'Eventos',
      description: 'Gerenciar todos os eventos',
      icon: <Calendar className="w-8 h-8" />,
      href: '/admin/events',
      count: stats.totalEvents,
      color: 'text-blue-600'
    },
    {
      title: 'Usuários',
      description: 'Gerenciar participantes e organizadores',
      icon: <Users className="w-8 h-8" />,
      href: '/admin/users',
      count: stats.totalUsers,
      color: 'text-green-600'
    },
    {
      title: 'Inscrições',
      description: 'Visualizar e gerenciar inscrições',
      icon: <CreditCard className="w-8 h-8" />,
      href: '/admin/registrations',
      count: stats.totalRegistrations,
      color: 'text-purple-600'
    },
    {
      title: 'Cupons',
      description: 'Sistema de cupons e descontos',
      icon: <Gift className="w-8 h-8" />,
      href: '/admin/cupons',
      count: stats.activeCoupons,
      color: 'text-orange-600'
    },
    {
      title: 'Certificados',
      description: 'Gerenciar certificados emitidos',
      icon: <FileText className="w-8 h-8" />,
      href: '/admin/certificados',
      count: stats.totalCertificates,
      color: 'text-indigo-600'
    },
    {
      title: 'Relatórios',
      description: 'Análises e métricas avançadas',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/admin/reports',
      color: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard EventSync v1.1</h1>
          <p className="mt-2 text-gray-600">
            Visão geral completa do sistema de gerenciamento de eventos
          </p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inscrições</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} text-white rounded-lg p-4 transition-colors duration-200`}
              >
                <div className="flex items-center">
                  {action.icon}
                  <div className="ml-3">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Navegação Principal */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Navegação Principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 bg-gray-100 rounded-lg ${card.color}`}>
                      {card.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                      <p className="text-sm text-gray-500">{card.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{card.count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Funcionalidades v1.1 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Novas Funcionalidades v1.1</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-medium text-gray-900 mb-2">Sistema de Cupons</h3>
              <p className="text-sm text-gray-600 mb-3">
                Crie cupons automáticos e manuais com diferentes tipos de desconto
              </p>
              <Link
                href="/admin/cupons"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Gerenciar Cupons →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-medium text-gray-900 mb-2">WhatsApp Business</h3>
              <p className="text-sm text-gray-600 mb-3">
                Integração completa com chatbot e notificações automáticas
              </p>
              <Link
                href="/admin/whatsapp"
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Configurar WhatsApp →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-medium text-gray-900 mb-2">Sistema de Certificados</h3>
              <p className="text-sm text-gray-600 mb-3">
                Geração automática de certificados em PDF com QR Code
              </p>
              <Link
                href="/admin/certificados"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Gerenciar Certificados →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-medium text-gray-900 mb-2">App Móvel</h3>
              <p className="text-sm text-gray-600 mb-3">
                Aplicativo React Native com scanner QR Code e notificações
              </p>
              <Link
                href="/mobile"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Acessar App →
              </Link>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Configurações do Sistema</h3>
              <p className="text-sm text-gray-500">
                Configure integrações, notificações e preferências
              </p>
            </div>
            <Link
              href="/admin/settings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
