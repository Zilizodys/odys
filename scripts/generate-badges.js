const fs = require('fs');
const path = require('path');

const badges = [
  'solo', 'couple', 'family', 'friends', 'express', 'efficient', 'balanced', 'long-stay',
  'budget-master', 'luxury', 'seasons', 'master-planner', 'urban-explorer', 'globe-trotter',
  'bronze-traveler', 'silver-traveler', 'gold-traveler', 'platinum-traveler',
  'food-expert', 'sport-expert', 'night-expert', 'nature-expert', 'culture-expert'
];

const colors = [
  '#6366f1', '#f59e42', '#10b981', '#f43f5e', '#fbbf24', '#3b82f6', '#a21caf', '#eab308',
  '#0ea5e9', '#f472b6', '#22d3ee', '#f87171', '#84cc16', '#eab308', '#d97706', '#a3e635',
  '#facc15', '#f472b6', '#f59e42', '#10b981', '#f43f5e', '#fbbf24', '#3b82f6'
];

const dir = path.join(__dirname, '../public/badges');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

badges.forEach((name, i) => {
  const initials = name
    .replace(/-/g, ' ')
    .split(' ')
    .map(w => w[0].toUpperCase())
    .join('');
  const svg = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="16" fill="${colors[i % colors.length]}" />
  <text x="50%" y="54%" text-anchor="middle" fill="#fff" font-size="22" font-family="Arial" font-weight="bold" dominant-baseline="middle">${initials}</text>
</svg>
  `.trim();
  fs.writeFileSync(path.join(dir, `${name}.svg`), svg, 'utf8');
});

console.log('✅ Badges SVG générés dans public/badges/'); 