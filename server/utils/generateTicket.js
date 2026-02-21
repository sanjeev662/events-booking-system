import PDFDocument from 'pdfkit';
import { generateQR } from './generateQR.js';

/**
 * Stream ticket PDF directly to output stream (e.g. HTTP response).
 * No file storage - generates on-the-fly only.
 */
export const streamTicketPDF = async (registration, outputStream) => {
  const { name, mobile, ticketId, email } = registration;
  const qrDataUrl = await generateQR(ticketId, name, mobile);

  const doc = new PDFDocument({ size: 'A5', margin: 30 });
  doc.pipe(outputStream);

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

  return new Promise((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);
    outputStream.on('error', reject);
  });
};
