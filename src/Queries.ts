import { getAPIResponse } from "../utils/api";
import { User } from "./User";
import { SubItem } from "./components/SubItemCard";

export const getUserFromAPI = async (userEmail: string) => {
  const data = await getAPIResponse("GET", "/user", {
    UserEmail: userEmail,
  });

  if (!data) {
    return undefined;
  }

  // Casting the data to our known schema before returning, for maximum type-safety
  return data.user as User;
};

export const saveNewCount =
  (userID: string | undefined, newCount: number) => async () => {
    if (!userID) return 0;

    const newCountRes = await getAPIResponse("POST", "/save-count", {
      UserID: userID,
      NewCount: newCount,
    });
    return newCountRes as number;
  };

export const getStripeSubscriptions = async () => {
  const product_data = await getAPIResponse(
    "GET",
    "/stripe/get-product-details"
  );

  return product_data.items as SubItem[];
};

export const getStripePaymentSessionURL = async (subItem: SubItem) => {
  const { sessionURL } = await getAPIResponse(
    "POST",
    "/stripe/create-checkout-session",
    {
      subFrequency: subItem.product.price.frequency,
      subPrice: subItem.product.price.amount,
    }
  );
  return sessionURL;
};

export const getStripeCustomerSessionURL = async (user: User) => {
  const { sessionURL } = await getAPIResponse(
    "POST",
    "/stripe/create-portal-session",
    {
      UserID: user.UserID,
      StripeCustomerID: user.StripeCustomerID,
    }
  );

  return sessionURL;
};

export const QueryKey = {
  GET_USER_DETAILS: ["GET_USER_DETAILS"],
  SAVE_COUNT: ["SAVE_COUNT"],
  GET_STRIPE_SUB_DETAILS: ["GET_SUB_DETAILS"],
  GET_STRIPE_PAY_URL: ["GET_STRIPE_PAY_URL"],
  GET_STRIPE_CUSTOMER_URL: ["GET_STRIPE_CUSTOMER_URL"],
};
