'use client';

import { useState } from 'react';
import { 
  Bell, 
  Shield, 
  User, 
  Palette, 
  Zap,
  Mail,
  Smartphone,
  Globe,
  Lock,
  Eye,
  Moon,
  Sun,
  Save,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      whatsapp: true
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analytics: true
    },
    account: {
      twoFactor: false,
      sessionTimeout: 30,
      language: 'pt-BR'
    },
    theme: 'system',
    integrations: {
      googleCalendar: true,
      slack: false,
      discord: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const notificationTypes = [
    { key: 'email', label: 'Notificações por Email', icon: Mail, description: 'Receber notificações importantes por email' },
    { key: 'push', label: 'Notificações Push', icon: Bell, description: 'Notificações em tempo real no navegador' },
    { key: 'sms', label: 'Notificações SMS', icon: Smartphone, description: 'SMS para eventos críticos' },
    { key: 'whatsapp', label: 'WhatsApp Business', icon: Globe, description: 'Mensagens via WhatsApp' }
  ];

  const privacyOptions = [
    { value: 'public', label: 'Público', description: 'Seu perfil é visível para todos' },
    { value: 'friends', label: 'Amigos', description: 'Apenas amigos podem ver seu perfil' },
    { value: 'private', label: 'Privado', description: 'Apenas você pode ver seu perfil' }
  ];

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español' },
    { code: 'fr-FR', name: 'Français' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Configurações
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Personalize sua experiência e gerencie suas preferências
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Salvando...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Notificações
                </h3>
              </div>
              <div className="space-y-4">
                {notificationTypes.map((type) => (
                  <div key={type.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <type.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {type.label}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[type.key as keyof typeof settings.notifications] as boolean}
                        onChange={(e) => handleSettingChange('notifications', type.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Privacidade e Segurança
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Visibilidade do Perfil
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    {privacyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Compartilhamento de Dados
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Permitir que EventSync use dados para melhorar o serviço
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Autenticação de Dois Fatores
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Adicionar uma camada extra de segurança à sua conta
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.account.twoFactor}
                      onChange={(e) => handleSettingChange('account', 'twoFactor', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Integrações
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Google Calendar
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Sincronizar eventos com seu calendário
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.integrations.googleCalendar}
                      onChange={(e) => handleSettingChange('integrations', 'googleCalendar', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Theme */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Tema
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'light', label: 'Claro', icon: Sun },
                  { value: 'dark', label: 'Escuro', icon: Moon },
                  { value: 'system', label: 'Sistema', icon: Palette }
                ].map((theme) => (
                  <label key={theme.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={settings.theme === theme.value}
                      onChange={(e) => handleSettingChange('theme', '', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <theme.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">{theme.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Idioma
                </h4>
              </div>
              <select
                value={settings.account.language}
                onChange={(e) => handleSettingChange('account', 'language', e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Timeout */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Timeout da Sessão
                </h4>
              </div>
              <div className="space-y-3">
                <select
                  value={settings.account.sessionTimeout}
                  onChange={(e) => handleSettingChange('account', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={120}>2 horas</option>
                  <option value={0}>Nunca</option>
                </select>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tempo de inatividade antes do logout automático
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
