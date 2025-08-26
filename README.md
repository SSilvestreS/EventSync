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

### Versão 2.0 - Futuro
- [ ] IA para recomendações
- [ ] Realidade aumentada
- [ ] Blockchain para certificados
- [ ] Marketplace de eventos

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

### PLANEJADAS (v2.0)
- [ ] IA para recomendações
- [ ] Realidade aumentada para check-in
- [ ] Blockchain para certificados
- [ ] Marketplace de eventos

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
│   │   └── webhooks/           # Webhooks (Stripe)
│   ├── auth/                   # Páginas de autenticação
│   ├── dashboard/              # Dashboard principal
│   ├── events/                 # Gestão de eventos
│   └── globals.css             # Estilos globais
├── components/                  # Componentes React
│   ├── dashboard/              # Componentes do dashboard
│   └── ui/                     # Componentes de interface
├── lib/                        # Utilitários e serviços
│   ├── googleCalendar.js       # Integração Google Calendar
│   ├── emailService.js         # Serviço de email
│   └── prisma.js              # Cliente Prisma
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

# Testes
npm run test             # Testes unitários
npm run test:e2e         # Testes E2E

# Utilitários
npm run email:test       # Testar serviço de email
npm run stripe:test      # Testar integração Stripe
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
npm run test
```

### **Testes E2E**
```bash
npm run test:e2e
```

### **Cobertura de Testes**
- Componentes React
- API Routes
- Utilitários e serviços
- Validações e schemas

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

### **Boas Práticas**
- Variáveis de ambiente para secrets
- Validação de dados em todas as APIs
- Logs de auditoria
- Sanitização de inputs

## Documentação da API

### **Endpoints Principais**
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/registrations` - Listar inscrições
- `POST /api/registrations` - Criar inscrição
- `GET /api/qrcode/[id]` - Gerar QR Code
- `POST /api/payments/create-payment-intent` - Criar pagamento

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

## Roadmap Atualizado

### Versão 1.1 (Atual) - ✅ IMPLEMENTADO
- [x] Sistema de cupons e descontos
- [x] Integração com WhatsApp Business
- [x] App móvel React Native
- [x] Sistema de certificados

### Versão 1.2 (Atual) - ✅ IMPLEMENTADO
- [x] Analytics avançados
- [x] Integração com CRM
- [x] Sistema de afiliados
- [x] Múltiplos idiomas

### Versão 2.0 (Futura)
- [ ] IA para recomendações
- [ ] Realidade aumentada para check-in
- [ ] Blockchain para certificados
- [ ] Marketplace de eventos

## Novas Funcionalidades v1.2 - IMPLEMENTADAS

### Analytics Avançados
- [x] **Tracking completo de usuários** com ações, sessões e metadados
- [x] **Integração com Mixpanel, PostHog e Amplitude** para análise externa
- [x] **Relatórios detalhados** por evento, usuário e período
- [x] **Métricas de conversão** e performance
- [x] **Tracking de UTM** e campanhas de marketing
- [x] **Analytics em tempo real** com atualizações automáticas
- [x] **Exportação de dados** para análise externa
- [x] **Limpeza automática** de dados antigos

### Integração com CRM
- [x] **Sincronização automática** com HubSpot, Salesforce e Pipedrive
- [x] **Criação automática de leads** para eventos
- [x] **Score de qualificação** baseado em atividades do usuário
- [x] **Pipeline de vendas** completo com status e prioridades
- [x] **Atividades e follow-ups** automatizados
- [x] **Webhooks para Zapier** e integrações customizadas
- [x] **Relatórios de CRM** com métricas de conversão
- [x] **Sincronização em massa** de contatos

### Sistema de Afiliados
- [x] **Programa completo de afiliados** com comissões personalizáveis
- [x] **Códigos únicos** para cada afiliado
- [x] **Comissões por evento** com valores específicos
- [x] **Sistema de referências** com validação automática
- [x] **Aprovação e pagamento** de comissões
- [x] **Dashboard de afiliados** com métricas de performance
- [x] **Relatórios financeiros** com histórico de pagamentos
- [x] **Sistema de status** (Ativo, Inativo, Suspenso, Pendente)

### Múltiplos Idiomas (i18n)
- [x] **Suporte a 10 idiomas** incluindo português, inglês, espanhol, francês, alemão, italiano, japonês, coreano, chinês e árabe
- [x] **Detecção automática** de idioma do navegador
- [x] **Preferências por usuário** com configurações salvas
- [x] **Formatação localizada** de datas, horas, moedas e números
- [x] **Suporte a RTL** para idiomas árabe e hebraico
- [x] **Traduções dinâmicas** com namespaces organizados
- [x] **Estatísticas de uso** de idiomas
- [x] **Sincronização** com banco de dados

### Sistema de Tracking de Conversões
- [x] **Tracking completo** de campanhas e fontes de tráfego
- [x] **Parâmetros UTM** para análise de marketing
- [x] **Conversões por evento** com valores monetários
- [x] **Análise de funil** de conversão
- [x] **Integração com analytics** para relatórios unificados

## Estatísticas e Progresso

### Progresso de Implementação
- **Versão 1.1**: [x] 100% COMPLETA
- **Versão 1.2**: [x] 100% IMPLEMENTADA
- **Versão 2.0**: [ ] 0% (Futuro)

### Métricas do Projeto
- **Stars**: 0
- **Forks**: 0
- **Issues**: 0
- **Pull Requests**: 0
- **Downloads**: 0

### Próximos Marcos
- **Q1 2024**: ✅ Versão 1.2 implementada
- **Q2 2024**: Testes e otimizações da v1.2
- **Q3 2024**: Planejamento da v2.0
- **Q4 2024**: Início do desenvolvimento da v2.0

---

