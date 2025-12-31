const homeConfigUrl = 'content/home.json';
const postsIndexUrl = 'posts/posts.json';
const defaultHeroCopyUrl = 'content/hero.md';
let heroCopyUrl = defaultHeroCopyUrl;
let heroMedia = [];
let techItems = [];
const getLocalizedMarkdown = window.getLocalizedMarkdown || ((markdown) => markdown);
const fallbackThumbnail = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80';

const heroMediaContainer = document.getElementById('heroMedia');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
let heroIndex = 0;

function setHeroMedia(index) {
  if (!heroMediaContainer || heroMedia.length === 0) return;
  const item = heroMedia[index];
  if (!item || !item.path) return;

  heroMediaContainer.innerHTML = '';
  const mediaType = item.mediaType || (isVideoSource(item.path) ? 'video' : 'image');
  if (mediaType === 'video') {
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'metadata';
    if (item.poster) video.poster = item.poster;
    video.src = item.path;
    heroMediaContainer.appendChild(video);
    video.load();
    video.play().catch(() => {
      // Autoplay might be blocked; keep poster visible.
    });
  } else {
    const img = document.createElement('img');
    img.src = item.path;
    img.alt = item.alt || '';
    if (!item.alt) img.setAttribute('aria-hidden', 'true');
    heroMediaContainer.appendChild(img);
  }
}

function nextHero(step = 1) {
  if (heroMedia.length === 0) return;
  heroIndex = (heroIndex + step + heroMedia.length) % heroMedia.length;
  setHeroMedia(heroIndex);
}

heroPrev?.addEventListener('click', () => nextHero(-1));
heroNext?.addEventListener('click', () => nextHero(1));

function applyHomeConfig(config = {}) {
  heroCopyUrl = typeof config.heroCopyUrl === 'string' && config.heroCopyUrl.trim()
    ? config.heroCopyUrl.trim()
    : defaultHeroCopyUrl;
  heroMedia = Array.isArray(config.heroMedia) ? config.heroMedia : [];
}

function parseHeroMarkdown(markdown) {
  const lines = markdown.split('\n');
  let maxWidth = '';
  const filtered = lines.filter((line) => {
    if (line.trim().toLowerCase().startsWith('maxwidth:')) {
      maxWidth = line.split(':').slice(1).join(':').trim();
      return false;
    }
    return true;
  });
  return { content: filtered.join('\n').trim(), maxWidth };
}

function loadHeroCopy(url) {
  fetch(url)
    .then((res) => res.text())
    .then((markdown) => {
      const target = document.getElementById('heroCopy');
      if (!target) return;
      const localized = getLocalizedMarkdown(markdown);
      const localizedData = parseHeroMarkdown(localized);
      const fallbackData = localizedData.maxWidth ? localizedData : parseHeroMarkdown(markdown);
      if (fallbackData.maxWidth) target.style.maxWidth = fallbackData.maxWidth;
      target.innerHTML = marked.parse(localizedData.content);
    })
    .catch(() => {}); // Silently fail if hero.md doesn't load
}

// Core technology carousel
const techTrack = document.getElementById('techTrack');
const techPrev = document.getElementById('techPrev');
const techNext = document.getElementById('techNext');
const techDots = document.getElementById('techDots');
let techIndex = 0;
const cardsPerView = () => (window.innerWidth < 1024 ? (window.innerWidth < 720 ? 1 : 2) : 3);
const videoExtensions = ['.mp4', '.webm', '.ogg'];

function isVideoSource(path = '') {
  const normalized = path.split('?')[0].toLowerCase();
  return videoExtensions.some((ext) => normalized.endsWith(ext));
}

function parsePost(markdown) {
  const lines = markdown.split('\n');
  const meta = {};
  let i = 0;
  for (; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      break;
    }
    const match = line.match(/^([A-Za-z][A-Za-z0-9 _-]*):\s*(.*)$/);
    if (!match) break;
    const key = match[1].trim().toLowerCase().replace(/\s+/g, '');
    meta[key] = match[2].trim();
  }
  const body = lines.slice(i).join('\n').trim();
  return { meta, body };
}

function buildPostData(meta = {}, link = '') {
  const title = meta.title || link;
  const description = meta.description || '';
  const authors = meta.authors || meta.author || 'Neuromeka AI Lab';
  const date = meta.date || '';
  const thumbnailPath = meta.thumbnailpath || meta.image || '';
  const thumbnailType = meta.thumbnailtype || '';
  const thumbnailPoster = meta.thumbnailposter || '';
  return {
    title,
    description,
    authors,
    date,
    thumbnailPath: thumbnailPath || fallbackThumbnail,
    thumbnailType,
    thumbnailPoster,
    link,
  };
}

function renderTechCards() {
  if (!techTrack) return;
  techTrack.innerHTML = '';
  if (techItems.length === 0) {
    renderTechDots();
    return;
  }
  const count = cardsPerView();
  const slice = techItems.slice(techIndex, techIndex + count);
  while (slice.length < count) {
    slice.push(...techItems);
  }
  slice.slice(0, count).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'tech-card';
    const targetUrl = `post.html?file=${item.link}`;
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', item.title);
    card.addEventListener('click', () => {
      window.location.href = targetUrl;
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = targetUrl;
      }
    });

    const mediaType = item.thumbnailType || (isVideoSource(item.thumbnailPath) ? 'video' : 'image');
    const media = mediaType === 'video' ? document.createElement('video') : document.createElement('img');
    if (mediaType === 'video') {
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.autoplay = true;
      media.preload = 'metadata';
      if (item.thumbnailPoster) media.poster = item.thumbnailPoster;
    }
    media.src = item.thumbnailPath;
    if (mediaType === 'image') {
      media.alt = item.title;
    } else {
      media.setAttribute('aria-label', item.title);
    }
    card.appendChild(media);

    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.textContent = `${item.authors}${item.date ? ' · ' + item.date : ''}`;
    const desc = document.createElement('p');
    desc.textContent = item.description;
    content.append(title, meta, desc);
    card.appendChild(content);
    techTrack.appendChild(card);
  });
  renderTechDots();
}

function renderTechDots() {
  if (!techDots) return;
  techDots.innerHTML = '';
  if (techItems.length === 0) return;
  const pages = Math.ceil(techItems.length / cardsPerView());
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    if (i === Math.floor(techIndex / cardsPerView())) dot.classList.add('active');
    dot.addEventListener('click', () => {
      techIndex = i * cardsPerView();
      renderTechCards();
    });
    techDots.appendChild(dot);
  }
}

function nextTech(step = 1) {
  if (techItems.length === 0) return;
  const count = cardsPerView();
  const pages = Math.ceil(techItems.length / count);
  const currentPage = Math.floor(techIndex / count);
  const nextPage = (currentPage + step + pages) % pages;
  techIndex = nextPage * count;
  renderTechCards();
}

function loadHomeConfig() {
  fetch(homeConfigUrl)
    .then((res) => res.json())
    .then((config) => applyHomeConfig(config))
    .catch(() => applyHomeConfig({}))
    .finally(() => {
      loadHeroCopy(heroCopyUrl);
      setHeroMedia(heroIndex);
    });
}

function loadTechItemsFromPosts() {
  return fetch(postsIndexUrl)
    .then((res) => res.json())
    .then((index) => {
      const sorted = index.sort((a, b) => new Date(b.date) - new Date(a.date));
      return Promise.all(sorted.map((item) => {
        const filePath = `posts/${item.file}`;
        return fetch(filePath)
          .then((res) => res.text())
          .then((md) => {
            const { meta } = parsePost(getLocalizedMarkdown(md));
            return buildPostData(meta, filePath);
          })
          .catch(() => ({
            title: item.file,
            description: 'Could not load post.',
            authors: 'Neuromeka AI Lab',
            date: '',
            thumbnailPath: fallbackThumbnail,
            thumbnailType: 'image',
            thumbnailPoster: '',
            link: filePath,
          }));
      }));
    })
    .then((items) => {
      techItems = items;
      renderTechCards();
    })
    .catch(() => {});
}

techPrev?.addEventListener('click', () => nextTech(-1));
techNext?.addEventListener('click', () => nextTech(1));
window.addEventListener('resize', () => renderTechCards());
loadHomeConfig();
loadTechItemsFromPosts();
