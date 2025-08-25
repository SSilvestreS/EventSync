# EventSync API - Documentação

## Visão Geral

A API do EventSync fornece endpoints para gerenciar eventos, inscrições, QR codes e métricas. Todos os endpoints retornam respostas em formato JSON e seguem padrões REST.

## Base URL

```
https://seu-dominio.com/api
```

## Autenticação

A API utiliza autenticação baseada em JWT. Inclua o token no header de todas as requisições:

```
Authorization: Bearer <seu_token_jwt>
```

## Endpoints

### Eventos

#### Listar Eventos
```
GET /events
```

**Parâmetros de Query:**
- `category` (opcional): Filtrar por categoria
- `status` (opcional): Filtrar por status
- `search` (opcional): Buscar por título ou descrição

**Exemplo de Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Workshop de Desenvolvimento Web",
      "description": "Aprenda as melhores práticas...",
      "date": "2024-02-15",
      "time": "14:00",
      "location": "Centro de Inovação",
      "capacity": 50,
      "registered": 35,
      "category": "Tecnologia",
      "status": "Ativo",
      "price": "R$ 150,00"
    }
  ],
  "total": 1,
  "message": "Eventos listados com sucesso"
}
```

#### Criar Evento
```
POST /events
```

**Corpo da Requisição:**
```json
{
  "title": "Título do Evento",
  "description": "Descrição detalhada",
  "category": "Tecnologia",
  "date": "2024-03-15",
  "time": "14:00",
  "location": "Local do Evento",
  "capacity": 50,
  "price": "R$ 100,00",
  "isFree": false
}
```

#### Obter Evento Específico
```
GET /events/{id}
```

#### Atualizar Evento
```
PUT /events/{id}
```

#### Deletar Evento
```
DELETE /events/{id}
```

### Inscrições

#### Listar Inscrições
```
GET /registrations
```

**Parâmetros de Query:**
- `eventId` (opcional): Filtrar por evento específico
- `status` (opcional): Filtrar por status
- `search` (opcional): Buscar por nome ou email

#### Criar Inscrição
```
POST /registrations
```

**Corpo da Requisição:**
```json
{
  "eventId": 1,
  "name": "Nome do Participante",
  "email": "email@exemplo.com",
  "phone": "(11) 99999-9999",
  "notes": "Observações adicionais"
}
```

#### Atualizar Status da Inscrição
```
PUT /registrations/{id}/status
```

**Corpo da Requisição:**
```json
{
  "status": "confirmed"
}
```

### QR Codes

#### Gerar QR Code
```
GET /qrcode/{registrationId}
```

Retorna um SVG do QR code para a inscrição específica.

**Headers de Resposta:**
- `Content-Type: image/svg+xml`
- `Cache-Control: public, max-age=3600`

#### Atualizar QR Code
```
POST /qrcode/{registrationId}
```

### Métricas

#### Visão Geral das Métricas
```
GET /metrics/overview
```

**Parâmetros de Query:**
- `period` (opcional): `all`, `month`, `week`

**Exemplo de Resposta:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalEvents": 12,
      "activeEvents": 8,
      "totalRegistrations": 847,
      "averageAttendance": 78.5
    },
    "growth": {
      "events": 25,
      "registrations": 15
    },
    "breakdown": {
      "eventsByCategory": {
        "Tecnologia": 5,
        "Marketing": 3
      }
    }
  }
}
```

#### Métricas de Evento Específico
```
GET /metrics/events/{eventId}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (ex: email já inscrito)
- `500` - Erro interno do servidor

## Tratamento de Erros

Todos os endpoints retornam erros no seguinte formato:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Código do erro (opcional)"
}
```

## Rate Limiting

A API implementa rate limiting para proteger contra abuso:
- Máximo de 100 requisições por minuto por IP
- Máximo de 1000 requisições por hora por usuário autenticado

## Paginação

Para endpoints que retornam listas, a paginação é implementada usando parâmetros de query:

```
GET /events?page=1&limit=20
```

**Parâmetros:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20, máximo: 100)

## Filtros e Ordenação

### Filtros Disponíveis

- **Eventos**: `category`, `status`, `date`, `location`
- **Inscrições**: `eventId`, `status`, `registrationDate`
- **Métricas**: `period`, `dateRange`

### Ordenação

- **Eventos**: `date`, `title`, `createdAt`
- **Inscrições**: `registrationDate`, `name`, `status`

**Exemplo:**
```
GET /events?sortBy=date&sortOrder=desc
```

## Webhooks

A API suporta webhooks para notificações em tempo real:

### Configurar Webhook
```
POST /webhooks
```

**Corpo da Requisição:**
```json
{
  "url": "https://seu-site.com/webhook",
  "events": ["event.created", "registration.confirmed"],
  "secret": "seu_secret_aqui"
}
```

### Eventos Disponíveis

- `event.created` - Novo evento criado
- `event.updated` - Evento atualizado
- `event.deleted` - Evento deletado
- `registration.created` - Nova inscrição
- `registration.confirmed` - Inscrição confirmada
- `registration.cancelled` - Inscrição cancelada

## Exemplos de Uso

### JavaScript/Node.js

```javascript
const API_BASE = 'https://seu-dominio.com/api';

// Listar eventos
async function listEvents() {
  const response = await fetch(`${API_BASE}/events`);
  const data = await response.json();
  return data.data;
}

// Criar evento
async function createEvent(eventData) {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  });
  return await response.json();
}

// Gerar QR code
async function generateQRCode(registrationId) {
  const response = await fetch(`${API_BASE}/qrcode/${registrationId}`);
  return await response.text(); // Retorna SVG
}
```

### Python

```python
import requests

API_BASE = 'https://seu-dominio.com/api'
headers = {'Authorization': f'Bearer {token}'}

# Listar eventos
def list_events():
    response = requests.get(f'{API_BASE}/events', headers=headers)
    return response.json()['data']

# Criar evento
def create_event(event_data):
    response = requests.post(
        f'{API_BASE}/events',
        json=event_data,
        headers=headers
    )
    return response.json()
```

### cURL

```bash
# Listar eventos
curl -X GET "https://seu-dominio.com/api/events" \
  -H "Authorization: Bearer seu_token_aqui"

# Criar evento
curl -X POST "https://seu-dominio.com/api/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_aqui" \
  -d '{
    "title": "Meu Evento",
    "description": "Descrição do evento",
    "date": "2024-03-15",
    "time": "14:00",
    "location": "Local do Evento",
    "capacity": 50
  }'
```

## Suporte

Para suporte técnico ou dúvidas sobre a API:

- **Email**: api@eventsync.com
- **Documentação**: https://docs.eventsync.com
- **Status da API**: https://status.eventsync.com
- **Comunidade**: https://community.eventsync.com

## Changelog

### v1.0.0 (2024-01-15)
- Lançamento inicial da API
- Endpoints básicos para eventos e inscrições
- Sistema de QR codes
- Métricas básicas

### v1.1.0 (Em desenvolvimento)
- Webhooks em tempo real
- Filtros avançados
- Paginação melhorada
- Rate limiting aprimorado
