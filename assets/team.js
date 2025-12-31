const teamMarkdownUrl = 'team/team.md';
const teamGrid = document.getElementById('teamGrid');

function parseTeam(markdown) {
  const members = [];
  const blocks = markdown.split(/\n## /).filter(Boolean);
  blocks.forEach((block) => {
    const lines = block.split('\n').filter(Boolean);
    const header = lines.shift();
    const [name, role] = header.split('|').map((s) => s.trim());
    const bullets = lines.filter((line) => line.startsWith('- ')).map((line) => line.replace(/^\-\s*/, ''));
    const imageLine = lines.find((line) => line.toLowerCase().startsWith('image:'));
    const image = imageLine ? imageLine.split(':')[1].trim() : null;
    members.push({ name, role, bullets, image });
  });
  return members;
}

function renderTeam(members) {
  if (!teamGrid) return;
  teamGrid.innerHTML = '';
  members.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'team-card';

    const img = document.createElement('img');
    img.src = member.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80';
    img.alt = member.name;

    const body = document.createElement('div');
    const name = document.createElement('h3');
    name.textContent = member.name;
    const role = document.createElement('div');
    role.className = 'post-meta';
    role.textContent = member.role;
    const list = document.createElement('ul');
    member.bullets.forEach((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      list.appendChild(li);
    });

    body.append(name, role, list);
    card.append(img, body);
    teamGrid.appendChild(card);
  });
}

fetch(teamMarkdownUrl)
  .then((res) => res.text())
  .then((md) => parseTeam(md))
  .then((members) => renderTeam(members))
  .catch(() => {
    if (teamGrid) teamGrid.textContent = 'Add team members in team/team.md using Markdown headings.';
  });
