import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

/*
 * 終端機彩蛋：按 ` 開啟（手機連點 logo 五下）
 * 純前端、唯讀：只讀取本站公開頁面，輸出一律當純文字顯示，不會寫入任何資料
 */

const SITE_BIRTHDAY = new Date('2025-08-12');

const SQUIRREL_ART = [
  '   .-.      /\\  ',
  '  (   \\    / o\\ ',
  '   \\   \\__/  _/ ',
  '    )   (   (   ',
  '   (_____)__)_) ',
];

const HELP = [
  '可用指令：',
  '  ls [路徑]           列出內容',
  '  cd <路徑>           切換資料夾（~ 回家，.. 上一層）',
  '  pwd                 顯示目前位置',
  '  open <路徑>         打開頁面',
  '  cat <路徑>          顯示文章標題和摘要',
  '  random              隨機打開一篇',
  '  search <關鍵字>     全站搜尋',
  '  theme [light|dark]  切換深淺色',
  '  whoami              我是誰',
  '  squirrelfetch       網站資訊',
  '  history             指令紀錄',
  '  clear               清除畫面',
  '  exit                關閉終端機',
  '',
  '小技巧：Tab 自動補全，↑ ↓ 翻找之前的指令',
];

const WHOAMI = [
  'Taipei squirrel',
  '大概是個研究有興趣的各種知識的人',
  '興趣：遊戲、動畫、閱讀、樹莓派 & Arduino、天文',
  '願望：有一天能看到極光',
  '',
  '想知道更多 → open docs/intro',
];

const COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'open', 'cat', 'random', 'search',
  'theme', 'whoami', 'squirrelfetch', 'history', 'clear', 'exit',
];

const PATH_COMMANDS = ['ls', 'cd', 'cat', 'open'];

function dir(page) {
  return {type: 'dir', page, children: {}};
}

/* 依照頁面網址建立資料夾結構 */
function addPage(root, segments, page) {
  let node = root;
  segments.slice(0, -1).forEach((name) => {
    node.children[name] = node.children[name] || dir();
    node = node.children[name];
  });
  node.children[segments[segments.length - 1]] = {type: 'file', page};
}

function buildTree(allDocsData) {
  const root = dir();
  const sections = {docs: 'default', game: 'game-docs'};
  Object.entries(sections).forEach(([name, pluginId]) => {
    const section = dir();
    root.children[name] = section;
    const plugin = allDocsData[pluginId];
    if (!plugin) return;
    const base = plugin.path.replace(/\/$/, '');
    plugin.versions[0].docs.forEach((doc) => {
      const rest = doc.path.slice(base.length).replace(/^\/|\/$/g, '');
      if (rest === '') {
        section.page = doc.path;
      } else {
        addPage(section, rest.split('/'), doc.path);
      }
    });
  });
  root.children.blog = dir('/blog');
  root.children['.secret'] = {
    type: 'file',
    text: [
      '恭喜你找到了松鼠的秘密 🌰',
      '其實松鼠常常忘記自己把堅果藏在哪裡，',
      '所以森林裡才會長出那麼多樹。',
    ],
  };
  return root;
}

function resolve(root, cwd, arg) {
  const parts = arg.startsWith('~') || arg.startsWith('/') ? [] : [...cwd];
  for (const seg of arg.replace(/^~/, '').split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      parts.pop();
      continue;
    }
    parts.push(seg);
  }
  let node = root;
  for (const seg of parts) {
    node = node.type === 'dir' ? node.children[seg] : undefined;
    if (!node) return null;
  }
  return {node, parts};
}

/* 列出資料夾底下所有文章（不含 Blog 列表這類目錄頁） */
function listPages(node, out = []) {
  if (node.type === 'file' && node.page) out.push(node.page);
  if (node.type === 'dir') {
    Object.entries(node.children)
      .filter(([name]) => !name.startsWith('.'))
      .forEach(([, child]) => listPages(child, out));
  }
  return out;
}

function commonPrefix(words) {
  return words.reduce((a, b) => {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(0, i);
  });
}

/* 切換深淺色：按導覽列原本的切換按鈕，讓 Docusaurus 自己處理 */
function setTheme(target) {
  const button = document.querySelector('.navbar button[class*="toggleButton"]');
  let tries = 0;
  (function step() {
    if (!button || document.documentElement.dataset.theme === target || tries++ > 3) return;
    button.click();
    setTimeout(step, 60);
  })();
}

function isTyping(target) {
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

let lineId = 0;

export default function SquirrelTerminal() {
  const history = useHistory();
  const location = useLocation();
  const {siteConfig, siteMetadata} = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  const tree = useMemo(() => buildTree(allDocsData), [allDocsData]);
  const blogLoading = useRef(null);

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState([]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const prompt = `squirrel@chwe12:~${cwd.length ? '/' + cwd.join('/') : ''}$`;

  const print = useCallback((text, kind = 'out') => {
    const list = Array.isArray(text) ? text : [text];
    setLines((prev) => [...prev, ...list.map((t) => ({id: lineId++, kind, text: t}))]);
  }, []);

  /* Blog 文章清單從本站的歸檔頁讀取（只讀） */
  const loadBlog = useCallback(() => {
    if (!blogLoading.current) {
      blogLoading.current = fetch('/blog/archive')
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          doc.querySelectorAll('main li a[href^="/blog/"]').forEach((a) => {
            const href = a.getAttribute('href');
            const name = href.replace(/^\/blog\//, '').replace(/\//g, '-');
            if (name) tree.children.blog.children[name] = {type: 'file', page: href};
          });
        })
        .catch(() => {
          blogLoading.current = null;
        });
    }
    return blogLoading.current;
  }, [tree]);

  /* 開啟方式：按 `，或連點 logo 五下（手機用） */
  useEffect(() => {
    let taps = [];

    function onKeyDown(e) {
      if (isTyping(e.target)) return;
      if (e.code === 'Backquote' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setOpen(true);
      }
    }

    function onClick(e) {
      if (!(e.target.closest && e.target.closest('.navbar__logo'))) return;
      const now = Date.now();
      taps = [...taps.filter((time) => now - time < 2000), now];
      if (taps.length >= 5) {
        taps = [];
        setOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (lines.length === 0) {
      print(['🐿️  歡迎來到松鼠終端機 squirrel-sh', '輸入 help 查看指令，Esc 或 exit 關閉', '']);
    }
    inputRef.current?.focus();
    loadBlog();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, open]);

  /* 換頁後 Docusaurus 會把焦點移走，搶回來讓人可以繼續打字 */
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 焦點不在終端機時也能按 Esc 關閉 */
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  async function run(raw) {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args.join(' ');
    if (!cmd) return;
    if ([...PATH_COMMANDS, 'random', 'squirrelfetch'].includes(cmd)) {
      await loadBlog();
    }

    switch (cmd) {
      case 'help':
        print(HELP);
        break;

      case 'ls': {
        const showHidden = args.includes('-a');
        const target = args.filter((a) => !a.startsWith('-')).join(' ');
        const found = resolve(tree, cwd, target);
        if (!found) return print(`ls: 找不到 '${target}'`, 'err');
        if (found.node.type === 'file') return print(found.parts[found.parts.length - 1]);
        const items = Object.entries(found.node.children)
          .filter(([name]) => showHidden || !name.startsWith('.'))
          .map(([name, node]) => (node.type === 'dir' ? `${name}/` : name));
        print(items.length ? items.join('   ') : '（空的）', 'list');
        break;
      }

      case 'cd': {
        const found = resolve(tree, cwd, arg || '~');
        if (!found) return print(`cd: 找不到 '${arg}'`, 'err');
        if (found.node.type !== 'dir') {
          return print(`cd: '${arg}' 不是資料夾，試試 open ${arg}`, 'err');
        }
        setCwd(found.parts);
        if (found.node.page) history.push(found.node.page);
        break;
      }

      case 'pwd':
        print(`~${cwd.length ? '/' + cwd.join('/') : ''}`);
        break;

      case 'open': {
        if (!arg) return print('open: 要打開哪一頁？例如 open docs/intro', 'err');
        const found = resolve(tree, cwd, arg);
        if (!found) return print(`open: 找不到 '${arg}'`, 'err');
        if (!found.node.page) return print(`open: '${arg}' 沒有頁面可以打開，試試 ls ${arg}`, 'err');
        print(`→ ${found.node.page}`);
        history.push(found.node.page);
        break;
      }

      case 'cat': {
        if (!arg) return print('cat: 要看哪一篇？例如 cat docs/intro', 'err');
        const found = resolve(tree, cwd, arg);
        if (!found) return print(`cat: 找不到 '${arg}'`, 'err');
        if (found.node.text) return print(found.node.text);
        if (!found.node.page) return print(`cat: '${arg}' 是資料夾`, 'err');
        try {
          const html = await (await fetch(found.node.page)).text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const title = doc.querySelector('main h1, article h1')?.textContent || doc.title;
          const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          print([`# ${title.trim()}`, desc.trim(), '', `→ open ${arg} 看全文`]);
        } catch {
          print('cat: 讀取失敗，稍後再試', 'err');
        }
        break;
      }

      case 'random': {
        const pages = listPages(tree);
        const page = pages[Math.floor(Math.random() * pages.length)];
        print(`🎲 → ${page}`);
        history.push(page);
        break;
      }

      case 'search':
        if (!arg) return print('search: 要搜尋什麼？例如 search 樹莓派', 'err');
        history.push(`/search?q=${encodeURIComponent(arg)}`);
        break;

      case 'theme': {
        const current = document.documentElement.dataset.theme;
        if (!arg) return print(`目前是 ${current} 模式（theme light / theme dark）`);
        if (!['light', 'dark'].includes(arg)) return print('theme: 只有 light 和 dark 喔', 'err');
        setTheme(arg);
        print(arg === 'dark' ? '🌙 晚安模式' : '☀️ 早安模式');
        break;
      }

      case 'whoami':
        print(WHOAMI);
        break;

      case 'squirrelfetch': {
        const count = (name) => listPages(tree.children[name]).length;
        const days = Math.floor((Date.now() - SITE_BIRTHDAY) / 86400000);
        const info = [
          'squirrel@chwe12',
          '---------------',
          `Site:    ${siteConfig.title}`,
          `Docs:    ${count('docs')} 篇`,
          `Blog:    ${count('blog')} 篇`,
          `Game:    ${count('game')} 篇`,
          `Uptime:  ${days} 天`,
          `Engine:  Docusaurus ${siteMetadata.docusaurusVersion}`,
          'Shell:   squirrel-sh 1.0',
        ];
        const blank = ' '.repeat(SQUIRREL_ART[0].length);
        print(info.map((text, i) => `${SQUIRREL_ART[i] || blank}  ${text}`), 'pre');
        break;
      }

      case 'history':
        print(cmdHistory.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`));
        break;

      case 'clear':
        setLines([]);
        break;

      case 'exit':
        setOpen(false);
        break;

      /* 隱藏指令 */
      case 'squirrel':
        window.dispatchEvent(new Event('squirrel:run'));
        print('🐿️ 咻——');
        break;

      case 'sudo':
        print('松鼠拒絕了你的請求。這裡松鼠最大。', 'err');
        break;

      case 'rm':
        print('堅果已經藏好了，你刪不掉的 🌰', 'err');
        break;

      case 'vim':
      case 'vi':
      case 'nano':
        print(['~', '~', '~', '"squirrel.txt" [唯讀]', '', '（放心，你沒有被困住）']);
        break;

      case 'hi':
      case 'hello':
        print('嗨！要來點堅果嗎？🌰');
        break;

      default:
        print(`squirrel-sh: 找不到指令 '${cmd}'，輸入 help 看看`, 'err');
    }
  }

  async function complete() {
    const tokens = input.split(' ');
    if (tokens.length === 1) {
      const matches = COMMANDS.filter((c) => c.startsWith(tokens[0]));
      if (matches.length === 1) setInput(`${matches[0]} `);
      else if (matches.length > 1) print(matches.join('   '), 'list');
      return;
    }
    if (!PATH_COMMANDS.includes(tokens[0])) return;
    await loadBlog();
    const last = tokens[tokens.length - 1];
    const dirPart = last.slice(0, last.lastIndexOf('/') + 1);
    const prefix = last.slice(dirPart.length);
    const found = resolve(tree, cwd, dirPart);
    if (!found || found.node.type !== 'dir') return;
    const matches = Object.entries(found.node.children)
      .filter(([name]) => name.startsWith(prefix) && (prefix.startsWith('.') || !name.startsWith('.')))
      .map(([name, node]) => (node.type === 'dir' ? `${name}/` : name));
    if (matches.length === 0) return;
    if (matches.length > 1) print(matches.join('   '), 'list');
    tokens[tokens.length - 1] = dirPart + commonPrefix(matches);
    setInput(tokens.join(' '));
  }

  function onInputKeyDown(e) {
    if (e.key === 'Enter') {
      print(`${prompt} ${input}`, 'cmd');
      if (input.trim()) setCmdHistory((prev) => [...prev, input.trim()]);
      setInput('');
      setHistoryIndex(null);
      run(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const from = historyIndex === null ? cmdHistory.length : historyIndex;
      const i = e.key === 'ArrowUp' ? Math.max(0, from - 1) : from + 1;
      setHistoryIndex(i >= cmdHistory.length ? null : i);
      setInput(i >= cmdHistory.length ? '' : cmdHistory[i]);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key === 'c' && !window.getSelection().toString()) {
      print(`${prompt} ${input}^C`, 'cmd');
      setInput('');
    }
  }

  if (!open) return null;

  return (
    <div className={styles.terminal} role="dialog" aria-label="松鼠終端機">
      <div className={styles.titleBar}>
        <span>squirrel-sh</span>
        <button
          type="button"
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="關閉終端機">
          ×
        </button>
      </div>
      <div className={styles.body} ref={bodyRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((line) => (
          <div key={line.id} className={styles[line.kind]}>
            {line.text || '\u00a0'}
          </div>
        ))}
        <div className={styles.inputLine}>
          <span className={styles.prompt}>{prompt}</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="輸入指令"
          />
        </div>
      </div>
    </div>
  );
}
