/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import carouselPressParser from './parsers/carousel-press.js';
import heroCtaParser from './parsers/hero-cta.js';
import heroFeatureParser from './parsers/hero-feature.js';
import videoFeatureParser from './parsers/video-feature.js';
import cardsFeatureParser from './parsers/cards-feature.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import sectionsTransformer from './transformers/abbvie-sections.js';
import dmImagesTransformer from './transformers/abbvie-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'carousel-press': carouselPressParser,
  'hero-cta': heroCtaParser,
  'hero-feature': heroFeatureParser,
  'video-feature': videoFeatureParser,
  'cards-feature': cardsFeatureParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AbbVie corporate home page with hero, press releases carousel, featured cards, video blocks, teasers, stats/impact grids, and content cards across multiple themed sections',
  urls: [
    'https://www.abbvie.com/',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: [
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.homepage-hero-controller.aem-GridColumn.aem-GridColumn--default--12',
      ],
    },
    {
      name: 'carousel-press',
      instances: [
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.homepage-overlap.medium-radius.cmp-container-xx-large.height-short.align-center.aem-GridColumn.aem-GridColumn--default--12',
      ],
    },
    {
      name: 'hero-cta',
      instances: [
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)',
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.medium-radius.cmp-container-xxx-large.height-short.aem-GridColumn.aem-GridColumn--default--12',
      ],
    },
    {
      name: 'video-feature',
      instances: [
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.video.cmp-video-xx-large.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(4)',
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.video.cmp-video-xx-large.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(8)',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)',
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.cmp-container-large.aem-GridColumn.aem-GridColumn--default--12',
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.cmp-grid-custom.aem-GridColumn.aem-GridColumn--default--12',
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(16)',
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.large-radius.cmp-container-full-width.height-default.no-bottom-margin.aem-GridColumn.aem-GridColumn--default--12',
      ],
    },
    {
      name: 'hero-feature',
      instances: [
        '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.default-radius.cmp-container-xxx-large.height-default.align-center.aem-GridColumn.aem-GridColumn--default--12',
      ],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'Press Releases',
      selector: '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.homepage-overlap.medium-radius.cmp-container-xx-large.height-short.align-center.aem-GridColumn.aem-GridColumn--default--12',
      style: 'light',
      blocks: ['carousel-press'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'Patients Intro CTA',
      selector: '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)',
      style: 'light',
      blocks: ['hero-cta'],
      defaultContent: [],
    },
    {
      id: 'rc7',
      name: 'Featured Story',
      selector: '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.cmp-container-large.aem-GridColumn.aem-GridColumn--default--12',
      style: 'accent',
      blocks: ['cards-feature'],
      defaultContent: [],
    },
    {
      id: 'rc11',
      name: 'Explore Opportunities CTA',
      selector: '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.medium-radius.cmp-container-xxx-large.height-short.aem-GridColumn.aem-GridColumn--default--12',
      style: 'dark',
      blocks: ['hero-cta'],
      defaultContent: [],
    },
    {
      id: 'rc13',
      name: 'Investor Resources',
      selector: '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(16)',
      style: 'accent',
      blocks: ['cards-feature'],
      defaultContent: [],
    },
    {
      id: 'rc16',
      name: 'ESG Module',
      selector: '#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.large-radius.cmp-container-full-width.height-default.no-bottom-margin.aem-GridColumn.aem-GridColumn--default--12',
      style: 'light',
      blocks: ['cards-feature'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
// cleanup runs first (removes header/footer/cookie noise), then sections
// (inserts <hr> + section metadata), then dm-images (rewrites Scene7 imgs to
// carrier anchors). dm-images must run after parsers have extracted imgs into
// block cells, so all run in afterTransform.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dmImagesTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path. Root path ('/') sanitizes to '' which makes the
    // importer's path.resolve() fall back to a broken process.cwd() shim;
    // map the home page to '/index' so it produces a valid document path.
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
