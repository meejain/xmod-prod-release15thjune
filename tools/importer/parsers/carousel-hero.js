/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://www.abbvie.com/
 * Generated: 2026-06-15
 * Validated: selectors verified against cached source.html (3 slides).
 *
 * Target table structure (base: carousel):
 *   Row 1: block name 'carousel-hero'
 *   Row N (one per slide): [ image ] | [ heading + CTA link ]
 *
 * Source DOM: dark full-bleed rotating hero. Each slide is a
 * `.cmp-home-hero__xf-block` containing a full-bleed Scene7 background
 * image (img.cmp-container__bg-image), an H1 headline (.cmp-title__text)
 * and a CTA link (.anchor-link a). Slides are extracted via
 * `.cmp-home-hero__xf-block` so the nested __alternative wrappers do not
 * affect slide enumeration.
 */
export default function parse(element, { document }) {
  // Each xf-block is one self-contained slide (image + headline + CTA).
  const slides = Array.from(element.querySelectorAll('.cmp-home-hero__xf-block'));

  const cells = [];

  slides.forEach((slide) => {
    // Full-bleed Scene7 background image for the slide.
    const image = slide.querySelector('img.cmp-container__bg-image, img[class*="bg-image"], img');

    // Headline for the slide.
    const heading = slide.querySelector('h1.cmp-title__text, .cmp-title__text, h1, h2');

    // CTA link for the slide.
    const ctaLink = slide.querySelector('.anchor-link a, .cmp-text a, a[href]');

    // Skip empty/incomplete slides.
    if (!image && !heading) return;

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (ctaLink) contentCell.push(ctaLink);

    cells.push([image || '', contentCell]);
  });

  // Empty-block guard: no usable slides found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
