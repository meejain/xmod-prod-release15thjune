/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-home-hero__xf-block"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector('img.cmp-container__bg-image, img[class*="bg-image"], img');
      const heading = slide.querySelector("h1.cmp-title__text, .cmp-title__text, h1, h2");
      const ctaLink = slide.querySelector(".anchor-link a, .cmp-text a, a[href]");
      if (!image && !heading) return;
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaLink) contentCell.push(ctaLink);
      cells.push([image || "", contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-press.js
  function parse2(element, { document }) {
    const rssCarousel = element.querySelector(".cmp-carousel--rss, .carousel-minimal");
    const scope = rssCarousel || element;
    const slides = Array.from(scope.querySelectorAll(".splide__slide"));
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector('a.carousel-rss__link, a[href*="news.abbvie.com"], a');
      if (!link) return;
      const eyebrow = slide.querySelector(".carousel-rss__eyebrow");
      const title = slide.querySelector(".carousel-rss__title, p");
      const content = [];
      if (eyebrow) {
        const dateEl = document.createElement("p");
        dateEl.textContent = eyebrow.textContent.trim();
        content.push(dateEl);
      }
      const headlineText = title ? title.textContent.trim() : link.textContent.trim();
      const headlineLink = document.createElement("a");
      headlineLink.setAttribute("href", link.getAttribute("href"));
      if (link.getAttribute("target")) headlineLink.setAttribute("target", link.getAttribute("target"));
      if (link.getAttribute("rel")) headlineLink.setAttribute("rel", link.getAttribute("rel"));
      headlineLink.textContent = headlineText;
      content.push(headlineLink);
      cells.push([content]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-press", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse3(element, { document }) {
    let heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    if (!heading) {
      const titleEl = element.querySelector('.cmp-teaser__title, [class*="title"]');
      if (titleEl) {
        const level = parseInt(titleEl.getAttribute("aria-level"), 10);
        const tag = `h${Number.isFinite(level) && level >= 1 && level <= 6 ? level : 2}`;
        heading = document.createElement(tag);
        const inner = titleEl.querySelector("p");
        heading.append(...(inner || titleEl).childNodes);
      }
    }
    let description = element.querySelector('.cmp-teaser__description, [class*="description"]');
    if (!description) {
      description = element.querySelector(":scope p, p");
    }
    let ctas = Array.from(element.querySelectorAll(
      ".cmp-teaser__action-container a, .cmp-teaser__action-link"
    ));
    if (ctas.length === 0) {
      ctas = Array.from(element.querySelectorAll("a.button, a.cta"));
    }
    if (ctas.length === 0) {
      ctas = Array.from(element.querySelectorAll("a[href]"));
    }
    ctas = [...new Set(ctas)];
    ctas.forEach((a) => {
      a.textContent = a.textContent.trim();
    });
    if (!heading && !description && ctas.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-feature.js
  function parse4(element, { document }) {
    let image = element.querySelector(".cmp-image__image, .cmp-image img, .image img, img");
    if (!image) {
      const imageWrapper = element.querySelector(".cmp-image[data-cmp-src], [data-cmp-src]");
      const src = imageWrapper && imageWrapper.getAttribute("data-cmp-src");
      if (src) {
        image = document.createElement("img");
        image.src = src;
        const title = imageWrapper.getAttribute("data-title");
        if (title) image.alt = title;
      }
    }
    const eyebrow = element.querySelector('.cmp-header__text, .cmp-header, .header [role="heading"]');
    const heading = element.querySelector(".cmp-title__text, .cmp-title h1, .cmp-title h2, .cmp-title h3, h1, h2, h3, h4");
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-button, .button a, a.cmp-button")).map((node) => node.tagName === "A" ? node : node.querySelector("a") || node).filter((node, idx, arr) => node.tagName === "A" && arr.indexOf(node) === idx);
    if (!heading && !eyebrow && ctaLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-feature.js
  function parse5(element, { document }) {
    const poster = element.querySelector(".cmp-video__image img, .cmp-image__image, img");
    const headingEl = element.querySelector(
      '.cmp-video__text-content [role="heading"], [role="heading"]'
    );
    const player = element.querySelector(".video-js[data-video-id], [data-video-id]");
    let videoHref = "";
    const explicitLink = element.querySelector("a[href]");
    if (explicitLink && explicitLink.getAttribute("href")) {
      videoHref = explicitLink.href || explicitLink.getAttribute("href");
    } else if (player) {
      const account = player.getAttribute("data-account");
      const videoId = player.getAttribute("data-video-id");
      if (account && videoId) {
        videoHref = `https://players.brightcove.net/${account}/default_default/index.html?videoId=${videoId}`;
      }
    }
    if (!videoHref && !poster) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (poster) {
      cells.push([poster]);
    }
    const contentCell = [];
    if (headingEl) {
      const level = headingEl.getAttribute("aria-level") || "2";
      const heading = document.createElement(`h${/^[1-6]$/.test(level) ? level : "2"}`);
      heading.textContent = headingEl.textContent.trim();
      contentCell.push(heading);
    }
    if (videoHref) {
      const link = document.createElement("a");
      link.href = videoHref;
      link.textContent = videoHref;
      contentCell.push(link);
    }
    if (contentCell.length) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse6(element, { document }) {
    const rows = [];
    const buildImageCell = (scope) => {
      const img = scope.querySelector("img");
      if (!img) return null;
      const picture = img.closest("picture");
      if (picture) return picture;
      return img;
    };
    const buildContentBody = (scope) => {
      const body = [];
      const eyebrow = scope.querySelector(".card-eyebrow, .eyebrow");
      if (eyebrow) {
        const h = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = eyebrow.textContent.trim();
        h.append(strong);
        body.push(h);
      }
      const title = scope.querySelector(".card-title") || scope.querySelector("h1, h2, h3, h4, h5, h6");
      if (title) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        body.push(h);
      }
      const descriptions = scope.querySelectorAll(".card-description, .card-text-container p");
      if (descriptions.length) {
        descriptions.forEach((d) => {
          const p = document.createElement("p");
          p.textContent = d.textContent.trim();
          if (p.textContent) body.push(p);
        });
      }
      const ctaSpan = scope.querySelector(".card-cta");
      const anchor = scope.querySelector("a[href]");
      let ctaLabel = ctaSpan ? ctaSpan.textContent.trim() : "";
      if (anchor) {
        const link = document.createElement("a");
        link.href = anchor.href;
        const label = ctaLabel || (anchor.textContent || "").trim() || (title ? title.textContent.trim() : "") || "Learn More";
        link.textContent = label;
        body.push(link);
      } else if (ctaLabel) {
        const p = document.createElement("p");
        p.textContent = ctaLabel;
        body.push(p);
      }
      return body.length ? body : null;
    };
    const buildStatBody = (scope) => {
      const body = [];
      const eyebrow = scope.querySelector(".eyebrow");
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = eyebrow.textContent.trim();
        p.append(strong);
        body.push(p);
      }
      const dataPoint = scope.querySelector(".data-point");
      const suffix = scope.querySelector(".data-point-suffix");
      if (dataPoint) {
        const h = document.createElement("h3");
        const value = dataPoint.textContent.trim();
        const suffixText = suffix ? suffix.textContent.trim() : "";
        h.textContent = `${value}${suffixText}`;
        body.push(h);
      }
      const description = scope.querySelector(".description");
      if (description && description.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = description.textContent.replace(/\s+/g, " ").trim();
        body.push(p);
      }
      return body.length ? body : null;
    };
    let cardEls = Array.from(element.querySelectorAll(
      '.grid-cell, [class*="grid-row__col-with-"]'
    ));
    if (!cardEls.length) {
      cardEls = Array.from(element.querySelectorAll(
        ".cardpagestory, .dashboardcards, .cmp-dashboardcard"
      ));
    }
    cardEls.forEach((cell) => {
      const isStat = cell.querySelector(".cmp-dashboardcard, .dashboardcards, .data-point");
      const imageCell = buildImageCell(cell);
      const body = isStat ? buildStatBody(cell) : buildContentBody(cell);
      if (!body && !imageCell) return;
      const row = [];
      if (imageCell) row.push(imageCell);
      row.push(body || "");
      rows.push(row);
    });
    if (!rows.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [...rows];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk"
        // line 5288
      ]);
      element.querySelectorAll('img[src^="data:"]').forEach((img) => {
        const real = img.getAttribute("data-cmp-src") || img.getAttribute("data-src") || img.getAttribute("data-asset");
        if (real) {
          img.setAttribute("src", real);
        } else {
          img.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".experiencefragment.sticky-nav",
        // header XF wrapper, line 8
        ".cmp-experiencefragment--header",
        // header XF, line 9 (defensive)
        ".cmp-experiencefragment--footer",
        // footer XF, line 4792
        "link",
        // leftover clientlib stylesheet links, lines 10-11
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("data-cmp-hook-image");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && Array.isArray(payload.template.sections) ? payload.template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolved = sections.map((section) => {
      let target = null;
      if (section && section.selector) {
        try {
          target = element.querySelector(section.selector) || doc.querySelector(section.selector);
        } catch (e) {
          target = null;
        }
      }
      return { section, target };
    });
    const firstWithTarget = resolved.findIndex((r) => r.target);
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, target } = resolved[i];
      if (!target) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        target.after(metaBlock);
      }
      if (i > firstWithTarget && target.previousElementSibling) {
        const hr = doc.createElement("hr");
        target.before(hr);
      }
    }
  }

  // tools/importer/transformers/abbvie-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "carousel-press": parse2,
    "hero-cta": parse3,
    "hero-feature": parse4,
    "video-feature": parse5,
    "cards-feature": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AbbVie corporate home page with hero, press releases carousel, featured cards, video blocks, teasers, stats/impact grids, and content cards across multiple themed sections",
    urls: [
      "https://www.abbvie.com/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.homepage-hero-controller.aem-GridColumn.aem-GridColumn--default--12"
        ]
      },
      {
        name: "carousel-press",
        instances: [
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.homepage-overlap.medium-radius.cmp-container-xx-large.height-short.align-center.aem-GridColumn.aem-GridColumn--default--12"
        ]
      },
      {
        name: "hero-cta",
        instances: [
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)",
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.medium-radius.cmp-container-xxx-large.height-short.aem-GridColumn.aem-GridColumn--default--12"
        ]
      },
      {
        name: "video-feature",
        instances: [
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.video.cmp-video-xx-large.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(4)",
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.video.cmp-video-xx-large.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(8)"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)",
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.cmp-container-large.aem-GridColumn.aem-GridColumn--default--12",
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.cmp-grid-custom.aem-GridColumn.aem-GridColumn--default--12",
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(16)",
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.large-radius.cmp-container-full-width.height-default.no-bottom-margin.aem-GridColumn.aem-GridColumn--default--12"
        ]
      },
      {
        name: "hero-feature",
        instances: [
          "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.default-radius.cmp-container-xxx-large.height-default.align-center.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "Press Releases",
        selector: "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.homepage-overlap.medium-radius.cmp-container-xx-large.height-short.align-center.aem-GridColumn.aem-GridColumn--default--12",
        style: "light",
        blocks: ["carousel-press"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Patients Intro CTA",
        selector: "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.teaser.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)",
        style: "light",
        blocks: ["hero-cta"],
        defaultContent: []
      },
      {
        id: "rc7",
        name: "Featured Story",
        selector: "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.cmp-container-large.aem-GridColumn.aem-GridColumn--default--12",
        style: "accent",
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "rc11",
        name: "Explore Opportunities CTA",
        selector: "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.medium-radius.cmp-container-xxx-large.height-short.aem-GridColumn.aem-GridColumn--default--12",
        style: "dark",
        blocks: ["hero-cta"],
        defaultContent: []
      },
      {
        id: "rc13",
        name: "Investor Resources",
        selector: "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.grid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(16)",
        style: "accent",
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "rc16",
        name: "ESG Module",
        selector: "#maincontent > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.abbvie-container.large-radius.cmp-container-full-width.height-default.no-bottom-margin.aem-GridColumn.aem-GridColumn--default--12",
        style: "light",
        blocks: ["cards-feature"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
