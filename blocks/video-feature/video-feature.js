/*
 * Video Feature Block
 * Large featured video player: a full-width poster image with an overlaid
 * heading and a "Watch 0:15"-style play button. Clicking the button reveals
 * an embedded Brightcove (or other) player.
 *
 * Authored structure (.plain.html):
 *   row 1: [ cell: <a href="...poster-image"> ]
 *   row 2: [ cell: <h2>Heading</h2> ], [ cell: <a href="...player url"> ]
 *
 * The poster cell holds a Dynamic Media / Scene7 image URL. The client-side
 * DM auto-block can convert that <a> into a <picture> before this decorator
 * runs, so the poster may arrive as an <a>, an <img>, or a <picture>. We
 * resolve the poster from whichever form is present, and treat the remaining
 * non-image anchor as the player link.
 */

const IMG_EXT = /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i;
const DM_URL = /\/is\/image\/|scene7\.com|\/adobe\/assets\/urn:/i;

function isImageHref(href) {
  return !!href && (IMG_EXT.test(href) || DM_URL.test(href));
}

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
  // Poster: prefer an already-rendered <picture>/<img> (DM auto-block output),
  // else an anchor whose href is an image/DM URL.
  const existingPicture = block.querySelector('picture');
  const existingImg = block.querySelector('img');
  const anchors = [...block.querySelectorAll('a')];
  const posterAnchor = anchors.find((a) => isImageHref(a.getAttribute('href')));

  // Player: the remaining anchor that is NOT an image URL.
  const playerLink = anchors.find((a) => !isImageHref(a.getAttribute('href')));

  // The heading may be a real <hN> or a role="heading" div.
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]');

  let posterAlt = '';
  let posterSrc = null;
  if (existingImg) {
    posterSrc = existingImg.getAttribute('src');
    posterAlt = existingImg.getAttribute('alt') || '';
  } else if (posterAnchor) {
    posterSrc = posterAnchor.getAttribute('href');
    posterAlt = posterAnchor.textContent.trim();
  }

  const playerUrl = playerLink ? playerLink.getAttribute('href') : null;
  const headingText = heading ? heading.textContent.trim() : '';
  let headingLevel = '2';
  if (heading) {
    headingLevel = heading.tagName.match(/^H[1-6]$/)
      ? heading.tagName.slice(1)
      : (heading.getAttribute('aria-level') || '2');
  }

  const panel = document.createElement('div');
  panel.className = 'video-feature-panel';

  if (existingPicture) {
    existingPicture.classList.add('video-feature-poster');
    panel.append(existingPicture);
  } else if (posterSrc) {
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
  block.replaceChildren(panel);
}
