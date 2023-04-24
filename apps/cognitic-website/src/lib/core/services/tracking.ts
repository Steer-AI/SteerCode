import { AnalyticsBrowser } from '@segment/analytics-next';
import { Log } from './logging';
import { PUBLIC_ANALYTICS_API_HOST, PUBLIC_ANALYTICS_WRITE_KEY } from '$env/static/public';

export const analytics = AnalyticsBrowser.load(
  {
    writeKey: PUBLIC_ANALYTICS_WRITE_KEY,
    cdnURL: '/api/tracking'
  },
  {
    integrations: {
      'Segment.io': { apiHost: PUBLIC_ANALYTICS_API_HOST }
    }
  }
);

type TrackingOtions = {
  action: string;
  value?: string | number | boolean;
  metainfo?: unknown;

  page?: string;
  referrer?: string;
  url?: string;
};

export function trackEvent(
  eventName: string,
  options: TrackingOtions
): void {
  if (typeof window === 'undefined') return;

  try {
    options['url'] = options.url || window.location.href;
    options['page'] = options.page ||  window.location.pathname;
    options['referrer'] = options.referrer || document.referrer;

    Log.DEBUG('track event', { eventName, options });
    analytics && analytics.track(eventName, options);
  } catch (e) {
    Log.ERROR("Tracking failed", e);
  }
}
