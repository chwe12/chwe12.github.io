import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/* 彩蛋按鍵：↑↑↓↓←→←→ */
const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
];

function isTyping(target) {
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

/* 重新觸發 CSS 動畫 */
function replay(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

export default function SquirrelEasterEgg() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let progress = 0;

    function onKeyDown(e) {
      if (isTyping(e.target)) return;
      if (e.key === SEQUENCE[progress]) {
        progress++;
      } else if (e.key !== 'ArrowUp') {
        progress = 0;
      } else if (progress !== 2) {
        progress = 1;
      }
      if (progress === SEQUENCE.length) {
        progress = 0;
        setRunning(true);
      }
    }

    /* 點導覽列的松鼠 logo 會跳一下 */
    function onClick(e) {
      const logo = e.target.closest && e.target.closest('.navbar__logo');
      if (logo) replay(logo, styles.hop);
    }

    function onAnimationEnd(e) {
      if (e.target.classList.contains(styles.hop)) {
        e.target.classList.remove(styles.hop);
      }
    }

    /* 終端機的 squirrel 指令也會叫松鼠出來 */
    function onRun() {
      setRunning(true);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('squirrel:run', onRun);
    document.addEventListener('click', onClick);
    document.addEventListener('animationend', onAnimationEnd);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('squirrel:run', onRun);
      document.removeEventListener('click', onClick);
      document.removeEventListener('animationend', onAnimationEnd);
    };
  }, []);

  if (!running) return null;

  return (
    <div
      className={styles.runner}
      aria-hidden="true"
      onAnimationEnd={(e) => e.target === e.currentTarget && setRunning(false)}>
      <svg className={styles.squirrel} viewBox="0 0 64 64">
        <mask id="squirrel-runner-eye">
          <rect width="64" height="64" fill="#fff" />
          <circle cx="47" cy="25" r="1.6" fill="#000" />
        </mask>
        <g mask="url(#squirrel-runner-eye)">
          <path
            className={styles.tail}
            d="M30 54C12 54 4 40 7 26 10 13 22 6 31 11c4 2.5 4 8-1 8.5-6 .5-11 5-11 12 0 9 6 13 13 15z"
          />
          <ellipse cx="37" cy="43" rx="10" ry="11.5" />
          <circle cx="44" cy="27" r="8" />
          <path d="M41 21l3-8 4 7z" />
          <ellipse cx="44" cy="54" rx="6" ry="2.2" />
        </g>
      </svg>
    </div>
  );
}
