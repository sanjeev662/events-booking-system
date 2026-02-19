import express from 'express';
import ExcelJS from 'exceljs';
import Registration from '../models/Registration.js';

const router = express.Router();

const checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.query.password || '';
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.use(checkAdmin);

// GET /api/registrations - list all
router.get('/registrations', async (req, res) => {
  try {
    const list = await Registration.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// GET /api/export-excel
router.get('/export-excel', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 }).lean();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Registrations');
    sheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Mobile', key: 'mobile', width: 14 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Address', key: 'address', width: 35 },
      { header: 'Payment ID', key: 'paymentId', width: 28 },
      { header: 'Ticket ID', key: 'ticketId', width: 14 },
      { header: 'Date', key: 'date', width: 22 }
    ];
    sheet.getRow(1).font = { bold: true };
    registrations.forEach((r) => {
      sheet.addRow({
        name: r.name,
        email: r.email,
        mobile: r.mobile,
        gender: r.gender,
        address: r.address,
        paymentId: r.paymentId || '',
        ticketId: r.ticketId || '',
        date: r.createdAt ? new Date(r.createdAt).toLocaleString() : ''
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=neon-holi-registrations.xlsx');
    await workbook.xlsx.write(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed' });
  }
});

export default router;
