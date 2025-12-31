const postsIndexUrl = 'posts/posts.json';
const postList = document.getElementById('postList');

function parsePost(markdown) {
  const lines = markdown.split('\n').filter(Boolean);
  const titleLine = lines.find((l) => l.startsWith('# ')) || lines[0] || '';
  const title = titleLine.replace(/^#\s*/, '').trim();
  const authorLine = lines.find((l) => l.toLowerCase().startsWith('authors:')) || '';
  const dateLine = lines.find((l) => l.toLowerCase().startsWith('date')) || '';
  const imageLine = lines.find((l) => l.toLowerCase().startsWith('image')) || '';
  const author = authorLine.split(':')[1]?.trim() || 'Neuromeka AI Lab';
  const date = dateLine.split(':')[1]?.trim() || '';
  const image = imageLine.split(':')[1]?.trim();
  const contentStart = lines.findIndex((l) => l.startsWith('# ')) + 1;
  const body = lines.slice(contentStart).join('\n');
  return { title, author, date, image, body };
}

function renderPostCard(post, file) {
  const card = document.createElement('article');
  card.className = 'post-card';

  const previewImg = document.createElement('img');
  previewImg.src = post.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80';
  previewImg.alt = post.title;
  card.appendChild(previewImg);

  const content = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = post.title;
  const meta = document.createElement('div');
  meta.className = 'post-meta';
  meta.textContent = `${post.author}${post.date ? ' · ' + post.date : ''}`;
  const excerpt = document.createElement('div');
  excerpt.className = 'markdown';
  excerpt.innerHTML = marked.parse(post.body.split('\n').slice(0, 6).join('\n'));
  const link = document.createElement('a');
  link.href = `post.html?file=${file}`;
  link.textContent = 'Read full post →';

  content.append(title, meta, excerpt, link);
  card.appendChild(content);
  postList?.appendChild(card);
}

fetch(postsIndexUrl)
  .then((res) => res.json())
  .then((index) => {
    const sorted = index.sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach((item) => {
      fetch(`posts/${item.file}`)
        .then((res) => res.text())
        .then((md) => parsePost(md))
        .then((post) => renderPostCard(post, `posts/${item.file}`))
        .catch(() => {
          const fallback = { title: item.file, body: 'Could not load post.' };
          renderPostCard(fallback, `posts/${item.file}`);
        });
    });
  })
  .catch(() => {
    if (postList) {
      postList.textContent = 'No posts yet. Add Markdown files under /posts and list them in posts/posts.json.';
    }
  });
