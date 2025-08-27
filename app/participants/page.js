'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  UserMinus,
  Edit3,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Send,
  QrCode,
  BarChart3,
  FileText,
  RefreshCw
} from 'lucide-react';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    event: 'all',
    date: 'all',
    payment: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedParticipantForQR, setSelectedParticipantForQR] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'registered', label: 'Registrado', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmed', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
    { value: 'checked-in', label: 'Check-in Realizado', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    { value: 'waitlist', label: 'Lista de Espera', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const eventOptions = [
    { value: 'all', label: 'Todos os Eventos' },
    { value: 'tech-conf-2024', label: 'Tech Conference 2024' },
    { value: 'workshop-design', label: 'Workshop de Design' },
    { value: 'startup-pitch', label: 'Startup Pitch Day' }
  ];

  const paymentOptions = [
    { value: 'all', label: 'Todos os Pagamentos' },
    { value: 'paid', label: 'Pago', color: 'bg-green-100 text-green-800' },
    { value: 'pending', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'failed', label: 'Falhou', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' }
  ];

  // Simular dados de participantes
  useEffect(() => {
    const generateParticipants = () => {
      const names = [
        'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
        'Lucia Rodrigues', 'Roberto Almeida', 'Fernanda Lima', 'Ricardo Pereira', 'Juliana Gomes',
        'Marcos Souza', 'Patricia Martins', 'Andre Santos', 'Camila Oliveira', 'Diego Costa',
        'Vanessa Ferreira', 'Thiago Rodrigues', 'Amanda Almeida', 'Felipe Lima', 'Carolina Pereira'
      ];

      const events = [
        { id: 'tech-conf-2024', name: 'Tech Conference 2024', date: '2024-04-15' },
        { id: 'workshop-design', name: 'Workshop de Design', date: '2024-04-22' },
        { id: 'startup-pitch', name: 'Startup Pitch Day', date: '2024-05-01' }
      ];

      return names.map((name, index) => {
        const event = events[Math.floor(Math.random() * events.length)];
        const status = ['registered', 'confirmed', 'checked-in', 'cancelled', 'waitlist'][Math.floor(Math.random() * 5)];
        const payment = ['paid', 'pending', 'failed', 'refunded'][Math.floor(Math.random() * 4)];
        
        return {
          id: index + 1,
          name,
          email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
          phone: `+55 (11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
          event: event.id,
          eventName: event.name,
          eventDate: event.date,
          registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status,
          payment,
          amount: Math.floor(Math.random() * 200) + 50,
          currency: 'BRL',
          checkInTime: status === 'checked-in' ? new Date().toISOString() : null,
          notes: Math.random() > 0.7 ? 'Participante VIP' : '',
          tags: Math.random() > 0.8 ? ['VIP', 'Speaker'] : []
        };
      });
    };

    setTimeout(() => {
      const data = generateParticipants();
      setParticipants(data);
      setFilteredParticipants(data);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Aplicar filtros e busca
  useEffect(() => {
    let filtered = participants;

    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filters.status !== 'all') {
      filtered = filtered.filter(participant => participant.status === filters.status);
    }
    if (filters.event !== 'all') {
      filtered = filtered.filter(participant => participant.event === filters.event);
    }
    if (filters.payment !== 'all') {
      filtered = filtered.filter(participant => participant.payment === filters.payment);
    }

    setFilteredParticipants(filtered);
    setCurrentPage(1);
  }, [participants, searchTerm, filters]);

  // Ordenação
  const sortData = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredParticipants].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredParticipants(sorted);
  };

  // Paginação
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Seleção em lote
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedParticipants(currentParticipants.map(p => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleSelectParticipant = (id, checked) => {
    if (checked) {
      setSelectedParticipants(prev => [...prev, id]);
    } else {
      setSelectedParticipants(prev => prev.filter(pId => pId !== id));
    }
  };

  // Ações em lote
  const handleBulkAction = (action) => {
    if (selectedParticipants.length === 0) return;

    switch (action) {
      case 'confirm':
        setParticipants(prev => prev.map(p => 
          selectedParticipants.includes(p.id) ? { ...p, status: 'confirmed' } : p
        ));
        break;
      case 'cancel':
        setParticipants(prev => prev.map(p => 
          selectedParticipants.includes(p.id) ? { ...p, status: 'cancelled' } : p
        ));
        break;
      case 'send-email':
        alert(`Enviando email para ${selectedParticipants.length} participantes`);
        break;
      case 'export':
        exportParticipants(selectedParticipants);
        break;
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir ${selectedParticipants.length} participantes?`)) {
          setParticipants(prev => prev.filter(p => !selectedParticipants.includes(p.id)));
          setSelectedParticipants([]);
        }
        break;
    }
  };

  const exportParticipants = (ids) => {
    const data = participants.filter(p => ids.includes(p.id));
    const csv = [
      ['Nome', 'Email', 'Telefone', 'Evento', 'Status', 'Pagamento', 'Valor'],
      ...data.map(p => [
        p.name,
        p.email,
        p.phone,
        p.eventName,
        p.status,
        p.payment,
        `${p.currency} ${p.amount}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participantes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'registered': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'checked-in': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'waitlist': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentColor = (payment) => {
    const paymentMap = {
      'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return paymentMap[payment] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'registered': 'Registrado',
      'confirmed': 'Confirmado',
      'checked-in': 'Check-in Realizado',
      'cancelled': 'Cancelado',
      'waitlist': 'Lista de Espera'
    };
    return statusMap[status] || status;
  };

  const getPaymentText = (payment) => {
    const paymentMap = {
      'paid': 'Pago',
      'pending': 'Pendente',
      'failed': 'Falhou',
      'refunded': 'Reembolsado'
    };
    return paymentMap[payment] || payment;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-300">Carregando participantes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Gerenciar Participantes
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {filteredParticipants.length} participantes encontrados
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Adicionar Participante</span>
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {participants.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Confirmados</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {participants.filter(p => p.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Check-in</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {participants.filter(p => p.status === 'checked-in').length}
                </p>
              </div>
              <QrCode className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pagamentos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {participants.filter(p => p.payment === 'paid').length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Evento
                </label>
                <select
                  value={filters.event}
                  onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {eventOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pagamento
                </label>
                <select
                  value={filters.payment}
                  onChange={(e) => setFilters(prev => ({ ...prev, payment: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {paymentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    status: 'all',
                    event: 'all',
                    date: 'all',
                    payment: 'all'
                  })}
                  className="w-full p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra de Busca e Ações */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportParticipants(filteredParticipants.map(p => p.id))}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ações em Lote */}
        {selectedParticipants.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {selectedParticipants.length} participantes selecionados
                </span>
                <button
                  onClick={() => setSelectedParticipants([])}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('confirm')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => handleBulkAction('send-email')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Enviar Email
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                >
                  Exportar
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Participantes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.length === currentParticipants.length && currentParticipants.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => sortData('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Participante</span>
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => sortData('eventName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Evento</span>
                      {sortConfig.key === 'eventName' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => sortData('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => sortData('payment')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Pagamento</span>
                      {sortConfig.key === 'payment' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => sortData('registrationDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Data de Registro</span>
                      {sortConfig.key === 'registrationDate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {currentParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={(e) => handleSelectParticipant(participant.id, e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {participant.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {participant.email}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {participant.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {participant.eventName}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(participant.eventDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                        {getStatusText(participant.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(participant.payment)}`}>
                          {getPaymentText(participant.payment)}
                        </span>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {participant.currency} {participant.amount}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {new Date(participant.registrationDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedParticipantForQR(participant);
                            setShowQRModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingParticipant(participant);
                            setShowEditModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Implementar visualização detalhada
                          }}
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                          title="Ver Detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                      <span className="font-medium">{Math.min(endIndex, filteredParticipants.length)}</span> de{' '}
                      <span className="font-medium">{filteredParticipants.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de QR Code */}
      {showQRModal && selectedParticipantForQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  QR Code - {selectedParticipantForQR.name}
                </h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  QR Code para check-in do participante
                </p>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p><strong>Evento:</strong> {selectedParticipantForQR.eventName}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedParticipantForQR.status)}</p>
                  <p><strong>ID:</strong> {selectedParticipantForQR.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
