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
  isPremium: () => boolean;
};

export function isPremium(user: User): boolean {
  return (
    user.stripe !== null &&
    user.stripe.subscribed_until !== null &&
    new Date() < new Date(user.stripe.subscribed_until)
  );
}
