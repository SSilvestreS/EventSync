'use client';

import { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp,
  Heart,
  Share2,
  MessageCircle,
  Eye,
  Clock,
  Tag,
  Award,
  CheckCircle,
  XCircle,
  Filter as FilterIcon,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';

export default function MarketplacePage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = [
    { id: 'all', name: 'Todas as Categorias', icon: Store },
    { id: 'technology', name: 'Tecnologia', icon: TrendingUp },
    { id: 'business', name: 'Negócios', icon: Users },
    { id: 'education', name: 'Educação', icon: Award },
    { id: 'entertainment', name: 'Entretenimento', icon: Heart },
    { id: 'health', name: 'Saúde', icon: CheckCircle },
    { id: 'sports', name: 'Esportes', icon: TrendingUp },
    { id: 'culture', name: 'Cultura', icon: Award }
  ];

  const locations = [
    { id: 'all', name: 'Todas as Localizações' },
    { id: 'sao-paulo', name: 'São Paulo, SP' },
    { id: 'rio-janeiro', name: 'Rio de Janeiro, RJ' },
    { id: 'belo-horizonte', name: 'Belo Horizonte, MG' },
    { id: 'brasilia', name: 'Brasília, DF' },
    { id: 'salvador', name: 'Salvador, BA' },
    { id: 'fortaleza', name: 'Fortaleza, CE' },
    { id: 'online', name: 'Online' }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Tech Conference 2024',
          description: 'A maior conferência de tecnologia do Brasil com palestras, workshops e networking.',
          category: 'technology',
          location: 'sao-paulo',
          address: 'Centro de Eventos São Paulo',
          date: '2024-06-15',
          time: '09:00',
          duration: '8h',
          price: 299.90,
          originalPrice: 399.90,
          discount: 25,
          capacity: 500,
          registered: 342,
          rating: 4.8,
          reviews: 127,
          organizer: {
            name: 'TechEvents Brasil',
            avatar: '/api/placeholder/40/40',
            verified: true,
            rating: 4.9
          },
          tags: ['JavaScript', 'React', 'Node.js', 'AI'],
          image: '/api/placeholder/400/250',
          featured: true,
          partnership: {
            available: true,
            type: 'sponsorship',
            benefits: ['Logo no material', 'Stand exclusivo', 'Palestra patrocinada']
          }
        },
        {
          id: 2,
          title: 'Workshop de Design UX/UI',
          description: 'Aprenda os fundamentos do design de experiência do usuário com especialistas.',
          category: 'education',
          location: 'rio-janeiro',
          address: 'Espaço Coworking Rio',
          date: '2024-05-20',
          time: '14:00',
          duration: '4h',
          price: 149.90,
          originalPrice: 199.90,
          discount: 25,
          capacity: 50,
          registered: 38,
          rating: 4.7,
          reviews: 89,
          organizer: {
            name: 'Design Academy',
            avatar: '/api/placeholder/40/40',
            verified: true,
            rating: 4.8
          },
          tags: ['UX Design', 'UI Design', 'Figma', 'Prototipagem'],
          image: '/api/placeholder/400/250',
          featured: false,
          partnership: {
            available: true,
            type: 'collaboration',
            benefits: ['Co-marketing', 'Desconto para clientes', 'Networking']
          }
        },
        {
          id: 3,
          title: 'Startup Pitch Day',
          description: 'Evento para startups apresentarem seus projetos para investidores.',
          category: 'business',
          location: 'belo-horizonte',
          address: 'Centro de Inovação BH',
          date: '2024-07-10',
          time: '18:00',
          duration: '6h',
          price: 0,
          originalPrice: 0,
          discount: 0,
          capacity: 200,
          registered: 156,
          rating: 4.6,
          reviews: 203,
          organizer: {
            name: 'Startup Brasil',
            avatar: '/api/placeholder/40/40',
            verified: true,
            rating: 4.7
          },
          tags: ['Startups', 'Investimento', 'Pitch', 'Networking'],
          image: '/api/placeholder/400/250',
          featured: true,
          partnership: {
            available: false,
            type: null,
            benefits: []
          }
        },
        {
          id: 4,
          title: 'Festival de Música Indie',
          description: 'Celebre a música independente com artistas locais e nacionais.',
          category: 'entertainment',
          location: 'salvador',
          address: 'Parque da Cidade',
          date: '2024-08-05',
          time: '16:00',
          duration: '12h',
          price: 89.90,
          originalPrice: 89.90,
          discount: 0,
          capacity: 1000,
          registered: 678,
          rating: 4.5,
          reviews: 456,
          organizer: {
            name: 'Indie Music Brasil',
            avatar: '/api/placeholder/40/40',
            verified: false,
            rating: 4.3
          },
          tags: ['Música Indie', 'Festival', 'Arte', 'Cultura'],
          image: '/api/placeholder/400/250',
          featured: false,
          partnership: {
            available: true,
            type: 'sponsorship',
            benefits: ['Branding no local', 'Anúncios', 'Experiência VIP']
          }
        },
        {
          id: 5,
          title: 'Conferência de Saúde Mental',
          description: 'Discussões sobre bem-estar mental e práticas de autocuidado.',
          category: 'health',
          location: 'online',
          address: 'Plataforma Online',
          date: '2024-06-30',
          time: '10:00',
          duration: '6h',
          price: 79.90,
          originalPrice: 99.90,
          discount: 20,
          capacity: 300,
          registered: 245,
          rating: 4.9,
          reviews: 178,
          organizer: {
            name: 'Saúde Mental Brasil',
            avatar: '/api/placeholder/40/40',
            verified: true,
            rating: 4.9
          },
          tags: ['Saúde Mental', 'Bem-estar', 'Psicologia', 'Autocuidado'],
          image: '/api/placeholder/400/250',
          featured: true,
          partnership: {
            available: true,
            type: 'collaboration',
            benefits: ['Conteúdo compartilhado', 'Webinars conjuntos', 'Recursos educativos']
          }
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchTerm, selectedCategory, selectedLocation, priceRange, sortBy]);

  const filterAndSortEvents = () => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
      const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });

    // Aplicar ordenação
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.registered - a.registered);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default:
        break;
    }

    setFilteredEvents(filtered);
  };

  const handlePartnership = (event) => {
    setSelectedEvent(event);
    // Aqui você implementaria a lógica para iniciar parceria
  };

  const handleFavorite = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    ));
  };

  const handleShare = (event) => {
    // Implementar compartilhamento
    navigator.share?.({
      title: event.title,
      text: event.description,
      url: `/events/${event.id}`
    });
  };

  const getLocationName = (locationId) => {
    return locations.find(loc => loc.id === locationId)?.name || locationId;
  };

  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Store;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Carregando marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Marketplace de Eventos
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Descubra eventos incríveis e encontre oportunidades de parceria
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos, categorias, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FilterIcon className="w-4 h-4" />
                <span>Filtros Avançados</span>
              </button>

              {showFilters && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Preço:</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-24"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      R$ {priceRange[1]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="popularity">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="date">Data</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-slate-300 dark:border-slate-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            {filteredEvents.length} eventos encontrados
          </p>
        </div>

        {/* Events Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Event Image */}
              <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-48'}`}
                  />
                  {event.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Destaque
                    </div>
                  )}
                  {event.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      -{event.discount}%
                    </div>
                  )}
                  <button
                    onClick={() => handleFavorite(event.id)}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${event.isFavorite ? 'text-red-500 fill-current' : 'text-slate-600 dark:text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* Event Content */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                {/* Category and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {React.createElement(getCategoryIcon(event.category), { className: "w-4 h-4 text-blue-500" })}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{event.rating}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({event.reviews})
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                      +{event.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {getLocationName(event.location)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {event.time} ({event.duration})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {event.registered}/{event.capacity}
                    </span>
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {event.organizer.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {event.organizer.rating}
                        </span>
                      </div>
                      {event.organizer.verified && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {event.price === 0 ? (
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        Gratuito
                      </span>
                    ) : (
                      <>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          R$ {event.price.toFixed(2)}
                        </span>
                        {event.originalPrice > event.price && (
                          <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                            R$ {event.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {event.partnership.available && (
                      <button
                        onClick={() => handlePartnership(event)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                      >
                        Parceria
                      </button>
                    )}
                    <button
                      onClick={() => handleShare(event)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Parceria: {selectedEvent.title}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Tipo de Parceria
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedEvent.partnership.type === 'sponsorship' ? 'Patrocínio' : 'Colaboração'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Benefícios Inclusos
                  </h4>
                  <ul className="space-y-2">
                    {selectedEvent.partnership.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-slate-600 dark:text-slate-400">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Sobre o Evento
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Data:</span>
                      <p className="text-slate-900 dark:text-white">
                        {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Local:</span>
                      <p className="text-slate-900 dark:text-white">
                        {getLocationName(selectedEvent.location)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Capacidade:</span>
                      <p className="text-slate-900 dark:text-white">
                        {selectedEvent.capacity} participantes
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Inscritos:</span>
                      <p className="text-slate-900 dark:text-white">
                        {selectedEvent.registered}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Organizador
                  </h4>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <img
                      src={selectedEvent.organizer.avatar}
                      alt={selectedEvent.organizer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {selectedEvent.organizer.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {selectedEvent.organizer.rating}
                          </span>
                        </div>
                        {selectedEvent.organizer.verified && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Fechar
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Solicitar Parceria
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
