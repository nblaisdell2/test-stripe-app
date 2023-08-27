import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSQLQuery } from "../hooks/useSQLQuery";
import { logError } from "../../utils/log";

import SubItemCard from "../components/SubItemCard";
import LoadingScreen from "../components/LoadingScreen";
import { QueryKey } from "../Queries";
import { getUserDetails } from "../User";
import { getSubscriptionDetails } from "../Stripe";

function Subscription() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const { isLoading, data } = useSQLQuery(
    QueryKey.GET_USER_DETAILS,
    getUserDetails(user?.email)
  );

  const { data: prodData } = useSQLQuery(
    QueryKey.GET_STRIPE_SUB_DETAILS,
    getSubscriptionDetails,
    !!data && data.SubscriptionStatus !== "Active"
  );

  useEffect(() => {
    if (!isLoading && data?.SubscriptionStatus == "Active") {
      navigate("/activity");
    }
  }, [data]);

  if (!(prodData && data)) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen bg-primary text-white font-bold flex flex-col space-y-5 justify-center items-center">
      <div>Select a subscription to get started.</div>

      <div className=" flex space-x-4">
        {prodData.map((d, i) => {
          return <SubItemCard key={i} subItem={d} />;
        })}
      </div>
    </div>
  );
}

export default Subscription;
