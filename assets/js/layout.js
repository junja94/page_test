const headerHost = document.getElementById('siteHeader');

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

if (headerHost) {
  fetch('assets/header.html')
    .then((res) => res.text())
    .then((markup) => {
      headerHost.innerHTML = markup;
      setActiveNav(headerHost);
    })
    .catch(() => {});
}
