/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie section breaks + section metadata.
 *
 * The homepage template defines 6 sections in page-templates.json, each with a
 * `selector` (verified against migration-work/cleaned.html, all rooted at
 * #maincontent) and a `style` (light / accent / dark). For each section this
 * transformer:
 *   - inserts a section break <hr> before the section element (except the first
 *     section, and only when there is preceding content), and
 *   - creates a "Section Metadata" block carrying the section's `style`.
 *
 * Runs only in afterTransform (per generate-import-transformer.md). Sections are
 * processed in reverse document order so that inserting <hr>/metadata for a later
 * section does not shift the DOM positions of earlier ones.
 *
 * Selectors come from payload.template.sections (populated by the site analysis /
 * block-mapping workflow); none are hardcoded or guessed here.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload
    && payload.template
    && Array.isArray(payload.template.sections)
    ? payload.template.sections
    : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve each section's anchor element from its template selector. Selectors
  // are rooted at #maincontent which is the root of the imported main content.
  const resolved = sections.map((section) => {
    let target = null;
    if (section && section.selector) {
      try {
        target = element.querySelector(section.selector)
          || doc.querySelector(section.selector);
      } catch (e) {
        target = null;
      }
    }
    return { section, target };
  });

  const firstWithTarget = resolved.findIndex((r) => r.target);

  // Reverse order so earlier insertions are not invalidated by later ones.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, target } = resolved[i];
    if (!target) continue;

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      target.after(metaBlock);
    }

    // Section break before every section except the first resolved one, and
    // only when there is real preceding content (avoid a leading <hr>).
    if (i > firstWithTarget && target.previousElementSibling) {
      const hr = doc.createElement('hr');
      target.before(hr);
    }
  }
}
