'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  Users,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    sound: true,
    desktop: true,
    email: true,
    autoHide: 5000,
    maxNotifications: 10
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const audioRef = useRef(null);

  // Simular WebSocket para demonstração
  useEffect(() => {
    // Simular conexão WebSocket
    const connectWebSocket = () => {
      setIsConnected(true);
      
      // Simular recebimento de notificações em tempo real
      const notificationTypes = [
        {
          type: 'success',
          title: 'Evento Criado',
          message: 'Tech Conference 2024 foi criado com sucesso',
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          priority: 'normal'
        },
        {
          type: 'warning',
          title: 'Participante Pendente',
          message: '5 inscrições aguardando aprovação',
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          priority: 'high'
        },
        {
          type: 'info',
          title: 'Novo Inscrito',
          message: 'João Silva se inscreveu no Workshop de Design',
          icon: Info,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          priority: 'normal'
        },
        {
          type: 'error',
          title: 'Falha no Pagamento',
          message: 'Erro ao processar pagamento de Maria Santos',
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          priority: 'critical'
        }
      ];

      // Simular notificações chegando a cada 10-30 segundos
      const interval = setInterval(() => {
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const newNotification = {
          id: Date.now(),
          ...randomType,
          timestamp: new Date(),
          read: false,
          action: Math.random() > 0.5 ? {
            label: 'Ver Detalhes',
            url: '/dashboard'
          } : null
        };

        addNotification(newNotification);
      }, Math.random() * 20000 + 10000); // 10-30 segundos

      return () => clearInterval(interval);
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev].slice(0, settings.maxNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
      return newNotifications;
    });

    // Tocar som se habilitado
    if (settings.sound && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    // Mostrar notificação desktop se habilitado
    if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }

    // Auto-hide se configurado
    if (settings.autoHide > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, settings.autoHide);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => {
      const newNotifications = prev.filter(n => n.id !== id);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
      return newNotifications;
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const newNotifications = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      setUnreadCount(newNotifications.filter(n => !n.read).length);
      return newNotifications;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const newNotifications = prev.map(n => ({ ...n, read: true }));
      setUnreadCount(0);
      return newNotifications;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-l-red-500';
      case 'high': return 'border-l-4 border-l-yellow-500';
      case 'normal': return 'border-l-4 border-l-blue-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'normal': return 'Normal';
      default: return 'Baixo';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, desktop: true }));
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <>
      {/* Áudio para notificações */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification-sound.mp3" type="audio/mpeg" />
      </audio>

      {/* Botão de notificações */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown de notificações */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Notificações
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {unreadCount} não lidas
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  title="Configurações"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Configurações */}
            {showSettings && (
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-white mb-3">Configurações</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.sound}
                      onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Som</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.desktop}
                      onChange={(e) => setSettings(prev => ({ ...prev, desktop: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Notificações Desktop</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                      Auto-hide (ms)
                    </label>
                    <input
                      type="number"
                      value={settings.autoHide}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoHide: parseInt(e.target.value) }))}
                      className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Marcar todas como lidas
              </button>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Limpar todas
              </button>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                          <notification.icon className={`w-4 h-4 ${notification.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatTime(notification.timestamp)}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  notification.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  notification.priority === 'high' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {getPriorityText(notification.priority)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {notification.action && (
                                <button
                                  onClick={() => {
                                    if (notification.action?.url) {
                                      window.location.href = notification.action.url;
                                    }
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                              
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Marcar como lida
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {notifications.length} notificação{notifications.length !== 1 ? 'es' : ''}
                </span>
                <span className={`flex items-center space-x-1 ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
