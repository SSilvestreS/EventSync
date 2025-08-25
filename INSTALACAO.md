# EventSync - Guia de Instalação e Execução

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior
- **npm** ou **yarn** como gerenciador de pacotes
- **Git** para controle de versão
- Conta na **Vercel** (opcional, para deploy)

## Passo a Passo da Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/eventsync.git
cd eventsync
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Configurações do Google Calendar API (opcional)
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
NEXTAUTH_SECRET=seu_nextauth_secret_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 4. Execute o Projeto

#### Desenvolvimento Local

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3000`

#### Build de Produção

```bash
npm run build
npm start
```

## Configuração do Google Calendar (Opcional)

Para usar a integração com Google Calendar:

### 1. Crie um Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google Calendar

### 2. Configure as Credenciais OAuth2

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure o tipo de aplicação como "Web application"
4. Adicione as URLs de redirecionamento:
   - `http://localhost:3000/api/auth/callback` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback` (produção)

### 3. Copie as Credenciais

Copie o Client ID e Client Secret para o arquivo `.env.local`.

## Estrutura do Projeto

```
EventSync/
├── app/                    # Aplicação Next.js (App Router)
│   ├── api/               # Endpoints da API
│   ├── dashboard/         # Página do dashboard
│   ├── events/            # Páginas de eventos
│   ├── globals.css        # Estilos globais
│   ├── layout.js          # Layout principal
│   └── page.js            # Página inicial
├── components/            # Componentes React
│   ├── dashboard/         # Componentes do dashboard
│   ├── Header.js          # Cabeçalho da aplicação
│   ├── Hero.js            # Seção principal
│   ├── EventList.js       # Lista de eventos
│   ├── Features.js        # Funcionalidades
│   └── Footer.js          # Rodapé
├── lib/                   # Utilitários e configurações
│   └── googleCalendar.js  # Integração Google Calendar
├── docs/                  # Documentação
├── public/                # Arquivos estáticos
├── package.json           # Dependências e scripts
├── tailwind.config.js     # Configuração Tailwind CSS
├── next.config.js         # Configuração Next.js
└── v0.config.js           # Configuração V0
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e Produção
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção

# V0 (Vercel)
npm run v0:dev       # Inicia V0 em modo desenvolvimento
npm run v0:build     # Build para V0
npm run v0:deploy    # Deploy na Vercel
```

## Funcionalidades Implementadas

### Completamente Funcionais

- **Página Inicial**: Landing page responsiva com apresentação do sistema
- **Dashboard**: Painel administrativo com métricas e visão geral
- **Gestão de Eventos**: Listagem, criação e edição de eventos
- **Sistema de Inscrições**: Gerenciamento de participantes
- **QR Codes**: Geração automática para check-in
- **Métricas**: Dashboard com estatísticas em tempo real
- **API REST**: Endpoints para todas as funcionalidades
- **Design Responsivo**: Interface otimizada para todos os dispositivos

### 🔄 Em Desenvolvimento

- **Autenticação**: Sistema de login e registro
- **Check-in**: Aplicativo para escanear QR codes
- **Notificações**: Sistema de emails e lembretes
- **Relatórios**: Exportação de dados em diferentes formatos

### 📋 Planejadas para Próximas Versões

- **Integração Google Calendar**: Sincronização automática
- **App Mobile**: Aplicativo nativo para iOS e Android
- **Pagamentos**: Integração com gateways de pagamento
- **Multi-idiomas**: Suporte a diferentes idiomas

## Testando a Aplicação

### 1. Acesse a Página Inicial

- Abra `http://localhost:3000`
- Verifique se a landing page carrega corretamente
- Teste a responsividade em diferentes tamanhos de tela

### 2. Teste o Dashboard

- Acesse `http://localhost:3000/dashboard`
- Verifique se as métricas são exibidas
- Teste a navegação entre as abas

### 3. Teste a Criação de Eventos

- Acesse `http://localhost:3000/events/create`
- Preencha o formulário com dados de teste
- Verifique se a prévia funciona corretamente

### 4. Teste as APIs

```bash
# Listar eventos
curl http://localhost:3000/api/events

# Criar evento
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Teste","description":"Descrição","date":"2024-03-15","time":"14:00","location":"Local","capacity":50}'

# Gerar QR code
curl http://localhost:3000/api/qrcode/1
```

## Deploy na Vercel

### 1. Conecte o Repositório

1. Acesse [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente

### 2. Configure as Variáveis de Ambiente

Na Vercel, adicione as mesmas variáveis do `.env.local`:

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=https://seu-dominio.vercel.app/api/auth/callback
JWT_SECRET=seu_jwt_secret
NEXTAUTH_SECRET=seu_nextauth_secret
NEXTAUTH_URL=https://seu-dominio.vercel.app
```

### 3. Deploy Automático

A Vercel fará deploy automático sempre que você fizer push para a branch principal.

## Solução de Problemas

### Erro de Dependências

```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro de Porta em Uso

```bash
# Encontre o processo usando a porta 3000
lsof -i :3000

# Mate o processo
kill -9 <PID>
```

### Erro de Build

```bash
# Verifique se todas as dependências estão instaladas
npm install

# Limpe o cache do Next.js
rm -rf .next
npm run build
```

### Problemas com Tailwind CSS

```bash
# Regenere os estilos
npx tailwindcss -i ./app/globals.css -o ./public/styles.css --watch
```

## Contribuindo

### 1. Fork o Projeto

1. Faça fork do repositório
2. Clone seu fork localmente
3. Crie uma branch para sua feature

### 2. Desenvolvimento

```bash
git checkout -b feature/nova-funcionalidade
# Faça suas alterações
git add .
git commit -m "Adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 3. Pull Request

1. Abra um Pull Request no GitHub
2. Descreva as mudanças realizadas
3. Aguarde a revisão e aprovação

## Suporte

### Recursos de Ajuda

- **Documentação**: `/docs` - Documentação completa da API
- **Issues**: GitHub Issues para reportar bugs
- **Discussions**: GitHub Discussions para dúvidas
- **Wiki**: Documentação adicional e tutoriais

### Contato

- **Email**: suporte@eventsync.com
- **Telefone**: +55 (11) 99999-9999
- **Horário**: Segunda a Sexta, 9h às 18h (GMT-3)

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## Agradecimentos

- **Next.js** - Framework React para produção
- **Tailwind CSS** - Framework CSS utilitário
- **Vercel** - Plataforma de deploy e hosting
- **Lucide React** - Ícones bonitos e consistentes
- **Google APIs** - Integração com Google Calendar

---

**EventSync** - Simplificando a organização de eventos desde 2024.
