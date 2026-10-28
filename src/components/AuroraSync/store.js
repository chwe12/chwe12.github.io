import {useSyncExternalStore} from 'react';

/*
 * 真實極光同步：讀取 NOAA 即時 Kp 指數（只讀）
 * Kp ≥ 5（地磁暴）時網站出現極光
 */

const KP_URL = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';
const CACHE_KEY = 'squirrel-aurora-kp';
const CACHE_TTL = 30 * 60 * 1000;

export const AURORA_THRESHOLD = 5;

const initialState = {kp: null, preview: null};
let state = initialState;
const listeners = new Set();
let pending = null;

function setState(patch) {
  state = {...state, ...patch};
  listeners.forEach((listener) => listener());
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.time < CACHE_TTL) return cached.kp;
  } catch {
    // 無痕模式等情況讀不到，直接重新查詢
  }
  return null;
}

function writeCache(kp) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({kp, time: Date.now()}));
  } catch {
    // 存不了也沒關係
  }
}

/* 取最近 60 分鐘的最大估計值，避免一分鐘一分鐘忽明忽暗 */
function parseKp(data) {
  const values = data
    .slice(-60)
    .map((row) => Number(row.estimated_kp))
    .filter((kp) => Number.isFinite(kp) && kp >= 0 && kp <= 9);
  return values.length ? Math.max(...values) : null;
}

export function loadKp({force = false} = {}) {
  const cached = force ? null : readCache();
  if (cached !== null) {
    setState({kp: cached});
    return Promise.resolve(cached);
  }
  if (!pending) {
    pending = fetch(KP_URL)
      .then((res) => res.json())
      .then((data) => {
        const kp = parseKp(data);
        if (kp !== null) {
          writeCache(kp);
          setState({kp});
        }
        return kp;
      })
      .catch(() => state.kp)
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

/* 預覽：只影響自己的瀏覽器畫面，null 表示關閉 */
export function setPreview(kp) {
  setState({preview: kp});
}

export function getAurora() {
  return state;
}

export function auroraLevel({kp, preview}) {
  const value = preview ?? kp;
  if (value === null || value < AURORA_THRESHOLD) return 0;
  if (value >= 7) return 3;
  if (value >= 6) return 2;
  return 1;
}

export function useAurora() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => initialState,
  );
}
