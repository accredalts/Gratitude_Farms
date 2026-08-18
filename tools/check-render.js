// Loads every route in a real browser at desktop and phone widths, and reports
// console errors, failed requests, horizontal overflow and nav/spacer drift.
//
// Needs the site running on 8899 — `npm run dev`, or `npm run build && npm run
// preview` to check what actually ships.
import puppeteer from 'puppeteer';

const ROUTES = [
  '/',
  '/about-us',
  '/our-team',
  '/services',
  '/services/managed-farmland',
  '/services/soil-fertility',
  '/services/farmland-design',
  '/services/farmland-operate',
  '/farmland-development',
  '/nakshatra-vanam',
  '/corporate-esg',
  '/sainya-krishi',
  '/medicinal-plants-trees',
  '/vriksh-ayurveda',
  '/blog',
  '/blog/what-makes-natural-farming-truly-natural',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/admin',
  '/admin/login',
  '/no-such-page'          // the 404 route still has to render a real page
];

// The console sits behind a login page, and what this pass wants to know is
// whether the console renders — so those routes are opened with the session
// already held, the way a signed-in visitor's browser holds it. `/admin/login`
// is left signed out so the gate itself is loaded too. The key is the one
// src/lib/admin-auth.js writes.
const SIGNED_IN = new Set(['/admin']);
const SESSION_KEY = 'gf-admin-session';
const SESSION_VALUE = 'krushna@sainyakrishi.com';

// A page under this many characters of text has almost certainly failed to
// render. The login page is a short form and is genuinely this small.
const MIN_TEXT = 400;
const MIN_TEXT_BY_ROUTE = { '/admin/login': 120 };

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844, isMobile: true }
];

const BASE = 'http://localhost:8899';
let problems = 0;

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

for (const vp of VIEWPORTS) {
  console.log(`\n===== ${vp.name} (${vp.width}px) =====`);

  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport(vp);

    const errs = [];
    const failed = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 160)));
    page.on('requestfailed', (r) => {
      // Fonts, YouTube and Maps are third-party; only our own files are ours to fix.
      if (r.url().startsWith(BASE)) failed.push(r.url().replace(BASE, ''));
    });

    try {
      if (SIGNED_IN.has(route)) {
        // sessionStorage is per-origin, so the session has to be written from a
        // page on it before the route under test is asked for.
        await page.goto(BASE + '/admin/login', { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.evaluate(
          (k, v) => window.sessionStorage.setItem(k, v), SESSION_KEY, SESSION_VALUE);
      }

      await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 900));   // let the data chunks settle

      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const main = document.querySelector('main');
        const nav = document.querySelector('nav');
        const spacer = document.querySelector('.gf-nav-spacer');
        return {
          title: document.title,
          textLen: (document.body.innerText || '').trim().length,
          overflow: de.scrollWidth - de.clientWidth,
          navH: nav ? Math.round(nav.getBoundingClientRect().height) : 0,
          spacerH: spacer ? Math.round(spacer.getBoundingClientRect().height) : 0,
          mainTop: main ? Math.round(main.getBoundingClientRect().top + window.scrollY) : 0,
          links: document.querySelectorAll('a[href]').length,
          buttons: document.querySelectorAll('button').length,
          imgsBroken: [...document.images]
            .filter((i) => i.complete && i.naturalWidth === 0)
            .map((i) => i.getAttribute('src'))
            .slice(0, 5),
          rootEmpty: !document.getElementById('root')?.firstElementChild
        };
      });

      const flags = [];
      if (info.rootEmpty) flags.push('React rendered nothing');
      const minText = MIN_TEXT_BY_ROUTE[route] ?? MIN_TEXT;
      if (info.textLen < minText) flags.push(`only ${info.textLen} chars rendered`);
      if (info.overflow > 2) flags.push(`page scrolls horizontally by ${info.overflow}px`);
      if (info.navH && info.spacerH && Math.abs(info.navH - info.spacerH) > 2) {
        flags.push(`nav ${info.navH}px vs spacer ${info.spacerH}px`);
      }
      if (info.imgsBroken.length) flags.push('broken images: ' + info.imgsBroken.join(', '));
      if (!info.title) flags.push('no document title');
      if (errs.length) flags.push('console: ' + errs.slice(0, 2).join(' | '));
      if (failed.length) flags.push('failed requests: ' + [...new Set(failed)].join(', '));

      if (flags.length) problems += flags.length;
      console.log(
        `${flags.length ? '✗' : '✓'} ${route.padEnd(48)} ${String(info.textLen).padStart(6)} chars ` +
        ` ${String(info.links).padStart(3)} links ${String(info.buttons).padStart(3)} btns  nav ${info.navH}/${info.spacerH}`
      );
      flags.forEach((f) => console.log(`    → ${f}`));
    } catch (e) {
      problems++;
      console.log(`✗ ${route.padEnd(48)} LOAD FAILED: ${e.message.slice(0, 100)}`);
    }
    await page.close();
  }
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)\n` : '\nClean\n');
process.exit(problems ? 1 : 0);
