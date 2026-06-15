/**
 * hero-cta — centered/split call-to-action band.
 * Authored structure (one row, up to three cells):
 *   cell 1: heading (h3/h4)
 *   cell 2: supporting paragraph
 *   cell 3: a single CTA link
 * Decorates the cells with semantic classes so CSS can build the
 * two-column (heading | text + cta) layout used on the AbbVie homepage.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const heading = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6'));
  const action = cells.find((c) => c.querySelector('a'));
  // the text cell is the remaining cell that is neither heading nor pure action
  const text = cells.find((c) => c !== heading && c !== action);

  if (heading) heading.classList.add('hero-cta-heading');
  if (text) text.classList.add('hero-cta-text');
  if (action) {
    action.classList.add('hero-cta-action');
    const link = action.querySelector('a');
    // mark plain (non-button-decorated) links so they render as inline CTA links
    if (link && !link.classList.contains('button')) {
      link.classList.add('hero-cta-link');
    }
  }

  // no background image in this variant
  if (!block.querySelector(':scope picture')) {
    block.classList.add('no-image');
  }
}
