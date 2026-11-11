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
const REPO_URL = 'https://github.com/Cosmosuperbaka/CCBPedia';
const ICON = `${import.meta.env.BASE_URL}brand/icon.jpg`;

/** Claude 的星芒标识 */
function ClaudeMark() {
  return (
    <svg className="claude-mark" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  );
}

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
          <p className="footer__title serif">CCBPedia</p>
          <p className="footer__links">
            <a className="footer__link" href={REPO_URL} target="_blank" rel="noreferrer">
              源码 · AGPL-3.0
            </a>
            <a className="footer__link footer__made" href="https://claude.ai" target="_blank" rel="noreferrer">
              <ClaudeMark />由 Claude 制作
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
