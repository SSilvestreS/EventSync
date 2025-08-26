import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

class CertificateTemplates {
  constructor() {
    this.templatesPath = path.join(process.cwd(), 'public', 'certificates', 'templates');
    this.fontsPath = path.join(process.cwd(), 'public', 'fonts');
  }

  // Template padrão
  async createDefaultTemplate(registration, certificateCode) {
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

        // Fundo gradiente
        this.createGradientBackground(doc);
        
        // Borda decorativa
        this.createDecorativeBorder(doc);
        
        // Cabeçalho
        this.createHeader(doc, registration.event);
        
        // Conteúdo principal
        this.createMainContent(doc, registration, certificateCode);
        
        // Rodapé
        this.createFooter(doc, registration.event);
        
        // QR Code
        this.addQRCode(doc, certificateCode, registration);
        
        // Assinatura
        this.addSignature(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Template corporativo
  async createCorporateTemplate(registration, certificateCode) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'portrait',
          margins: {
            top: 60,
            bottom: 60,
            left: 60,
            right: 60
          }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Fundo corporativo
        this.createCorporateBackground(doc);
        
        // Logo da empresa (se disponível)
        this.addCompanyLogo(doc, registration.event);
        
        // Cabeçalho corporativo
        this.createCorporateHeader(doc, registration.event);
        
        // Conteúdo corporativo
        this.createCorporateContent(doc, registration, certificateCode);
        
        // Rodapé corporativo
        this.createCorporateFooter(doc, registration.event);
        
        // QR Code corporativo
        this.addCorporateQRCode(doc, certificateCode, registration);
        
        // Assinatura corporativa
        this.addCorporateSignature(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Template acadêmico
  async createAcademicTemplate(registration, certificateCode) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'portrait',
          margins: {
            top: 70,
            bottom: 70,
            left: 70,
            right: 70
          }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Fundo acadêmico
        this.createAcademicBackground(doc);
        
        // Selo acadêmico
        this.addAcademicSeal(doc);
        
        // Cabeçalho acadêmico
        this.createAcademicHeader(doc, registration.event);
        
        // Conteúdo acadêmico
        this.createAcademicContent(doc, registration, certificateCode);
        
        // Rodapé acadêmico
        this.createAcademicFooter(doc, registration.event);
        
        // QR Code acadêmico
        this.addAcademicQRCode(doc, certificateCode, registration);
        
        // Assinatura acadêmica
        this.addAcademicSignature(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Criar fundo gradiente
  createGradientBackground(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Gradiente de fundo
    const gradient = doc.linearGradient(0, 0, pageWidth, pageHeight);
    gradient.stop(0, '#f8f9fa');
    gradient.stop(0.5, '#e9ecef');
    gradient.stop(1, '#dee2e6');
    
    doc.rect(0, 0, pageWidth, pageHeight).fill(gradient);
  }

  // Criar fundo corporativo
  createCorporateBackground(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Fundo sólido corporativo
    doc.rect(0, 0, pageWidth, pageHeight).fill('#ffffff');
    
    // Linha decorativa superior
    doc.rect(0, 0, pageWidth, 8).fill('#007bff');
  }

  // Criar fundo acadêmico
  createAcademicBackground(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Fundo acadêmico
    doc.rect(0, 0, pageWidth, pageHeight).fill('#f8f9fa');
    
    // Padrão de fundo sutil
    for (let i = 0; i < pageWidth; i += 50) {
      for (let j = 0; j < pageHeight; j += 50) {
        doc.circle(i, j, 1).fill('#e9ecef');
      }
    }
  }

  // Criar borda decorativa
  createDecorativeBorder(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Borda externa
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
       .lineWidth(3)
       .stroke('#007bff');
    
    // Cantos decorativos
    const cornerSize = 30;
    const corners = [
      [20, 20], [pageWidth - 20 - cornerSize, 20],
      [20, pageHeight - 20 - cornerSize], [pageWidth - 20 - cornerSize, pageHeight - 20 - cornerSize]
    ];
    
    corners.forEach(([x, y]) => {
      doc.rect(x, y, cornerSize, cornerSize)
         .lineWidth(2)
         .stroke('#007bff');
    });
  }

  // Criar cabeçalho
  createHeader(doc, event) {
    // Título principal
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
  }

  // Criar cabeçalho corporativo
  createCorporateHeader(doc, event) {
    // Logo da empresa (placeholder)
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fill('#007bff')
       .text('LOGO EMPRESA', 50, 50);
    
    // Título corporativo
    doc.fontSize(32)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text('CERTIFICADO CORPORATIVO', 0, 120, {
         align: 'center'
       });
    
    // Linha separadora
    doc.rect(100, 150, doc.page.width - 200, 2).fill('#007bff');
  }

  // Criar cabeçalho acadêmico
  createAcademicHeader(doc, event) {
    // Selo acadêmico
    doc.circle(doc.page.width / 2, 80, 40)
       .lineWidth(3)
       .stroke('#dc3545');
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fill('#dc3545')
       .text('ACADÊMICO', 0, 80, {
         align: 'center'
       });
    
    // Título acadêmico
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text('CERTIFICADO ACADÊMICO', 0, 140, {
         align: 'center'
       });
  }

  // Criar conteúdo principal
  createMainContent(doc, registration, certificateCode) {
    const pageHeight = doc.page.height;
    
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
  }

  // Criar conteúdo corporativo
  createCorporateContent(doc, registration, certificateCode) {
    // Nome do participante
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text(registration.user.name, 0, 200, {
         align: 'center'
       });
    
    // Descrição corporativa
    doc.fontSize(16)
       .font('Helvetica')
       .fill('#6c757d')
       .text('completou com êxito o programa de treinamento', 0, 240, {
         align: 'center'
       });
    
    // Nome do evento
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fill('#007bff')
       .text(registration.event.title, 0, 280, {
         align: 'center'
       });
    
    // Informações adicionais
    const eventDate = new Date(registration.event.date).toLocaleDateString('pt-BR');
    doc.fontSize(14)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`Data de conclusão: ${eventDate}`, 0, 320, {
         align: 'center'
       });
    
    // Código do certificado
    doc.fontSize(12)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`ID do Certificado: ${certificateCode}`, 0, 360, {
         align: 'center'
       });
  }

  // Criar conteúdo acadêmico
  createAcademicContent(doc, registration, certificateCode) {
    // Nome do participante
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text(registration.user.name, 0, 200, {
         align: 'center'
       });
    
    // Descrição acadêmica
    doc.fontSize(16)
       .font('Helvetica')
       .fill('#6c757d')
       .text('participou e concluiu com sucesso o curso acadêmico', 0, 240, {
         align: 'center'
       });
    
    // Nome do curso
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fill('#dc3545')
       .text(registration.event.title, 0, 280, {
         align: 'center'
       });
    
    // Informações acadêmicas
    const eventDate = new Date(registration.event.date).toLocaleDateString('pt-BR');
    doc.fontSize(14)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`Data de conclusão: ${eventDate}`, 0, 320, {
         align: 'center'
       });
    
    // Código do certificado
    doc.fontSize(12)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`Código Acadêmico: ${certificateCode}`, 0, 360, {
         align: 'center'
       });
  }

  // Adicionar QR Code
  async addQRCode(doc, certificateCode, registration) {
    try {
      const QRCode = await import('qrcode');
      const qrCodeData = JSON.stringify({
        certificateCode,
        registrationId: registration.id,
        eventId: registration.event.id,
        userId: registration.user.id,
        validationUrl: `${process.env.NEXTAUTH_URL}/certificates/validate/${certificateCode}`
      });
      
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
      doc.image(qrCodeBuffer, doc.page.width - 150, doc.page.height - 150, {
        width: 100,
        height: 100
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  }

  // Adicionar QR Code corporativo
  async addCorporateQRCode(doc, certificateCode, registration) {
    try {
      const QRCode = await import('qrcode');
      const qrCodeData = JSON.stringify({
        certificateCode,
        type: 'corporate',
        registrationId: registration.id,
        validationUrl: `${process.env.NEXTAUTH_URL}/certificates/validate/${certificateCode}`
      });
      
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
      doc.image(qrCodeBuffer, doc.page.width - 120, doc.page.height - 120, {
        width: 80,
        height: 80
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code corporativo:', error);
    }
  }

  // Adicionar QR Code acadêmico
  async addAcademicQRCode(doc, certificateCode, registration) {
    try {
      const QRCode = await import('qrcode');
      const qrCodeData = JSON.stringify({
        certificateCode,
        type: 'academic',
        registrationId: registration.id,
        validationUrl: `${process.env.NEXTAUTH_URL}/certificates/validate/${certificateCode}`
      });
      
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
      doc.image(qrCodeBuffer, doc.page.width - 120, doc.page.height - 120, {
        width: 80,
        height: 80
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code acadêmico:', error);
    }
  }

  // Adicionar assinatura
  addSignature(doc) {
    const pageHeight = doc.page.height;
    
    // Linha de assinatura
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text('_________________________', 100, pageHeight - 100);
    
    // Nome do organizador
    doc.fontSize(12)
       .font('Helvetica')
       .fill('#6c757d')
       .text('Organizador do Evento', 100, pageHeight - 80);
  }

  // Adicionar assinatura corporativa
  addCorporateSignature(doc) {
    const pageHeight = doc.page.height;
    
    // Linha de assinatura
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text('_________________________', 150, pageHeight - 100);
    
    // Nome do diretor
    doc.fontSize(12)
       .font('Helvetica')
       .fill('#6c757d')
       .text('Diretor de Treinamento', 150, pageHeight - 80);
    
    // Carimbo da empresa
    doc.circle(500, pageHeight - 120, 30)
       .lineWidth(2)
       .stroke('#007bff');
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fill('#007bff')
       .text('CARIMBO', 500, pageHeight - 120, {
         align: 'center'
       });
  }

  // Adicionar assinatura acadêmica
  addAcademicSignature(doc) {
    const pageHeight = doc.page.height;
    
    // Linha de assinatura
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fill('#212529')
       .text('_________________________', 150, pageHeight - 100);
    
    // Nome do coordenador
    doc.fontSize(12)
       .font('Helvetica')
       .fill('#6c757d')
       .text('Coordenador Acadêmico', 150, pageHeight - 80);
    
    // Selo acadêmico
    doc.circle(500, pageHeight - 120, 30)
       .lineWidth(2)
       .stroke('#dc3545');
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fill('#dc3545')
       .text('SELO', 500, pageHeight - 120, {
         align: 'center'
       });
  }

  // Adicionar logo da empresa
  addCompanyLogo(doc, event) {
    // Placeholder para logo
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fill('#007bff')
       .text('LOGO', 50, 50);
  }

  // Adicionar selo acadêmico
  addAcademicSeal(doc) {
    // Selo acadêmico
    doc.circle(doc.page.width / 2, 80, 40)
       .lineWidth(3)
       .stroke('#dc3545');
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fill('#dc3545')
       .text('ACADÊMICO', 0, 80, {
         align: 'center'
       });
  }

  // Criar rodapé
  createFooter(doc, event) {
    const pageHeight = doc.page.height;
    
    // Linha separadora
    doc.rect(50, pageHeight - 150, doc.page.width - 100, 1).fill('#dee2e6');
    
    // Informações do evento
    doc.fontSize(10)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`Evento: ${event.title} | Organizador: ${event.organizer || 'EventSync'}`, 0, pageHeight - 130, {
         align: 'center'
       });
  }

  // Criar rodapé corporativo
  createCorporateFooter(doc, event) {
    const pageHeight = doc.page.height;
    
    // Linha separadora
    doc.rect(50, pageHeight - 150, doc.page.width - 100, 1).fill('#007bff');
    
    // Informações corporativas
    doc.fontSize(10)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`Programa: ${event.title} | Empresa: ${event.organizer || 'EventSync'}`, 0, pageHeight - 130, {
         align: 'center'
       });
  }

  // Criar rodapé acadêmico
  createAcademicFooter(doc, event) {
    const pageHeight = doc.page.height;
    
    // Linha separadora
    doc.rect(50, pageHeight - 150, doc.page.width - 100, 1).fill('#dc3545');
    
    // Informações acadêmicas
    doc.fontSize(10)
       .font('Helvetica')
       .fill('#6c757d')
       .text(`Curso: ${event.title} | Instituição: ${event.organizer || 'EventSync'}`, 0, pageHeight - 130, {
         align: 'center'
       });
  }
}

export default new CertificateTemplates();
