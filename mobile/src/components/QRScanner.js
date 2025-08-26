import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { checkInUser } from '../services/eventService';
import { sendWhatsAppNotification } from '../services/whatsappService';

const { width, height } = Dimensions.get('window');

const QRScanner = ({ navigation, route }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const onSuccess = async (e) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setIsScanning(false);

      const qrData = e.data;
      console.log('QR Code escaneado:', qrData);

      // Parse do QR Code
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
      } catch (error) {
        Alert.alert(
          'QR Code Inválido',
          'Este QR Code não é válido para o EventSync.',
          [{ text: 'OK', onPress: () => setIsScanning(true) }]
        );
        return;
      }

      // Validar estrutura dos dados
      if (!parsedData.registrationId || !parsedData.eventId) {
        Alert.alert(
          'QR Code Inválido',
          'Este QR Code não contém informações válidas de inscrição.',
          [{ text: 'OK', onPress: () => setIsScanning(true) }]
        );
        return;
      }

      setScannedData(parsedData);

      // Fazer check-in
      const checkInResult = await checkInUser(parsedData.registrationId);

      if (checkInResult.success) {
        // Enviar notificação WhatsApp se configurado
        if (checkInResult.user.phone) {
          try {
            await sendWhatsAppNotification(
              checkInResult.user.phone,
              checkInResult.user.name,
              checkInResult.event.title,
              new Date().toLocaleTimeString('pt-BR')
            );
          } catch (error) {
            console.log('Erro ao enviar WhatsApp:', error);
          }
        }

        Alert.alert(
          'Check-in Realizado!',
          `Bem-vindo(a) ${checkInResult.user.name}!\n\nEvento: ${checkInResult.event.title}\nHorário: ${new Date().toLocaleTimeString('pt-BR')}`,
          [
            {
              text: 'Ver Detalhes',
              onPress: () => {
                navigation.navigate('CheckInDetails', {
                  checkInData: checkInResult
                });
              }
            },
            {
              text: 'Novo Scan',
              onPress: () => {
                setScannedData(null);
                setIsScanning(true);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Erro no Check-in',
          checkInResult.message || 'Não foi possível realizar o check-in.',
          [{ text: 'OK', onPress: () => setIsScanning(true) }]
        );
      }
    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao processar o QR Code. Tente novamente.',
        [{ text: 'OK', onPress: () => setIsScanning(true) }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (error) => {
    console.error('Erro no scanner:', error);
    Alert.alert(
      'Erro no Scanner',
      'Não foi possível acessar a câmera. Verifique as permissões.',
      [{ text: 'OK' }]
    );
  };

  const toggleFlash = () => {
    // Implementar toggle da lanterna
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (!isScanning) {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Icon name="check-circle" size={80} color="#4CAF50" />
          <Text style={styles.resultTitle}>QR Code Processado</Text>
          <Text style={styles.resultText}>
            {scannedData ? 'Dados extraídos com sucesso!' : 'Processando...'}
          </Text>
          
          {isProcessing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Realizando check-in...</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        topContent={
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scanner de Check-in</Text>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Icon name="flash-off" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        }
        bottomContent={
          <View style={styles.bottomContent}>
            <Text style={styles.instructionText}>
              Posicione o QR Code dentro da área de escaneamento
            </Text>
            <View style={styles.scanArea}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
          </View>
        }
        containerStyle={styles.scannerContainer}
        cameraStyle={styles.camera}
        showMarker={false}
        reactivate={true}
        reactivateTimeout={2000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flashButton: {
    padding: 10,
  },
  bottomContent: {
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
  },
  instructionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#007AFF',
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTopRight: {
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 10,
  },
});

export default QRScanner;
