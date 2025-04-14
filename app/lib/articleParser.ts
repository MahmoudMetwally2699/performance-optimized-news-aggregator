import { load } from 'cheerio';

export async function fetchFullContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    // Remove unwanted elements
    $('script, style, iframe, nav, header, footer, .ads, #ads, .advertisement').remove();

    // Try different content selectors in order of preference
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.article-content',
      '.story-content',
      '.post-content',
      '.entry-content',
      '#content-body',
      '.story-body'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length) {
        // Clean up the content
        element.find('script, style, iframe').remove();
        return element.text().trim();
      }
    }

    // Fallback: try to find the largest text block
    const paragraphs = $('p');
    if (paragraphs.length > 0) {
      return paragraphs.map((_, el) => $(el).text()).get().join('\n\n');
    }

    return null;
  } catch (error) {
    console.error('Error fetching article content:', error);
    return null;
  }
}
