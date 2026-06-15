import { createOptimizedPicture } from '../../scripts/aem.js';

/* Universal Editor instrumentation is not used in this DA project; no-op shim. */
function moveInstrumentation() {}

/* Matches AbbVie "big number" stat values: 75+, ~57k, 39%, 210K+, etc.
   Captures an optional leading symbol group, the numeric core, and a
   trailing suffix group so they can be styled at different sizes. */
const STAT_RE = /^([~<>≈]*)\s*([\d.,]+)\s*([a-zA-Z%+]*)$/;

/* Splits a stat heading like "~57k" into a leading number + trailing suffix
   and rebuilds it as styled spans inside a flex container. */
function decorateStatNumber(heading) {
  const match = heading.textContent.trim().match(STAT_RE);
  if (!match) return false;
  const [, prefix, number, suffix] = match;
  const wrap = document.createElement('div');
  wrap.className = 'cards-feature-stat-value';
  const num = document.createElement('span');
  num.className = 'cards-feature-stat-number';
  num.textContent = `${prefix}${number}`;
  wrap.append(num);
  if (suffix) {
    const suf = document.createElement('span');
    suf.className = 'cards-feature-stat-suffix';
    suf.textContent = suffix;
    wrap.append(suf);
  }
  heading.replaceWith(wrap);
  return true;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-feature-card-image';
      else div.className = 'cards-feature-card-body';
    });

    /* A stat tile is a card whose body contains only an eyebrow + a big
       number heading + a short description, with no image and no link. */
    const body = li.querySelector('.cards-feature-card-body');
    const hasImage = !!li.querySelector('.cards-feature-card-image');
    const hasLink = !!li.querySelector('a');
    const heading = body ? body.querySelector('h2, h3, h4, h5, h6') : null;
    if (body && !hasImage && !hasLink && heading && decorateStatNumber(heading)) {
      li.classList.add('cards-feature-stat');
      /* mark the leading <strong> eyebrow paragraph for styling */
      const eyebrow = body.querySelector('p > strong');
      if (eyebrow) eyebrow.closest('p').classList.add('cards-feature-eyebrow');
    } else if (body) {
      const eyebrow = body.querySelector('p > strong');
      if (eyebrow) eyebrow.closest('p').classList.add('cards-feature-eyebrow');
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  /* Layout hints based on the cards present:
     - all-stat / mixed-stat tiles  → equal-width tile row
     - every card is image + single link → 3-up image grid
     - a single card → full-width feature row */
  const items = [...ul.children];
  const stats = items.filter((li) => li.classList.contains('cards-feature-stat'));
  const linkOnlyImageCards = items.filter((li) => li.querySelector('.cards-feature-card-image')
    && li.querySelectorAll('a').length === 1
    && !li.querySelector('h1, h2, h3, h4, h5, h6, strong'));
  if (stats.length) block.classList.add('cards-feature-has-stats');
  if (items.length > 1 && linkOnlyImageCards.length === items.length) {
    block.classList.add('cards-feature-imagegrid');
  }
  if (items.length === 1) block.classList.add('cards-feature-single');

  block.textContent = '';
  block.append(ul);
}
