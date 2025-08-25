import { defineConfig } from '@v0/ai';

export default defineConfig({
  name: 'EventSync',
  description: 'Sistema de Gerenciamento de Eventos e Inscrições',
  instructions: `
    Você é um assistente especializado em gerenciamento de eventos.
    Ajude os usuários com:
    - Criação e edição de eventos
    - Sistema de inscrições
    - Geração de QR codes
    - Métricas e relatórios
    - Integração com Google Calendar
  `,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000
});
