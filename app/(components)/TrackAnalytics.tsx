'use client';

import { useEffect } from 'react';
import { trackAnalytics } from '../lib/analytics-service';

export function TrackAnalytics({ articleId, action }: { articleId: string; action: string }) {
  useEffect(() => {
    trackAnalytics(articleId, action as 'view' | 'share' | 'favorite');
  }, [articleId, action]);

  return null;
}
