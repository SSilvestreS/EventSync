'use client';

import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Star, 
  Users,
  Calendar,
  MapPin,
  Tag,
  Heart,
  Eye,
  Share2,
  Bookmark
} from 'lucide-react';

export default function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas', icon: Star },
    { id: 'events', name: 'Eventos', icon: Calendar },
    { id: 'content', name: 'Conteúdo', icon: Bookmark },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'tools', name: 'Ferramentas', icon: TrendingUp }
  ];

  // Simular dados de comportamento do usuário
  useEffect(() => {
    const generateRecommendations = () => {
      const userBehavior = {
        interests: ['tecnologia', 'startups', 'design', 'marketing'],
        location: 'São Paulo',
        preferredTime: 'evening',
        budget: 'medium',
        eventSize: 'medium',
        networking: 'high',
        learning: 'practical'
      };

      const baseRecommendations = [
        {
          id: 1,
          type: 'event',
          title: 'Startup Weekend São Paulo',
          category: 'events',
          description: 'Evento de 54 horas para desenvolver ideias de negócio',
          matchScore: 95,
          reason: 'Baseado no seu interesse em startups e networking',
          tags: ['startups', 'networking', 'empreendedorismo'],
          date: '2024-04-15',
          location: 'São Paulo, SP',
          price: 'R$ 150',
          attendees: 120,
          image: '/api/placeholder/300/200',
          actions: ['inscrever', 'compartilhar', 'favoritar']
        },
        {
          id: 2,
          type: 'content',
          title: 'Guia Completo de Eventos Híbridos',
          category: 'content',
          description: 'E-book com estratégias para eventos presenciais e online',
          matchScore: 88,
          reason: 'Baseado no seu histórico de eventos e interesse em tecnologia',
          tags: ['eventos', 'tecnologia', 'híbrido'],
          author: 'EventSync Team',
          readTime: '15 min',
          downloads: 1250,
          image: '/api/placeholder/300/200',
          actions: ['baixar', 'compartilhar', 'favoritar']
        },
        {
          id: 3,
          type: 'tool',
          title: 'EventSync Analytics Pro',
          category: 'tools',
          description: 'Ferramenta avançada de análise para eventos',
          matchScore: 82,
          reason: 'Baseado no seu uso frequente de relatórios',
          tags: ['analytics', 'relatórios', 'métricas'],
          price: 'R$ 99/mês',
          trial: '7 dias grátis',
          features: ['Dashboard avançado', 'Exportação de dados', 'Alertas automáticos'],
          image: '/api/placeholder/300/200',
          actions: ['testar', 'comprar', 'compartilhar']
        },
        {
          id: 4,
          type: 'networking',
          title: 'Grupo de Organizadores de Eventos Tech',
          category: 'networking',
          description: 'Comunidade exclusiva para troca de experiências',
          matchScore: 78,
          reason: 'Baseado no seu perfil de organizador e interesse em tecnologia',
          tags: ['networking', 'tecnologia', 'comunidade'],
          members: 450,
          activity: 'Alta',
          nextMeetup: '2024-03-25',
          image: '/api/placeholder/300/200',
          actions: ['participar', 'conectar', 'compartilhar']
        },
        {
          id: 5,
          type: 'event',
          title: 'Design Thinking Workshop',
          category: 'events',
          description: 'Workshop prático de design thinking para eventos',
          matchScore: 75,
          reason: 'Baseado no seu interesse em design e aprendizado prático',
          tags: ['design', 'workshop', 'prático'],
          date: '2024-04-22',
          location: 'São Paulo, SP',
          price: 'R$ 200',
          attendees: 80,
          image: '/api/placeholder/300/200',
          actions: ['inscrever', 'compartilhar', 'favoritar']
        }
      ];

      // Filtrar por categoria
      const filteredRecs = selectedCategory === 'all' 
        ? baseRecommendations 
        : baseRecommendations.filter(rec => rec.category === selectedCategory);

      // Ordenar por score de match
      return filteredRecs.sort((a, b) => b.matchScore - a.matchScore);
    };

    // Simular delay de processamento
    setTimeout(() => {
      setRecommendations(generateRecommendations());
      setIsLoading(false);
    }, 1500);
  }, [selectedCategory]);

  const handleAction = (recommendationId, action) => {
    console.log(`Ação ${action} executada para recomendação ${recommendationId}`);
    // Aqui implementaríamos a lógica real das ações
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'inscrever': return Calendar;
      case 'baixar': return TrendingUp;
      case 'testar': return Eye;
      case 'participar': return Users;
      case 'compartilhar': return Share2;
      case 'favoritar': return Heart;
      case 'comprar': return Tag;
      default: return Star;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Analisando suas preferências...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Recomendações Personalizadas
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Baseadas no seu comportamento e preferências
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {recommendations.length} recomendações encontradas
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Image */}
            <div className="relative">
              <img
                src={rec.image}
                alt={rec.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchScoreColor(rec.matchScore)}`}>
                  {rec.matchScore}% match
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                  {rec.title}
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                {rec.description}
              </p>

              {/* Match Reason */}
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Por que foi recomendado:</span> {rec.reason}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {rec.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                {rec.type === 'event' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(rec.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{rec.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{rec.attendees} participantes</span>
                    </div>
                  </>
                )}
                {rec.type === 'content' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{rec.readTime} de leitura</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{rec.downloads} downloads</span>
                    </div>
                  </>
                )}
                {rec.type === 'tool' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Tag className="w-4 h-4" />
                      <span>{rec.price}</span>
                    </div>
                    {rec.trial && (
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <Clock className="w-4 h-4" />
                        <span>{rec.trial}</span>
                      </div>
                    )}
                  </>
                )}
                {rec.type === 'networking' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{rec.members} membros</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>Atividade: {rec.activity}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {rec.actions.map((action, index) => {
                  const ActionIcon = getActionIcon(action);
                  return (
                    <button
                      key={index}
                      onClick={() => handleAction(rec.id, action)}
                      className="flex items-center space-x-1 px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      <ActionIcon className="w-3 h-3" />
                      <span className="capitalize">{action}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 border border-slate-200 dark:border-slate-700 text-center">
          <Lightbulb className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Nenhuma recomendação encontrada
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            Tente selecionar uma categoria diferente ou aguarde novas recomendações baseadas no seu comportamento.
          </p>
        </div>
      )}
    </div>
  );
}
