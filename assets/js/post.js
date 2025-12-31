const postContainer = document.getElementById('post');
const params = new URLSearchParams(window.location.search);
const file = params.get('file');
const getLocalizedMarkdown = window.getLocalizedMarkdown || ((markdown) => markdown);
const videoExtensions = ['.mp4', '.webm', '.ogg'];

function isVideoSource(path = '') {
  const normalized = path.split('?')[0].toLowerCase();
  return videoExtensions.some((ext) => normalized.endsWith(ext));
}

function parsePost(markdown) {
  const lines = markdown.split('\n');
  const meta = {};
  let i = 0;
  while (i < lines.length && !lines[i].trim()) {
    i += 1;
  }
  if (i < lines.length && lines[i].trim().startsWith('#')) {
    meta.title = lines[i].replace(/^#+\s*/, '').trim();
    i += 1;
  }
  while (i < lines.length && !lines[i].trim()) {
    i += 1;
  }
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

function renderPost(post) {
  if (!postContainer) return;
  postContainer.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'post-header';
  const headerText = document.createElement('div');
  headerText.className = 'post-header-text';
  const title = document.createElement('h1');
  title.textContent = post.title || '';
  const meta = document.createElement('div');
  meta.className = 'post-meta';
  const metaParts = [];
  if (post.authors) metaParts.push(post.authors);
  if (post.date) metaParts.push(post.date);
  meta.textContent = metaParts.join(' · ');
  headerText.append(title, meta);

  if (post.description) {
    const desc = document.createElement('p');
    desc.className = 'post-header-description';
    desc.textContent = post.description;
    headerText.appendChild(desc);
  }

  const pub = document.createElement('div');
  pub.className = 'post-publication';
  if (post.publication) {
    const link = document.createElement('a');
    link.href = post.publication;
    link.textContent = 'Publication';
    link.target = '_blank';
    link.rel = 'noopener';
    pub.appendChild(link);
  } else {
    const label = document.createElement('span');
    label.className = 'is-unavailable';
    label.textContent = 'Publication (unavailable)';
    pub.appendChild(label);
  }
  headerText.appendChild(pub);
  header.appendChild(headerText);

  const mediaPath = post.thumbnailPath;
  if (mediaPath) {
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'post-header-media';
    const mediaType = post.thumbnailType || (isVideoSource(mediaPath) ? 'video' : 'image');
    const media = mediaType === 'video' ? document.createElement('video') : document.createElement('img');
    if (mediaType === 'video') {
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.autoplay = true;
      media.preload = 'metadata';
      if (post.thumbnailPoster) media.poster = post.thumbnailPoster;
      media.src = mediaPath;
      media.setAttribute('aria-label', post.title);
    } else {
      media.src = mediaPath;
      media.alt = post.title;
    }
    mediaWrap.appendChild(media);
    header.appendChild(mediaWrap);
  }
  postContainer.appendChild(header);

  const body = document.createElement('div');
  body.className = 'markdown';
  body.innerHTML = marked.parse(post.body);
  postContainer.appendChild(body);
}

if (file) {
  fetch(file)
    .then((res) => res.text())
    .then((md) => parsePost(getLocalizedMarkdown(md)))
    .then(({ meta, body }) => {
      const thumbnailPath = meta.thumbnailpath || meta.thumbnail || meta.image || meta.video || meta.videopath || '';
      const thumbnailType = meta.thumbnailtype || '';
      const thumbnailPoster = meta.thumbnailposter || '';
      const publication = meta.publication || meta.publicationlink || meta.link || '';
      renderPost({
        title: meta.title || file,
        authors: meta.authors || meta.author || 'Neuromeka AI Lab',
        date: meta.date || '',
        description: meta.description || '',
        publication,
        thumbnailPath,
        thumbnailType,
        thumbnailPoster,
        body,
      });
    })
    .catch(() => {
      if (postContainer) postContainer.textContent = 'Could not load this post.';
    });
} else if (postContainer) {
  postContainer.textContent = 'No post specified. Use ?file=posts/your-post.md';
}
