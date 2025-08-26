import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  // Configurar notificações
  configure() {
    PushNotification.configure({
      // Configurações básicas
      onRegister: function (token) {
        console.log('TOKEN:', token);
        this.saveDeviceToken(token);
      }.bind(this),

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        this.handleNotification(notification);
      }.bind(this),

      // Permissões
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Configurações específicas do Android
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  // Criar canais de notificação (Android)
  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'eventsync-general',
        channelName: 'EventSync Geral',
        channelDescription: 'Notificações gerais do EventSync',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Canal criado: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'eventsync-events',
        channelName: 'Eventos',
        channelDescription: 'Notificações relacionadas a eventos',
        playSound: true,
        soundName: 'default',
        importance: 5,
        vibrate: true,
      },
      (created) => console.log(`Canal de eventos criado: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'eventsync-checkin',
        channelName: 'Check-in',
        channelDescription: 'Notificações de check-in',
        playSound: true,
        soundName: 'default',
        importance: 5,
        vibrate: true,
      },
      (created) => console.log(`Canal de check-in criado: ${created}`)
    );
  }

  // Salvar token do dispositivo
  async saveDeviceToken(token) {
    try {
      await AsyncStorage.setItem('deviceToken', token);
      // Enviar token para o servidor
      this.sendTokenToServer(token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  // Enviar token para o servidor
  async sendTokenToServer(token) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${process.env.API_URL}/api/notifications/register-device`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            userId,
            deviceToken: token,
            platform: DeviceInfo.getSystemName(),
            appVersion: DeviceInfo.getVersion(),
          }),
        });

        if (response.ok) {
          console.log('Token enviado para o servidor com sucesso');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar token para o servidor:', error);
    }
  }

  // Agendar notificação
  scheduleNotification(notification) {
    const {
      id,
      title,
      message,
      date,
      channelId = 'eventsync-general',
      data = {},
      repeatType = 'none',
    } = notification;

    PushNotification.localNotificationSchedule({
      id: id.toString(),
      channelId,
      title,
      message,
      date: new Date(date),
      repeatType,
      data,
      allowWhileIdle: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message,
      subText: 'EventSync',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
    });
  }

  // Enviar notificação imediata
  sendImmediateNotification(notification) {
    const {
      id,
      title,
      message,
      channelId = 'eventsync-general',
      data = {},
    } = notification;

    PushNotification.localNotification({
      id: id.toString(),
      channelId,
      title,
      message,
      data,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message,
      subText: 'EventSync',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
    });
  }

  // Notificação de evento próximo
  scheduleEventReminder(event) {
    const reminderDate = new Date(event.date);
    reminderDate.setHours(reminderDate.getHours() - 24); // 24h antes

    this.scheduleNotification({
      id: `event-reminder-${event.id}`,
      title: 'Lembrete de Evento',
      message: `O evento "${event.title}" acontece amanhã! Não se esqueça de levar seu QR Code.`,
      date: reminderDate,
      channelId: 'eventsync-events',
      data: {
        type: 'event_reminder',
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  }

  // Notificação de check-in
  sendCheckInNotification(checkInData) {
    this.sendImmediateNotification({
      id: `checkin-${Date.now()}`,
      title: 'Check-in Realizado!',
      message: `Bem-vindo(a) ao evento "${checkInData.event.title}"!`,
      channelId: 'eventsync-checkin',
      data: {
        type: 'check_in',
        eventId: checkInData.event.id,
        eventTitle: checkInData.event.title,
        checkInTime: checkInData.checkInTime,
      },
    });
  }

  // Notificação de certificado disponível
  sendCertificateNotification(certificate) {
    this.sendImmediateNotification({
      id: `certificate-${certificate.id}`,
      title: 'Certificado Disponível!',
      message: `Seu certificado para "${certificate.registration.event.title}" está pronto para download.`,
      channelId: 'eventsync-events',
      data: {
        type: 'certificate_ready',
        certificateId: certificate.id,
        eventTitle: certificate.registration.event.title,
        downloadUrl: certificate.downloadUrl,
      },
    });
  }

  // Notificação de pagamento
  sendPaymentNotification(payment) {
    const status = payment.status === 'success' ? 'Aprovado' : 'Falhou';
    const message = payment.status === 'success' 
      ? `Pagamento aprovado para "${payment.registration.event.title}"`
      : `Falha no pagamento para "${payment.registration.event.title}". Tente novamente.`;

    this.sendImmediateNotification({
      id: `payment-${payment.id}`,
      title: `Pagamento ${status}`,
      message,
      channelId: 'eventsync-events',
      data: {
        type: 'payment_status',
        paymentId: payment.id,
        status: payment.status,
        eventTitle: payment.registration.event.title,
      },
    });
  }

  // Notificação de cupom disponível
  sendCouponNotification(coupon) {
    this.sendImmediateNotification({
      id: `coupon-${coupon.id}`,
      title: 'Cupom Disponível!',
      message: `Novo cupom disponível: ${coupon.code} - ${coupon.description}`,
      channelId: 'eventsync-events',
      data: {
        type: 'coupon_available',
        couponId: coupon.id,
        couponCode: coupon.code,
        description: coupon.description,
      },
    });
  }

  // Cancelar notificação específica
  cancelNotification(id) {
    PushNotification.cancelLocalNotification({ id: id.toString() });
  }

  // Cancelar todas as notificações
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Limpar badge (iOS)
  clearBadge() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }

  // Obter notificações agendadas
  getScheduledNotifications() {
    return new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  // Verificar permissões
  checkPermissions() {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Solicitar permissões
  requestPermissions() {
    return new Promise((resolve) => {
      PushNotification.requestPermissions(['alert', 'badge', 'sound']).then((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Tratar notificação recebida
  handleNotification(notification) {
    const { data } = notification;

    if (data) {
      switch (data.type) {
        case 'event_reminder':
          this.handleEventReminder(data);
          break;
        case 'check_in':
          this.handleCheckInNotification(data);
          break;
        case 'certificate_ready':
          this.handleCertificateNotification(data);
          break;
        case 'payment_status':
          this.handlePaymentNotification(data);
          break;
        case 'coupon_available':
          this.handleCouponNotification(data);
          break;
        default:
          console.log('Tipo de notificação não reconhecido:', data.type);
      }
    }
  }

  // Tratar lembrete de evento
  handleEventReminder(data) {
    // Implementar lógica específica para lembretes de evento
    console.log('Lembrete de evento:', data);
  }

  // Tratar notificação de check-in
  handleCheckInNotification(data) {
    // Implementar lógica específica para notificações de check-in
    console.log('Notificação de check-in:', data);
  }

  // Tratar notificação de certificado
  handleCertificateNotification(data) {
    // Implementar lógica específica para notificações de certificado
    console.log('Notificação de certificado:', data);
  }

  // Tratar notificação de pagamento
  handlePaymentNotification(data) {
    // Implementar lógica específica para notificações de pagamento
    console.log('Notificação de pagamento:', data);
  }

  // Tratar notificação de cupom
  handleCouponNotification(data) {
    // Implementar lógica específica para notificações de cupom
    console.log('Notificação de cupom:', data);
  }

  // Configurar notificações em lote
  async scheduleBatchNotifications(notifications) {
    try {
      for (const notification of notifications) {
        this.scheduleNotification(notification);
      }
      console.log(`${notifications.length} notificações agendadas com sucesso`);
    } catch (error) {
      console.error('Erro ao agendar notificações em lote:', error);
    }
  }

  // Sincronizar notificações com o servidor
  async syncNotificationsWithServer() {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;

      const response = await fetch(`${process.env.API_URL}/api/notifications/sync`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const notifications = await response.json();
        await this.scheduleBatchNotifications(notifications);
      }
    } catch (error) {
      console.error('Erro ao sincronizar notificações:', error);
    }
  }
}

export default new NotificationService();
