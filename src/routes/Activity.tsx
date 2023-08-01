import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { log, logWarn } from "../../utils/logs/log";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {};

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

function Activity({}: Props) {
  const { isAuthenticated, user, logout } = useAuth0();
  const [count, setCount] = useState(0);

  // TODO: Fix ReactQuery defaults
  //   - https://medium.com/in-the-weeds/fetch-a-query-only-once-until-page-refresh-using-react-query-a333d00b86ff

  // useQuery syntax
  //  data      = Return data from query
  //  isLoading = true if still loading. Allows us to render conditionally
  //  isError   = true if an error occurred during the query
  //  queryKey  = used for caching
  //  queryFn   = function used to actually query some API and return to useQuery
  const {
    data: currUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["data"],
    refetchOnWindowFocus: false,
    // refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      log("inside query", user?.email);
      const url = `${process.env.BASE_API_URL}/user`;
      const { data } = await axios.get(url, {
        params: {
          UserEmail: user?.email,
        },
      });
      //   log("Got data", data);
      setCount(data.user.CurrCount);
      // Casting the data to our known schema before returning, for maximum type-safety
      return data.user as User;
    },
  });

  const { mutate: saveCount } = useMutation({
    mutationKey: ["save-count"],
    mutationFn: async () => {
      const url = `${process.env.BASE_API_URL}/save-count`;
      const { data } = await axios.post(url, {
        UserID: currUser?.UserID,
        NewCount: count,
      });

      return data;
    },
  });

  const { mutate: customerPortal } = useMutation({
    mutationKey: ["customer-portal"],
    mutationFn: async () => {
      const url = `${process.env.BASE_API_URL}/stripe/create-portal-session`;
      const { data } = await axios.post(url, {
        UserID: currUser?.UserID,
        StripeCustomerID: currUser?.StripeCustomerID,
      });

      console.log("Return data for customer portal", data);
      window.location.href = data.sessionURL;

      return data;
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    log("About to redirect", { user, currUser });
    if (!isLoading && user && currUser?.SubscriptionStatus != "Active") {
      window.location.href = "/subscription";
    }
  }, [user, currUser, isLoading]);

  const updateCount = (type: string, num: number) => {
    let newCount = count;
    switch (type) {
      case "add":
        newCount += num;
        break;
      case "sub":
        newCount -= num;
        break;
      case "mul":
        newCount *= num;
        break;
    }

    if (newCount >= 10000000) {
      newCount = 10000000;
    }
    if (newCount < 0) {
      newCount = 0;
    }

    setCount(newCount);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-primary flex flex-col justify-center items-center space-y-8 text-white font-bold">
        <h1>Loading...</h1>
      </div>
    );
  }

  log("User", currUser);

  return (
    <div className="h-screen bg-primary flex flex-col items-center text-white font-bold">
      <div className="w-[75%]">
        {/* Top Banner */}
        <div className="mt-5 flex justify-between items-center">
          <div className="text-3xl">Welcome, {currUser?.UserName}!</div>
          <div
            onClick={() => logout()}
            className="text-xl hover:underline hover:cursor-pointer"
          >
            Logout
          </div>
        </div>

        <hr className="my-4" />

        {/* Subscription Details section */}
        <div>
          <div className="text-center text-2xl italic mb-6">
            Subscription Details
          </div>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="underline">Subscription Status</div>
              <div className="text-green-500">
                {currUser?.SubscriptionStatus}
              </div>
            </div>
            <div className="text-center">
              <div className="underline">Subscription Ends</div>
              <div>{currUser?.EndDateTime?.substring(0, 10)}</div>
            </div>
            <div>
              <button
                onClick={() => customerPortal()}
                className="border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
              >
                Update Subscription Details
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Counter section */}
        <div>
          <div className="flex justify-center items-center space-x-4 mb-10">
            <div className="text-2xl">Current Count:</div>
            <div className="text-5xl">{count}</div>
          </div>

          <div className="flex items-center justify-around">
            {/* Counter controls */}
            <div className="flex space-x-4">
              <div className="flex flex-col text-center space-y-2">
                <div>Add</div>
                <button
                  onClick={() => updateCount("add", 1)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  +1
                </button>
                <button
                  onClick={() => updateCount("add", 5)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  +5
                </button>
                <button
                  onClick={() => updateCount("add", 10)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  +10
                </button>
              </div>
              <div className="flex flex-col text-center space-y-2">
                <div>Subtract</div>
                <button
                  onClick={() => updateCount("sub", 1)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  -1
                </button>
                <button
                  onClick={() => updateCount("sub", 5)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  -5
                </button>
                <button
                  onClick={() => updateCount("sub", 10)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  -10
                </button>
              </div>
              <div className="flex flex-col text-center space-y-2">
                <div>Multiply</div>
                <button
                  onClick={() => updateCount("mul", 2)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  x2
                </button>
                <button
                  onClick={() => updateCount("mul", 5)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  x5
                </button>
                <button
                  onClick={() => updateCount("mul", 10)}
                  className="h-16 w-16 align-middle table-cell border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
                >
                  x10
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => saveCount()}
              className="h-fit text-2xl border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(Activity);
