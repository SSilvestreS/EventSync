'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Calendar, MapPin, Users, Tag, Image as ImageIcon } from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    capacity: '',
    price: '',
    isFree: false,
    image: null,
    tags: '',
    requirements: '',
    contactEmail: '',
    contactPhone: ''
  });

  const categories = [
    'Tecnologia',
    'Marketing',
    'Negócios',
    'Educação',
    'Arte',
    'Saúde',
    'Esporte',
    'Entretenimento',
    'Outros'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar o evento
    console.log('Dados do evento:', formData);
    alert('Evento criado com sucesso!');
    router.push('/events');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const EventPreview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prévia do Evento</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-bold text-gray-900">{formData.title || 'Título do Evento'}</h4>
          <p className="text-gray-600 mt-1">{formData.description || 'Descrição do evento aparecerá aqui...'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : 'Data não definida'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{formData.location || 'Local não definido'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              Capacidade: {formData.capacity || '0'} pessoas
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {formData.isFree ? 'Gratuito' : formData.price || 'Preço não definido'}
            </span>
          </div>
        </div>

        {formData.category && (
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {formData.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Criar Evento</h1>
                <p className="mt-2 text-gray-600">Configure todos os detalhes do seu evento</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="btn-secondary"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Ocultar Prévia' : 'Ver Prévia'}
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Evento
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Título do Evento *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Ex: Workshop de Desenvolvimento Web"
                    />
                  </div>

                  <div>
                    <label className="form-label">Descrição *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="input-field"
                      placeholder="Descreva detalhadamente o seu evento..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Categoria *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Ex: tecnologia, web, react"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Data e Local */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data e Local</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Data *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="form-label">Horário *</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Duração (horas)</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="0.5"
                        step="0.5"
                        className="input-field"
                        placeholder="2.5"
                      />
                    </div>
                    <div>
                      <label className="form-label">Local *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Ex: Centro de Inovação"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacidade e Preço */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacidade e Preço</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Capacidade Máxima *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="input-field"
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Evento gratuito</label>
                    </div>

                    {!formData.isFree && (
                      <div>
                        <label className="form-label">Preço</label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Ex: R$ 150,00"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Imagem e Requisitos */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagem e Requisitos</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Imagem do Evento</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload de arquivo</span>
                            <input
                              type="file"
                              name="image"
                              onChange={handleImageChange}
                              className="sr-only"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">ou arraste e solte</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Requisitos</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      placeholder="Ex: Conhecimentos básicos de programação, trazer notebook..."
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Email de Contato</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="contato@evento.com"
                      />
                    </div>
                    <div>
                      <label className="form-label">Telefone de Contato</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Prévia ou Informações */}
          <div className="space-y-6">
            {isPreview ? (
              <EventPreview />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dicas para um Evento de Sucesso</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Use um título claro e atrativo que explique o que os participantes aprenderão</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Inclua uma descrição detalhada com benefícios e resultados esperados</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Escolha uma data e horário que sejam convenientes para seu público-alvo</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Defina uma capacidade realista baseada no local e recursos disponíveis</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Adicione uma imagem de qualidade para aumentar o engajamento</p>
                  </div>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Informações Básicas</span>
                  <span className={`text-sm ${formData.title && formData.description && formData.category ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.title && formData.description && formData.category ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data e Local</span>
                  <span className={`text-sm ${formData.date && formData.time && formData.location ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.date && formData.time && formData.location ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacidade</span>
                  <span className={`text-sm ${formData.capacity ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.capacity ? '✓' : '○'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
