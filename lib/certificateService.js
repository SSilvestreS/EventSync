import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CertificateService {
  constructor() {
    this.templatesPath = path.join(process.cwd(), 'public', 'certificates', 'templates');
    this.outputPath = path.join(process.cwd(), 'public', 'certificates', 'generated');
  }

  // Gerar certificado
  async generateCertificate(registrationId) {
    try {
      // Buscar dados da inscrição
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: {
          user: true,
          event: true,
          sessions: {
            include: {
              session: true
            }
          }
        }
      });

      if (!registration) {
        throw new Error('Inscrição não encontrada');
      }

      // Verificar se já existe certificado
      const existingCertificate = await prisma.certificate.findUnique({
        where: { registrationId }
      });

      if (existingCertificate) {
        return existingCertificate;
      }

      // Gerar código único do certificado
      const certificateCode = this.generateCertificateCode(registration);

      // Criar PDF do certificado
      const pdfBuffer = await this.createCertificatePDF(registration, certificateCode);

      // Salvar arquivo
      const fileName = `certificate_${certificateCode}.pdf`;
      const filePath = path.join(this.outputPath, fileName);
      
      // Garantir que o diretório existe
      if (!fs.existsSync(this.outputPath)) {
        fs.mkdirSync(this.outputPath, { recursive: true });
      }

      fs.writeFileSync(filePath, pdfBuffer);

      // Salvar no banco
      const certificate = await prisma.certificate.create({
        data: {
          registrationId,
          certificateCode,
          downloadUrl: `/certificates/generated/${fileName}`,
          templateId: 'default',
          customFields: {
            eventTitle: registration.event.title,
            userName: registration.user.name,
            eventDate: registration.event.date,
            totalHours: this.calculateTotalHours(registration.sessions)
          }
        }
      });

      return certificate;
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      throw error;
    }
  }

  // Criar PDF do certificado
  async createCertificatePDF(registration, certificateCode) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Adicionar fundo
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill('#f8f9fa');

        // Borda decorativa
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
           .lineWidth(3)
           .stroke('#007bff');

        // Título
        doc.fontSize(36)
           .font('Helvetica-Bold')
           .fill('#007bff')
           .text('CERTIFICADO DE PARTICIPAÇÃO', 0, 100, {
             align: 'center'
           });

        // Subtítulo
        doc.fontSize(18)
           .font('Helvetica')
           .fill('#6c757d')
           .text('Este documento certifica que', 0, 160, {
             align: 'center'
           });

        // Nome do participante
        doc.fontSize(28)
           .font('Helvetica-Bold')
           .fill('#212529')
           .text(registration.user.name, 0, 200, {
             align: 'center'
           });

        // Participou do evento
        doc.fontSize(18)
           .font('Helvetica')
           .fill('#6c757d')
           .text('participou com sucesso do evento', 0, 250, {
             align: 'center'
           });

        // Nome do evento
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fill('#007bff')
           .text(`"${registration.event.title}"`, 0, 290, {
             align: 'center'
           });

        // Data do evento
        const eventDate = new Date(registration.event.date).toLocaleDateString('pt-BR');
        doc.fontSize(16)
           .font('Helvetica')
           .fill('#6c757d')
           .text(`realizado em ${eventDate}`, 0, 330, {
             align: 'center'
           });

        // Carga horária
        const totalHours = this.calculateTotalHours(registration.sessions);
        if (totalHours > 0) {
          doc.fontSize(16)
             .font('Helvetica')
             .fill('#6c757d')
             .text(`com carga horária de ${totalHours} horas`, 0, 360, {
               align: 'center'
             });
        }

        // Código do certificado
        doc.fontSize(12)
           .font('Helvetica')
           .fill('#6c757d')
           .text(`Código: ${certificateCode}`, 0, 420, {
             align: 'center'
           });

        // Data de emissão
        const issuedDate = new Date().toLocaleDateString('pt-BR');
        doc.fontSize(12)
           .font('Helvetica')
           .fill('#6c757d')
           .text(`Emitido em: ${issuedDate}`, 0, 440, {
             align: 'center'
           });

        // QR Code
        const qrCodeData = JSON.stringify({
          certificateCode,
          registrationId: registration.id,
          eventId: registration.event.id,
          userId: registration.user.id
        });

        try {
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
          doc.image(qrCodeBuffer, doc.page.width - 150, doc.page.height - 150, {
            width: 100,
            height: 100
          });
        } catch (error) {
          console.error('Erro ao gerar QR Code:', error);
        }

        // Assinatura
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fill('#212529')
           .text('_________________________', 100, doc.page.height - 100);

        doc.fontSize(12)
           .font('Helvetica')
           .fill('#6c757d')
           .text('Organizador do Evento', 100, doc.page.height - 80);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Calcular horas totais das sessões
  calculateTotalHours(sessions) {
    return sessions.reduce((total, sessionReg) => {
      if (sessionReg.session.duration) {
        return total + sessionReg.session.duration;
      }
      return total;
    }, 0);
  }

  // Gerar código único do certificado
  generateCertificateCode(registration) {
    const timestamp = Date.now().toString(36);
    const userId = registration.userId.substring(0, 8);
    const eventId = registration.eventId.substring(0, 8);
    const random = Math.random().toString(36).substring(2, 6);
    
    return `CERT-${timestamp}-${userId}-${eventId}-${random}`.toUpperCase();
  }

  // Validar certificado
  async validateCertificate(certificateCode) {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { certificateCode },
        include: {
          registration: {
            include: {
              user: true,
              event: true
            }
          }
        }
      });

      if (!certificate) {
        return {
          valid: false,
          message: 'Certificado não encontrado'
        };
      }

      if (!certificate.isActive) {
        return {
          valid: false,
          message: 'Certificado inativo'
        };
      }

      if (certificate.expiresAt && new Date() > certificate.expiresAt) {
        return {
          valid: false,
          message: 'Certificado expirado'
        };
      }

      return {
        valid: true,
        certificate,
        message: 'Certificado válido'
      };
    } catch (error) {
      console.error('Erro ao validar certificado:', error);
      return {
        valid: false,
        message: 'Erro ao validar certificado'
      };
    }
  }

  // Listar certificados de um usuário
  async getUserCertificates(userId) {
    try {
      const certificates = await prisma.certificate.findMany({
        where: {
          registration: {
            userId
          }
        },
        include: {
          registration: {
            include: {
              event: true
            }
          }
        },
        orderBy: {
          issuedAt: 'desc'
        }
      });

      return certificates;
    } catch (error) {
      console.error('Erro ao buscar certificados do usuário:', error);
      throw error;
    }
  }

  // Revogar certificado
  async revokeCertificate(certificateId) {
    try {
      const certificate = await prisma.certificate.update({
        where: { id: certificateId },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });

      return certificate;
    } catch (error) {
      console.error('Erro ao revogar certificado:', error);
      throw error;
    }
  }
}

export default new CertificateService();
