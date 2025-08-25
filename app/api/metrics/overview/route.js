import { NextResponse } from 'next/server';

// Dados mockados para demonstração
const events = [
  { id: 1, title: 'Workshop de Desenvolvimento Web', date: '2024-02-15', capacity: 50, registered: 35, status: 'Ativo' },
  { id: 2, title: 'Palestra sobre IA', date: '2024-02-20', capacity: 100, registered: 78, status: 'Ativo' },
  { id: 3, title: 'Workshop de Marketing', date: '2024-02-25', capacity: 30, registered: 25, status: 'Ativo' },
  { id: 4, title: 'Conferência de Negócios', date: '2024-01-15', capacity: 200, registered: 180, status: 'Concluído' }
];

const registrations = [
  { id: 1, eventId: 1, status: 'confirmed', registrationDate: '2024-01-20T10:00:00Z' },
  { id: 2, eventId: 1, status: 'confirmed', registrationDate: '2024-01-21T14:30:00Z' },
  { id: 3, eventId: 2, status: 'confirmed', registrationDate: '2024-01-22T09:15:00Z' },
  { id: 4, eventId: 2, status: 'pending', registrationDate: '2024-01-23T11:00:00Z' },
  { id: 5, eventId: 3, status: 'confirmed', registrationDate: '2024-01-24T16:45:00Z' }
];

// GET - Obter métricas gerais
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, month, week
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filtrar eventos por período
    let filteredEvents = [...events];
    let filteredRegistrations = [...registrations];
    
    if (period === 'month') {
      filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      });
      
      filteredRegistrations = registrations.filter(reg => {
        const regDate = new Date(reg.registrationDate);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
      });
    } else if (period === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= oneWeekAgo;
      });
      
      filteredRegistrations = registrations.filter(reg => {
        const regDate = new Date(reg.registrationDate);
        return regDate >= oneWeekAgo;
      });
    }
    
    // Calcular métricas
    const totalEvents = filteredEvents.length;
    const activeEvents = filteredEvents.filter(event => event.status === 'Ativo').length;
    const completedEvents = filteredEvents.filter(event => event.status === 'Concluído').length;
    
    const totalRegistrations = filteredRegistrations.length;
    const confirmedRegistrations = filteredRegistrations.filter(reg => reg.status === 'confirmed').length;
    const pendingRegistrations = filteredRegistrations.filter(reg => reg.status === 'pending').length;
    
    const totalCapacity = filteredEvents.reduce((sum, event) => sum + event.capacity, 0);
    const totalRegistered = filteredEvents.reduce((sum, event) => sum + event.registered, 0);
    const averageAttendance = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;
    
    // Calcular crescimento
    const previousPeriodEvents = period === 'month' ? 2 : period === 'week' ? 1 : 0;
    const previousPeriodRegistrations = period === 'month' ? 45 : period === 'week' ? 12 : 0;
    
    const eventsGrowth = previousPeriodEvents > 0 ? 
      Math.round(((totalEvents - previousPeriodEvents) / previousPeriodEvents) * 100) : 0;
    
    const registrationsGrowth = previousPeriodRegistrations > 0 ? 
      Math.round(((totalRegistrations - previousPeriodRegistrations) / previousPeriodRegistrations) * 100) : 0;
    
    // Eventos por categoria
    const eventsByCategory = filteredEvents.reduce((acc, event) => {
      const category = event.category || 'Outros';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    // Inscrições por status
    const registrationsByStatus = filteredRegistrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1;
      return acc;
    }, {});
    
    // Tendência de inscrições (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const registrationsTrend = last7Days.map(date => {
      const count = filteredRegistrations.filter(reg => 
        reg.registrationDate.startsWith(date)
      ).length;
      return { date, count };
    });
    
    const metrics = {
      overview: {
        totalEvents,
        activeEvents,
        completedEvents,
        totalRegistrations,
        confirmedRegistrations,
        pendingRegistrations,
        totalCapacity,
        totalRegistered,
        averageAttendance
      },
      growth: {
        events: eventsGrowth,
        registrations: registrationsGrowth
      },
      breakdown: {
        eventsByCategory,
        registrationsByStatus
      },
      trend: {
        registrations: registrationsTrend
      },
      period,
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: metrics,
      message: 'Métricas obtidas com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao obter métricas:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
