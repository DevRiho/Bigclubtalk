/**
 * A lightweight utility to parse Markdown-style text and newlines into formatted HTML.
 * Handles paragraphs, headings, blockquotes, lists, bold/italic text, links, and image tags.
 */
export function parseMarkdownToHtml(content) {
  if (!content) return "";

  // If the content already has structured HTML block tags (like <p>, <div>, <h1>, <blockquote),
  // we treat it as HTML but still process inline markdown tags (like markdown images or links)
  // that might have been mixed in by the editor.
  const hasHtmlBlocks = /<p|<div|<h[1-6]|<ul|<ol|<blockquote|<section/i.test(content);

  if (hasHtmlBlocks) {
    let processed = content;
    // Replace markdown images: ![alt](url) -> <img src="url" alt="alt" class="story-image" />
    processed = processed.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="story-image" />');
    // Replace markdown links: [text](url) -> <a href="url" class="story-link" target="_blank" rel="noopener noreferrer">$1</a>
    processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="story-link" target="_blank" rel="noopener noreferrer">$1</a>');
    return processed;
  }

  // Normalize line endings
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split into block elements by double newlines
  const blocks = normalized.split(/\n\n+/);
  
  const htmlBlocks = blocks.map(block => {
    let text = block.trim();
    if (!text) return "";

    // 1. Headings (###, ##, #)
    if (text.startsWith("### ")) {
      return `<h3 class="story-h3">${parseInlineMarkdown(text.slice(4))}</h3>`;
    }
    if (text.startsWith("## ")) {
      return `<h2 class="story-h2">${parseInlineMarkdown(text.slice(3))}</h2>`;
    }
    if (text.startsWith("# ")) {
      return `<h1 class="story-h1">${parseInlineMarkdown(text.slice(2))}</h1>`;
    }

    // 2. Blockquotes (>)
    if (text.startsWith(">")) {
      // Remove leading > from each line and join
      const lines = text.split("\n").map(line => line.replace(/^>\s*/, "")).join(" ");
      return `<blockquote class="story-blockquote">${parseInlineMarkdown(lines)}</blockquote>`;
    }

    // 3. Unordered Lists (- or *)
    if (text.startsWith("- ") || text.startsWith("* ")) {
      const items = text.split(/\n[*-]\s+/).map(item => {
        const cleanItem = item.replace(/^[*-]\s+/, "");
        return `<li class="story-li">${parseInlineMarkdown(cleanItem)}</li>`;
      });
      return `<ul class="story-ul">${items.join("")}</ul>`;
    }

    // 4. Ordered Lists (1., 2., etc.)
    if (/^\d+\.\s+/.test(text)) {
      const items = text.split(/\n\d+\.\s+/).map(item => {
        const cleanItem = item.replace(/^\d+\.\s+/, "");
        return `<li class="story-li">${parseInlineMarkdown(cleanItem)}</li>`;
      });
      return `<ol class="story-ol">${items.join("")}</ol>`;
    }

    // 5. Standalone Image tag ![alt](url)
    if (text.startsWith("![") && text.endsWith(")")) {
      const match = text.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return `<img src="${match[2]}" alt="${match[1]}" class="story-image" />`;
      }
    }

    // 6. Regular Paragraph
    // Convert single newlines inside paragraph blocks to <br /> tags
    const inlineParsed = parseInlineMarkdown(text).replace(/\n/g, "<br />");
    return `<p class="story-p">${inlineParsed}</p>`;
  });

  return htmlBlocks.filter(Boolean).join("\n");
}

/**
 * Parses inline elements like bold, italic, links, and images
 */
function parseInlineMarkdown(text) {
  let html = text;

  // Inline Images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="story-image" />');

  // Inline Links: [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="story-link" target="_blank" rel="noopener noreferrer">$1</a>');

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  return html;
}
