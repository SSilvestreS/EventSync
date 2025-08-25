'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, User, Settings, LogOut, Plus, Search } from 'lucide-react';

export default function DashboardHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Navegação */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EventSync</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">
                Eventos
              </Link>
              <Link href="/registrations" className="text-gray-600 hover:text-gray-900 transition-colors">
                Inscrições
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </Link>
            </nav>
          </div>

          {/* Barra de Busca */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos, inscrições..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Botão Criar Evento */}
            <Link href="/events/create" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Link>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">Nova inscrição para Workshop de Desenvolvimento Web</p>
                      <p className="text-xs text-gray-500 mt-1">Há 5 minutos</p>
                    </div>
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">Evento "Palestra sobre IA" está próximo</p>
                      <p className="text-xs text-gray-500 mt-1">Há 1 hora</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">Relatório mensal disponível</p>
                      <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-700">
                      Ver todas as notificações
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Menu do Usuário */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">Organizador</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Link>
                    <hr className="my-1" />
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
