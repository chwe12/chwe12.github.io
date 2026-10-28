import {useEffect} from 'react';
import {auroraLevel, loadKp, setPreview, useAurora} from './store';
import './aurora.css';

const REFRESH_INTERVAL = 30 * 60 * 1000;

/* 在 <html> 加上 data-aurora，讓 aurora.css 顯示極光 */
export default function AuroraSync() {
  const aurora = useAurora();
  const level = auroraLevel(aurora);

  useEffect(() => {
    /*
     * 測試用：網址加 ?aurora 預覽，只影響自己的畫面
     * ?aurora → Kp 6；?aurora=5~9 → 指定強度；其他值 → 0（不出現極光）
     */
    const param = new URLSearchParams(window.location.search).get('aurora');
    if (param !== null) {
      const kp = Number(param);
      if (param === '') setPreview(6);
      else setPreview(kp >= 5 && kp <= 9 ? kp : 0);
    }
    loadKp();
    const timer = setInterval(() => loadKp(), REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (level > 0) root.dataset.aurora = String(level);
    else delete root.dataset.aurora;
  }, [level]);

  return null;
}
