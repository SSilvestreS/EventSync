'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Settings, TestTube, Zap, Smartphone } from 'lucide-react';

export default function WhatsAppConfigPage() {
  const [config, setConfig] = useState({
    phoneNumber: '',
    accessToken: '',
    webhookUrl: '',
    isActive: false,
    autoReply: true,
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'America/Sao_Paulo'
    },
    chatbotEnabled: true,
    notificationsEnabled: true
  });
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/whatsapp/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        alert('Configuração salva com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração');
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim()) {
      alert('Digite uma mensagem de teste');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage })
      });

      if (response.ok) {
        const result = await response.json();
        addLog('Mensagem de teste enviada com sucesso', 'success');
        setTestMessage('');
      } else {
        const error = await response.json();
        addLog(`Erro ao enviar mensagem: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem de teste:', error);
      addLog('Erro ao enviar mensagem de teste', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Manter apenas os últimos 50 logs
  };

  const testWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/test-webhook', {
        method: 'POST'
      });

      if (response.ok) {
        addLog('Webhook testado com sucesso', 'success');
      } else {
        const error = await response.json();
        addLog(`Erro no webhook: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      addLog('Erro ao testar webhook', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin;
    const webhookUrl = `${baseUrl}/api/webhooks/whatsapp`;
    setConfig(prev => ({ ...prev, webhookUrl }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuração WhatsApp Business</h1>
          <p className="mt-2 text-gray-600">
            Configure a integração com WhatsApp Business para automatizar comunicações
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configurações Básicas */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações Básicas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do WhatsApp Business
                  </label>
                  <input
                    type="tel"
                    value={config.phoneNumber}
                    onChange={(e) => setConfig({...config, phoneNumber: e.target.value})}
                    placeholder="+5511999999999"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token de Acesso
                  </label>
                  <input
                    type="password"
                    value={config.accessToken}
                    onChange={(e) => setConfig({...config, accessToken: e.target.value})}
                    placeholder="Seu token do Meta Developer"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Webhook
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={config.webhookUrl}
                      onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
                      placeholder="URL do webhook"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={generateWebhookUrl}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Gerar
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.isActive}
                      onChange={(e) => setConfig({...config, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Integração Ativa</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.autoReply}
                      onChange={(e) => setConfig({...config, autoReply: e.target.checked})}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Resposta Automática</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Horário */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Horário de Funcionamento</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Início
                  </label>
                  <input
                    type="time"
                    value={config.businessHours.start}
                    onChange={(e) => setConfig({
                      ...config, 
                      businessHours: {...config.businessHours, start: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fim
                  </label>
                  <input
                    type="time"
                    value={config.businessHours.end}
                    onChange={(e) => setConfig({
                      ...config, 
                      businessHours: {...config.businessHours, end: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuso Horário
                  </label>
                  <select
                    value={config.businessHours.timezone}
                    onChange={(e) => setConfig({
                      ...config, 
                      businessHours: {...config.businessHours, timezone: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Belem">Belém (GMT-3)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configurações de Funcionalidades */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Funcionalidades</h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.chatbotEnabled}
                    onChange={(e) => setConfig({...config, chatbotEnabled: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Chatbot Inteligente</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notificationsEnabled}
                    onChange={(e) => setConfig({...config, notificationsEnabled: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notificações Automáticas</span>
                </label>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex space-x-4">
              <button
                onClick={saveConfig}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Configuração'}
              </button>

              <button
                onClick={testWebhook}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <TestTube className="w-5 h-5 mr-2" />
                Testar Webhook
              </button>
            </div>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Teste de Mensagem */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Teste de Mensagem
              </h3>
              
              <div className="space-y-4">
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Digite uma mensagem de teste..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                
                <button
                  onClick={sendTestMessage}
                  disabled={loading || !testMessage.trim()}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Teste
                </button>
              </div>
            </div>

            {/* Status da Integração */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status da Integração</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">WhatsApp Business</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    config.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {config.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Webhook</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    config.webhookUrl ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {config.webhookUrl ? 'Configurado' : 'Pendente'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Token</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    config.accessToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {config.accessToken ? 'Configurado' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Logs Recentes</h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">Nenhum log disponível</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className={`text-xs p-2 rounded ${
                      log.type === 'success' ? 'bg-green-50 text-green-700' :
                      log.type === 'error' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      <div className="font-medium">{log.message}</div>
                      <div className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
