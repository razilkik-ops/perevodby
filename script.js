const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const themeToggle = document.getElementById('theme-toggle');
const themeState = document.getElementById('theme-state');
const root = document.documentElement;
const themeStorageKey = 'perevodby-theme';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const getSavedTheme = () => {
  try {
    const value = localStorage.getItem(themeStorageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // localStorage can be unavailable in restrictive browser modes.
  }
};

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  if (themeState) {
    themeState.textContent = isDark ? 'Темная' : 'Светлая';
  }
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'
    );
  }
};

const initializeTheme = () => {
  const savedTheme = getSavedTheme();
  const initialTheme = savedTheme || (mediaQuery.matches ? 'dark' : 'light');
  applyTheme(initialTheme);
};

initializeTheme();

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const opened = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

if (typeof mediaQuery.addEventListener === 'function') {
  mediaQuery.addEventListener('change', (event) => {
    if (!getSavedTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
}

const revealItems = document.querySelectorAll('.section-reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
