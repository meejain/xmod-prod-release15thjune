/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature.
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Generated: 2026-06-15 (revalidate)
 *
 * Target structure (Block Collection "cards" pattern, see blocks/cards-feature/cards-feature.js):
 *   Row 0: block name ("cards-feature")
 *   Each following row: one card => [imageCell, bodyCell]
 *     - imageCell: a single <picture> (so the block JS classifies it as the card image).
 *       Omitted entirely when the card has no image (body becomes the only cell).
 *     - bodyCell: eyebrow / title / description / CTA, or stat-tile text (data-point + suffix + description).
 *
 * Resilience: this variant is used in 5 grids whose inner markup varies:
 *   - feature story cards (.cardpagestory: image + .card-eyebrow + .card-title + .card-description + .card-cta)
 *   - stat tiles (.dashboardcards / .cmp-dashboardcard: .eyebrow + .data-point + .data-point-suffix + .description)
 *   - plain image + title + link card grids
 *   - feature + linklist grids
 * Each grid-cell (.grid-cell / .grid-row__col-with-*) is treated as one card.
 */
export default function parse(element, { document }) {
  // Collect the per-card cells. Each entry is an array of cell contents for one row.
  const rows = [];

  // Build a picture-only image cell from any <img> found in a card.
  // Reusing the existing <picture> keeps Scene7 srcset/type; fall back to wrapping a bare <img>.
  const buildImageCell = (scope) => {
    const img = scope.querySelector('img');
    if (!img) return null;
    const picture = img.closest('picture');
    if (picture) return picture;
    return img;
  };

  // Build the text body for a standard content card (feature story / image+title+link).
  const buildContentBody = (scope) => {
    const body = [];

    // Eyebrow / kicker (rendered as a heading element by the source).
    const eyebrow = scope.querySelector('.card-eyebrow, .eyebrow');
    if (eyebrow) {
      const h = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      h.append(strong);
      body.push(h);
    }

    // Title heading. Prefer an explicit card title, then any heading inside the card.
    const title = scope.querySelector('.card-title')
      || scope.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      body.push(h);
    }

    // Description paragraph(s).
    const descriptions = scope.querySelectorAll('.card-description, .card-text-container p');
    if (descriptions.length) {
      descriptions.forEach((d) => {
        const p = document.createElement('p');
        p.textContent = d.textContent.trim();
        if (p.textContent) body.push(p);
      });
    }

    // CTA: prefer a real anchor (preserve href). The source sometimes uses a non-anchor
    // .card-cta span inside a wrapping <a>; in that case build a link from the ancestor anchor.
    const ctaSpan = scope.querySelector('.card-cta');
    const anchor = scope.querySelector('a[href]');
    let ctaLabel = ctaSpan ? ctaSpan.textContent.trim() : '';
    if (anchor) {
      const link = document.createElement('a');
      link.href = anchor.href;
      const label = ctaLabel
        || (anchor.textContent || '').trim()
        || (title ? title.textContent.trim() : '')
        || 'Learn More';
      link.textContent = label;
      body.push(link);
    } else if (ctaLabel) {
      const p = document.createElement('p');
      p.textContent = ctaLabel;
      body.push(p);
    }

    return body.length ? body : null;
  };

  // Build the text body for a stat / dashboard tile.
  const buildStatBody = (scope) => {
    const body = [];

    const eyebrow = scope.querySelector('.eyebrow');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      p.append(strong);
      body.push(p);
    }

    const dataPoint = scope.querySelector('.data-point');
    const suffix = scope.querySelector('.data-point-suffix');
    if (dataPoint) {
      const h = document.createElement('h3');
      const value = dataPoint.textContent.trim();
      const suffixText = suffix ? suffix.textContent.trim() : '';
      h.textContent = `${value}${suffixText}`;
      body.push(h);
    }

    const description = scope.querySelector('.description');
    if (description && description.textContent.trim()) {
      const p = document.createElement('p');
      // Normalize internal whitespace/newlines from the source markup.
      p.textContent = description.textContent.replace(/\s+/g, ' ').trim();
      body.push(p);
    }

    return body.length ? body : null;
  };

  // Identify each card. Grid cells are the primary unit; fall back to other card containers
  // so non-grid instances (containers wrapping cards directly) still produce rows.
  let cardEls = Array.from(element.querySelectorAll(
    '.grid-cell, [class*="grid-row__col-with-"]',
  ));
  if (!cardEls.length) {
    cardEls = Array.from(element.querySelectorAll(
      '.cardpagestory, .dashboardcards, .cmp-dashboardcard',
    ));
  }

  cardEls.forEach((cell) => {
    const isStat = cell.querySelector('.cmp-dashboardcard, .dashboardcards, .data-point');
    const imageCell = buildImageCell(cell);
    const body = isStat ? buildStatBody(cell) : buildContentBody(cell);

    // Skip cells that yielded no usable content.
    if (!body && !imageCell) return;

    const row = [];
    if (imageCell) row.push(imageCell);
    row.push(body || '');
    rows.push(row);
  });

  // Empty-block guard: if no cards were extracted, unwrap rather than emit an empty block.
  if (!rows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [...rows];
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
