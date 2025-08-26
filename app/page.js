'use client';

import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Globe, 
  Zap, 
  Shield,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  LogIn,
  Rocket,
  Target,
  Award,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { 
      icon: Calendar, 
      title: 'Gestão de Eventos', 
      description: 'Crie e organize eventos facilmente com interface intuitiva',
      color: 'blue'
    },
    { 
      icon: Users, 
      title: 'Sistema de Inscrições', 
      description: 'Gerencie participantes automaticamente com validação',
      color: 'green'
    },
    { 
      icon: QrCode, 
      title: 'Check-in com QR Code', 
      description: 'Check-in rápido e seguro para todos os participantes',
      color: 'purple'
    },
    { 
      icon: CreditCard, 
      title: 'Pagamentos Online', 
      description: 'Processe pagamentos com Stripe e outros gateways',
      color: 'orange'
    },
    { 
      icon: BarChart3, 
      title: 'Analytics Avançados', 
      description: 'Relatórios detalhados e métricas de performance',
      color: 'indigo'
    },
    { 
      icon: Globe, 
      title: 'Multi-idioma', 
      description: 'Suporte para 10 idiomas diferentes',
      color: 'teal'
    },
    { 
      icon: Zap, 
      title: 'Integração CRM', 
      description: 'Conecte com HubSpot, Salesforce e Pipedrive',
      color: 'yellow'
    },
    { 
      icon: Shield, 
      title: 'Sistema de Afiliados', 
      description: 'Programa de afiliados com comissões automáticas',
      color: 'red'
    }
  ];

  const stats = [
    { number: '10+', label: 'Anos de Experiência' },
    { number: '500+', label: 'Eventos Gerenciados' },
    { number: '50K+', label: 'Participantes' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const benefits = [
    'Interface moderna e responsiva',
    'Integração com múltiplas plataformas',
    'Suporte técnico 24/7',
    'Atualizações automáticas',
    'Backup em tempo real',
    'Segurança de nível empresarial'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventSync
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
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
            <div className="md:hidden py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  router.push('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero & Features */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <span className="text-3xl sm:text-4xl font-bold">EventSync</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Transforme a forma como você gerencia eventos
            </h1>
            
            <p className="text-blue-100 text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed">
              Plataforma completa para criação, gestão e análise de eventos. 
              Desde pequenos workshops até grandes conferências internacionais.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <button
                onClick={() => router.push('/login')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Começar Agora</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Ver Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-blue-100 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Features Grid */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 order-1 lg:order-2">
          <div className="max-w-md mx-auto lg:mx-0">
            {/* Version Badge */}
            <div className="text-center mb-6 sm:mb-8">
              <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Versão 1.3 - Sistemas Avançados
              </span>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                    <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="mt-8 sm:mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Por que escolher o EventSync?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
              >
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Acessar Plataforma</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
