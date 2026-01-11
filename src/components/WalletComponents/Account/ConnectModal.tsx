import React, { useEffect, useRef } from "react";

import coinbase_Logo from "../../assets/coinbase_Logo.png";
import metamask_Logo from "../../assets/svg/metamask_Logo.svg";
import walletconnect_Logo from "../../assets/svg/walletconnect_Logo.svg";
import { coinbaseWallet } from "../../../connectors/coinbaseWallet";
import { metaMask } from "../../../connectors/metaMask";
import { walletConnect } from "../../../connectors/walletConnect";
import ConnectButton from "./ConnectButton";
import { enqueueSnackbar } from "notistack";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWallet: React.Dispatch<
    React.SetStateAction<
      "MetaMask" | "WalletConnect" | "Coinbase Wallet" | null
    >
  >;
}

const ConnectModal: React.FC<ConnectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedWallet,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [isModalOpen, setIsModalOpen]);

  const activateConnector = async (label: string) => {
    try {
      switch (label) {
        case "MetaMask":
          await metaMask.activate();
          setSelectedWallet(label);
          window.localStorage.setItem("connectorId", "injected");
          break;

        case "WalletConnect":
          await walletConnect.activate();
          setSelectedWallet(label);
          window.localStorage.setItem("connectorId", "wallet_connect");
          break;

        case "Coinbase Wallet":
          await coinbaseWallet.activate();
          setSelectedWallet(label);
          window.localStorage.setItem("connectorId", "injected");
          break;

        default:
          break;
      }
    } catch (error: any) {
      if (error && error.message !== "User closed modal") {
        enqueueSnackbar(
          error && error.message ? error.message : "Something went wrong",
          {
            variant: "warning",
            autoHideDuration: 3000,
          }
        );
      }
    } finally {
      setIsModalOpen(false);
    }
  };
  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-your-wallet-title"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="w-full max-w-md rounded-[10px] bg-[rgba(34,51,123,0.6)] p-6 shadow-2xl backdrop-blur-[147px] outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center">
                <h2
                  id="connect-your-wallet-title"
                  className="text-2xl font-semibold text-[#00FFF8]"
                >
                  Connect Your Wallet
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4 h-1 w-16 rounded bg-[#00FFF8]" />

              <div className="flex flex-col items-center">
                <ConnectButton
                  label="MetaMask"
                  image={metamask_Logo}
                  onClick={() => activateConnector("MetaMask")}
                />
                <ConnectButton
                  label="WalletConnect"
                  image={walletconnect_Logo}
                  onClick={() => activateConnector("WalletConnect")}
                />
                <ConnectButton
                  label="Coinbase Wallet"
                  image={coinbase_Logo}
                  onClick={() => activateConnector("Coinbase Wallet")}
                />
              </div>

              <div className="mt-4 text-center text-white">
                <p className="mb-2 text-base font-medium">
                  Need help installing a wallet?
                  <a
                    className="ml-1 text-[#FF49C1] hover:underline"
                    href="https://metamask.zendesk.com/hc/en-us/articles/360015489471-How-to-Install-MetaMask-Manually"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here
                  </a>
                </p>
                <p className="text-sm opacity-90">
                  Wallets are provided by External Providers and by selecting
                  you agree to Terms of those Providers. Your access to the
                  wallet might be reliant on the External Provider being
                  operational.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectModal;
