import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { log } from "../../utils/logs/log";
import axios from "axios";
import { User } from "./Activity";

// Schema of return data from API
type Data = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const Home = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();

  const {
    data: currUser,
    isError,
    isLoading: isQueryLoading,
  } = useQuery({
    queryKey: ["data"],
    refetchOnWindowFocus: false,
    // refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!user?.email,
    queryFn: async () => {
      log("inside query", user?.email);
      const url = `${process.env.BASE_API_URL}/user`;
      const { data } = await axios.get(url, {
        params: {
          UserEmail: user?.email,
        },
      });
      //   log("Got data", data);
      // Casting the data to our known schema before returning, for maximum type-safety
      return data.user as User;
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!isQueryLoading) {
      log("About to redirect", { user, currUser });
      if (user && currUser?.SubscriptionStatus == "Active") {
        window.location.href = "/activity";
      } else {
        window.location.href = "/subscription";
      }
    }
  }, [user, currUser, isQueryLoading]);

  if (isLoading) {
    return (
      <div className="h-screen bg-primary flex flex-col justify-center items-center space-y-8 text-white font-bold">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-primary flex flex-col justify-center items-center space-y-8 text-white font-bold">
        <h1 className="text-5xl">Super-Duper Counter App</h1>
        <button
          onClick={() => {
            // console.log("Please show me this!");
            // console.log("What is this?", process.env.AUTH0_REDIRECT_URI);
            loginWithRedirect();
          }}
          className="border-2 border-white rounded-lg p-3 hover:bg-white hover:text-[#151515] transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  return <div>Uh oh!</div>;
};

export default Home;
