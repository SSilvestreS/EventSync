# EventSync - Sistema de Gerenciamento de Eventos

## **Sobre o Projeto**

O EventSync é uma plataforma completa para criação, gestão e análise de eventos. Desenvolvido com Next.js 14, React 18 e TypeScript, oferece uma solução robusta e escalável para organizadores de eventos.

## **Status de Implementação**

### **Versão 1.1 - Funcionalidades Básicas** ✅ **100% IMPLEMENTADO**
- ✅ Sistema de autenticação e autorização
- ✅ Gerenciamento de usuários e perfis
- ✅ Criação e edição de eventos
- ✅ Sistema de inscrições
- ✅ Check-in com QR Code
- ✅ Processamento de pagamentos (Stripe)
- ✅ Sistema de cupons e descontos
- ✅ Relatórios básicos
- ✅ Notificações por email
- ✅ Integração com Google Calendar

### **Versão 1.2 - Sistemas Avançados** ✅ **100% IMPLEMENTADO**
- ✅ Analytics avançados (Mixpanel, PostHog, Amplitude)
- ✅ Integração CRM (HubSpot, Salesforce, Pipedrive, Zapier)
- ✅ Sistema de afiliados com comissões
- ✅ Suporte multi-idioma (10 idiomas)
- ✅ Sistema de notificações push (Web Push API)
- ✅ PWA (Progressive Web App)
- ✅ Service Worker para funcionalidades offline

### **Versão 1.3 - Refatoração e Responsividade** ✅ **100% IMPLEMENTADO**
- ✅ **Refatoração completa** da estrutura do código
- ✅ **Sistema de configuração** centralizado com Zod
- ✅ **Sistema de logging** profissional com Winston
- ✅ **Middleware avançado** para API routes
- ✅ **Sistema de validação** robusto com Zod
- ✅ **Sistema de cache** inteligente
- ✅ **Sistema de monitoramento** e métricas
- ✅ **Sistema de testes** automatizados com Jest
- ✅ **Componentes UI** reutilizáveis e padronizados
- ✅ **Hooks customizados** para API e cache
- ✅ **Utilitários centralizados** para validação, formatação e manipulação de dados
- ✅ **Responsividade total** para todas as dimensões de tela
- ✅ **Design mobile-first** com breakpoints progressivos
- ✅ **Layout adaptativo** que se reorganiza automaticamente
- ✅ **Menu mobile** funcional para todas as páginas

## **Funcionalidades Principais**

### **Core Features**
- **Gerenciamento de Eventos**: Criação, edição e organização completa
- **Sistema de Inscrições**: Gestão automática de participantes
- **Check-in com QR Code**: Processo rápido e seguro
- **Pagamentos Online**: Integração com Stripe e outros gateways
- **Analytics Avançados**: Métricas detalhadas e relatórios
- **Integração CRM**: HubSpot, Salesforce, Pipedrive, Zapier
- **Sistema de Afiliados**: Programa com comissões automáticas
- **Multi-idioma**: Suporte para 10 idiomas diferentes
- **Notificações Push**: Web Push API com Service Worker
- **PWA**: Progressive Web App com funcionalidades offline

### **Sistemas Avançados**
- **Configuração Centralizada**: Sistema robusto com validação Zod
- **Logging Profissional**: Winston com rotação de arquivos
- **Middleware Avançado**: Sistema flexível para API routes
- **Validação Robusta**: Schemas Zod para todos os dados
- **Cache Inteligente**: Estratégias de cache otimizadas
- **Monitoramento**: Métricas de performance e saúde da aplicação
- **Testes Automatizados**: Jest com cobertura completa
- **Componentes UI**: Biblioteca de componentes reutilizáveis
- **Hooks Customizados**: Gerenciamento de estado e API
- **Utilitários**: Funções centralizadas para operações comuns

### **Responsividade e UX**
- **Mobile-First Design**: Começa com design para telas pequenas
- **Layout Adaptativo**: Se reorganiza automaticamente
- **Menu Mobile**: Navegação otimizada para dispositivos móveis
- **Breakpoints Progressivos**: sm (640px+), md (768px+), lg (1024px+), xl (1280px+)
- **Design Consistente**: Interface moderna em todas as resoluções
- **Performance Otimizada**: Carregamento rápido em qualquer dispositivo

## **Tecnologias Utilizadas**

### **Frontend**
- **Next.js 14**: Framework React com App Router
- **React 18**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utility-first
- **Lucide React**: Biblioteca de ícones

### **Backend**
- **Node.js**: Runtime JavaScript
- **Prisma**: ORM para banco de dados
- **PostgreSQL**: Banco de dados principal
- **Redis**: Cache e sessões
- **NextAuth.js**: Autenticação e autorização

### **Sistemas Avançados**
- **Zod**: Validação de schemas
- **Winston**: Sistema de logging
- **Jest**: Framework de testes
- **Web Push API**: Notificações push
- **Service Worker**: Funcionalidades offline

### **Integrações**
- **Stripe**: Processamento de pagamentos
- **Google APIs**: Calendar e autenticação
- **Mixpanel/PostHog/Amplitude**: Analytics
- **HubSpot/Salesforce/Pipedrive**: CRM
- **Zapier**: Automações

### **DevOps e Infraestrutura**
- **Docker**: Containerização
- **Docker Compose**: Orquestração de serviços
- **Git**: Controle de versão
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

## **Estrutura do Projeto**

```
EventSync/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes base (Button, Modal, Table, Card)
│   │   └── forms/              # Componentes de formulário
│   ├── hooks/                   # Hooks customizados (useApi, useApiWithCache)
│   ├── lib/                     # Bibliotecas e serviços
│   │   ├── config/             # Configuração centralizada
│   │   ├── logger/             # Sistema de logging
│   │   ├── middleware/         # Middleware avançado
│   │   ├── validation/         # Validação com Zod
│   │   ├── cache/              # Sistema de cache
│   │   ├── monitoring/         # Monitoramento e métricas
│   │   └── testing/            # Sistema de testes
│   ├── types/                   # Tipos TypeScript
│   ├── utils/                   # Utilitários centralizados
│   └── constants/               # Constantes da aplicação
├── prisma/                      # Schema e migrações do banco
├── public/                      # Arquivos estáticos
├── components/                  # Componentes globais
├── lib/                         # Serviços e utilitários
├── Dockerfile                   # Container de produção
├── Dockerfile.dev               # Container de desenvolvimento
├── docker-compose.yml           # Orquestração de produção
├── docker-compose.dev.yml       # Orquestração de desenvolvimento
└── README.md                    # Documentação do projeto
```

## **Scripts Disponíveis**

### **Desenvolvimento**
```bash
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Construir aplicação para produção
npm run start            # Iniciar servidor de produção
npm run lint             # Executar linting
```

### **Banco de Dados**
```bash
npm run db:generate      # Gerar cliente Prisma
npm run db:push          # Sincronizar schema com banco
npm run db:migrate       # Executar migrações
npm run db:studio        # Abrir Prisma Studio
npm run db:seed          # Popular banco com dados de teste
npm run db:reset         # Resetar banco de dados
```

### **Sistemas Avançados**
```bash
npm run i18n:extract     # Extrair strings para tradução
npm run i18n:sync        # Sincronizar traduções
npm run analytics:export # Exportar dados de analytics
npm run crm:sync         # Sincronizar com sistemas CRM
npm run cache:stats      # Estatísticas do sistema de cache
npm run logs:analyze     # Análise de logs
```

### **Docker**
```bash
npm run docker:dev       # Iniciar ambiente de desenvolvimento
npm run docker:dev:down  # Parar ambiente de desenvolvimento
npm run docker:prod      # Iniciar ambiente de produção
npm run docker:prod:down # Parar ambiente de produção
npm run docker:clean     # Limpar containers e volumes
```

### **Testes**
```bash
npm run test             # Executar testes unitários
npm run test:e2e         # Executar testes end-to-end
```

## **Banco de Dados**

### **Modelos Principais**
- **User**: Usuários com perfis e permissões
- **Event**: Eventos com detalhes e configurações
- **Registration**: Inscrições de participantes
- **Coupon**: Sistema de cupons e descontos
- **Payment**: Transações e pagamentos
- **Notification**: Sistema de notificações

### **Modelos Avançados (v1.2+)**
- **UserAnalytics**: Dados de comportamento do usuário
- **EventAnalytics**: Métricas de eventos
- **CRMContact**: Contatos em sistemas CRM
- **CRMLead**: Leads e oportunidades
- **Affiliate**: Sistema de afiliados
- **UserPreferences**: Preferências de usuário
- **ConversionTracking**: Rastreamento de conversões

### **Modelos de Notificação (v1.3)**
- **PushSubscription**: Assinaturas de notificação push
- **NotificationLog**: Histórico de notificações
- **NotificationPreference**: Preferências de notificação

## **Níveis de Acesso**

- **ADMIN**: Acesso total ao sistema
- **ORGANIZER**: Gerenciamento de eventos próprios
- **PARTICIPANT**: Visualização e inscrição em eventos
- **AFFILIATE**: Sistema de afiliados com comissões

## **Responsividade e Design**

### **Breakpoints Implementados**
- **Mobile First**: Design começa para telas pequenas
- **sm (640px+)**: Tablets pequenos e celulares grandes
- **md (768px+)**: Tablets e dispositivos médios
- **lg (1024px+)**: Desktops e laptops
- **xl (1280px+)**: Telas grandes e monitores

### **Recursos Responsivos**
- **Menu hambúrguer** funcional para mobile
- **Grid adaptativo** que se reorganiza automaticamente
- **Tipografia escalável** para todas as telas
- **Espaçamentos flexíveis** que se ajustam
- **Ícones responsivos** com tamanhos apropriados
- **Navegação mobile** otimizada
- **Formulários adaptativos** para touch

## **URLs de Acesso**

### **Desenvolvimento Local**
- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Prisma Studio**: http://localhost:5555

### **Credenciais de Teste**
- **Admin**: admin@eventsync.com / admin123
- **Organizador**: organizador@eventsync.com / organizador123
- **Participante**: participante@eventsync.com / participante123

## **Documentação da API**

### **Endpoints Principais**
- `POST /api/auth/login` - Autenticação de usuário
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/events/[id]` - Detalhes do evento
- `POST /api/events/[id]/register` - Inscrição em evento
- `POST /api/events/[id]/checkin` - Check-in com QR Code

### **Endpoints Avançados (v1.2+)**
- `GET /api/analytics` - Relatórios de analytics
- `POST /api/crm/contacts` - Sincronização CRM
- `GET /api/affiliates` - Sistema de afiliados
- `GET /api/i18n/languages` - Idiomas disponíveis
- `POST /api/conversions/track` - Rastreamento de conversões

### **Endpoints de Notificação (v1.3)**
- `POST /api/notifications/push/subscribe` - Assinar notificações push
- `GET /api/notifications/preferences` - Preferências de notificação
- `POST /api/notifications/send` - Enviar notificações

### **Endpoints de Sistema (v1.3)**
- `GET /api/config` - Configurações da aplicação
- `GET /api/logs` - Logs do sistema
- `GET /api/cache/stats` - Estatísticas de cache
- `GET /api/monitoring/health` - Saúde da aplicação
- `POST /api/testing/run` - Executar testes

## **Docker e Deploy**

### **Ambiente de Desenvolvimento**
```bash
# Iniciar ambiente completo
npm run docker:dev

# Ver logs
docker-compose -f docker-compose.dev.yml logs app

# Parar ambiente
npm run docker:dev:down
```

### **Ambiente de Produção**
```bash
# Iniciar produção
npm run docker:prod

# Parar produção
npm run docker:prod:down
```

### **Serviços Docker**
- **EventSync App**: Next.js na porta 3000
- **PostgreSQL**: Banco de dados na porta 5432
- **Redis**: Cache na porta 6379
- **Prisma Studio**: Gerenciamento DB na porta 5555

## **Testes e Qualidade**

### **Framework de Testes**
- **Jest**: Testes unitários e de integração
- **React Testing Library**: Testes de componentes
- **Playwright**: Testes end-to-end

### **Cobertura de Testes**
- ✅ **Testes unitários** para utilitários
- ✅ **Testes de componentes** para UI
- ✅ **Testes de API** para endpoints
- ✅ **Testes de integração** para fluxos completos

## **Monitoramento e Performance**

### **Métricas Coletadas**
- **Performance**: Tempo de resposta e throughput
- **Erros**: Taxa de erro e stack traces
- **Negócio**: Conversões e engajamento
- **Sistema**: Uso de recursos e saúde

### **Alertas e Notificações**
- **Críticos**: Falhas de sistema
- **Importantes**: Degradação de performance
- **Informativos**: Métricas de negócio

## **Roadmap e Próximas Versões**

### **Versão 1.4 - Automação e IA**
- **Chatbot inteligente** para suporte ao usuário
- **Análise preditiva** de eventos
- **Recomendações personalizadas** para usuários
- **Automação de workflows** com Zapier

### **Versão 1.5 - Colaboração e Comunidade**
- **Sistema de equipes** para organizadores
- **Chat em tempo real** entre participantes
- **Marketplace de eventos** e parcerias
- **App mobile nativo** (iOS/Android)

### **Versão 2.0 - Enterprise e Escalabilidade**
- **Multi-tenancy** para organizações
- **SSO e integração** com sistemas corporativos
- **Business Intelligence** avançado
- **Microserviços** e arquitetura distribuída

## **Contribuição**

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- **TypeScript**: Tipagem estática obrigatória
- **ESLint**: Linting automático
- **Prettier**: Formatação consistente
- **Conventional Commits**: Padrão de commits
- **Testes**: Cobertura mínima de 80%

## **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## **Suporte**

### **Canais de Suporte**
- **Email**: suporte@eventsync.com
- **Discord**: [EventSync Community](https://discord.gg/eventsync)
- **Documentação**: [docs.eventsync.com](https://docs.eventsync.com)
- **Issues**: [GitHub Issues](https://github.com/eventsync/eventsync/issues)

### **Recursos Úteis**
- **Quick Start**: [Guia de Início Rápido](https://docs.eventsync.com/quickstart)
- **Vídeos**: [Tutoriais em Vídeo](https://youtube.com/eventsync)
- **Blog**: [EventSync Blog](https://blog.eventsync.com)
- **FAQ**: [Perguntas Frequentes](https://docs.eventsync.com/faq)

---

## **EventSync - Transformando a Gestão de Eventos**

**Uma plataforma completa, moderna e responsiva para criar, gerenciar e analisar eventos de sucesso.**

**Status: PROJETO COMPLETAMENTE FINALIZADO - Versão 1.3 com Responsividade Total!**







---

