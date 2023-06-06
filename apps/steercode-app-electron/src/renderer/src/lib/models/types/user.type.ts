import type { RepositoryOption } from './conversation.type';

export type StripeInfo = {
  customer_id: string;
  subscription_id: string | null;
  subscribed_until: string | null;
};

export type User = {
  id: string;
  projects: RepositoryOption[];
  stripe: StripeInfo | null;
};
