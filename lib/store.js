import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/db.json');
const BACKUP_FILE = path.join(__dirname, '../data/db.json.bak');

export const storeEvents = new EventEmitter();

const defaultData = {
  visitors: [],
  blockedIps: [],
  blockedBins: [],
  telegramConfig: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
    enabled: true
  }
};

// In-memory database cache to prevent any read failures, concurrency conflicts, or disconnections
let cachedDb = null;

function sanitizeVisitor(v, index = 0) {
  if (!v || typeof v !== 'object') return null;
  let id = v.id;
  if (typeof id !== 'string' || !id.trim() || id === '[object Object]') {
    id = `vis_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
  }
  return {
    ...v,
    id,
    name: typeof v.name === 'string' && v.name.trim() ? v.name : 'زائر جديد',
    phone: typeof v.phone === 'string' ? v.phone : '',
    email: typeof v.email === 'string' ? v.email : '',
    emiratesId: typeof v.emiratesId === 'string' ? v.emiratesId : '',
    ip: typeof v.ip === 'string' && v.ip.trim() ? v.ip : '127.0.0.1',
    step: typeof v.step === 'string' ? v.step : 'schedule',
    orderStatus: v.orderStatus || 'pending'
  };
}

function loadDbFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.visitors)) {
            parsed.visitors = parsed.visitors.map((v, i) => sanitizeVisitor(v, i)).filter(Boolean);
          }
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Warning: primary db.json read failed, checking backup:', err.message);
  }

  // Attempt reading from backup
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const backupRaw = fs.readFileSync(BACKUP_FILE, 'utf-8');
      if (backupRaw && backupRaw.trim().length > 0) {
        const parsedBackup = JSON.parse(backupRaw);
        if (parsedBackup && typeof parsedBackup === 'object') {
          if (Array.isArray(parsedBackup.visitors)) {
            parsedBackup.visitors = parsedBackup.visitors.map((v, i) => sanitizeVisitor(v, i)).filter(Boolean);
          }
          console.log('Restored database from backup file.');
          return parsedBackup;
        }
      }
    }
  } catch (bakErr) {
    console.error('Backup read error:', bakErr.message);
  }

  return JSON.parse(JSON.stringify(defaultData));
}

function readDb() {
  if (!cachedDb) {
    cachedDb = loadDbFromDisk();
  }
  if (cachedDb && Array.isArray(cachedDb.visitors)) {
    cachedDb.visitors = cachedDb.visitors.map((v, i) => sanitizeVisitor(v, i)).filter(Boolean);
  }
  return cachedDb;
}

function writeDb(data) {
  cachedDb = data;
  try {
    const jsonString = JSON.stringify(data, null, 2);
    // Atomic write to prevent half-written/corrupted files during concurrent writes
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, jsonString, 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);

    // Also update backup file asynchronously
    try {
      fs.writeFileSync(BACKUP_FILE, jsonString, 'utf-8');
    } catch (bErr) {}

    // Emit live event for connected clients/SSE
    storeEvents.emit('change', data);
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

export const store = {
  getVisitors() {
    const db = readDb();
    const now = Date.now();
    
    // Compute real-time online status (active within last 3 minutes or currently waiting for OTP/Card approval)
    const list = (db.visitors || []).map(v => {
      const lastActive = v.lastActiveAt ? new Date(v.lastActiveAt).getTime() : 0;
      const isWaiting = v.cardApprovalStatus === 'waiting' || v.otpApprovalStatus === 'waiting';
      const isOnline = (now - lastActive) < 180000 || isWaiting;
      const createdAt = v.createdAt || v.updatedAt || v.lastActiveAt || new Date().toISOString();
      return {
        ...v,
        createdAt,
        online: isOnline,
        status: v.blocked ? 'blocked' : (isOnline ? 'online' : 'offline'),
        orderStatus: v.orderStatus || 'pending'
      };
    });

    // Always sort so latest registered or active orders appear at the top
    list.sort((a, b) => {
      const tA = new Date(a.updatedAt || a.lastActiveAt || a.createdAt || 0).getTime();
      const tB = new Date(b.updatedAt || b.lastActiveAt || b.createdAt || 0).getTime();
      return tB - tA;
    });

    return list;
  },

  getVisitorById(id) {
    const visitors = this.getVisitors();
    return visitors.find(v => v.id === id) || null;
  },

  upsertVisitor(visitorData) {
    if (!visitorData || typeof visitorData !== 'object') return null;
    let targetId = visitorData.id || visitorData.visitorId;
    if (typeof targetId !== 'string' || !targetId.trim() || targetId === '[object Object]') {
      targetId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    }
    visitorData.id = targetId;

    const db = readDb();
    const visitors = db.visitors || [];
    const index = visitors.findIndex(v => v && v.id === targetId);
    const now = new Date().toISOString();

    if (index >= 0) {
      const existing = visitors[index];
      const merged = { ...existing };
      for (const [key, val] of Object.entries(visitorData)) {
        if (val !== undefined && val !== null && val !== '') {
          if (key === 'createdAt' && existing.createdAt) {
            continue; // Keep original entry time intact
          }
          if (key === 'name' && existing.name && existing.name !== 'زائر جديد' && val === 'زائر جديد') {
            continue;
          }
          if (key === 'bookingData' && existing.bookingData) {
            merged.bookingData = { ...existing.bookingData, ...val };
          } else {
            merged[key] = val;
          }
        }
      }
      merged.createdAt = existing.createdAt || merged.createdAt || now;
      merged.lastActiveAt = now;
      merged.updatedAt = now;
      if (!merged.orderStatus) merged.orderStatus = 'pending';

      // Move updated visitor to the front of the list so it is immediately visible
      visitors.splice(index, 1);
      visitors.unshift(merged);
      db.visitors = visitors;
      writeDb(db);
      return merged;
    } else {
      const cleanData = {};
      for (const [key, val] of Object.entries(visitorData)) {
        if (val !== undefined && val !== null) {
          cleanData[key] = val;
        }
      }
      const newVisitor = {
        id: visitorData.id || `vis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: visitorData.name || 'زائر جديد',
        phone: visitorData.phone || '',
        email: visitorData.email || '',
        emiratesId: visitorData.emiratesId || '',
        ip: visitorData.ip || '127.0.0.1',
        step: visitorData.step || 'schedule',
        orderStatus: 'pending',
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now,
        ...cleanData
      };
      visitors.unshift(newVisitor);
      db.visitors = visitors;
      writeDb(db);
      return newVisitor;
    }
  },

  updateVisitor(id, updates) {
    const db = readDb();
    const visitors = db.visitors || [];
    const index = visitors.findIndex(v => v.id === id);
    if (index >= 0) {
      visitors[index] = {
        ...visitors[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      db.visitors = visitors;
      writeDb(db);
      return visitors[index];
    }
    return null;
  },

  deleteVisitor(id) {
    const db = readDb();
    db.visitors = (db.visitors || []).filter(v => v.id !== id);
    writeDb(db);
    return true;
  },

  getBlockedIps() {
    return readDb().blockedIps || [];
  },

  addBlockedIp(ip) {
    const db = readDb();
    db.blockedIps = Array.from(new Set([...(db.blockedIps || []), ip]));
    writeDb(db);
    return db.blockedIps;
  },

  removeBlockedIp(ip) {
    const db = readDb();
    db.blockedIps = (db.blockedIps || []).filter(item => item !== ip);
    writeDb(db);
    return db.blockedIps;
  },

  getBlockedBins() {
    return readDb().blockedBins || [];
  },

  addBlockedBin(bin) {
    const db = readDb();
    db.blockedBins = Array.from(new Set([...(db.blockedBins || []), bin]));
    writeDb(db);
    return db.blockedBins;
  },

  removeBlockedBin(bin) {
    const db = readDb();
    db.blockedBins = (db.blockedBins || []).filter(item => item !== bin);
    writeDb(db);
    return db.blockedBins;
  },

  getTelegramConfig() {
    const db = readDb();
    return db.telegramConfig || {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      chatId: process.env.TELEGRAM_CHAT_ID || '',
      enabled: true
    };
  },

  saveTelegramConfig(config) {
    const db = readDb();
    db.telegramConfig = {
      token: config.token || '',
      chatId: config.chatId || '',
      enabled: config.enabled !== false
    };
    writeDb(db);
    return db.telegramConfig;
  }
};
