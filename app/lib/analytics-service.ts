export async function trackAnalytics(articleId: string, action: 'view' | 'share' | 'favorite') {
  try {
    const baseUrl = window.location.origin;
    const res = await fetch(`${baseUrl}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        articleId,
        action,
        timestamp: new Date().toISOString()
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to track analytics');
    }

    return true;
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return false;
  }
}
