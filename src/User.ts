import { logError } from "../utils/log";
import { getUserFromAPI } from "./Queries";

export type User = {
  UserID: string;
  UserName: string;
  UserEmail: string;
  CurrCount: number;
  SubscriptionStatus: string;
  IsInTrial: string;
  StartDateTime: string;
  EndDateTime: string;
  StripeCustomerID: string;
};

export const getUserDetails = (userEmail: string | undefined) => async () => {
  if (!userEmail) return undefined;

  const user = await getUserFromAPI(userEmail);

  if (!user) {
    logError("[User.ts] (getUserDetails) No user details found");
    return undefined;
  }

  // Casting the data to our known schema before returning, for maximum type-safety
  return user;
};

export const updateUserCount =
  (newCount: number) =>
  (old: User | undefined): User | undefined => {
    if (!old) return undefined;
    return {
      ...old,
      CurrCount: newCount,
    };
  };
