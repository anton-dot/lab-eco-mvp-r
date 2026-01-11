import { initializeConnector } from "@web3-react/core";
import { Network } from "@web3-react/network";

// Define custom URLs for the network connector
const CUSTOM_URLS: { [chainId: number]: string[] } = {
  80001: [
    "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    "https://rpc-mumbai.maticvigil.com",
    "https://matic-mumbai.chainstacklabs.com",
    "https://rpc.ankr.com/polygon_mumbai"
  ]
};

export const [network, hooks] = initializeConnector<Network>((actions) => 
  new Network({ 
    actions, 
    urlMap: CUSTOM_URLS 
  })
);
