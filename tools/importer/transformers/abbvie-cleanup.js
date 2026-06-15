/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie site-wide cleanup.
 *
 * Removes non-authorable site chrome and tracking noise so the import
 * contains only page-level authorable content (the `#maincontent` grid).
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (cleaned DOM of https://www.abbvie.com/). None are guessed.
 *
 * Verified sources (line numbers in cleaned.html):
 *  - Header experience fragment .....  .cmp-experiencefragment--header  (line 9),
 *                                      wrapper .sticky-nav              (line 8)
 *  - Footer experience fragment .....  .cmp-experiencefragment--footer  (line 4792)
 *  - OneTrust cookie consent SDK ....  #onetrust-consent-sdk            (line 5288)
 *  - GTM (noscript) comments ........  lines 2-3
 *  - clientlib <link> tags ..........  lines 10-11
 *
 * NOTE: iframes are intentionally NOT blanket-removed. The only authorable
 * iframe is the YouTube video embed inside #maincontent (line 4426), which
 * the video-feature parser needs. The OneTrust SDK iframes are removed as
 * part of the #onetrust-consent-sdk subtree.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };


export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent / OneTrust SDK — overlay that would interfere with
    // block matching. Whole subtree (banner, preference center, its iframes).
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk', // line 5288
    ]);

    // Restore real image URLs for lazy-loaded AEM images. The CMS ships
    // `<img src="data:image/gif;base64,...">` placeholders with the true
    // (Scene7) URL in `data-cmp-src` / `data-asset`. Left as-is, the data-URI
    // src both loses the real image and breaks markdown conversion. Promote
    // the real URL into `src` BEFORE parsers and the DM transformer run so
    // they see the actual Scene7 URLs.
    element.querySelectorAll('img[src^="data:"]').forEach((img) => {
      const real = img.getAttribute('data-cmp-src')
        || img.getAttribute('data-src')
        || img.getAttribute('data-asset');
      if (real) {
        img.setAttribute('src', real);
      } else {
        img.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome: global header/nav and footer experience
    // fragments. Remove the .experiencefragment GridColumn wrappers so no
    // empty shell is left behind.
    WebImporter.DOMUtils.remove(element, [
      '.experiencefragment.sticky-nav', // header XF wrapper, line 8
      '.cmp-experiencefragment--header', // header XF, line 9 (defensive)
      '.cmp-experiencefragment--footer', // footer XF, line 4792
      'link', // leftover clientlib stylesheet links, lines 10-11
      'noscript',
    ]);

    // Strip CMS data-layer / tracking attributes left on authorable nodes.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-cmp-hook-image');
      el.removeAttribute('onclick');
    });
  }
}
