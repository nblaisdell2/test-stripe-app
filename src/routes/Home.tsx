import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { useSQLQuery } from "../hooks/useSQLQuery";
import { logError } from "../../utils/log";
import LoadingScreen from "../components/LoadingScreen";
import { getUserDetails } from "../User";
import { QueryKey } from "../Queries";

const Home = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const {
    data: currUser,
    isError,
    isLoading: isQueryLoading,
  } = useSQLQuery(
    QueryKey.GET_USER_DETAILS,
    getUserDetails(user?.email),
    !!user?.email
  );

  useEffect(() => {
    if (!isQueryLoading) {
      if (user && currUser?.SubscriptionStatus == "Active") {
        navigate("/activity");
      } else {
        navigate("/subscription");
      }
    }
  }, [isQueryLoading]);

  if (isLoading || isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen bg-primary flex flex-col justify-center items-center space-y-8 text-white font-bold">
      <h1 className="text-5xl">Super-Duper Counter App</h1>
      <button
        onClick={() => {
          loginWithRedirect();
        }}
        className="border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
      >
        Sign In
      </button>
    </div>
  );
};

export default Home;
