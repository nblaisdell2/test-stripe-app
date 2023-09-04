import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { log, logError } from "../../utils/log";
import { useSQLQuery } from "../hooks/useSQLQuery";
import { useSQLMutation } from "../hooks/useSQLMutation";
import LoadingScreen from "../components/LoadingScreen";
import { getUserDetails, updateUserCount } from "../User";
import { QueryKey, saveNewCount, saveNewCountError } from "../Queries";
import { navigateToCustomerPortal } from "../Stripe";

const MAX_COUNT = 10000000;

function useActivity() {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  const [count, setCount] = useState(-1);

  const {
    data: currUser,
    isLoading,
    isError,
  } = useSQLQuery(QueryKey.GET_USER_DETAILS, getUserDetails(user?.email));

  const { mutate: saveCount, error: saveCountErr } = useSQLMutation(
    QueryKey.SAVE_COUNT,
    saveNewCount(currUser?.UserID, count),
    QueryKey.GET_USER_DETAILS,
    false,
    updateUserCount(count),
    3000,
    async () => {
      if (currUser) setCount(currUser.CurrCount);
    }
  );

  const { mutate: saveCountWithError, error: saveCountWithErrorErr } =
    useSQLMutation(
      QueryKey.SAVE_COUNT_WITH_ERROR,
      saveNewCountError(currUser?.UserID, count),
      QueryKey.GET_USER_DETAILS,
      false,
      updateUserCount(count),
      3000,
      async () => {
        if (currUser) setCount(currUser.CurrCount);
      }
    );

  const { mutate: customerPortal } = useSQLMutation(
    QueryKey.GET_STRIPE_CUSTOMER_URL,
    navigateToCustomerPortal(currUser)
  );

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

    if (newCount >= MAX_COUNT) {
      newCount = MAX_COUNT;
    }
    if (newCount < 0) {
      newCount = 0;
    }

    setCount(newCount);
  };

  useEffect(() => {
    if (currUser) {
      if (currUser?.SubscriptionStatus != "Active") {
        navigate("/subscription");
      }

      setCount(currUser.CurrCount);
    }
  }, [currUser]);

  return {
    isLoading,
    isError,
    currUser,
    count,
    logout,
    updateCount,
    saveCount,
    saveCountErr,
    saveCountWithError,
    saveCountWithErrorErr,
    customerPortal,
  };
}

function Activity() {
  const {
    isLoading,
    isError,
    currUser,
    count,
    logout,
    updateCount,
    saveCount,
    saveCountErr,
    saveCountWithError,
    saveCountWithErrorErr,
    customerPortal,
  } = useActivity();

  if (isError) {
    return (
      <div className="h-screen bg-primary flex flex-col justify-center items-center space-y-8 text-white font-bold">
        <h1 className="text-red-500">Error!</h1>
      </div>
    );
  }

  if (isLoading || currUser?.SubscriptionStatus != "Active" || count < 0) {
    return <LoadingScreen />;
  }

  log("[Activity.tsx]", currUser);

  return (
    <div className="h-screen bg-primary flex flex-col items-center text-white font-bold">
      <div className="w-[75%]">
        {/* Top Banner */}
        <div className="mt-5 flex justify-between items-center">
          <div className="text-3xl">Welcome, {currUser?.UserName}!</div>
          <div>
            <Link to={"/test"}>Test Page</Link>
          </div>
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

            <div className="flex flex-col items-center space-y-4">
              {(saveCountErr || saveCountWithErrorErr) && (
                <div className="flex flex-col items-center text-yellow-300">
                  <div>Error updating count!</div>
                  <div>Reverting to previous value</div>
                </div>
              )}
              {/* Save Button */}
              <button
                onClick={() => saveCount()}
                disabled={saveCountErr || saveCountWithErrorErr}
                className="h-fit text-2xl border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
              >
                Save
              </button>
              <button
                onClick={() => saveCountWithError()}
                disabled={saveCountErr || saveCountWithErrorErr}
                className="h-fit text-2xl border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
              >
                Save w/ Error
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity;
