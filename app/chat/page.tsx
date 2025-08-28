'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Users, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Image,
  File,
  Smile,
  Paperclip,
  Mic,
  Eye,
  EyeOff,
  Settings,
  User,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setChats([
        {
          id: 1,
          name: 'Tech Conference 2024',
          type: 'event',
          lastMessage: 'Olá! Alguém tem dúvidas sobre o evento?',
          lastMessageTime: '14:30',
          unreadCount: 3,
          participants: 156,
          avatar: '/api/placeholder/50/50',
          isOnline: true,
          participants: [
            { id: 1, name: 'João Silva', avatar: '/api/placeholder/40/40', isOnline: true },
            { id: 2, name: 'Maria Santos', avatar: '/api/placeholder/40/40', isOnline: true },
            { id: 3, name: 'Pedro Costa', avatar: '/api/placeholder/40/40', isOnline: false }
          ]
        },
        {
          id: 2,
          name: 'Workshop Design',
          type: 'event',
          lastMessage: 'O workshop começa em 10 minutos!',
          lastMessageTime: '13:45',
          unreadCount: 0,
          participants: 89,
          avatar: '/api/placeholder/50/50',
          isOnline: true,
          participants: [
            { id: 4, name: 'Ana Oliveira', avatar: '/api/placeholder/40/40', isOnline: true },
            { id: 5, name: 'Carlos Lima', avatar: '/api/placeholder/40/40', isOnline: false }
          ]
        },
        {
          id: 3,
          name: 'Maria Santos',
          type: 'private',
          lastMessage: 'Obrigada pela ajuda!',
          lastMessageTime: '12:20',
          unreadCount: 1,
          participants: 2,
          avatar: '/api/placeholder/50/50',
          isOnline: true,
          participants: [
            { id: 2, name: 'Maria Santos', avatar: '/api/placeholder/40/40', isOnline: true }
          ]
        }
      ]);

      setOnlineUsers([
        { id: 1, name: 'João Silva', avatar: '/api/placeholder/40/40' },
        { id: 2, name: 'Maria Santos', avatar: '/api/placeholder/40/40' },
        { id: 4, name: 'Ana Oliveira', avatar: '/api/placeholder/40/40' }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Simular carregamento de mensagens
      setMessages([
        {
          id: 1,
          senderId: 1,
          senderName: 'João Silva',
          senderAvatar: '/api/placeholder/40/40',
          content: 'Olá pessoal! Bem-vindos ao Tech Conference 2024!',
          timestamp: '14:00',
          type: 'text',
          isOwn: false
        },
        {
          id: 2,
          senderId: 2,
          senderName: 'Maria Santos',
          senderAvatar: '/api/placeholder/40/40',
          content: 'Oi João! Estou muito animada para o evento!',
          timestamp: '14:02',
          type: 'text',
          isOwn: false
        },
        {
          id: 3,
          senderId: 3,
          senderName: 'Pedro Costa',
          senderAvatar: '/api/placeholder/40/40',
          content: 'Alguém sabe onde será o coffee break?',
          timestamp: '14:05',
          type: 'text',
          isOwn: false
        },
        {
          id: 4,
          senderId: 1,
          senderName: 'João Silva',
          senderAvatar: '/api/placeholder/40/40',
          content: 'Será no hall principal, próximo ao auditório A!',
          timestamp: '14:07',
          type: 'text',
          isOwn: true
        },
        {
          id: 5,
          senderId: 2,
          senderName: 'Maria Santos',
          senderAvatar: '/api/placeholder/40/40',
          content: 'Perfeito! Obrigada pela informação!',
          timestamp: '14:10',
          type: 'text',
          isOwn: false
        }
      ]);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      id: Date.now(),
      senderId: 1, // Simular usuário atual
      senderName: 'Você',
      senderAvatar: '/api/placeholder/40/40',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isOwn: true
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    // Simular resposta automática
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        senderId: 2,
        senderName: 'Maria Santos',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Mensagem recebida! Responderei em breve.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        isOwn: false
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  const handleTyping = () => {
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Carregando chat...</p>
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
            Chat em Tempo Real
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Conecte-se com participantes e organize eventos colaborativamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Sidebar - Lista de Chats */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Online Users */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Usuários Online ({onlineUsers.length})
              </h3>
              <div className="space-y-2">
                {onlineUsers.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {chat.name}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {chat.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {chat.participants} participantes
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Chat */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowCreateChat(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Novo Chat
              </button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedChat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {selectedChat.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedChat.participants} participantes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Video className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!message.isOwn && (
                          <img
                            src={message.senderAvatar}
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                        <div className={`rounded-lg px-4 py-2 ${
                          message.isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                        }`}>
                          {!message.isOwn && (
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            message.isOwn ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <span className="text-xs">{message.timestamp}</span>
                            {message.isOwn && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-3">
                        <img
                          src="/api/placeholder/40/40"
                          alt="Typing"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <File className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white pr-12"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Selecione um chat
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Escolha uma conversa para começar a mensagear
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Chat Modal */}
        {showCreateChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Criar Novo Chat
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Chat
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white">
                    <option value="event">Chat de Evento</option>
                    <option value="private">Chat Privado</option>
                    <option value="group">Chat em Grupo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome do Chat
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Digite o nome do chat"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    rows={3}
                    placeholder="Descreva o propósito do chat"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateChat(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Criar Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
