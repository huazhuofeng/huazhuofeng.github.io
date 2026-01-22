(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');

  const getPreferredTheme = () => {
    try {
      return localStorage.getItem('preferred-theme');
    } catch (error) {
      return null;
    }
  };

  const setPreferredTheme = (value) => {
    try {
      localStorage.setItem('preferred-theme', value);
    } catch (error) {
      // silent fallback
    }
  };

  const applyTheme = (value) => {
    root.setAttribute('data-theme', value);
    setPreferredTheme(value);
  };

  const initializeTheme = () => {
    const stored = getPreferredTheme();
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = stored || (systemDark ? 'dark' : 'light');
    root.setAttribute('data-theme', defaultTheme);
  };

  const toggleTheme = () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Highlight author name in publications
  const highlightAuthorName = () => {
    const authorElements = document.querySelectorAll('.authors');
    authorElements.forEach(el => {
      const text = el.innerHTML;
      el.innerHTML = text.replace(/Feng H/g, '<span class="author-highlight">Feng H</span>');
    });
  };

  initializeTheme();
  highlightAuthorName();

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
})();
