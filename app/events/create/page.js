'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Tag,
  Image as ImageIcon,
  Settings,
  Eye,
  Save,
  Plus,
  X,
  Upload,
  Globe,
  CreditCard,
  Shield,
  Zap
} from 'lucide-react';

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    maxParticipants: 100,
    category: 'technology',
    price: 0,
    currency: 'BRL',
    isOnline: false,
    onlineUrl: '',
    isHybrid: false,
    tags: [],
    image: null,
    coverImage: null,
    settings: {
      allowWaitlist: true,
      requireApproval: false,
      allowCancellation: true,
      cancellationDeadline: 24,
      allowTransfers: true,
      maxTransfers: 1,
      requirePayment: false,
      allowPartialPayment: false,
      requireDocuments: false,
      allowQuestions: true,
      allowFeedback: true,
      sendReminders: true,
      reminderDays: [1, 7, 14],
      allowSocialSharing: true,
      enableQRCode: true,
      enableCheckIn: true,
      enableAnalytics: true
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const categories = [
    { value: 'technology', label: 'Tecnologia', icon: Zap },
    { value: 'business', label: 'Negócios', icon: Users },
    { value: 'education', label: 'Educação', icon: Globe },
    { value: 'health', label: 'Saúde', icon: Shield },
    { value: 'entertainment', label: 'Entretenimento', icon: Calendar },
    { value: 'sports', label: 'Esportes', icon: Users },
    { value: 'culture', label: 'Cultura', icon: Globe },
    { value: 'other', label: 'Outros', icon: Tag }
  ];

  const currencies = [
    { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
    { code: 'USD', symbol: '$', name: 'Dólar Americano' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'Libra Esterlina' }
  ];

  const steps = [
    { id: 1, title: 'Informações Básicas', icon: Calendar },
    { id: 2, title: 'Local e Data', icon: MapPin },
    { id: 3, title: 'Configurações', icon: Settings },
    { id: 4, title: 'Mídia e Visual', icon: ImageIcon },
    { id: 5, title: 'Revisão', icon: Eye }
  ];

  useEffect(() => {
    // Auto-save draft every 30 seconds
    const interval = setInterval(() => {
      if (formData.title || formData.description) {
        localStorage.setItem('eventDraft', JSON.stringify(formData));
      }
    }, 30000);

    // Load draft on mount
    const savedDraft = localStorage.getItem('eventDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }

    return () => clearInterval(interval);
  }, [formData]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
        if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
        if (formData.description.length < 50) newErrors.description = 'Descrição deve ter pelo menos 50 caracteres';
        break;
      case 2:
        if (!formData.date) newErrors.date = 'Data é obrigatória';
        if (!formData.time) newErrors.time = 'Horário é obrigatório';
        if (!formData.location && !formData.isOnline) newErrors.location = 'Local é obrigatório para eventos presenciais';
        if (formData.isOnline && !formData.onlineUrl) newErrors.onlineUrl = 'URL online é obrigatória para eventos online';
        break;
      case 3:
        if (formData.maxParticipants < 1) newErrors.maxParticipants = 'Número de participantes deve ser maior que 0';
        if (formData.price < 0) newErrors.price = 'Preço não pode ser negativo';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }));
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'image') {
          setFormData(prev => ({ ...prev, image: file }));
          setImagePreview(e.target.result);
        } else {
          setFormData(prev => ({ ...prev, coverImage: file }));
          setCoverPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSaving(true);
    try {
      // Simular criação do evento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpar draft
      localStorage.removeItem('eventDraft');
      
      // Redirecionar para dashboard ou evento criado
      alert('Evento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Título do Evento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                placeholder="Ex: Tech Conference 2024"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                placeholder="Descreva seu evento em detalhes..."
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>{formData.description.length}/1000 caracteres</span>
                {errors.description && <span className="text-red-500">{errors.description}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Adicionar tag..."
                    className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-l-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Adicionar tag..."]');
                      if (input.value) {
                        addTag(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Horário de Início *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.time ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Horário de Término
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Máximo de Participantes
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  min="1"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maxParticipants ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                />
                {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isOnline}
                    onChange={(e) => handleInputChange('isOnline', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Evento Online</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isHybrid}
                    onChange={(e) => handleInputChange('isHybrid', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Evento Híbrido</span>
                </label>
              </div>

              {formData.isOnline && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    URL do Evento Online *
                  </label>
                  <input
                    type="url"
                    value={formData.onlineUrl}
                    onChange={(e) => handleInputChange('onlineUrl', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.onlineUrl ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    placeholder="https://meet.google.com/..."
                  />
                  {errors.onlineUrl && <p className="text-red-500 text-sm mt-1">{errors.onlineUrl}</p>}
                </div>
              )}

              {!formData.isOnline && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nome do Local *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.location ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                      placeholder="Ex: Centro de Convenções"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Endereço"
                    />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Cidade"
                    />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Estado"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Preço do Ingresso
                </label>
                <div className="flex">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="p-3 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    className={`flex-1 p-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Gratuito
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="free"
                      checked={formData.price === 0}
                      onChange={() => handleInputChange('price', 0)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Sim</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="free"
                      checked={formData.price > 0}
                      onChange={() => handleInputChange('price', 10)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Não</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Configurações Avançadas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowWaitlist}
                      onChange={(e) => handleSettingsChange('allowWaitlist', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Permitir Lista de Espera</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.requireApproval}
                      onChange={(e) => handleSettingsChange('requireApproval', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Requer Aprovação</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowCancellation}
                      onChange={(e) => handleSettingsChange('allowCancellation', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Permitir Cancelamento</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowTransfers}
                      onChange={(e) => handleSettingsChange('allowTransfers', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Permitir Transferências</span>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.requirePayment}
                      onChange={(e) => handleSettingsChange('requirePayment', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Requer Pagamento</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowPartialPayment}
                      onChange={(e) => handleSettingsChange('allowPartialPayment', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Permitir Pagamento Parcial</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.enableQRCode}
                      onChange={(e) => handleSettingsChange('enableQRCode', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Gerar QR Code</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.enableAnalytics}
                      onChange={(e) => handleSettingsChange('enableAnalytics', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Habilitar Analytics</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Imagem Principal
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: null }));
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Clique para fazer upload da imagem
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Selecionar Imagem
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Imagem de Capa
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, coverImage: null }));
                          setCoverPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Clique para fazer upload da capa
                      </p>
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Selecionar Capa
                      </button>
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Dicas para Imagens</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Imagem principal: 800x600px ou proporção 4:3</li>
                <li>• Imagem de capa: 1200x400px ou proporção 3:1</li>
                <li>• Formatos aceitos: JPG, PNG, WebP</li>
                <li>• Tamanho máximo: 5MB por imagem</li>
                <li>• Use imagens de alta qualidade para melhor apresentação</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resumo do Evento</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Informações Básicas</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Título:</span> {formData.title}</p>
                    <p><span className="font-medium">Categoria:</span> {categories.find(c => c.value === formData.category)?.label}</p>
                    <p><span className="font-medium">Tags:</span> {formData.tags.join(', ') || 'Nenhuma'}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Data e Local</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Data:</span> {formData.date}</p>
                    <p><span className="font-medium">Horário:</span> {formData.time} - {formData.endTime || 'Não definido'}</p>
                    <p><span className="font-medium">Tipo:</span> {formData.isOnline ? 'Online' : formData.isHybrid ? 'Híbrido' : 'Presencial'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Descrição</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">{formData.description}</p>
              </div>
              
              <div className="mt-4">
                <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Configurações</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <p>• Máximo: {formData.maxParticipants} participantes</p>
                  <p>• Preço: {formData.price === 0 ? 'Gratuito' : `${formData.currency} ${formData.price}`}</p>
                  <p>• QR Code: {formData.settings.enableQRCode ? 'Sim' : 'Não'}</p>
                  <p>• Analytics: {formData.settings.enableAnalytics ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Criar Novo Evento
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Configure todos os detalhes do seu evento
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isPreviewMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewMode ? 'Editar' : 'Preview'}</span>
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Criar Evento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                }`}>
                  {currentStep > step.id ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Anterior</span>
            </button>
            
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Passo {currentStep} de {steps.length}
            </div>
            
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <span>Próximo</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Criar Evento</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
