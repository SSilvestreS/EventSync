'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Key, 
  Database, 
  Cloud,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Globe,
  Lock,
  Zap
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  users: number;
  events: number;
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  features: string[];
}

interface TenantMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  totalEvents: number;
  revenue: number;
  growth: number;
}

export default function EnterprisePage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [metrics, setMetrics] = useState<TenantMetrics>({
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalUsers: 0,
    totalEvents: 0,
    revenue: 0,
    growth: 0
  });
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'sso' | 'bi' | 'microservices'>('overview');

  useEffect(() => {
    // Simular dados de organizações
    const mockOrganizations: Organization[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        plan: 'enterprise',
        users: 1250,
        events: 45,
        status: 'active',
        createdAt: '2024-01-15',
        features: ['SSO', 'Advanced Analytics', 'Custom Branding', 'API Access', 'Priority Support']
      },
      {
        id: '2',
        name: 'Global Events Inc',
        domain: 'globalevents.com',
        plan: 'professional',
        users: 850,
        events: 32,
        status: 'active',
        createdAt: '2024-02-20',
        features: ['SSO', 'Advanced Analytics', 'Custom Branding']
      },
      {
        id: '3',
        name: 'StartupHub',
        domain: 'startuphub.io',
        plan: 'starter',
        users: 150,
        events: 8,
        status: 'trial',
        createdAt: '2024-03-10',
        features: ['Basic Analytics']
      }
    ];

    setOrganizations(mockOrganizations);
    setMetrics({
      totalOrganizations: 3,
      activeOrganizations: 2,
      totalUsers: 2250,
      totalEvents: 85,
      revenue: 125000,
      growth: 15.5
    });
  }, []);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-600 bg-purple-100';
      case 'professional': return 'text-blue-600 bg-blue-100';
      case 'starter': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'trial': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'organizations', label: 'Organizações', icon: Building2 },
    { id: 'sso', label: 'SSO & Integração', icon: Key },
    { id: 'bi', label: 'Business Intelligence', icon: TrendingUp },
    { id: 'microservices', label: 'Microserviços', icon: Cloud }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">EventSync Enterprise</h1>
              <p className="text-gray-600 mt-1">Plataforma de gerenciamento de eventos para organizações</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Versão</p>
                <p className="font-semibold text-gray-900">2.0.0</p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sistema Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Organizações</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalOrganizations}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{metrics.growth}% este mês
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% este mês
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Eventos</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalEvents}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% este mês
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita</p>
                    <p className="text-2xl font-bold text-gray-900">${metrics.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +18% este mês
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Features */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Funcionalidades Enterprise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-tenancy</h3>
                    <p className="text-sm text-gray-600 mt-1">Isolamento completo de dados por organização</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">SSO & Integração</h3>
                    <p className="text-sm text-gray-600 mt-1">Autenticação única com sistemas corporativos</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Intelligence</h3>
                    <p className="text-sm text-gray-600 mt-1">Dashboards executivos e relatórios avançados</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cloud className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Microserviços</h3>
                    <p className="text-sm text-gray-600 mt-1">Arquitetura distribuída e escalável</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Compliance & Auditoria</h3>
                    <p className="text-sm text-gray-600 mt-1">Logs de auditoria e conformidade regulatória</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">SLA & Performance</h3>
                    <p className="text-sm text-gray-600 mt-1">Garantias de disponibilidade e performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Organizações</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Nova Organização
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuários
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eventos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{org.name}</div>
                            <div className="text-sm text-gray-500">{org.domain}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(org.plan)}`}>
                            {org.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {org.users.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {org.events}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(org.status)}`}>
                            {org.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedOrg(org)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Ver Detalhes
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Configurar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sso' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">SSO & Integração Corporativa</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações SSO</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SAML 2.0</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">OAuth 2.0</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">LDAP/Active Directory</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Configurando</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrações Ativas</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Microsoft Azure AD</p>
                      <p className="text-xs text-gray-500">2 organizações conectadas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Google Workspace</p>
                      <p className="text-xs text-gray-500">1 organização conectada</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Okta</p>
                      <p className="text-xs text-gray-500">1 organização conectada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bi' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Intelligence</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Executivo</h3>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráficos e métricas executivas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KPIs Principais</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-green-600">24.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Receita por Usuário</p>
                    <p className="text-2xl font-bold text-blue-600">$156</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Churn Rate</p>
                    <p className="text-2xl font-bold text-red-600">3.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NPS Score</p>
                    <p className="text-2xl font-bold text-purple-600">8.7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'microservices' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Arquitetura de Microserviços</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Ativos</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Auth Service</span>
                    </div>
                    <span className="text-xs text-green-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Event Service</span>
                    </div>
                    <span className="text-xs text-green-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Payment Service</span>
                    </div>
                    <span className="text-xs text-green-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Analytics Service</span>
                    </div>
                    <span className="text-xs text-yellow-600">Warning</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Latência Média</p>
                    <p className="text-2xl font-bold text-green-600">45ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Throughput</p>
                    <p className="text-2xl font-bold text-blue-600">2.4k req/s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold text-purple-600">99.9%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold text-red-600">0.1%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Organization Details Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedOrg.name}</h3>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plano</p>
                    <p className="font-semibold text-gray-900">{selectedOrg.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900">{selectedOrg.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Usuários</p>
                    <p className="font-semibold text-gray-900">{selectedOrg.users.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eventos</p>
                    <p className="font-semibold text-gray-900">{selectedOrg.events}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Funcionalidades Ativas</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedOrg(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Fechar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
