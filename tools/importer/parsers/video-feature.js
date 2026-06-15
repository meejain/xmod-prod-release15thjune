/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-feature.
 * Base block: video
 * Source URL: https://www.abbvie.com/
 * Generated: 2026-06-15
 *
 * Maps Scene7 poster + heading + constructed Brightcove player URL into the
 * video content model (poster row + heading/link row).
 *
 * Source structure (validated against source.html):
 *   .cmp-video__image img            -> Scene7 poster image
 *   .cmp-video__text-content [role="heading"] -> video heading
 *   .video-js[data-account][data-video-id]    -> Brightcove player reference
 *
 * The video block (blocks/video-feature/video-feature.js) expects:
 *   - a <picture>/<img> poster placeholder
 *   - an <a> whose href points to the video URL
 * Brightcove provides no direct media URL, so a player URL is constructed
 * from data-account / data-video-id.
 */
export default function parse(element, { document }) {
  // Poster image (Scene7). Fallback to any image inside the panel.
  const poster = element.querySelector('.cmp-video__image img, .cmp-image__image, img');

  // Heading rendered as a div with role="heading" (not a real <hN>).
  const headingEl = element.querySelector(
    '.cmp-video__text-content [role="heading"], [role="heading"]',
  );

  // Brightcove player reference.
  const player = element.querySelector('.video-js[data-video-id], [data-video-id]');

  // Resolve a usable video link.
  let videoHref = '';
  // Prefer an explicit anchor if one exists in the source.
  const explicitLink = element.querySelector('a[href]');
  if (explicitLink && explicitLink.getAttribute('href')) {
    videoHref = explicitLink.href || explicitLink.getAttribute('href');
  } else if (player) {
    const account = player.getAttribute('data-account');
    const videoId = player.getAttribute('data-video-id');
    if (account && videoId) {
      videoHref = `https://players.brightcove.net/${account}/default_default/index.html?videoId=${videoId}`;
    }
  }

  // Empty-block guard: without a video reference there is nothing to import.
  if (!videoHref && !poster) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: poster image (the play-overlay placeholder for the video block).
  if (poster) {
    cells.push([poster]);
  }

  // Row: heading + video link.
  const contentCell = [];
  if (headingEl) {
    // Promote role="heading" div to a real heading element for the block.
    const level = headingEl.getAttribute('aria-level') || '2';
    const heading = document.createElement(`h${/^[1-6]$/.test(level) ? level : '2'}`);
    heading.textContent = headingEl.textContent.trim();
    contentCell.push(heading);
  }
  if (videoHref) {
    const link = document.createElement('a');
    link.href = videoHref;
    link.textContent = videoHref;
    contentCell.push(link);
  }
  if (contentCell.length) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-feature', cells });
  element.replaceWith(block);
}
