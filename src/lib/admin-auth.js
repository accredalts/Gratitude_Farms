/**
 * The console's accounts and session.
 *
 * There is no server behind this site — it is static files on GitHub Pages — so
 * everything here happens in the visitor's browser. Two consequences are worth
 * knowing before trusting it with anything:
 *
 *   · the founder credential below ships inside the JavaScript bundle, so
 *     anyone who opens the bundle can read it, and
 *   · an account an admin adds is written to that browser's localStorage, so it
 *     exists on that computer only — it does not follow the person to another
 *     machine, and clearing site data removes it.
 *
 * It is a lock on a door, not a wall. The day the console talks to a real
 * backend, this file is the seam to replace: the same functions, answered by the
 * server, with the passwords hashed on it rather than kept as text here.
 */

/**
 * The founder account. It ships with the site, which makes it the one account
 * always present — a browser with an empty store would otherwise have no way in
 * — so it cannot be removed, and it cannot be edited from the console either:
 * it lives in this file, not in any browser.
 */
const OWNER = {
  name: 'Krushna',
  email: 'krushna@sainyakrishi.com',
  password: '***REMOVED***',
  role: 'Admin'
};

export const ADMIN_ROLE = 'Admin';
export const MEMBER_ROLE = 'Member';

/** Admins can manage the team; members get everything else. */
export const ROLES = [MEMBER_ROLE, ADMIN_ROLE];

export const MIN_PASSWORD = 8;

// The session goes in sessionStorage — closing the tab signs you out, so a
// shared machine is not left open. The accounts go in localStorage, because they
// are meant to outlive the visit.
const SESSION_KEY = 'gf-admin-session';
const USERS_KEY = 'gf-admin-users';

// Deliberately loose: the point is to catch a typo, not to adjudicate RFC 5322.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Storage access can throw outright — Safari's private mode does — and a console
 * that cannot remember anything is still better than a page that will not
 * render, so every caller treats a missing store as "empty".
 */
function session() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function vault() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** An address as it is compared and stored: trimmed and lower-case. */
const clean = (email) => String(email ?? '').trim().toLowerCase();

const fail = (error) => ({ ok: false, error });

/** The same date format the rest of the console shows, e.g. "Aug 17, 2026". */
function today() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * The added accounts. A store that has been hand-edited, half-written or left
 * over from an older shape should not take the console down, so every record is
 * checked and normalised on the way out rather than trusted.
 */
function readUsers() {
  try {
    const raw = vault()?.getItem(USERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];

    return list
      .filter((u) => u && typeof u.email === 'string' && typeof u.password === 'string')
      .map((u) => ({
        name: String(u.name || ''),
        email: clean(u.email),
        password: u.password,
        role: ROLES.includes(u.role) ? u.role : MEMBER_ROLE,
        added: String(u.added || '')
      }))
      .filter((u) => u.email !== OWNER.email);   // the founder is never a stored record
  } catch {
    return [];
  }
}

/** False when the browser refused the write — a full or locked-down store. */
function writeUsers(list) {
  try {
    vault()?.setItem(USERS_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** The full record for an address, password included, or null. */
function find(email) {
  const wanted = clean(email);
  if (wanted === OWNER.email) return { ...OWNER, isOwner: true };

  const hit = readUsers().find((u) => u.email === wanted);
  return hit ? { ...hit, isOwner: false } : null;
}

/* ------------------------------------------------------------------ session */

/** True when the credential matches an account; the session opens as a result. */
export function signIn(email, password) {
  const account = find(email);

  // The email is matched leniently — case and stray whitespace are how a real
  // person types an address — while the password is compared exactly.
  if (!account || String(password) !== account.password) return false;

  session()?.setItem(SESSION_KEY, account.email);
  return true;
}

export function signOut() {
  session()?.removeItem(SESSION_KEY);
}

/** The signed-in address, or null. */
export function currentAdmin() {
  return session()?.getItem(SESSION_KEY) || null;
}

/**
 * The signed-in account, or null. An account that has been removed since the
 * session opened resolves to null here, which is what closes the console behind
 * the person who was using it.
 */
export function currentUser() {
  const email = currentAdmin();
  if (!email) return null;

  const account = find(email);
  if (!account) return null;

  return { name: account.name, email: account.email, role: account.role, isOwner: !!account.isOwner };
}

export function isSignedIn() {
  return currentUser() !== null;
}

/** Only admins may add and remove people. */
export function canManageTeam(user) {
  return !!user && user.role === ADMIN_ROLE;
}

/* ------------------------------------------------------------------- people */

/**
 * Every account, founder first. Passwords are deliberately left out: nothing in
 * the console needs to read one back, and a list that does not carry them cannot
 * put one on screen by accident.
 */
export function listUsers() {
  return [
    { name: OWNER.name, email: OWNER.email, role: OWNER.role, added: 'Founder account', isOwner: true },
    ...readUsers().map((u) => ({ name: u.name, email: u.email, role: u.role, added: u.added, isOwner: false }))
  ];
}

export function addUser({ name, email, password, role } = {}) {
  const person = String(name ?? '').trim();
  const address = clean(email);

  if (!person) return fail('Give this person a name.');
  if (!EMAIL_SHAPE.test(address)) return fail('That does not look like an email address.');
  if (find(address)) return fail(address + ' already has an account.');
  if (String(password ?? '').length < MIN_PASSWORD) {
    return fail(`The password needs at least ${MIN_PASSWORD} characters.`);
  }

  const list = readUsers();
  list.unshift({
    name: person,
    email: address,
    password: String(password),
    role: ROLES.includes(role) ? role : MEMBER_ROLE,
    added: today()
  });

  if (!writeUsers(list)) return fail('This browser would not save the account.');
  return { ok: true };
}

/**
 * Changes an added account. An absent or empty `password` leaves the existing
 * one alone, so an admin can correct a name or a role without knowing it.
 */
export function updateUser(email, patch = {}) {
  const target = clean(email);
  if (target === OWNER.email) {
    return fail('The founder account is set in the site’s code and cannot be edited here.');
  }

  const list = readUsers();
  const index = list.findIndex((u) => u.email === target);
  if (index === -1) return fail('That account no longer exists.');

  const current = list[index];
  const person = String(patch.name ?? current.name).trim();
  const address = patch.email === undefined ? current.email : clean(patch.email);
  const password = patch.password ? String(patch.password) : null;

  if (!person) return fail('Give this person a name.');
  if (!EMAIL_SHAPE.test(address)) return fail('That does not look like an email address.');
  if (address !== target && find(address)) return fail(address + ' already has an account.');
  if (password && password.length < MIN_PASSWORD) {
    return fail(`The password needs at least ${MIN_PASSWORD} characters.`);
  }

  list[index] = {
    ...current,
    name: person,
    email: address,
    role: ROLES.includes(patch.role) ? patch.role : current.role,
    password: password || current.password
  };

  if (!writeUsers(list)) return fail('This browser would not save the change.');

  // Re-addressing the account you are signed in as would otherwise strand the
  // session on an address that no longer resolves.
  if (clean(currentAdmin()) === target) session()?.setItem(SESSION_KEY, address);

  return { ok: true };
}

export function removeUser(email) {
  const target = clean(email);

  if (target === OWNER.email) return fail('The founder account cannot be removed.');
  if (target === clean(currentAdmin())) return fail('You cannot remove the account you are signed in as.');

  const list = readUsers();
  const remaining = list.filter((u) => u.email !== target);
  if (remaining.length === list.length) return fail('That account no longer exists.');
  if (!writeUsers(remaining)) return fail('This browser would not save the change.');

  return { ok: true };
}
