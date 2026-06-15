/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta.
 * Base block: hero
 * Source: https://www.abbvie.com/ (AbbVie corporate homepage)
 * Variant: text-only centered CTA banner (heading + supporting paragraph + single CTA).
 *   No background image. Used twice on the page (light + dark sections), each rendered
 *   from AEM Core Component teaser markup (.cmp-teaser with __title / __description / __action-link).
 * Generated: 2026-06-15
 */
export default function parse(element, { document }) {
  // The hero-cta block JS expects an optional first div with a <picture> for a background
  // image; when absent it adds the `no-image` class. This variant is text-only, so we emit a
  // single content row (heading + paragraph + CTA) and no image row.

  // --- Heading ---
  // Source teaser uses .cmp-teaser__title (role="heading") wrapping a <p>. Fall back to real
  // heading elements when present.
  let heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) {
    const titleEl = element.querySelector('.cmp-teaser__title, [class*="title"]');
    if (titleEl) {
      // Promote the teaser title (a div with role="heading") to a real heading element so the
      // block renders semantic markup. Use the aria-level to pick the heading rank.
      const level = parseInt(titleEl.getAttribute('aria-level'), 10);
      const tag = `h${Number.isFinite(level) && level >= 1 && level <= 6 ? level : 2}`;
      heading = document.createElement(tag);
      const inner = titleEl.querySelector('p');
      heading.append(...((inner || titleEl).childNodes));
    }
  }

  // --- Supporting paragraph / description ---
  let description = element.querySelector('.cmp-teaser__description, [class*="description"]');
  if (!description) {
    // Fall back to the first standalone paragraph that is not inside the title/action regions.
    description = element.querySelector(':scope p, p');
  }

  // --- CTA link(s) ---
  // Prefer the teaser action region; fall back to generic button/cta markup. Selectors are
  // queried in priority order (not comma-joined) so a single anchor that matches multiple
  // patterns (e.g. an .cmp-teaser__action-link inside .cmp-teaser__action-container) is not
  // selected twice.
  let ctas = Array.from(element.querySelectorAll(
    '.cmp-teaser__action-container a, .cmp-teaser__action-link',
  ));
  if (ctas.length === 0) {
    ctas = Array.from(element.querySelectorAll('a.button, a.cta'));
  }
  if (ctas.length === 0) {
    // Last-resort fallback: any anchor inside the block.
    ctas = Array.from(element.querySelectorAll('a[href]'));
  }
  // De-duplicate in case overlapping selectors ever match the same node.
  ctas = [...new Set(ctas)];
  // Normalize CTA whitespace (source markup has trailing newlines inside the anchor text).
  ctas.forEach((a) => {
    a.textContent = a.textContent.trim();
  });

  // --- Empty-block guard ---
  if (!heading && !description && ctas.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- Build cells (single content row: heading + paragraph + CTA) ---
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctas);

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
