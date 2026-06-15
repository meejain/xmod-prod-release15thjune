/*
 * Video Feature Block
 * Large featured video player: a full-width poster image with an overlaid
 * heading and a "Watch 0:15"-style play button. Clicking the button reveals
 * an embedded Brightcove (or other) player.
 *
 * Authored structure (.plain.html):
 *   row 1: [ cell: <a href="...poster-image"> ]
 *   row 2: [ cell: <h2>Heading</h2> ], [ cell: <a href="...player url"> ]
 */

function buildEmbed(url) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-feature-embed';
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', 'Video player');
  iframe.setAttribute('loading', 'lazy');
  wrapper.append(iframe);
  return wrapper;
}

export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const posterLink = links[0];
  const playerLink = links[links.length - 1] !== posterLink ? links[links.length - 1] : null;
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');

  const posterSrc = posterLink ? posterLink.getAttribute('href') : null;
  const posterAlt = posterLink ? posterLink.textContent.trim() : '';
  const playerUrl = playerLink ? playerLink.getAttribute('href') : null;
  const headingText = heading ? heading.textContent.trim() : '';
  const headingLevel = heading ? heading.tagName.toLowerCase().replace('h', '') : '2';

  block.textContent = '';

  const panel = document.createElement('div');
  panel.className = 'video-feature-panel';

  if (posterSrc) {
    const img = document.createElement('img');
    img.src = posterSrc;
    img.alt = posterAlt;
    img.loading = 'lazy';
    img.className = 'video-feature-poster';
    panel.append(img);
  }

  const content = document.createElement('div');
  content.className = 'video-feature-text-content';

  if (headingText) {
    const h = document.createElement('div');
    h.setAttribute('role', 'heading');
    h.setAttribute('aria-level', headingLevel);
    h.className = 'video-feature-heading';
    h.textContent = headingText;
    content.append(h);
  }

  if (playerUrl) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-feature-play';
    button.setAttribute('aria-label', 'Play video');
    const label = document.createElement('span');
    label.textContent = 'Watch';
    button.append(label);
    button.addEventListener('click', () => {
      const embed = buildEmbed(playerUrl);
      panel.replaceChildren(embed);
      block.dataset.playing = 'true';
    });
    content.append(button);
  }

  panel.append(content);
  block.append(panel);
}
