import QRCode from 'qrcode';

export const generateQR = async (ticketId, name, mobile) => {
  const data = JSON.stringify({ ticketId, name, mobile });
  return QRCode.toDataURL(data, { width: 200, margin: 2 });
};
