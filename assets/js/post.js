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
  header.className = 'section-header';
  const title = document.createElement('h1');
  title.textContent = post.title || '';
  const meta = document.createElement('div');
  meta.className = 'post-meta';
  meta.textContent = `${post.authors}${post.date ? ' · ' + post.date : ''}`;
  header.append(title, meta);

  const mediaPath = post.thumbnailPath;
  const mediaType = post.thumbnailType || (isVideoSource(mediaPath) ? 'video' : 'image');
  if (mediaPath) {
    if (mediaType === 'video') {
      const heroVideo = document.createElement('video');
      heroVideo.src = mediaPath;
      heroVideo.muted = true;
      heroVideo.loop = true;
      heroVideo.playsInline = true;
      heroVideo.autoplay = true;
      heroVideo.preload = 'metadata';
      if (post.thumbnailPoster) heroVideo.poster = post.thumbnailPoster;
      heroVideo.style.borderRadius = '16px';
      heroVideo.style.margin = '1rem 0';
      postContainer.append(header, heroVideo);
    } else {
      const heroImg = document.createElement('img');
      heroImg.src = mediaPath;
      heroImg.alt = post.title;
      heroImg.style.borderRadius = '16px';
      heroImg.style.margin = '1rem 0';
      postContainer.append(header, heroImg);
    }
  } else {
    postContainer.append(header);
  }

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
      const thumbnailPath = meta.thumbnailpath || meta.image || '';
      const thumbnailType = meta.thumbnailtype || '';
      const thumbnailPoster = meta.thumbnailposter || '';
      renderPost({
        title: meta.title || file,
        authors: meta.authors || meta.author || 'Neuromeka AI Lab',
        date: meta.date || '',
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
