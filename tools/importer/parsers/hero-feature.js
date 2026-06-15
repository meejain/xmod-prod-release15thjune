/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-feature.
 * Base block: hero
 * Source URL: https://www.abbvie.com/
 * Generated: 2026-06-15
 *
 * Image-overlay feature banner. The source provides a Scene7 feature image
 * (.cmp-image with data-cmp-src) alongside an eyebrow (.cmp-header__text),
 * an H3 heading (.cmp-title__text) and a "Learn more" CTA (.cmp-button).
 *
 * Target hero structure:
 *   Row 1: feature/background image (first child -> decorated as overlay background)
 *   Row 2: eyebrow + heading + CTA content
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (selectors validated against source.html)
  // Feature image: prefer the rendered <img> inside .cmp-image so the importer
  // produces a <picture>. Fall back to building one from data-cmp-src.
  let image = element.querySelector('.cmp-image__image, .cmp-image img, .image img, img');
  if (!image) {
    const imageWrapper = element.querySelector('.cmp-image[data-cmp-src], [data-cmp-src]');
    const src = imageWrapper && imageWrapper.getAttribute('data-cmp-src');
    if (src) {
      image = document.createElement('img');
      image.src = src;
      const title = imageWrapper.getAttribute('data-title');
      if (title) image.alt = title;
    }
  }

  // Eyebrow / kicker text
  const eyebrow = element.querySelector('.cmp-header__text, .cmp-header, .header [role="heading"]');

  // Primary heading (H3 in source; allow any heading level as fallback)
  const heading = element.querySelector('.cmp-title__text, .cmp-title h1, .cmp-title h2, .cmp-title h3, h1, h2, h3, h4');

  // CTA button(s)
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-button, .button a, a.cmp-button'))
    .map((node) => (node.tagName === 'A' ? node : node.querySelector('a') || node))
    .filter((node, idx, arr) => node.tagName === 'A' && arr.indexOf(node) === idx);

  // EMPTY-BLOCK GUARD: bail gracefully if no meaningful content
  if (!heading && !eyebrow && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // OUTPUT STRUCTURE
  const cells = [];

  // Row 1: feature image (background overlay) — only when present
  if (image) {
    cells.push([image]);
  }

  // Row 2: eyebrow + heading + CTA content
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
