const PREFIX = 'nanumcart:';
const VERSION_KEY = `${PREFIX}version`;
const VERSION = '1';

let versionChecked = false;

/** 저장된 스키마 버전이 현재 버전과 다르면 nanumcart:* 키를 모두 지운다 (한 세션당 한 번만 확인) */
function ensureVersion() {
  if (versionChecked) return;
  versionChecked = true;
  try {
    if (localStorage.getItem(VERSION_KEY) !== VERSION) {
      clearAllState();
      localStorage.setItem(VERSION_KEY, VERSION);
    }
  } catch {
    // localStorage 접근 불가 — 시드로 동작
  }
}

export function loadState(key, seed) {
  ensureVersion();
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return seed;
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 실패(용량 초과 등)는 무시하고 메모리 상태만 유지
  }
}

export function clearAllState() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}
