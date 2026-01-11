import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";

import { URLS } from "../constants/networks";

// Use type assertion to bypass the type checking issue
export const [coinbaseWallet, hooks] = initializeConnector<any>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        appName: "Lumangi",
        url: URLS[1][0],
      },
    })
);
