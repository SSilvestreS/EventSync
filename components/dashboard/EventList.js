'use client';

import Link from 'next/link';
import { Calendar, Users, Edit, Eye, MoreHorizontal } from 'lucide-react';

export default function EventList({ events }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'completed':
        return 'Concluído';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Eventos Recentes</h3>
          <Link href="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todos
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {events.map((event) => (
          <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{event.registrations}/{event.capacity} inscritos</span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Capacidade</span>
                    <span>{Math.round((event.registrations / event.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-6">
                <Link
                  href={`/events/${event.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Ver detalhes"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/events/${event.id}/edit`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar evento"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Mais opções"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">Nenhum evento encontrado.</p>
          <Link href="/events/create" className="text-blue-600 hover:text-blue-700 font-medium">
            Criar primeiro evento
          </Link>
        </div>
      )}
    </div>
  );
}
