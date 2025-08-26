'use client';

import { useState, useEffect } from 'react';
import CouponManager from '../../components/CouponManager';

export default function CuponsAdminPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEvent(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administração de Cupons</h1>
          <p className="mt-2 text-gray-600">
            Gerencie cupons e descontos para todos os eventos do EventSync
          </p>
        </div>

        {/* Seletor de Evento */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Selecionar Evento</h2>
          <div className="flex space-x-4">
            <select
              value={selectedEvent || ''}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um evento</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString('pt-BR')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gerenciador de Cupons */}
        {selectedEvent ? (
          <CouponManager eventId={selectedEvent} />
        ) : (
          <div className="bg-white rounded-lg border p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione um evento para gerenciar cupons
            </h3>
            <p className="text-gray-600">
              Escolha um evento na lista acima para começar a criar e gerenciar cupons
            </p>
          </div>
        )}

        {/* Estatísticas Gerais */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Estatísticas Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{events.length}</p>
              <p className="text-sm text-gray-500">Total de Eventos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'PUBLISHED').length}
              </p>
              <p className="text-sm text-gray-500">Eventos Publicados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {events.reduce((sum, e) => sum + (e.currentRegistrations || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total de Inscrições</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {events.reduce((sum, e) => sum + (e.price || 0) * (e.currentRegistrations || 0), 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Receita Total (R$)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
