'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Calendar, MapPin, Users, Tag } from 'lucide-react';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  const categories = ['Todos', 'Tecnologia', 'Marketing', 'Negócios', 'Educação', 'Arte', 'Saúde'];
  const statuses = ['Todos', 'Ativo', 'Rascunho', 'Concluído', 'Cancelado'];

  const events = [
    {
      id: 1,
      title: 'Workshop de Desenvolvimento Web',
      description: 'Aprenda as melhores práticas de desenvolvimento web moderno com React e Node.js',
      date: '2024-02-15',
      time: '14:00',
      location: 'Centro de Inovação',
      capacity: 50,
      registered: 35,
      category: 'Tecnologia',
      status: 'Ativo',
      price: 'R$ 150,00',
      image: '/images/workshop-web.jpg'
    },
    {
      id: 2,
      title: 'Palestra sobre Inteligência Artificial',
      description: 'Descubra como a IA está transformando diferentes setores da economia',
      date: '2024-02-20',
      time: '19:00',
      location: 'Auditório Principal',
      capacity: 100,
      registered: 78,
      category: 'Tecnologia',
      status: 'Ativo',
      price: 'Gratuito',
      image: '/images/palestra-ia.jpg'
    },
    {
      id: 3,
      title: 'Workshop de Marketing Digital',
      description: 'Estratégias eficazes para marketing nas redes sociais e crescimento de negócios',
      date: '2024-02-25',
      time: '15:30',
      location: 'Sala de Treinamento',
      capacity: 30,
      registered: 25,
      category: 'Marketing',
      status: 'Ativo',
      price: 'R$ 200,00',
      image: '/images/workshop-marketing.jpg'
    },
    {
      id: 4,
      title: 'Conferência de Empreendedorismo',
      description: 'Conecte-se com empreendedores e aprenda sobre inovação e crescimento',
      date: '2024-03-10',
      time: '09:00',
      location: 'Centro de Convenções',
      capacity: 200,
      registered: 45,
      category: 'Negócios',
      status: 'Rascunho',
      price: 'R$ 350,00',
      image: '/images/conferencia-empreendedorismo.jpg'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Todos' || event.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
              <p className="mt-2 text-gray-600">Gerencie todos os seus eventos em um só lugar</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/events/create" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Criar Evento
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Botão Limpar Filtros */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setSelectedStatus('Todos');
              }}
              className="btn-secondary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              {/* Imagem do Evento */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg flex items-center justify-center">
                <Calendar className="h-16 w-16 text-white opacity-80" />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Conteúdo do Evento */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                {/* Informações do Evento */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.date)} às {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {event.registered}/{event.capacity} inscritos
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Tag className="h-4 w-4 mr-2" />
                    {event.price}
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Capacidade</span>
                    <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    Ver Detalhes
                  </Link>
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="flex-1 btn-primary text-center"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vazio */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'Todos' || selectedStatus !== 'Todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro evento'}
            </p>
            <Link href="/events/create" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Link>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo dos Eventos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{events.length}</p>
              <p className="text-sm text-gray-600">Total de Eventos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'Ativo').length}
              </p>
              <p className="text-sm text-gray-600">Eventos Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {events.reduce((sum, e) => sum + e.registered, 0)}
              </p>
              <p className="text-sm text-gray-600">Total de Inscrições</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(events.reduce((sum, e) => sum + (e.registered / e.capacity), 0) / events.length * 100)}%
              </p>
              <p className="text-sm text-gray-600">Taxa Média de Ocupação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
