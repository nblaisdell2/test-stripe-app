import React, { useEffect } from "react";
import SubItem from "../SubItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { User } from "./Activity";
import { log } from "../../utils/logs/log";

type Props = {};

function Subscription({}: Props) {
  const { isAuthenticated, user, logout } = useAuth0();

  const { isLoading, data } = useQuery({
    queryKey: ["get-sub-details"],
    refetchOnWindowFocus: false,
    // refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      log("Getting data from user", user?.email);
      const url = `${process.env.BASE_API_URL}/user`;
      const { data } = await axios.get(url, {
        params: {
          UserEmail: user?.email,
        },
      });
      log("Got User Data", data);

      const product_url = `${process.env.BASE_API_URL}/stripe/get-product-details`;
      const { data: product_data } = await axios.get(product_url);
      log("Got Product Data", product_data);

      return {
        products: product_data.items as SubItem[],
        user: data.user as User,
      };
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/";
    }

    // log("About to redirect", { authUser: user, myUser: data?.user });
    if (!isLoading && user && data?.user?.SubscriptionStatus == "Active") {
      window.location.href = "/activity";
    }
  }, [isAuthenticated, isLoading, data?.user]);

  log("Data from useQuery", { data, user });

  if (isLoading || !data?.user) {
    return <div>Still Loading...</div>;
  }

  return (
    <div className="h-screen bg-primary text-white font-bold flex flex-col space-y-5 justify-center items-center">
      <div>Select a subscription to get started.</div>
      {/* <div className="border border-red-500">
        <stripe-pricing-table
          pricing-table-id="prctbl_1NZhIuIJJf7l1lt3GW8oeI5H"
          publishable-key="pk_test_51NZauGIJJf7l1lt3k2IPU1lG8rqCwn1DxuFdojpOSGukPcSiQLkSdZIw9XbHzkz11z17cBHhCckNnNLl5qT8nQJN002RYpUiX7"
        />
      </div> */}
      <div className=" flex space-x-4">
        {data.products.map((d, i) => {
          return (
            <SubItem
              key={i}
              subItem={d}
              userEmail={data.user.UserEmail}
              customerID={data.user.StripeCustomerID}
            />
          );
        })}
      </div>
    </div>
  );
}

export default withAuthenticationRequired(Subscription);
