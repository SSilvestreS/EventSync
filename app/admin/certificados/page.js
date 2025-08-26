'use client';

import { useState, useEffect } from 'react';
import { Download, Eye, RefreshCw, FileText } from 'lucide-react';

export default function CertificadosAdminPage() {
  const [certificates, setCertificates] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certsResponse, eventsResponse] = await Promise.all([
        fetch('/api/certificates'),
        fetch('/api/events')
      ]);

      if (certsResponse.ok) {
        const certsData = await certsResponse.json();
        setCertificates(certsData);
      }

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async (registrationId) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId })
      });

      if (response.ok) {
        const newCertificate = await response.json();
        setCertificates([...certificates, newCertificate]);
        alert('Certificado gerado com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      alert('Erro ao gerar certificado');
    } finally {
      setGenerating(false);
    }
  };

  const generateAllCertificates = async () => {
    if (!confirm('Gerar certificados para todas as inscrições confirmadas?')) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/certificates/generate-all', {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.message}`);
        fetchData(); // Recarregar dados
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao gerar certificados:', error);
      alert('Erro ao gerar certificados em lote');
    } finally {
      setGenerating(false);
    }
  };

  const filteredCertificates = selectedEvent
    ? certificates.filter(cert => cert.registration?.event?.id === selectedEvent)
    : certificates;

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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Certificados</h1>
          <p className="mt-2 text-gray-600">
            Gerencie e gere certificados para todos os participantes dos eventos
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Evento
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Eventos</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={generateAllCertificates}
                disabled={generating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                Gerar Todos
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Total de Certificados</h3>
            <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Certificados Ativos</h3>
            <p className="text-2xl font-bold text-green-600">
              {certificates.filter(c => c.isActive).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Eventos com Certificados</h3>
            <p className="text-2xl font-bold text-blue-600">
              {new Set(certificates.map(c => c.registration?.event?.id)).size}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Downloads Hoje</h3>
            <p className="text-2xl font-bold text-purple-600">
              {certificates.filter(c => {
                const today = new Date().toDateString();
                const issuedToday = new Date(c.issuedAt).toDateString();
                return issuedToday === today;
              }).length}
            </p>
          </div>
        </div>

        {/* Lista de Certificados */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Certificados ({filteredCertificates.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emitido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {certificate.registration?.user?.name || 'N/A'}
                        </p>
                        <p className="text-gray-500">
                          {certificate.registration?.user?.email || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {certificate.registration?.event?.title || 'N/A'}
                        </p>
                        <p className="text-gray-500">
                          {certificate.registration?.event?.date 
                            ? new Date(certificate.registration.event.date).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {certificate.certificateCode}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(certificate.issuedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        certificate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {certificate.downloadUrl && (
                          <a
                            href={certificate.downloadUrl}
                            download
                            className="text-blue-600 hover:text-blue-900"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => generateCertificate(certificate.registrationId)}
                          disabled={generating}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Regenerar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mensagem quando não há certificados */}
        {filteredCertificates.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center mt-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum certificado encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedEvent 
                ? 'Este evento ainda não possui certificados gerados.'
                : 'Comece gerando certificados para os participantes dos eventos.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
