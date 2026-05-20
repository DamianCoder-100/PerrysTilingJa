// BACK-END CODE FOR PERRY'S WEBSITE CONTACT FORM

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const app = express();

// ======================
// TRUST PROXY (for deployment)
// ======================
app.set('trust proxy', 1);

// ======================
// ENV VARIABLES
// ======================
const emailUser = process.env.SMTP_USER;
const emailPass = process.env.SMTP_PASS;
const receiverEmail = process.env.RECEIVER_EMAIL;
const port = process.env.PORT || 3000;

// ======================
// ENV VALIDATION (fail fast)
// ======================
if (
  !emailUser ||
  !emailPass ||
  !receiverEmail ||
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT
) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// ======================
// MIDDLEWARE
// ======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://damiancoder-100.github.io'
    ]
  })
);

// ======================
// RATE LIMITER
// ======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many requests. Try again later.'
  }
});

// ======================
// SMTP TRANSPORTER (OPTIMIZED)
// ======================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: emailUser,
    pass: emailPass
  },

  // 🔥 TIMEOUT SETTINGS (added)
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// SMTP connection check
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP server ready');
  }
});

// ======================
// HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Backend running' });
});

// ======================
// VALIDATION RULES
// ======================
const contactValidation = [
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('email').trim().normalizeEmail().isEmail().withMessage('Valid email required'),
  body('phone').trim().escape().notEmpty().withMessage('Phone is required'),
  body('service').trim().escape().notEmpty().withMessage('Service is required'),
  body('message')
    .trim()
    .escape()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters')
];

// ======================
// CONTACT ROUTE
// ======================
app.post('/contact', limiter, contactValidation, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { name, email, phone, service, message } = req.body;

  try {
    // ======================
    // EMAIL TO OWNER
    // ======================
    await transporter.sendMail({
      from: `"Perry's Tiling" <${emailUser}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `New Quote Request: ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // ======================
    // CONFIRMATION EMAIL TO USER
    // ======================
    await transporter.sendMail({
      from: `"Perry's Tiling" <${emailUser}>`,
      to: email,
      subject: "Thanks for contacting Perry's Tiling!",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out about <strong>${service}</strong>.</p>
        <p>We will get back to you within 24 hours.</p>
        <p>Phone: (876) 817-3377</p>
        <br />
        <p>- Perry's Tiling Team</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (err) {
    console.error('❌ Email error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error. Try again later.'
    });
  }
});

// ======================
// START SERVER
// ======================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});