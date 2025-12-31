const postsIndexUrl = 'posts/posts.json';
const postList = document.getElementById('postList');
const getLocalizedMarkdown = window.getLocalizedMarkdown || ((markdown) => markdown);
const videoExtensions = ['.mp4', '.webm', '.ogg'];
const fallbackThumbnail = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80';

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

function buildPostData(meta = {}, file = '', body = '') {
  const title = meta.title || file;
  const description = meta.description || '';
  const authors = meta.authors || meta.author || 'Neuromeka AI Lab';
  const date = meta.date || '';
  const thumbnailPath = meta.thumbnailpath || meta.thumbnail || meta.image || meta.video || meta.videopath || '';
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
    body,
  };
}

function renderPostCard(post, file) {
  const card = document.createElement('article');
  card.className = 'post-card';
  const targetUrl = `post.html?file=${file}`;
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    window.location.href = targetUrl;
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = targetUrl;
    }
  });

  const mediaPath = post.thumbnailPath || fallbackThumbnail;
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
  card.appendChild(media);

  const content = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = post.title;
  const meta = document.createElement('div');
  meta.className = 'post-meta';
  meta.textContent = `${post.authors}${post.date ? ' · ' + post.date : ''}`;
  const desc = document.createElement('p');
  desc.className = 'post-description';
  desc.textContent = post.description;

  content.append(title, meta, desc);
  card.appendChild(content);
  postList?.appendChild(card);
}

fetch(postsIndexUrl)
  .then((res) => res.json())
  .then((index) => {
    const entries = Array.isArray(index) ? index : [];
    return Promise.all(entries.map((item) => {
      const filePath = `posts/${item.file}`;
      return fetch(filePath)
        .then((res) => res.text())
        .then((md) => parsePost(getLocalizedMarkdown(md)))
        .then(({ meta, body }) => ({ post: buildPostData(meta, filePath, body), filePath }))
        .catch(() => ({
          post: buildPostData({ title: item.file, description: 'Could not load post.' }, filePath, ''),
          filePath,
        }));
    }));
  })
  .then((items) => {
    if (postList) postList.innerHTML = '';
    items
      .sort((a, b) => new Date(b.post.date || 0) - new Date(a.post.date || 0))
      .forEach(({ post, filePath }) => renderPostCard(post, filePath));
  })
  .catch(() => {
    if (postList) {
      postList.textContent = 'No posts yet. Add Markdown files under /posts and list them in posts/posts.json.';
    }
  });
