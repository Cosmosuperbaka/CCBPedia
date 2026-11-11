import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page container">
      <div className="empty">
        <p className="serif" style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--ink)' }}>
          这一页猜不出来
        </p>
        <p style={{ margin: 'var(--sp-2) 0 var(--sp-4)' }}>没有找到你要的页面。</p>
        <Link className="link" to="/">
          ← 回到首页
        </Link>
      </div>
    </div>
  );
}
