document.documentElement.classList.add('js');

const state = { projects: [], filter: 'all' };
const grid = document.querySelector('#project-grid');
const projectCount = document.querySelector('#project-count');
const filters = [...document.querySelectorAll('.filter')];
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const backTop = document.querySelector('.back-top');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const projectPriority = ['web-shopping-platform', 'v-resq', 'fashion-ecommerce', 'badminton-pose-analysis'];

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[character]));

const initials = title => title.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase();
const projectHref = project => `projects/project.html?slug=${encodeURIComponent(project.slug)}`;

function coverMarkup(project) {
  if (!project.cover) {
    return `<div class="project-placeholder"><span>${escapeHtml(initials(project.title))}</span><strong>Project imagery needed</strong><small>${escapeHtml(project.missingImages?.[0] || 'Add a verified project screenshot.')}</small></div>`;
  }
  return `<img src="${escapeHtml(project.cover.src)}" srcset="${escapeHtml(project.cover.srcset)}" sizes="(max-width: 720px) calc(100vw - 28px), (max-width: 1180px) 50vw, 380px" alt="${escapeHtml(project.cover.alt)}" width="1600" height="900" loading="lazy" decoding="async">`;
}

function renderProjects() {
  if (!grid) return;
  const originalOrder = new Map(state.projects.map((project, index) => [project.slug, index]));
  const visible = state.projects
    .filter(project => state.filter === 'all' || (project.filters || [project.category]).includes(state.filter))
    .sort((first, second) => {
      const firstPriority = projectPriority.indexOf(first.slug);
      const secondPriority = projectPriority.indexOf(second.slug);
      const firstRank = firstPriority === -1 ? 100 + originalOrder.get(first.slug) : firstPriority;
      const secondRank = secondPriority === -1 ? 100 + originalOrder.get(second.slug) : secondPriority;
      return firstRank - secondRank;
    });
  projectCount.textContent = `${visible.length} project${visible.length === 1 ? '' : 's'}`;
  grid.innerHTML = visible.map((project, index) => `
    <article class="project-card${index === 0 ? ' project-card--featured' : ''}" data-project="${escapeHtml(project.slug)}" data-category="${escapeHtml((project.filters || [project.category]).join(' '))}">
      <a class="project-visual" href="${projectHref(project)}" aria-label="Open ${escapeHtml(project.title)} project details">
        ${coverMarkup(project)}
      </a>
      <div class="project-body">
        <div class="project-meta"><span>${escapeHtml(project.categoryLabel)}</span><span>${escapeHtml(project.year)}</span></div>
        <h3><a href="${projectHref(project)}">${escapeHtml(project.title)}</a></h3>
        <p>${escapeHtml(project.summary)}</p>
        <div class="tags">${project.technologies.slice(0, 4).map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')}</div>
        <div class="project-actions">
          <a class="project-link" href="${projectHref(project)}">View Project <span aria-hidden="true">→</span></a>
          ${project.github ? `<a class="github-link" href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">${escapeHtml(project.githubLabel || 'GitHub')} <span aria-hidden="true">↗</span></a>` : ''}
        </div>
      </div>
    </article>`).join('');

  if (!reduceMotion) {
    grid.querySelectorAll('.project-card').forEach((card, index) => card.animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 420, delay: Math.min(index * 35, 210), easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    ));
  }
}

function setFilter(nextFilter, updateUrl = true) {
  const allowed = ['all', ...filters.map(button => button.dataset.filter)];
  state.filter = allowed.includes(nextFilter) ? nextFilter : 'all';
  filters.forEach(button => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (updateUrl) {
    const url = new URL(window.location.href);
    state.filter === 'all' ? url.searchParams.delete('filter') : url.searchParams.set('filter', state.filter);
    history.replaceState({}, '', url);
  }
  renderProjects();
}

async function loadProjects() {
  if (!grid) return;
  if (Array.isArray(window.PORTFOLIO_PROJECTS)) {
    state.projects = window.PORTFOLIO_PROJECTS;
    setFilter(new URLSearchParams(location.search).get('filter') || 'all', false);
    return;
  }
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.projects = await response.json();
    setFilter(new URLSearchParams(location.search).get('filter') || 'all', false);
  } catch (error) {
    grid.innerHTML = '<p class="load-error">Project data could not load. Refresh the page or reopen index.html from the portfolio folder.</p>';
    projectCount.textContent = 'Projects unavailable';
  }
}

filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));

function closeNavigation({ restoreFocus = false } = {}) {
  navMenu?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open navigation menu');
  if (restoreFocus) navToggle?.focus();
}

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navToggle.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
  navMenu.classList.toggle('is-open', !open);
});

navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeNavigation()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navMenu?.classList.contains('is-open')) closeNavigation({ restoreFocus: true });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
const sectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px' }) : null;
sections.forEach(section => sectionObserver?.observe(section));

window.addEventListener('scroll', () => backTop?.classList.toggle('is-visible', window.scrollY > 600), { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
loadProjects();
