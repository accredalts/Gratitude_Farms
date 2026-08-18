import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { A, Hov, Seo } from '../lib/ui.jsx';
import { css } from '../lib/css.js';
import { isSignedIn, signIn } from '../lib/admin-auth.js';

/**
 * The one page between the footer's "Admin Login" link and the console.
 *
 * It deliberately does not wear the site's nav and footer: this is a door into a
 * tool, so it borrows the console's own ground colour and leaves a single way
 * back out to the website.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState('');

  // `body.gf-admin` is the console's background. Setting it here means the
  // colour reaches the overscroll area too, not just this page's box.
  useEffect(() => {
    document.body.classList.add('gf-admin');
    return () => document.body.classList.remove('gf-admin');
  }, []);

  // Where the guard turned the visitor away from, so a deep link into the
  // console resumes rather than always landing on the dashboard.
  const from = location.state?.from || '/admin';

  // Someone already through has no reason to see the door again.
  if (isSignedIn()) return <Navigate to={from} replace />;

  function onSubmit(event) {
    event.preventDefault();

    if (signIn(email, password)) {
      navigate(from, { replace: true });
      return;
    }

    // One message for both fields: saying which half was wrong tells an
    // outsider which half to keep guessing at.
    setError('That email and password do not match an account.');
    setPassword('');
  }

  return (
    <>
      <Seo
        title="Admin Login | Gratitude Farms"
        description="Sign in to the Gratitude Farms admin console."
      />
      <main style={css("font-family:'Hanken Grotesk',sans-serif;min-height:100vh;background:#F0EDE8;display:flex;align-items:center;justify-content:center;padding:clamp(36px,8vw,72px) 20px;box-sizing:border-box;")}>
        <div style={css("width:100%;max-width:432px;")}>
          <A href="/" style={css("display:flex;align-items:center;justify-content:center;gap:11px;text-decoration:none;")}>
            <img src="/assets/logo-badge.png" alt="" style={css("width:42px;height:42px;object-fit:contain;")} />
            <span style={css("font-family:'Source Serif 4',serif;font-size:20px;font-weight:700;color:#1A3C34;")}>
              Gratitude Farms
            </span>
          </A>

          <form
            onSubmit={onSubmit}
            style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:18px;padding:clamp(26px,5vw,36px);margin-top:26px;box-shadow:0 18px 44px rgba(26,60,52,0.09);")}
          >
            <span style={css("font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#C5A059;text-transform:uppercase;")}>
              Admin Console
            </span>
            <h1 style={css("font-family:'Source Serif 4',serif;font-size:27px;color:#1A3C34;margin:10px 0 8px;line-height:1.2;")}>
              Sign in
            </h1>
            <p style={css("color:#717976;font-size:14px;line-height:1.65;margin:0 0 24px;")}>
              This console is for Gratitude Farms staff. Enter your credentials to continue.
            </p>

            {error ? (
              <div
                role="alert"
                style={css("background:#fdf1ee;border:1px solid #e7c3b8;border-radius:10px;padding:12px 14px;color:#8c3a22;font-size:13.5px;line-height:1.55;margin-bottom:20px;")}
              >
                {error}
              </div>
            ) : null}

            <label htmlFor="adm-email" style={css("display:block;font-size:13px;font-weight:700;color:#1A3C34;margin-bottom:7px;")}>
              Email address
            </label>
            <input
              id="adm-email"
              className="adm-input"
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="username"
              autoFocus
              required
              aria-invalid={error ? 'true' : undefined}
              placeholder="you@gratitudefarms.co.in"
              style={css("padding:13px 14px;font-size:15px;")}
            />

            <label htmlFor="adm-password" style={css("display:block;font-size:13px;font-weight:700;color:#1A3C34;margin:18px 0 7px;")}>
              Password
            </label>
            <div style={css("position:relative;")}>
              <input
                id="adm-password"
                className="adm-input"
                type={reveal ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                required
                aria-invalid={error ? 'true' : undefined}
                placeholder="••••••••"
                style={css("padding:13px 68px 13px 14px;font-size:15px;")}
              />
              <button
                type="button"
                onClick={() => setReveal(!reveal)}
                aria-pressed={reveal}
                style={css("position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;padding:8px 10px;color:#1A3C34;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")}
              >
                {reveal ? 'Hide' : 'Show'}
              </button>
            </div>

            <Hov
              as="button"
              type="submit"
              style={css("width:100%;margin-top:26px;background:#1A3C34;color:#fff;border:none;border-radius:12px;padding:15px 20px;font-size:14.5px;font-weight:700;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")}
              hoverStyle={css("background:#C5A059;color:#1A3C34;")}
            >
              Sign in to console
            </Hov>

            <p style={css("color:#8b938f;font-size:12.5px;line-height:1.6;margin:18px 0 0;text-align:center;")}>
              Lost your password? Ask a site administrator to reset it for you.
            </p>
          </form>

          <div style={css("text-align:center;margin-top:22px;")}>
            <A href="/" style={css("color:#414846;text-decoration:none;font-size:13.5px;font-weight:600;")} hoverStyle={css("color:#C5A059;")}>
              ↩ Back to website
            </A>
          </div>
        </div>
      </main>
    </>
  );
}
