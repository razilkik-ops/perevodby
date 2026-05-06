require('dotenv').config();

const path = require('node:path');

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const port = Number(process.env.PORT) || 3000;

const maxFiles = Number(process.env.ORDER_FORM_MAX_FILES) || 5;
const maxFileSizeMb = Number(process.env.ORDER_FORM_MAX_FILE_MB) || 10;
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.rtf']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: maxFiles,
    fileSize: maxFileSizeBytes,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      callback(new Error('unsupported_file_type'));
      return;
    }

    callback(null, true);
  },
});

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.use(express.static(__dirname, { extensions: ['html'] }));

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const portValue = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || !process.env.ORDER_FORM_TO) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: portValue,
    secure: process.env.SMTP_SECURE === 'true' || portValue === 465,
    auth: {
      user,
      pass,
    },
  });
};

const escapeHtml = (value = '') =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getOrderMailContent = ({ name, phone, email, service, urgency, message, filesCount }) => {
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email || 'Не указан');
  const safeService = escapeHtml(service || 'Не указан');
  const safeUrgency = escapeHtml(urgency || 'Не указана');
  const safeMessage = escapeHtml(message || 'Не указан');

  return {
    subject: `Новая заявка с сайта: ${name}`,
    text: [
      'Новая заявка с сайта perevod.by',
      '',
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Email: ${email || 'Не указан'}`,
      `Тип перевода: ${service || 'Не указан'}`,
      `Срочность: ${urgency || 'Не указана'}`,
      `Комментарий: ${message || 'Не указан'}`,
      `Файлов приложено: ${filesCount}`,
    ].join('\n'),
    html: `
      <h2>Новая заявка с сайта perevod.by</h2>
      <p><strong>Имя:</strong> ${safeName}</p>
      <p><strong>Телефон:</strong> ${safePhone}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Тип перевода:</strong> ${safeService}</p>
      <p><strong>Срочность:</strong> ${safeUrgency}</p>
      <p><strong>Комментарий:</strong><br />${safeMessage.replaceAll('\n', '<br />')}</p>
      <p><strong>Файлов приложено:</strong> ${filesCount}</p>
    `,
  };
};

app.post('/api/order', (req, res) => {
  upload.array('files', maxFiles)(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          ok: false,
          message: `Один из файлов превышает ${maxFileSizeMb} МБ.`,
        });
        return;
      }

      if (error.code === 'LIMIT_FILE_COUNT') {
        res.status(400).json({
          ok: false,
          message: `Можно прикрепить не более ${maxFiles} файлов за одну заявку.`,
        });
        return;
      }
    }

    if (error) {
      const message =
        error.message === 'unsupported_file_type'
          ? 'Поддерживаются только PDF, JPG, PNG, DOC, DOCX и RTF.'
          : 'Не удалось обработать вложения. Попробуйте еще раз.';

      res.status(400).json({ ok: false, message });
      return;
    }

    const transporter = createTransporter();

    if (!transporter) {
      res.status(503).json({
        ok: false,
        message:
          'Форма пока не настроена на сервере. Добавьте SMTP-параметры и email получателя.',
      });
      return;
    }

    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();
    const email = String(req.body.email || '').trim();
    const service = String(req.body.service || '').trim();
    const urgency = String(req.body.urgency || '').trim();
    const message = String(req.body.comment || req.body.message || '').trim();
    const consent = req.body.consent;
    const honeypot = String(req.body.company || '').trim();
    const files = Array.isArray(req.files) ? req.files : [];

    if (honeypot) {
      res.status(200).json({ ok: true, message: 'Заявка отправлена.' });
      return;
    }

    if (!name || !phone || !consent) {
      res.status(400).json({
        ok: false,
        message: 'Заполните имя, телефон и подтвердите согласие на обработку данных.',
      });
      return;
    }

    if (!files.length) {
      res.status(400).json({
        ok: false,
        message: 'Прикрепите хотя бы один файл.',
      });
      return;
    }

    const mailContent = getOrderMailContent({
      name,
      phone,
      email,
      service,
      urgency,
      message,
      filesCount: files.length,
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ORDER_FORM_TO,
        replyTo: email || undefined,
        subject: mailContent.subject,
        text: mailContent.text,
        html: mailContent.html,
        attachments: files.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        })),
      });

      res.status(200).json({
        ok: true,
        message: 'Заявка отправлена. Мы свяжемся с вами в рабочее время.',
      });
    } catch (mailError) {
      console.error('Order form send error:', mailError);
      res.status(500).json({
        ok: false,
        message:
          'Не удалось отправить заявку. Попробуйте еще раз или свяжитесь с нами по телефону.',
      });
    }
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next();
    return;
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`perevod.by server listening on port ${port}`);
});
