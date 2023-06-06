import type { RepositoryOption } from './conversation.type';

export type StripeInfo = {
  customer_id: string;
  subscription_id: string | null;
  subscribed_until: string | null;
};

export type UserInfo = {
  id: string;
  projects: RepositoryOption[];
  stripe: StripeInfo | null;
};

export type User = UserInfo & {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
