import { google } from 'googleapis';

// Configuração do Google Calendar API
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// Função para criar cliente OAuth2
function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// Função para gerar URL de autorização
export function generateAuthUrl() {
  const oauth2Client = createOAuth2Client();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

// Função para trocar código por tokens
export async function exchangeCodeForTokens(code) {
  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    return {
      success: true,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date
    };
  } catch (error) {
    console.error('Erro ao trocar código por tokens:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para criar evento no Google Calendar
export async function createCalendarEvent(accessToken, eventData) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: new Date(`${eventData.date}T${eventData.time}:00`).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(`${eventData.date}T${eventData.time}:00`).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: eventData.attendees || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 dia antes
          { method: 'popup', minutes: 30 }, // 30 minutos antes
        ],
      },
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });
    
    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: 'Evento criado no Google Calendar com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para atualizar evento no Google Calendar
export async function updateCalendarEvent(accessToken, eventId, eventData) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: new Date(`${eventData.date}T${eventData.time}:00`).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(`${eventData.date}T${eventData.time}:00`).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
    };
    
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
      sendUpdates: 'all',
    });
    
    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: 'Evento atualizado no Google Calendar com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao atualizar evento no Google Calendar:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para deletar evento do Google Calendar
export async function deleteCalendarEvent(accessToken, eventId) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all',
    });
    
    return {
      success: true,
      message: 'Evento deletado do Google Calendar com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao deletar evento do Google Calendar:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para sincronizar eventos do Google Calendar
export async function syncCalendarEvents(accessToken, calendarId = 'primary') {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      location: event.location,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      attendees: event.attendees || [],
      htmlLink: event.htmlLink,
      status: event.status
    }));
    
    return {
      success: true,
      events,
      message: 'Eventos sincronizados com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao sincronizar eventos do Google Calendar:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para verificar se o token ainda é válido
export async function isTokenValid(accessToken) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Tentar fazer uma requisição simples para verificar se o token é válido
    await calendar.calendarList.list({ maxResults: 1 });
    
    return true;
  } catch (error) {
    return false;
  }
}

// Função para renovar token usando refresh token
export async function refreshAccessToken(refreshToken) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    return {
      success: true,
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date
    };
    
  } catch (error) {
    console.error('Erro ao renovar access token:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
