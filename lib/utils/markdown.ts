const MARKDOWN_IMAGE_PATTERN = /!\[[^\]]*]\([^)]*\)/g;
const MARKDOWN_LINK_PATTERN = /\[(.*?)\]\([^)]*\)/g;
const MARKDOWN_SYMBOL_PATTERN = /[#>*_`~-]/g;

/**
 * Removes basic Markdown syntax so that only readable text remains.
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(MARKDOWN_IMAGE_PATTERN, '')
    .replace(MARKDOWN_LINK_PATTERN, (_, text: string) => text || '')
    .replace(MARKDOWN_SYMBOL_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
}

