import {
  getStripeCustomerSessionURL,
  getStripePaymentSessionURL,
  getStripeSubscriptions,
} from "./Queries";
import { User } from "./User";
import { SubItem } from "./components/SubItemCard";

export const navigateToCustomerPortal =
  (user: User | undefined) => async () => {
    if (user) {
      window.location.href = await getStripeCustomerSessionURL(user);
    }
  };

export const navigateToPaymentSession = (subItem: SubItem) => async () => {
  window.location.href = await getStripePaymentSessionURL(subItem);
};

export const getSubscriptionDetails = getStripeSubscriptions;
