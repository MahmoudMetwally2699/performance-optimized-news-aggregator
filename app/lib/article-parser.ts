import { parse } from 'node-html-parser';

export async function parseArticleContent(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);

    // Common content selectors
    const selectors = ['article', '.article-content', '#storytext', '.story-body'];
    let content = '';

    for (const selector of selectors) {
      const element = root.querySelector(selector);
      if (element) {
        // Remove unwanted elements
        element.querySelectorAll('script, style, .ad').forEach(el => el.remove());
        content = element.innerHTML;
        break;
      }
    }

    return {
      content,
      images: root.querySelectorAll('img').map(img => img.getAttribute('src')).filter(Boolean)
    };
  } catch (error) {
    console.error('Failed to parse article:', error);
    return { content: '', images: [] };
  }
}
