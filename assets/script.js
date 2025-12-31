const heroCopyUrl = 'content/hero.md';
const heroVideos = [
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/forest.mp4',
    poster: 'https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?auto=format&fit=crop&w=1600&q=80',
  },
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/river.mp4',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  },
];

const techItems = [
  {
    title: 'Vision-aligned cobot grasping',
    description: 'Real-time visual servoing for precision pick-and-place. Generated from the accompanying blog post.',
    mediaType: 'video',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    link: 'posts/vision-grasping.md',
  },
  {
    title: 'Safety-first motion planning',
    description: 'Dynamic obstacle avoidance and risk-aware trajectory planning.',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1502462041640-e5a4d4d8e0aa?auto=format&fit=crop&w=1200&q=80',
    link: 'posts/trajectory-safety.md',
  },
  {
    title: 'Data pipelines for industrial AI',
    description: 'Edge-to-cloud telemetry pipelines to keep cobots observable and improvable.',
    mediaType: 'video',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/river.mp4',
    link: 'posts/data-pipeline.md',
  },
  {
    title: 'Human-robot collaboration UX',
    description: 'Interfaces that make robot intent understandable at a glance.',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    link: 'posts/collaboration-ux.md',
  },
];

const heroVideo = document.getElementById('heroVideo');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
let heroIndex = 0;

function setHeroVideo(index) {
  const item = heroVideos[index];
  heroVideo.setAttribute('src', item.src);
  heroVideo.setAttribute('poster', item.poster);
  heroVideo.load();
  heroVideo.play().catch(() => {
    // Autoplay might be blocked; keep poster visible.
  });
}

function nextHero(step = 1) {
  heroIndex = (heroIndex + step + heroVideos.length) % heroVideos.length;
  setHeroVideo(heroIndex);
}

heroPrev?.addEventListener('click', () => nextHero(-1));
heroNext?.addEventListener('click', () => nextHero(1));

fetch(heroCopyUrl)
  .then((res) => res.text())
  .then((markdown) => {
    const target = document.getElementById('heroCopy');
    if (target) target.innerHTML = marked.parse(markdown);
  })
  .catch(() => {
    const fallback = document.getElementById('heroCopy');
    if (fallback) fallback.textContent = 'At Neuromeka AI Lab, we tackle industry-specific challenges by focusing on practical, field-ready AI solutions. By integrating advanced data-driven methodologies into industrial machines, we aim to deliver real-world impact and drive meaningful transformation in automation.';
  })
  .finally(() => setHeroVideo(heroIndex));

// Core technology carousel
const techTrack = document.getElementById('techTrack');
const techPrev = document.getElementById('techPrev');
const techNext = document.getElementById('techNext');
const techDots = document.getElementById('techDots');
let techIndex = 0;
const cardsPerView = () => (window.innerWidth < 1024 ? (window.innerWidth < 720 ? 1 : 2) : 3);

function renderTechCards() {
  if (!techTrack) return;
  techTrack.innerHTML = '';
  const count = cardsPerView();
  const slice = techItems.slice(techIndex, techIndex + count);
  while (slice.length < count) {
    slice.push(...techItems);
  }
  slice.slice(0, count).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'tech-card';

    const media = item.mediaType === 'image' ? document.createElement('img') : document.createElement('video');
    if (item.mediaType === 'video') {
      media.setAttribute('muted', 'true');
      media.setAttribute('loop', 'true');
      media.setAttribute('playsinline', 'true');
      media.autoplay = true;
    }
    media.src = item.src;
    media.alt = item.title;
    card.appendChild(media);

    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const desc = document.createElement('p');
    desc.textContent = item.description;
    const link = document.createElement('a');
    link.href = `post.html?file=${item.link}`;
    link.textContent = 'Read the post';
    link.target = '_blank';
    link.rel = 'noopener';
    link.insertAdjacentHTML('beforeend', '&#8594;');

    content.append(title, desc, link);
    card.appendChild(content);
    techTrack.appendChild(card);
  });
  renderTechDots();
}

function renderTechDots() {
  if (!techDots) return;
  techDots.innerHTML = '';
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
  const count = cardsPerView();
  const pages = Math.ceil(techItems.length / count);
  const currentPage = Math.floor(techIndex / count);
  const nextPage = (currentPage + step + pages) % pages;
  techIndex = nextPage * count;
  renderTechCards();
}

techPrev?.addEventListener('click', () => nextTech(-1));
techNext?.addEventListener('click', () => nextTech(1));
window.addEventListener('resize', () => renderTechCards());
renderTechCards();
