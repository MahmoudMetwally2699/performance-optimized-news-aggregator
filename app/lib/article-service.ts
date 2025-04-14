export async function trackArticleView(articleId: string) {
  try {
    const url = new URL(`/api/articles/${articleId}/view`, window.location.origin);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error(`Failed to track view: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to track article view:', error);
    return false;
  }
}
