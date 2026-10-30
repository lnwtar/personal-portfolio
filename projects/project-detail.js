const slug = new URLSearchParams(location.search).get('slug');
const $ = selector => document.querySelector(selector);
const asset = path => `../${path}`;
const galleryState = { items: [], index: 0, lastFocus: null };

function fillList(selector, items, ordered = false) {
  const target = $(selector);
  target.replaceChildren(...items.map((item, index) => {
    const element = document.createElement('li');
    if (ordered) element.dataset.step = String(index + 1).padStart(2, '0');
    element.textContent = item;
    return element;
  }));
}

function imageMarkup(item, { eager = false } = {}) {
  const image = document.createElement('img');
  image.src = asset(item.src);
  if (item.srcset) image.srcset = item.srcset.split(', ').map(entry => `../${entry}`).join(', ');
  image.sizes = '(max-width: 900px) calc(100vw - 28px), 700px';
  image.alt = item.alt || '';
  image.width = 1600;
  image.height = 900;
  image.decoding = 'async';
  image.loading = eager ? 'eager' : 'lazy';
  if (eager) image.fetchPriority = 'high';
  return image;
}

function updateGallery(nextIndex) {
  const total = galleryState.items.length;
  if (!total) return;
  galleryState.index = (nextIndex + total) % total;
  const item = galleryState.items[galleryState.index];
  const active = $('#gallery-active');
  active.src = asset(item.src);
  active.srcset = item.srcset ? item.srcset.split(', ').map(entry => `../${entry}`).join(', ') : '';
  active.alt = item.alt || '';
  $('#gallery-caption').textContent = item.caption || item.alt || '';
  $('#gallery-counter').textContent = `${galleryState.index + 1} / ${total}`;
  $('#gallery-status').textContent = `${total} verified image${total === 1 ? '' : 's'}`;
  document.querySelectorAll('.gallery-thumb').forEach((button, index) => {
    const current = index === galleryState.index;
    button.classList.toggle('is-current', current);
    button.setAttribute('aria-current', current ? 'true' : 'false');
  });
  const lightbox = $('#lightbox');
  if (lightbox.open) {
    const full = $('#lightbox-image');
    full.src = asset(item.src);
    full.srcset = active.srcset;
    full.alt = item.alt || '';
    $('#lightbox-caption').textContent = `${galleryState.index + 1} / ${total} — ${item.caption || item.alt || ''}`;
  }
}

function setupGallery(items) {
  galleryState.items = items || [];
  const viewer = $('#gallery-viewer');
  if (!galleryState.items.length) {
    viewer.hidden = true;
    $('#gallery-status').textContent = 'No verified gallery images yet';
    return;
  }

  viewer.hidden = false;
  const thumbs = $('#gallery-thumbs');
  thumbs.replaceChildren(...galleryState.items.map((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumb';
    button.setAttribute('aria-label', `Show image ${index + 1}: ${item.caption || item.alt || ''}`);
    const image = imageMarkup({ ...item, src: item.src.replace('-1600.webp', '-960.webp'), srcset: '' });
    image.width = 240;
    image.height = 135;
    button.append(image);
    button.addEventListener('click', () => updateGallery(index));
    return button;
  }));

  $('#gallery-prev').addEventListener('click', () => updateGallery(galleryState.index - 1));
  $('#gallery-next').addEventListener('click', () => updateGallery(galleryState.index + 1));
  $('#lightbox-prev').addEventListener('click', () => updateGallery(galleryState.index - 1));
  $('#lightbox-next').addEventListener('click', () => updateGallery(galleryState.index + 1));
  updateGallery(0);
  addSwipe($('#gallery-open'));
  addSwipe($('#lightbox-stage'));
}

function addSwipe(element) {
  let startX = 0;
  let startY = 0;
  element.addEventListener('pointerdown', event => {
    startX = event.clientX;
    startY = event.clientY;
  });
  element.addEventListener('pointerup', event => {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    updateGallery(galleryState.index + (deltaX < 0 ? 1 : -1));
  });
}

function openLightbox() {
  if (!galleryState.items.length) return;
  galleryState.lastFocus = document.activeElement;
  updateGallery(galleryState.index);
  $('#lightbox').showModal();
  $('#lightbox-close').focus();
}

function closeLightbox() {
  $('#lightbox').close();
}

function setupLightbox() {
  const lightbox = $('#lightbox');
  $('#gallery-open').addEventListener('click', openLightbox);
  $('#lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('close', () => galleryState.lastFocus?.focus());
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') updateGallery(galleryState.index - 1);
    if (event.key === 'ArrowRight') updateGallery(galleryState.index + 1);
    if (event.key !== 'Tab') return;
    const focusable = [...lightbox.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function renderMissingImages(items) {
  if (!items?.length) return;
  $('#missing-media').hidden = false;
  fillList('#missing-media-list', items);
}

function setupProjectPager(projects, currentIndex) {
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  const previousLink = $('#previous-project');
  const nextLink = $('#next-project');
  previousLink.href = `project.html?slug=${encodeURIComponent(previous.slug)}`;
  previousLink.querySelector('strong').textContent = previous.title;
  nextLink.href = `project.html?slug=${encodeURIComponent(next.slug)}`;
  nextLink.querySelector('strong').textContent = next.title;
}

async function init() {
  try {
    const response = await fetch('../data/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();
    const currentIndex = projects.findIndex(item => item.slug === slug);
    if (currentIndex < 0) throw new Error('Project not found');
    const project = projects[currentIndex];

    document.title = `${project.title} — Kantapon Thanwisetwong`;
    document.querySelector('meta[name="description"]').content = project.summary;
    $('#detail-category').textContent = project.categoryLabel;
    $('#detail-title').textContent = project.title;
    $('#detail-summary').textContent = project.summary;
    $('#detail-overview').textContent = project.summary;
    $('#detail-problem').textContent = project.problem;
    $('#detail-solution').textContent = project.solution;
    $('#detail-contributions').textContent = project.contributions;
    $('#detail-outcome').textContent = project.outcome;
    $('#detail-lessons').textContent = project.lessons;
    $('#detail-year').textContent = project.year;
    $('#detail-field').textContent = project.categoryLabel;
    fillList('#detail-objectives', project.objectives);
    fillList('#detail-process', project.process, true);

    const technology = $('#detail-tech');
    technology.replaceChildren(...project.technologies.map(item => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = item;
      return tag;
    }));

    if (project.github) {
      const heading = document.createElement('h3');
      heading.textContent = 'Verified Link';
      const link = document.createElement('a');
      link.className = 'detail-github';
      link.href = project.github;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = `${project.githubLabel || 'View GitHub Repository'} ↗`;
      $('#detail-links').append(heading, link);
    }

    const hero = $('#detail-image');
    if (project.cover) {
      hero.replaceChildren(imageMarkup(project.cover, { eager: true }));
    } else {
      hero.innerHTML = '<div class="project-placeholder"><span>IMG</span><strong>Verified Project Image Needed</strong><small>See the image requests in the gallery section.</small></div>';
    }

    setupGallery(project.gallery);
    renderMissingImages(project.missingImages);
    setupProjectPager(projects, currentIndex);
    setupLightbox();
  } catch (error) {
    $('#detail-title').textContent = 'Project Not Found';
    $('#detail-summary').textContent = 'Return to the project gallery and choose an available case study.';
    document.querySelector('.detail-content').hidden = true;
  }
}

init();
