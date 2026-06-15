/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-press.
 * Base block: carousel
 * Source URL: https://www.abbvie.com/
 * Generated: 2026-06-15
 *
 * Compact press-release news rotator. Each RSS slide in the source
 * (`.splide__slide > a.carousel-rss__link`) becomes one carousel slide
 * containing a date eyebrow (`.carousel-rss__eyebrow`) and a headline link
 * (`.carousel-rss__title` wrapped in the external news.abbvie.com link).
 *
 * The source also contains a separate "Featured" sub-area (image + heading +
 * CTA) inside the second grid column — this is intentionally NOT included;
 * the parser focuses only on the press-release rotator slides.
 */
export default function parse(element, { document }) {
  // The press-release rotator lives in the RSS carousel content container.
  // Restrict extraction to that area so the "Featured" sub-area is excluded.
  const rssCarousel = element.querySelector('.cmp-carousel--rss, .carousel-minimal');
  const scope = rssCarousel || element;

  // Each press-release slide.
  const slides = Array.from(scope.querySelectorAll('.splide__slide'));

  const cells = [];

  slides.forEach((slide) => {
    // Headline link (external news.abbvie.com URL).
    const link = slide.querySelector('a.carousel-rss__link, a[href*="news.abbvie.com"], a');
    if (!link) return;

    // Date eyebrow and headline title within the slide/link.
    const eyebrow = slide.querySelector('.carousel-rss__eyebrow');
    const title = slide.querySelector('.carousel-rss__title, p');

    // Build a single content cell per slide: date eyebrow + headline link.
    const content = [];

    if (eyebrow) {
      // Preserve the date as its own line.
      const dateEl = document.createElement('p');
      dateEl.textContent = eyebrow.textContent.trim();
      content.push(dateEl);
    }

    // Build the headline link, preserving its external href.
    const headlineText = title ? title.textContent.trim() : link.textContent.trim();
    const headlineLink = document.createElement('a');
    headlineLink.setAttribute('href', link.getAttribute('href'));
    if (link.getAttribute('target')) headlineLink.setAttribute('target', link.getAttribute('target'));
    if (link.getAttribute('rel')) headlineLink.setAttribute('rel', link.getAttribute('rel'));
    headlineLink.textContent = headlineText;
    content.push(headlineLink);

    // One slide = one row, one content column (no image for this variant).
    cells.push([content]);
  });

  // Empty-block guard: bail gracefully if no press-release slides were found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-press', cells });
  element.replaceWith(block);
}
