// 整站框架：顶栏导航、主题切换、路由切换过渡、页脚
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './Layout.css';

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/tournaments', label: '赛事' },
  { to: '/players', label: '选手' },
  { to: '/rankings', label: '榜单' },
];

const GAME_URL = 'https://ccb.baka.website';
const ICON = `${import.meta.env.BASE_URL}brand/icon.jpg`;

type Theme = 'light' | 'dark';

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  // 只有用户手动切换时才记住选择；否则一直跟随系统
  const toggle = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('ccbpedia-theme', next);
      } catch {
        // 隐私模式下可能写不进去，忽略即可
      }
      return next;
    });
  return [theme, toggle];
}

function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? '切换到浅色主题' : '切换到深色主题'}
      title={dark ? '切换到浅色主题' : '切换到深色主题'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={theme}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
          transition={{ duration: 0.18 }}
        >
          {dark ? (
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}

export function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 旧页面淡出完成后瞬间回到顶部（全局开了平滑滚动，这里必须用 instant，否则会停在半路）
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

  return (
    <div className="shell">
      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container topbar__inner">
          <Link to="/" className="brand" aria-label="CCBPedia 首页">
            <img className="brand__icon" src={ICON} alt="" width={30} height={30} />
            <span className="brand__name serif">
              CCB<span className="brand__accent">Pedia</span>
            </span>
          </Link>

          <nav className="nav" aria-label="主导航">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav__link">
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="nav__underline"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__tools">
            <a className="play-link" href={GAME_URL} target="_blank" rel="noreferrer">
              去玩一把
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M4 2h6v6M10 2 2.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="shell__main">
        <AnimatePresence mode="wait" initial={false} onExitComplete={scrollTop}>
          <motion.div
            key={location.pathname}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <p className="footer__title serif">CCBPedia</p>
            <p className="faint">「二刺猿笑传之猜猜呗」赛事数据百科 · 数据由赛事主办方与群友整理</p>
          </div>
          <a className="footer__link" href={GAME_URL} target="_blank" rel="noreferrer">
            ccb.baka.website
          </a>
        </div>
      </footer>
    </div>
  );
}
