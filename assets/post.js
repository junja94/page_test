const postContainer = document.getElementById('post');
const params = new URLSearchParams(window.location.search);
const file = params.get('file');

function parsePost(markdown) {
  const lines = markdown.split('\n').filter(Boolean);
  const titleLine = lines.find((l) => l.startsWith('# ')) || '';
  const authorLine = lines.find((l) => l.toLowerCase().startsWith('authors:')) || '';
  const dateLine = lines.find((l) => l.toLowerCase().startsWith('date')) || '';
  const imageLine = lines.find((l) => l.toLowerCase().startsWith('image')) || '';
  const title = titleLine.replace(/^#\s*/, '').trim();
  const author = authorLine.split(':')[1]?.trim() || 'Neuromeka AI Lab';
  const date = dateLine.split(':')[1]?.trim() || '';
  const image = imageLine.split(':')[1]?.trim();
  const contentStart = lines.findIndex((l) => l.startsWith('# ')) + 1;
  const body = lines.slice(contentStart).join('\n');
  return { title, author, date, image, body };
}

function renderPost(post) {
  if (!postContainer) return;
  postContainer.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'section-header';
  const title = document.createElement('h1');
  title.textContent = post.title;
  const meta = document.createElement('div');
  meta.className = 'post-meta';
  meta.textContent = `${post.author}${post.date ? ' · ' + post.date : ''}`;
  header.append(title, meta);

  if (post.image) {
    const heroImg = document.createElement('img');
    heroImg.src = post.image;
    heroImg.alt = post.title;
    heroImg.style.borderRadius = '16px';
    heroImg.style.margin = '1rem 0';
    postContainer.append(header, heroImg);
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
    .then((md) => parsePost(md))
    .then((post) => renderPost(post))
    .catch(() => {
      if (postContainer) postContainer.textContent = 'Could not load this post.';
    });
} else if (postContainer) {
  postContainer.textContent = 'No post specified. Use ?file=posts/your-post.md';
}
