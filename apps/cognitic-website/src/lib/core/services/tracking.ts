import { browser } from '$app/environment';
import { PUBLIC_ANALYTICS_WRITE_KEY } from '$env/static/public';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { Log } from './logging';

let analytics: AnalyticsBrowser | null = null;

export function loadAnalytics(): void {
  if (!browser) return;
  Log.DEBUG('Load analytics');
  analytics = AnalyticsBrowser.load(
    {
      writeKey: PUBLIC_ANALYTICS_WRITE_KEY
      // cdnURL: '/api/tracking'
    }
    // {
    //   integrations: {
    //     'Segment.io': { apiHost: PUBLIC_ANALYTICS_API_HOST }
    //   }
    // }
  );
}

type Properties = {
  [key: string]: number | string | boolean | null | undefined;
};

export function trackEvent(event: string, properties?: Properties): void {
  if (!browser || !analytics) return;

  try {
    // see https://segment.com/docs/connections/spec/track/
    Log.DEBUG('Track event', { event, properties });
    analytics.track(event, properties);
  } catch (e) {
    Log.ERROR('Tracking event failed', e);
  }
}

export function trackPage(category: string, properties?: Properties): void {
  if (!browser || !analytics) return;

  try {
    // see https://segment.com/docs/connections/spec/page/
    Log.DEBUG('track page', { category, properties });
    analytics.page(category, '', properties);
  } catch (e) {
    Log.ERROR('Tracking page failed', e);
  }
}

export function trackIdentify(userId: string, traits?: Properties): void {
  if (!browser || !analytics) return;

  try {
    // see https://segment.com/docs/connections/spec/identify/
    Log.DEBUG('Track identify', { userId, traits });
    analytics.identify(userId, traits);
  } catch (e) {
    Log.ERROR('Tracking identify failed', e);
  }
}

export function resetAnalytics(): void {
  if (!browser || !analytics) return;
  analytics.reset();
}
