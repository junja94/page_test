const headerHost = document.getElementById('siteHeader');
const footerHost = document.getElementById('siteFooter');

function setActiveNav(container) {
  const links = container.querySelectorAll('nav a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const activeHref = current === 'post.html' ? 'blog.html' : current;
  links.forEach((link) => {
    if (link.getAttribute('href') === activeHref) {
      link.classList.add('active');
    }
  });
}

function loadPartial(host, path, onLoad) {
  if (!host) return;
  fetch(path)
    .then((res) => res.text())
    .then((markup) => {
      host.innerHTML = markup;
      if (onLoad) onLoad(host);
    })
    .catch(() => {});
}

loadPartial(headerHost, 'assets/header.html', setActiveNav);
loadPartial(footerHost, 'assets/footer.html');
