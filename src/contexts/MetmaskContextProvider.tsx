/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  createContext,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { ethers, BigNumber } from "ethers";

import EacAggregatorProxyContractAbi from "../contract/abi/EACAggregatorProxyAbi.json";
import LumanagiPredictionV1Abi from "../contract/abi/LumanagiPredictionV1Abi.json";

import {
  EAC_AGGREGATOR_PROXY_ADDRESS,
  LUMANAGI_PREDICTION_V1_ADDRESS,
} from "../constants/contract";
import { useWeb3React } from "@web3-react/core";

type MetamaskContextType = {
  errorMessage: null | string;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  balance: null | BigNumber;
  setBalance: Dispatch<SetStateAction<BigNumber | null>>;
  eacAggregatorProxyContract: any;
  lumanagiPredictionV1Contract: any;
  postTransaction: (
    to: string,
    data: string,
    value?: number | BigNumber,
    from?: string,
    callback?: Function
  ) => void;
  getBalance: () => Promise<BigNumber>;
  lumanagiPredictionV1ContractSocket: any;
};

export const MetmaskContext = createContext<MetamaskContextType>({
  errorMessage: null,
  setErrorMessage: () => null,
  balance: null,
  setBalance: () => null,
  eacAggregatorProxyContract: null,
  lumanagiPredictionV1Contract: null,
  lumanagiPredictionV1ContractSocket: null,
  postTransaction: () => {},
  getBalance: () => Promise.resolve(BigNumber.from(0)),
});

const MetmaskContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const { provider, chainId } = useWeb3React();

  const [balance, setBalance] = useState<null | BigNumber>(null);

  const [eacAggregatorProxyContract, setEacAggregatorProxyContract] =
    useState<any>(null);
  const [lumanagiPredictionV1Contract, setLumanagiPredictionV1Contract] =
    useState<any>(null);
  const [
    lumanagiPredictionV1ContractSocket,
    setLumanagiPredictionV1ContractSocket,
  ] = useState<any>(null);

  const [signer, setSigner] = useState<any | ethers.providers.JsonRpcSigner>(
    null
  );

  /**
   * creates contract objects and assigns provider
   */
  const setContracts = async () => {
    if (provider) {
      try {
        // Create ethers providers for contract interactions
        const httpProvider = new ethers.providers.JsonRpcProvider(
          "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        );
        
        // Create WebSocket provider for socket connections
        const wsProvider = new ethers.providers.WebSocketProvider(
          "wss://polygon-mumbai.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        );
        
        const eacContract = new ethers.Contract(
          EAC_AGGREGATOR_PROXY_ADDRESS,
          EacAggregatorProxyContractAbi as any,
          httpProvider
        );
        const lumangiContract = new ethers.Contract(
          LUMANAGI_PREDICTION_V1_ADDRESS,
          LumanagiPredictionV1Abi as any,
          httpProvider
        );

        const socketInstance = new ethers.Contract(
          LUMANAGI_PREDICTION_V1_ADDRESS,
          LumanagiPredictionV1Abi as any,
          wsProvider
        );
        
        setEacAggregatorProxyContract(eacContract);
        setLumanagiPredictionV1Contract(lumangiContract);
        setLumanagiPredictionV1ContractSocket(socketInstance);
        
        // Create ethers provider and signer
        if (window.ethereum) {
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setSigner(ethersProvider.getSigner());
        }
      } catch (error) {
        console.error("Error setting up contracts:", error);
        setErrorMessage("Failed to connect to the blockchain network");
      }
    }
  };

  /**
   *
   */
  const getBalance = async () => {
    if (window.ethereum) {
      try {
        if (window.ethereum.selectedAddress) {
          const balance = (await provider?.getBalance(
            window.ethereum.selectedAddress
          )) as BigNumber;

          return balance;
        }
        return BigNumber.from(0);
      } catch (error) {
        console.error("LL: getBalance -> error", error);
        throw error;
      }
    } else {
      throw new Error("Install MetaMask");
    }
  };

  /**
   * Handles post call of contracts
   * @param to smart contract address
   * @param data encoded abi of function
   * @param value value to be sent[Optional]
   * @param from from account[Optional]
   */

  const postTransaction = async (
    to: string,
    data: string,
    value?: BigNumber | number,
    from?: string,
    callback?: Function
  ) => {
    let signerTemp = (provider as ethers.providers.Web3Provider).getSigner();
    if (!signer) {
      // connectHandler();
    }

    const fromTemp = from ? from : await signerTemp.getAddress();
    const tx = {
      from: fromTemp,
      to,
      value: value ? (value as BigNumber)._hex : undefined,
      data,
    };

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
    if (txHash) {
      if (callback) {
        callback(txHash);
      }
    }
  };

  useEffect(() => {
    if (provider) {
      setContracts();
    }
  }, [provider, chainId]);

  return (
    <MetmaskContext.Provider
      value={{
        errorMessage,
        setErrorMessage,
        balance,
        setBalance,
        eacAggregatorProxyContract,
        lumanagiPredictionV1Contract,
        postTransaction,
        getBalance,
        lumanagiPredictionV1ContractSocket,
      }}
    >
      {children}
    </MetmaskContext.Provider>
  );
};

export default MetmaskContextProvider;
