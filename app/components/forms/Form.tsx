'use client';

import React, { useState } from 'react';
import { FormField, FormData, ValidationResult } from '../../types';
import { validationUtils } from '../../utils';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface FormProps {
  fields: FormField[];
  onSubmit: (data: FormData) => void | Promise<void>;
  submitText?: string;
  loading?: boolean;
  className?: string;
  initialData?: FormData;
  validation?: {
    [key: string]: (value: any) => string | null;
  };
}

/**
 * Componente Form reutilizável e padronizado
 */
export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitText = 'Enviar',
  loading = false,
  className = '',
  initialData = {},
  validation = {},
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Valida um campo específico
  const validateField = (name: string, value: any): string | null => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    // Validação obrigatória
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} é obrigatório`;
    }

    // Validação de tamanho mínimo
    if (field.validation?.min && typeof value === 'string' && value.length < field.validation.min) {
      return `${field.label} deve ter pelo menos ${field.validation.min} caracteres`;
    }

    // Validação de tamanho máximo
    if (field.validation?.max && typeof value === 'string' && value.length > field.validation.max) {
      return `${field.label} deve ter no máximo ${field.validation.max} caracteres`;
    }

    // Validação de padrão
    if (field.validation?.pattern && typeof value === 'string') {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `${field.label} não está no formato correto`;
      }
    }

    // Validação customizada
    if (validation[name]) {
      return validation[name](value);
    }

    // Validações específicas por tipo
    switch (field.type) {
      case 'email':
        if (value && !validationUtils.isValidEmail(value)) {
          return 'Email inválido';
        }
        break;
      case 'password':
        if (value) {
          const passwordValidation = validationUtils.isValidPassword(value);
          if (!passwordValidation.isValid) {
            return passwordValidation.errors[0];
          }
        }
        break;
    }

    return null;
  };

  // Atualiza o valor de um campo
  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Valida o campo se já foi tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  };

  // Marca um campo como tocado
  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const value = formData[name];
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  };

  // Valida todo o formulário
  const validateForm = (): ValidationResult => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: Object.values(newErrors) };
  };

  // Submete o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    }
  };

  // Renderiza um campo específico
  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isTouched = touched[field.name];

    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
    const errorClasses = 'border-red-500 focus:ring-red-500';
    const normalClasses = 'border-gray-300 focus:ring-blue-500';

    const inputClasses = cn(
      baseClasses,
      isTouched && error ? errorClasses : normalClasses
    );

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            placeholder={field.placeholder}
            className={cn(inputClasses, 'resize-vertical min-h-[100px]')}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            className={inputClasses}
          >
            <option value="">Selecione...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              onBlur={() => handleFieldBlur(field.name)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  onBlur={() => handleFieldBlur(field.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            className={inputClasses}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            placeholder={field.placeholder}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          {field.type !== 'checkbox' && field.type !== 'radio' && (
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {renderField(field)}
          
          {touched[field.name] && errors[field.name] && (
            <p className="text-sm text-red-600">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div className="pt-4">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default Form;
