'use client';

import { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import MetricsOverview from '../../components/dashboard/MetricsOverview';
import EventList from '../../components/dashboard/EventList';
import RecentRegistrations from '../../components/dashboard/RecentRegistrations';
import QuickActions from '../../components/dashboard/QuickActions';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = {
    totalEvents: 12,
    totalRegistrations: 847,
    totalRevenue: 15420.50,
    averageAttendance: 78.5,
    thisMonth: {
      events: 3,
      registrations: 156,
      revenue: 3200.00
    }
  };

  const events = [
    {
      id: 1,
      title: 'Workshop de Desenvolvimento Web',
      date: '2024-02-15',
      registrations: 35,
      capacity: 50,
      status: 'active'
    },
    {
      id: 2,
      title: 'Palestra sobre IA',
      date: '2024-02-20',
      registrations: 78,
      capacity: 100,
      status: 'active'
    },
    {
      id: 3,
      title: 'Workshop de Marketing',
      date: '2024-02-25',
      registrations: 25,
      capacity: 30,
      status: 'active'
    }
  ];

  const recentRegistrations = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      event: 'Workshop de Desenvolvimento Web',
      date: '2024-02-10',
      status: 'confirmed'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      event: 'Palestra sobre IA',
      date: '2024-02-09',
      status: 'confirmed'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      event: 'Workshop de Marketing',
      date: '2024-02-08',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de Navegação */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'events', label: 'Eventos' },
              { id: 'registrations', label: 'Inscrições' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Configurações' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo Principal */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <MetricsOverview metrics={metrics} />
            
            <div className="grid lg:grid-cols-2 gap-8">
              <EventList events={events} />
              <RecentRegistrations registrations={recentRegistrations} />
            </div>
            
            <QuickActions />
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Eventos</h2>
            <p className="text-gray-600">Funcionalidade de gerenciamento de eventos será implementada aqui.</p>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Inscrições</h2>
            <p className="text-gray-600">Funcionalidade de gerenciamento de inscrições será implementada aqui.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics e Relatórios</h2>
            <p className="text-gray-600">Funcionalidade de analytics será implementada aqui.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h2>
            <p className="text-gray-600">Funcionalidade de configurações será implementada aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}
