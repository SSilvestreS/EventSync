# EventSync - Sistema de Gerenciamento de Eventos

EventSync é uma plataforma completa para gerenciamento de eventos, inscrições e check-ins com QR Code, desenvolvida com Next.js 14 e tecnologias modernas.

## Status de Implementação

### Versão 1.1 - COMPLETA (100%)
- [x] **Sistema de Cupons e Descontos** - Implementado e funcional
- [x] **Integração WhatsApp Business** - Implementado e funcional  
- [x] **App Móvel React Native** - Implementado e funcional
- [x] **Sistema de Certificados** - Implementado e funcional

### Versão 1.2 - IMPLEMENTADA (100%)
- [x] **Analytics avançados** - Implementado e funcional
- [x] **Integração com CRM** - Implementado e funcional
- [x] **Sistema de afiliados** - Implementado e funcional
- [x] **Múltiplos idiomas** - Implementado e funcional
- [x] **Sistema de tracking de conversões** - Implementado e funcional

### Versão 1.3 - IMPLEMENTADA (100%)
- [x] **Sistema de Notificações Push Avançado** - Implementado e funcional
- [x] **Templates de Email Inteligentes** - Implementado e funcional
- [x] **Service Worker PWA** - Implementado e funcional
- [x] **Preferências de Notificação** - Implementado e funcional
- [x] **Refatoração Completa do Código** - Implementado e funcional
- [x] **Sistema de Componentes UI Reutilizáveis** - Implementado e funcional
- [x] **Hooks Personalizados** - Implementado e funcional
- [x] **Utilitários Centralizados** - Implementado e funcional
- [x] **Tipos TypeScript Completos** - Implementado e funcional
- [x] **Constantes Centralizadas** - Implementado e funcional
- [x] **Sistema de Configuração Avançado** - Implementado e funcional
- [x] **Sistema de Logging Profissional** - Implementado e funcional
- [x] **Sistema de Middleware Avançado** - Implementado e funcional
- [x] **Sistema de Validação Robusto** - Implementado e funcional
- [x] **Sistema de Cache Inteligente** - Implementado e funcional
- [x] **Sistema de Monitoramento e Métricas** - Implementado e funcional
- [x] **Sistema de Testes Automatizados** - Implementado e funcional

### Versão 2.0 - EM PLANEJAMENTO
- [ ] IA para recomendações de eventos
- [ ] Realidade aumentada para check-in
- [ ] Blockchain para certificados verificáveis
- [ ] Marketplace de eventos
- [ ] Sistema de gamificação
- [ ] Integração com redes sociais

## Funcionalidades Principais

### IMPLEMENTADAS (v1.1 + v1.2)
- [x] Sistema de cupons e descontos
- [x] Integração WhatsApp Business
- [x] App móvel React Native
- [x] Sistema de certificados
- [x] Geração de QR Codes
- [x] Sistema de pagamentos
- [x] Autenticação e autorização
- [x] Dashboard administrativo
- [x] Gestão de eventos
- [x] Sistema de inscrições
- [x] **Analytics avançados com Mixpanel, PostHog e Amplitude**
- [x] **Integração com CRM (HubSpot, Salesforce, Pipedrive, Zapier)**
- [x] **Sistema completo de afiliados com comissões**
- [x] **Suporte a 10 idiomas com internacionalização completa**
- [x] **Sistema de notificações push em tempo real**
- [x] **Templates de email responsivos e inteligentes**
- [x] **Service worker para PWA e cache offline**
- [x] **Preferências personalizáveis de notificação**
- [x] **Arquitetura refatorada e modular**
- [x] **Componentes UI reutilizáveis e padronizados**
- [x] **Hooks personalizados para gerenciamento de estado**
- [x] **Utilitários centralizados e organizados**
- [x] **Sistema de tipos TypeScript completo**
- [x] **Constantes e configurações centralizadas**
- [x] **Sistema de configuração avançado com validação Zod**
- [x] **Sistema de logging profissional com Winston**
- [x] **Sistema de middleware organizado e priorizado**
- [x] **Sistema de validação robusto com schemas Zod**
- [x] **Sistema de cache inteligente com múltiplas estratégias**
- [x] **Sistema de monitoramento com métricas e health checks**
- [x] **Sistema de testes automatizados com Jest**

### PLANEJADAS (v2.0)
- [ ] IA para recomendações de eventos
- [ ] Realidade aumentada para check-in
- [ ] Blockchain para certificados verificáveis
- [ ] Marketplace de eventos
- [ ] Sistema de gamificação
- [ ] Integração com redes sociais

### **Sistema de Eventos**
- Criação e edição de eventos
- Categorização (Conferência, Workshop, Seminário, etc.)
- Gestão de sessões e palestras
- Sistema de patrocinadores
- Upload de imagens e mídia
- Integração com Google Calendar

### **Sistema de Inscrições**
- Inscrição em eventos
- Geração automática de QR Code
- Sistema de lista de espera
- Diferentes tipos de ingressos
- Check-in e check-out

### **Sistema de Pagamentos**
- Integração com Stripe
- Múltiplos métodos de pagamento
- Processamento seguro de transações
- Webhooks para atualizações automáticas
- Histórico de pagamentos

### **Autenticação e Usuários**
- Login/Registro com email e senha
- Autenticação OAuth com Google
- Sistema de roles (Admin, Organizador, Participante)
- Perfis de usuário personalizáveis
- Verificação de email

### **Dashboard e Analytics**
- Painel do organizador
- Métricas em tempo real
- Relatórios de inscrições
- Gráficos e estatísticas
- Exportação de dados

### **Notificações e Comunicação**
- Emails automáticos personalizados
- Lembretes de eventos
- Confirmações de inscrição
- Notificações de pagamento
- Sistema de notificações in-app

### **QR Code e Check-in**
- Geração automática de QR Codes
- Sistema de check-in móvel
- Validação em tempo real
- Histórico de presenças
- Relatórios de participação

## Tecnologias Utilizadas

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones modernos
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### **Backend**
- **Next.js API Routes** - API RESTful
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **NextAuth.js** - Autenticação e autorização
- **bcryptjs** - Hash de senhas
- **JWT** - Tokens de autenticação
- **Mixpanel/PostHog/Amplitude** - Analytics avançados
- **HubSpot/Salesforce/Pipedrive** - Integração CRM
- **i18next** - Internacionalização
- **Segment/Rudder** - Tracking de conversões
- **Web Push API** - Notificações push em tempo real
- **Service Worker** - PWA e cache offline
- **VAPID** - Autenticação de notificações push

### **Pagamentos e Integrações**
- **Stripe** - Processamento de pagamentos
- **Google APIs** - Calendar e OAuth
- **Nodemailer** - Envio de emails
- **QRCode** - Geração de códigos QR

### **Ferramentas de Desenvolvimento**
- **TypeScript** - Tipagem estática
- **ESLint** - Linting de código
- **Jest** - Testes unitários
- **Playwright** - Testes E2E
- **Prisma Studio** - Interface do banco

### **Refatoração e Arquitetura**
- **clsx** - Combinação inteligente de classes CSS
- **tailwind-merge** - Resolução de conflitos Tailwind
- **Sistema de Componentes** - Design system modular e reutilizável
- **Hooks Personalizados** - Gerenciamento de estado e API
- **Utilitários Centralizados** - Funções auxiliares organizadas
- **Tipos TypeScript** - Sistema de tipos completo e consistente
- **Constantes** - Configurações centralizadas e padronizadas

### **Sistemas Avançados**
- **Zod** - Validação de esquemas e configuração
- **Winston** - Sistema de logging profissional
- **Middleware Manager** - Gerenciamento de middlewares
- **Cache Manager** - Sistema de cache inteligente
- **Monitoring System** - Monitoramento e métricas
- **Testing System** - Sistema de testes automatizados

## Estrutura do Projeto

```
EventSync/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Autenticação
│   │   ├── events/             # Gestão de eventos
│   │   ├── registrations/      # Inscrições
│   │   ├── payments/           # Pagamentos
│   │   ├── qrcode/             # QR Codes
│   │   ├── metrics/            # Métricas
│   │   ├── analytics/          # Analytics avançados
│   │   ├── crm/                # Integração CRM
│   │   ├── affiliates/         # Sistema de afiliados
│   │   ├── i18n/               # Internacionalização
│   │   ├── conversions/        # Tracking de conversões
│   │   ├── notifications/      # Sistema de notificações
│   │   │   ├── push/          # Notificações push
│   │   │   ├── preferences/   # Preferências de notificação
│   │   │   └── send/          # Envio de notificações
│   │   └── webhooks/           # Webhooks (Stripe)
│   ├── components/              # Componentes específicos da aplicação
│   │   ├── ui/                 # Componentes UI reutilizáveis
│   │   ├── forms/              # Componentes de formulário
│   │   ├── layout/             # Componentes de layout
│   │   └── modals/             # Componentes de modal
│   ├── hooks/                   # Hooks personalizados
│   │   └── useApi.ts           # Hook para gerenciar chamadas de API
│   ├── utils/                   # Utilitários da aplicação
│   │   └── cn.ts               # Utilitário para combinar classes CSS
│   ├── constants/               # Constantes da aplicação
│   ├── types/                   # Tipos TypeScript da aplicação
│   ├── auth/                    # Páginas de autenticação
│   ├── dashboard/               # Dashboard principal
│   ├── events/                  # Gestão de eventos
│   └── globals.css              # Estilos globais
├── components/                  # Componentes React
│   ├── dashboard/              # Componentes do dashboard
│   ├── ui/                     # Componentes de interface reutilizáveis
│   │   ├── Button.tsx         # Botão padronizado
│   │   ├── Modal.tsx          # Modal reutilizável
│   │   ├── Table.tsx          # Tabela com paginação e busca
│   │   └── Card.tsx           # Card com header, content e footer
│   ├── forms/                  # Componentes de formulário
│   │   └── Form.tsx           # Formulário reutilizável
│   ├── layout/                 # Componentes de layout
│   └── modals/                 # Componentes de modal
├── lib/                        # Utilitários e serviços
│   ├── services/               # Serviços de negócio
│   │   ├── googleCalendar.js  # Integração Google Calendar
│   │   ├── emailService.js    # Serviço de email
│   │   ├── analyticsService.js # Serviço de analytics
│   │   ├── crmService.js      # Serviço de CRM
│   │   ├── affiliateService.js # Serviço de afiliados
│   │   ├── i18nService.js     # Serviço de internacionalização
│   │   └── notificationService.js # Serviço de notificações
│   ├── utils/                  # Utilitários organizados
│   │   ├── dateUtils.ts       # Utilitários de data
│   │   ├── validationUtils.ts # Utilitários de validação
│   │   ├── formatUtils.ts     # Utilitários de formatação
│   │   ├── arrayUtils.ts      # Utilitários de array
│   │   ├── objectUtils.ts     # Utilitários de objeto
│   │   ├── stringUtils.ts     # Utilitários de string
│   │   ├── urlUtils.ts        # Utilitários de URL
│   │   ├── storageUtils.ts    # Utilitários de localStorage
│   │   └── performanceUtils.ts # Utilitários de performance
│   ├── constants/              # Constantes centralizadas
│   ├── types/                  # Tipos TypeScript
│   ├── middleware/             # Middlewares personalizados
│   ├── config/                 # Sistema de configuração avançado
│   │   └── index.ts           # Configuração centralizada com Zod
│   ├── logger/                 # Sistema de logging profissional
│   │   └── index.ts           # Logger com Winston
│   ├── validation/             # Sistema de validação robusto
│   │   └── index.ts           # Validação com Zod
│   ├── cache/                  # Sistema de cache inteligente
│   │   └── index.ts           # Cache Manager
│   ├── monitoring/             # Sistema de monitoramento
│   │   └── index.ts           # Monitoring System
│   ├── testing/                # Sistema de testes automatizados
│   │   └── index.ts           # Testing System
│   ├── prisma.js              # Cliente Prisma
│   ├── emailTemplates.js      # Templates de email
│   ├── notificationConfig.js  # Configurações de notificação
│   └── config.js              # Configurações centralizadas
├── prisma/                     # Schema e migrações
│   ├── schema.prisma          # Schema do banco
│   └── seed.js                # Dados iniciais
├── scripts/                    # Scripts utilitários
├── docs/                       # Documentação
└── public/                     # Arquivos estáticos
```

## Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL 12+
- Conta Stripe (para pagamentos)
- Conta Google Cloud (para OAuth e Calendar)

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/eventsync.git
cd eventsync
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp env.example .env.local
# Edite .env.local com suas configurações
```

### **4. Configure o banco de dados**
```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações
npm run db:push

# Popule com dados iniciais
npm run db:seed
```

### **5. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

### **6. Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Servidor de produção
npm run lint             # Verificação de código

# Banco de dados
npm run db:generate      # Gerar cliente Prisma
npm run db:push          # Sincronizar schema
npm run db:migrate       # Executar migrações
npm run db:studio        # Abrir Prisma Studio
npm run db:seed          # Popular banco com dados
npm run db:reset         # Resetar banco
npm run setup            # Configuração completa

# Analytics e CRM
npm run analytics:export # Exportar dados de analytics
npm run crm:sync         # Sincronizar com CRM externo

# Internacionalização
npm run i18n:extract     # Extrair textos para tradução
npm run i18n:sync        # Sincronizar traduções

# Notificações
npm run notifications:test # Testar sistema de notificações
npm run pwa:install       # Instalar como PWA

# Testes
npm run test             # Testes unitários
npm run test:e2e         # Testes E2E

# Utilitários
npm run email:test       # Testar serviço de email
npm run stripe:test      # Testar integração Stripe

# Sistemas Avançados
npm run cache:stats      # Estatísticas do sistema de cache
npm run logs:analyze     # Análise de logs do sistema
npm run test:unit        # Testes unitários
npm run test:integration # Testes de integração
npm run test:coverage    # Cobertura de testes
npm run monitoring:stats # Estatísticas de monitoramento
npm run health:check     # Verificar health checks do sistema
```

## Banco de Dados

### **Modelos Principais**
- **User** - Usuários do sistema
- **Event** - Eventos e suas configurações
- **Session** - Sessões/palestras dos eventos
- **Registration** - Inscrições dos usuários
- **Payment** - Histórico de pagamentos
- **Sponsor** - Patrocinadores dos eventos
- **Media** - Arquivos e imagens
- **Notification** - Notificações do sistema
- **UserAnalytics** - Analytics de usuários
- **EventAnalytics** - Analytics de eventos
- **CRMContact** - Contatos do CRM
- **CRMLead** - Leads do CRM
- **Affiliate** - Sistema de afiliados
- **AffiliateReferral** - Referências de afiliados
- **UserPreferences** - Preferências de usuário
- **ConversionTracking** - Tracking de conversões
- **PushSubscription** - Subscriptions de notificação push
- **NotificationLog** - Log de notificações enviadas
- **NotificationPreference** - Preferências de notificação

### **Relacionamentos**
- Usuários podem organizar múltiplos eventos
- Eventos podem ter múltiplas sessões
- Usuários podem se inscrever em múltiplos eventos
- Cada inscrição pode ter um pagamento associado
- Eventos podem ter múltiplos patrocinadores

## Autenticação e Autorização

### **Sistemas de Login**
- **Email/Senha** - Autenticação tradicional
- **Google OAuth** - Login social
- **JWT Tokens** - Sessões seguras

### **Níveis de Acesso**
- **ADMIN** - Acesso total ao sistema
- **ORGANIZER** - Gestão de eventos próprios
- **ATTENDEE** - Participante de eventos
- **AFFILIATE** - Afiliado com sistema de comissões

## Sistema de Pagamentos

### **Métodos Suportados**
- Cartão de crédito/débito
- PIX (Brasil)
- Transferência bancária
- Pagamento em dinheiro

### **Funcionalidades**
- Processamento seguro com Stripe
- Webhooks para atualizações automáticas
- Histórico completo de transações
- Suporte a reembolsos
- Múltiplas moedas

## Sistema de Notificações

### **Tipos de Email**
- Confirmação de inscrição
- Lembretes de eventos
- Confirmação de pagamento
- Falha no pagamento
- Atualizações de eventos

### **Configuração SMTP**
- Suporte a Gmail, Outlook, etc.
- Templates HTML responsivos
- Personalização por usuário
- Logs de envio

## Testes

### **Testes Unitários**
```bash
npm run test:unit
```

### **Testes de Integração**
```bash
npm run test:integration
```

### **Testes E2E**
```bash
npm run test:e2e
```

### **Cobertura de Testes**
```bash
npm run test:coverage
```

### **Sistema de Testes Automatizados**
- **Jest** - Framework de testes principal
- **Test Suites** - Organização de testes por funcionalidade
- **Métricas de Teste** - Duração, sucesso e falhas
- **Retry Automático** - Reexecução de testes falhados
- **Testes Paralelos** - Execução simultânea para performance
- **Cobertura Automática** - Relatórios de cobertura de código

### **Cobertura de Testes**
- Componentes React
- API Routes
- Utilitários e serviços
- Validações e schemas
- Sistemas avançados (config, logging, cache, etc.)

## Deploy e Produção

### **Vercel (Recomendado)**
```bash
npm run build
npm run deploy
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Variáveis de Produção**
- Configurar banco PostgreSQL
- Configurar Stripe (chaves de produção)
- Configurar SMTP para emails
- Configurar domínios permitidos

## Segurança

### **Medidas Implementadas**
- Hash de senhas com bcrypt
- JWT tokens seguros
- Validação de entrada com Zod
- Rate limiting
- CORS configurado
- Headers de segurança
- Sistema de logging de segurança
- Monitoramento de tentativas de acesso
- Health checks automáticos
- Sistema de alertas para anomalias

### **Boas Práticas**
- Variáveis de ambiente para secrets
- Validação de dados em todas as APIs
- Logs de auditoria
- Sanitização de inputs
- Configuração centralizada e validada
- Logging estruturado e organizado
- Cache inteligente com estratégias configuráveis
- Monitoramento contínuo de performance
- Testes automatizados para todas as funcionalidades
- Middleware organizado e priorizado

## Documentação da API

### **Endpoints Principais**
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/registrations` - Listar inscrições
- `POST /api/registrations` - Criar inscrição
- `GET /api/qrcode/[id]` - Gerar QR Code
- `POST /api/payments/create-payment-intent` - Criar pagamento

### **Novos Endpoints v1.2**
- `GET /api/analytics` - Relatórios de analytics
- `POST /api/analytics` - Tracking de ações
- `GET /api/crm` - Relatórios de CRM
- `POST /api/crm` - Sincronização com CRM
- `GET /api/affiliates` - Relatórios de afiliados
- `POST /api/affiliates` - Gestão de afiliados
- `GET /api/i18n` - Configurações de idioma
- `POST /api/i18n` - Preferências de usuário
- `GET /api/conversions` - Tracking de conversões

### **Novos Endpoints v1.3 - Notificações**
- `POST /api/notifications/push` - Salvar subscription push
- `DELETE /api/notifications/push` - Remover subscription
- `GET /api/notifications/preferences` - Obter preferências
- `POST /api/notifications/preferences` - Atualizar preferências
- `POST /api/notifications/send` - Enviar notificações

### **Novos Endpoints v1.3 - Sistemas Avançados**
- `GET /api/config` - Obter configurações do sistema
- `GET /api/logs` - Acessar logs do sistema
- `GET /api/cache/stats` - Estatísticas do cache
- `GET /api/monitoring/stats` - Métricas de monitoramento
- `GET /api/monitoring/health` - Status de health checks
- `GET /api/monitoring/alerts` - Alertas ativos do sistema
- `POST /api/testing/run` - Executar testes automatizados

### **Autenticação**
Todas as rotas protegidas requerem token JWT no header:
```
Authorization: Bearer <token>
```

## Contribuição

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### **Padrões de Código**
- Use TypeScript
- Siga o ESLint configurado
- Escreva testes para novas funcionalidades
- Documente APIs e componentes
- Use commits semânticos

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

### **Canais de Ajuda**
- **Issues** - Reporte bugs e solicite features
- **Discussions** - Tire dúvidas e compartilhe ideias
- **Wiki** - Documentação detalhada
- **Email** - contato@eventsync.com

### **Recursos Úteis**
- [Documentação Next.js](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Documentação v1.2](./docs/VERSION_1.2.md) - Novas funcionalidades
- [Mixpanel Docs](https://developer.mixpanel.com/docs)
- [PostHog Docs](https://posthog.com/docs)
- [HubSpot API Docs](https://developers.hubspot.com/docs)
- [i18next Docs](https://www.i18next.com/overview/getting-started)
- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)
- [Zod Documentation](https://zod.dev/)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [Jest Documentation](https://jestjs.io/docs/getting-started)







---

