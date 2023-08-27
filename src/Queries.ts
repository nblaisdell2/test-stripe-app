import { getAPIResponse } from "../utils/api";
import { log } from "../utils/log";
import { User } from "./User";
import { SubItem } from "./components/SubItemCard";

export const getUserFromAPI = async (userEmail: string) => {
  log("Running API Query: 'getUserFromAPI'");

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

    log("Running API Query: 'saveNewCount'");

    const newCountRes = await getAPIResponse("POST", "/save-count", {
      UserID: userID,
      NewCount: newCount,
    });
    return newCountRes as number;
  };

export const saveNewCountError =
  (userID: string | undefined, newCount: number) => async () => {
    if (!userID) return 0;

    log("Running API Query: 'saveNewCount'");

    const newCountRes = await getAPIResponse("POST", "/save-count-error", {
      UserID: userID,
      NewCount: newCount,
    });
    return newCountRes as number;
  };

export const getStripeSubscriptions = async () => {
  log("Running API Query: 'getStripeSubscriptions'");

  const product_data = await getAPIResponse(
    "GET",
    "/stripe/get-product-details"
  );

  return product_data.items as SubItem[];
};

export const getStripePaymentSessionURL = async (subItem: SubItem) => {
  log("Running API Query: 'getStripePaymentSessionURL'");

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
  log("Running API Query: 'getStripeCustomerSessionURL'");

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
  SAVE_COUNT_WITH_ERROR: ["SAVE_COUNT_WITH_ERROR"],
  GET_STRIPE_SUB_DETAILS: ["GET_SUB_DETAILS"],
  GET_STRIPE_PAY_URL: ["GET_STRIPE_PAY_URL"],
  GET_STRIPE_CUSTOMER_URL: ["GET_STRIPE_CUSTOMER_URL"],
};
