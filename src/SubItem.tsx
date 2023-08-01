import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { log } from "../utils/logs/log";

type Highlight = {
  isHighlighted: boolean;
  highlightText: string;
};

type Price = {
  amount: number;
  frequency: "month" | "year";
};

type Product = {
  name: string;
  description: string;
  price: Price;
};

type SubItem = {
  highlight: Highlight;
  isTestMode: boolean;
  product: Product;
  buttonText: string;
};

type Props = {
  subItem: SubItem;
  userEmail: string;
  customerID: string;
};

function SubItem({ subItem, userEmail, customerID }: Props) {
  log("Sub Item Props", { subItem, userEmail, customerID });
  const { mutate: openPaymentSession } = useMutation({
    mutationKey: ["create-subscription-payment-session"],
    mutationFn: async () => {
      const url = `${process.env.BASE_API_URL}/stripe/create-checkout-session`;
      const { data } = await axios.post(url, {
        stripeCustomerID: customerID,
        userEmail: userEmail,
        subFrequency: subItem.product.price.frequency,
        subPrice: subItem.product.price.amount,
      });

      log("data from useMutation", data);
      window.location.href = data.sessionURL;

      return data;
    },
  });

  return (
    <div className="flex flex-col items-center border border-[#575757] bg-[#2D2D2D] rounded-md p-8 w-72">
      <div className="w-full">
        <div className="h-6 flex space-x-3">
          {subItem.highlight.isHighlighted && (
            <div className="h-fit bg-black p-1 rounded-md animate-[bounce_1500ms_ease-in-out_infinite]">
              <div className="text-xs flex items-center justify-center">
                {subItem.highlight.highlightText}
              </div>
            </div>
          )}
          {subItem.isTestMode && (
            <div className="h-fit bg-[#FFDE92] px-2 text-xs text-[#BC7237] rounded-sm flex items-center justify-center">
              TEST MODE
            </div>
          )}
        </div>
        <div
          className={`text-xl font-semibold ${
            (subItem.highlight.isHighlighted || subItem.isTestMode) && "mt-4"
          } mb-2`}
        >
          {subItem.product.name}
        </div>
        <div className="text-sm font-normal text-[#B1B1B1]">
          {subItem.product.description}
        </div>

        <div className="flex items-center space-x-1 mt-8 mb-6">
          <div className="text-4xl font-bold">
            {"$" + subItem.product.price.amount.toFixed(0)}
          </div>
          <div className="text-sm font-medium text-[#B1B1B1]">
            <div className="-mb-1">per</div>
            <div>{subItem.product.price.frequency}</div>
          </div>
        </div>

        <button
          onClick={() => openPaymentSession()}
          className="bg-[#0074D4] w-full rounded-md py-2"
        >
          {subItem.buttonText}
        </button>
      </div>
    </div>
  );
}

export default SubItem;
