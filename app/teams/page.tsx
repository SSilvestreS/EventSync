'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Crown, 
  Shield, 
  User, 
  Mail, 
  Phone,
  Calendar,
  Star,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    visibility: 'private',
    maxMembers: 10
  });

  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member',
    message: ''
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setTeams([
        {
          id: 1,
          name: 'Equipe Tech Events',
          description: 'Equipe especializada em eventos de tecnologia e inovação',
          visibility: 'public',
          maxMembers: 15,
          currentMembers: 8,
          createdAt: '2024-01-15',
          events: 12,
          rating: 4.8,
          members: [
            {
              id: 1,
              name: 'João Silva',
              email: 'joao@techevents.com',
              role: 'owner',
              avatar: '/api/placeholder/40/40',
              joinedAt: '2024-01-15',
              status: 'active',
              permissions: ['all']
            },
            {
              id: 2,
              name: 'Maria Santos',
              email: 'maria@techevents.com',
              role: 'admin',
              avatar: '/api/placeholder/40/40',
              joinedAt: '2024-01-20',
              status: 'active',
              permissions: ['events', 'members', 'analytics']
            },
            {
              id: 3,
              name: 'Pedro Costa',
              email: 'pedro@techevents.com',
              role: 'member',
              avatar: '/api/placeholder/40/40',
              joinedAt: '2024-02-01',
              status: 'active',
              permissions: ['events', 'analytics']
            }
          ]
        },
        {
          id: 2,
          name: 'Eventos Corporativos SP',
          description: 'Foco em eventos corporativos na região de São Paulo',
          visibility: 'private',
          maxMembers: 8,
          currentMembers: 5,
          createdAt: '2024-02-01',
          events: 8,
          rating: 4.6,
          members: [
            {
              id: 4,
              name: 'Ana Oliveira',
              email: 'ana@corporate.com',
              role: 'owner',
              avatar: '/api/placeholder/40/40',
              joinedAt: '2024-02-01',
              status: 'active',
              permissions: ['all']
            }
          ]
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateTeam = async () => {
    setIsLoading(true);
    // Simular criação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTeamData = {
      id: Date.now(),
      ...newTeam,
      currentMembers: 1,
      createdAt: new Date().toISOString().split('T')[0],
      events: 0,
      rating: 0,
      members: []
    };
    
    setTeams(prev => [...prev, newTeamData]);
    setNewTeam({ name: '', description: '', visibility: 'private', maxMembers: 10 });
    setShowCreateModal(false);
    setIsLoading(false);
  };

  const handleInviteMember = async () => {
    if (!selectedTeam || !inviteData.email) return;
    
    // Simular convite
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Adicionar membro à equipe
    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          currentMembers: team.currentMembers + 1,
          members: [...team.members, {
            id: Date.now(),
            name: inviteData.email.split('@')[0],
            email: inviteData.email,
            role: inviteData.role,
            avatar: '/api/placeholder/40/40',
            joinedAt: new Date().toISOString().split('T')[0],
            status: 'pending',
            permissions: getPermissionsByRole(inviteData.role)
          }]
        };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    setInviteData({ email: '', role: 'member', message: '' });
    setShowInviteModal(false);
  };

  const getPermissionsByRole = (role) => {
    switch (role) {
      case 'owner':
        return ['all'];
      case 'admin':
        return ['events', 'members', 'analytics', 'settings'];
      case 'moderator':
        return ['events', 'members', 'analytics'];
      case 'member':
        return ['events', 'analytics'];
      default:
        return ['events'];
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'moderator':
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Carregando equipes...</p>
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
            Gerenciar Equipes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Colabore com sua equipe para criar eventos incríveis
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total de Equipes</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{teams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Membros Totais</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {teams.reduce((acc, team) => acc + team.currentMembers, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Eventos Criados</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {teams.reduce((acc, team) => acc + team.events, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avaliação Média</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {(teams.reduce((acc, team) => acc + team.rating, 0) / teams.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Criar Nova Equipe
          </button>
          
          <button
            onClick={() => setShowInviteModal(true)}
            disabled={!selectedTeam}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5 mr-2" />
            Convidar Membro
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                selectedTeam?.id === team.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedTeam(team)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {team.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {team.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    team.visibility === 'public' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {team.visibility === 'public' ? 'Público' : 'Privado'}
                  </span>
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {team.currentMembers}/{team.maxMembers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Membros</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {team.events}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Eventos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {team.rating}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Criada em {new Date(team.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Team Details */}
        {selectedTeam && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Detalhes da Equipe: {selectedTeam.name}
              </h2>
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Informações da Equipe
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Descrição</p>
                    <p className="text-slate-900 dark:text-white">{selectedTeam.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Visibilidade</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedTeam.visibility === 'public' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedTeam.visibility === 'public' ? 'Público' : 'Privado'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Membros</p>
                    <p className="text-slate-900 dark:text-white">
                      {selectedTeam.currentMembers}/{selectedTeam.maxMembers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Membros da Equipe
                </h3>
                <div className="space-y-3">
                  {selectedTeam.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getRoleColor(member.role)}`}>
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(member.role)}
                            <span className="capitalize">{member.role}</span>
                          </div>
                        </span>
                        
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {member.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Criar Nova Equipe
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome da Equipe
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Digite o nome da equipe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    rows={3}
                    placeholder="Descreva o propósito da equipe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Visibilidade
                  </label>
                  <select
                    value={newTeam.visibility}
                    onChange={(e) => setNewTeam({ ...newTeam, visibility: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="private">Privado</option>
                    <option value="public">Público</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Máximo de Membros
                  </label>
                  <input
                    type="number"
                    value={newTeam.maxMembers}
                    onChange={(e) => setNewTeam({ ...newTeam, maxMembers: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    min="2"
                    max="50"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeam.name}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Criar Equipe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        {showInviteModal && selectedTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Convidar Membro para {selectedTeam.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Função
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="member">Membro</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    rows={3}
                    placeholder="Mensagem personalizada para o convite"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={!inviteData.email}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Enviar Convite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
