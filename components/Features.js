'use client';

import { Calendar, QrCode, BarChart3, Users, Smartphone, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Gestão Completa de Eventos',
      description: 'Crie, edite e organize eventos com todas as informações necessárias. Configure datas, horários, locais e capacidades de forma intuitiva.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Sistema de Inscrições',
      description: 'Formulários personalizáveis para inscrições com validação em tempo real. Confirmações automáticas por email e gestão de participantes.',
      color: 'text-green-600'
    },
    {
      icon: QrCode,
      title: 'QR Codes Únicos',
      description: 'Geração automática de QR codes para cada inscrito. Sistema de check-in rápido e eficiente com registro de presença em tempo real.',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Métricas e Relatórios',
      description: 'Dashboard completo com métricas de inscrições, engajamento e presença. Relatórios detalhados para análise de performance.',
      color: 'text-orange-600'
    },
    {
      icon: Smartphone,
      title: 'Responsivo e Mobile',
      description: 'Interface otimizada para todos os dispositivos. Acesso fácil através de smartphones e tablets para check-in e visualização.',
      color: 'text-red-600'
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Sistema seguro com autenticação de usuários, backup automático de dados e conformidade com padrões de segurança.',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher o EventSync?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma oferece todas as ferramentas necessárias para organizar 
            eventos de sucesso, desde a criação até a análise de resultados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 ${feature.color}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seção de Integração Google Calendar */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Integração com Google Calendar
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sincronize automaticamente seus eventos com o Google Calendar. 
                Crie eventos, configure lembretes e mantenha todos os participantes 
                informados sobre as próximas atividades.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Sincronização automática bidirecional
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Lembretes personalizados para participantes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Atualizações em tempo real
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Compatível com todos os dispositivos
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">
                Sincronização automática com Google Calendar
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de organizadores que já confiam no EventSync 
            para gerenciar seus eventos com sucesso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">
              Criar Conta Gratuita
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Agendar Demonstração
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
