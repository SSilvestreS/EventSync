'use client';

import Link from 'next/link';
import { Calendar, Mail, CheckCircle, Clock, User } from 'lucide-react';

export default function RecentRegistrations({ registrations }) {
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
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Inscrições Recentes</h3>
          <Link href="/registrations" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {registrations.map((registration) => (
          <div key={registration.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{registration.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                    {getStatusIcon(registration.status)}
                    <span className="ml-1">{getStatusLabel(registration.status)}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{registration.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(registration.date)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-900 font-medium">{registration.event}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Ver detalhes"
                >
                  <User className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Enviar email"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {registrations.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">Nenhuma inscrição encontrada.</p>
          <Link href="/events" className="text-blue-600 hover:text-blue-700 font-medium">
            Criar evento para receber inscrições
          </Link>
        </div>
      )}

      {/* Estatísticas Rápidas */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {registrations.filter(r => r.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-600">Confirmadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {registrations.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pendentes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {registrations.filter(r => r.status === 'cancelled').length}
            </p>
            <p className="text-sm text-gray-600">Canceladas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
