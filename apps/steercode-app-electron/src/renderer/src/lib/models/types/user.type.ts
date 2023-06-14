export type StripeInfo = {
  customer_id: string;
  subscription_id: string | null;
  subscribed_until: string | null;
};

export type UserSubscription = {
  uid: string;
  stripe?: StripeInfo | null;
};

export type User = UserSubscription & {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
