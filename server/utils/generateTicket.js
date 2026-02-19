import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQR } from './generateQR.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateTicketPDF = async (registration) => {
  const { name, mobile, ticketId, email } = registration;
  const qrDataUrl = await generateQR(ticketId, name, mobile);

  const doc = new PDFDocument({ size: 'A5', margin: 30 });
  const ticketsDir = path.join(__dirname, '../tickets');
  if (!fs.existsSync(ticketsDir)) fs.mkdirSync(ticketsDir, { recursive: true });
  const filePath = path.join(ticketsDir, `ticket-${ticketId}.pdf`);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Neon styled header
    doc.fontSize(22).fillColor('#ff1493').text('NEON HOLI EVENT 2026', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#00bfff').text('Ballia\'s Biggest Neon Celebration', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(10).fillColor('#333');
    doc.text(`Ticket ID: ${ticketId}`, { continued: false });
    doc.text(`Name: ${name}`);
    doc.text(`Mobile: ${mobile}`);
    doc.text(`Email: ${email}`);
    doc.text('Date: 28th February 2026');
    doc.text('Time: 02:00 PM');
    doc.text('Venue: JMB Resort, Ballia');
    doc.moveDown(1);

    // QR Code - parse base64 and embed
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    doc.image(Buffer.from(base64Data, 'base64'), 200, doc.y, { width: 120, height: 120 });
    doc.moveDown(4);

    doc.fontSize(8).fillColor('#666').text('Present this ticket at the venue. Entry: ₹99', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
    doc.on('error', reject);
  });
};

export const getTicketPath = (ticketId) => {
  return path.join(__dirname, '../tickets', `ticket-${ticketId}.pdf`);
};
