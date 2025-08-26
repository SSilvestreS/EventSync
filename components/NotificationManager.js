'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, BellOff, Settings, CheckCircle, XCircle } from 'lucide-react';

const NotificationManager = () => {
  const { data: session } = useSession();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    reminder24h: true,
    reminder2h: true,
    reminder30min: true,
    eventUpdates: true,
    paymentConfirmations: true,
    marketingEmails: false
  });

  // Verificar se o navegador suporta notificações push
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  // Carregar preferências do usuário
  useEffect(() => {
    if (session?.user) {
      loadPreferences();
    }
  }, [session]);

  // Verificar subscription atual
  const checkSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    }
  }, []);

  // Carregar preferências do usuário
  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }

  // Solicitar permissão e criar subscription
  const subscribeToNotifications = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Solicitar permissão
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        setMessage('Permissão negada para notificações', 'error');
        return;
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Criar subscription
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Salvar no servidor
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: newSubscription.toJSON(),
          endpoint: newSubscription.endpoint,
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(newSubscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(newSubscription.getKey('auth'))))
        })
      });

      if (response.ok) {
        setSubscription(newSubscription);
        setIsSubscribed(true);
        setMessage('Notificações push ativadas com sucesso!', 'success');
      } else {
        throw new Error('Erro ao salvar subscription');
      }

    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
      setMessage('Erro ao ativar notificações push', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Desativar notificações push
  const unsubscribeFromNotifications = async () => {
    if (!subscription) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Cancelar subscription
      await subscription.unsubscribe();

      // Remover do servidor
      const response = await fetch(`/api/notifications/push?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSubscription(null);
        setIsSubscribed(false);
        setMessage('Notificações push desativadas', 'success');
      } else {
        throw new Error('Erro ao remover subscription');
      }

    } catch (error) {
      console.error('Erro ao desativar notificações:', error);
      setMessage('Erro ao desativar notificações push', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar preferência específica
  const updatePreference = async (key, value) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });

      if (response.ok) {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setMessage('Preferência atualizada com sucesso!', 'success');
      } else {
        throw new Error('Erro ao atualizar preferência');
      }
    } catch (error) {
      console.error('Erro ao atualizar preferência:', error);
      setMessage('Erro ao atualizar preferência', 'error');
    }
  };

  // Testar notificação
  const testNotification = async () => {
    if (!isSubscribed) return;

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: [session.user.id],
          title: 'Teste de Notificação',
          message: 'Esta é uma notificação de teste do EventSync!',
          type: 'TEST',
          sendEmail: false,
          sendPush: true
        })
      });

      if (response.ok) {
        setMessage('Notificação de teste enviada!', 'success');
      } else {
        throw new Error('Erro ao enviar notificação de teste');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      setMessage('Erro ao enviar notificação de teste', 'error');
    }
  };

  // Mostrar mensagem
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  if (!session?.user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Gerenciar Notificações
        </h2>
        <Settings className="w-5 h-5 text-gray-400" />
      </div>

      {/* Mensagem de status */}
      {message && (
        <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
          messageType === 'success' ? 'bg-green-100 text-green-800' :
          messageType === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {messageType === 'success' ? <CheckCircle className="w-4 h-4" /> :
           messageType === 'error' ? <XCircle className="w-4 h-4" /> :
           <Bell className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* Status das notificações push */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Notificações Push</h3>
        
        {!isSupported ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800">
              Seu navegador não suporta notificações push.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Status: {isSubscribed ? 'Ativado' : 'Desativado'}
              </span>
              <div className="flex gap-2">
                {!isSubscribed ? (
                  <button
                    onClick={subscribeToNotifications}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? 'Ativando...' : 'Ativar Push'}
                  </button>
                ) : (
                  <button
                    onClick={unsubscribeFromNotifications}
                    disabled={isLoading}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? 'Desativando...' : 'Desativar Push'}
                  </button>
                )}
                
                {isSubscribed && (
                  <button
                    onClick={testNotification}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Testar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferências de notificação */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Preferências</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notificações por email */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-600">Email</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => updatePreference('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Notificações por email</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.reminder24h}
                  onChange={(e) => updatePreference('reminder24h', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Lembretes 24h antes</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.reminder2h}
                  onChange={(e) => updatePreference('reminder2h', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Lembretes 2h antes</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.reminder30min}
                  onChange={(e) => updatePreference('reminder30min', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Lembretes 30min antes</span>
              </label>
            </div>
          </div>

          {/* Outras notificações */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-600">Outras</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.eventUpdates}
                  onChange={(e) => updatePreference('eventUpdates', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Atualizações de eventos</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.paymentConfirmations}
                  onChange={(e) => updatePreference('paymentConfirmations', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Confirmações de pagamento</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.marketingEmails}
                  onChange={(e) => updatePreference('marketingEmails', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Emails de marketing</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-gray-50 rounded-md p-4">
        <h4 className="font-medium text-gray-700 mb-2">Como funcionam as notificações?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Push:</strong> Receba notificações instantâneas no navegador</li>
          <li>• <strong>Email:</strong> Receba lembretes e atualizações por email</li>
          <li>• <strong>Lembretes:</strong> Configure quando quer ser lembrado dos eventos</li>
          <li>• <strong>Personalização:</strong> Escolha quais tipos de notificação receber</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationManager;
