import React, { useEffect, useMemo, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { getExplorer } from "../../../constants/networks";
import Address from "./Address";
import MotionButton from "../../../UI/MotionButton";
interface ConnectModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  disconnect: () => Promise<void>;
  anchorEl: any;
  id: string;
}

const DisconnectModal: React.FC<ConnectModalProps> = ({
  isModalOpen,
  handleClose,
  disconnect,
  anchorEl,
  id,
}) => {
  const { account, chainId } = useWeb3React();

  const panelRef = useRef<HTMLDivElement>(null);
  const coords = useMemo(() => {
    if (!anchorEl) return { top: 0, left: 0 };
    const rect = anchorEl.getBoundingClientRect();
    return { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX };
  }, [anchorEl]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    const onClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [isModalOpen, handleClose, anchorEl]);

  if (!isModalOpen) return null;

  return (
    <div
      id={id}
      className="fixed z-50"
      style={{ top: coords.top, left: coords.left }}
      role="dialog"
      aria-modal="false"
    >
      <div
        ref={panelRef}
        className="w-[25rem] rounded-lg bg-[rgba(34,51,123,0.6)] p-3 shadow-xl backdrop-blur-[147px] text-white"
      >
        <div className="mb-3 flex items-center">
          <h3 className="text-2xl font-semibold text-[#00FFF8]">Account</h3>
          <button
            type="button"
            onClick={handleClose}
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
        <div className="mb-3 h-1 w-16 rounded bg-[#00FFF8]" />

        <Address
          avatar="left"
          size={15}
          copyable
          style={{ fontSize: "20px", width: "100%", marginBottom: "1rem" }}
        />

        <div className="flex w-full items-center justify-center gap-2">
          {chainId !== undefined && (
            <button
              type="button"
              className="relative rounded-[10px] px-2 py-1.5 text-white"
              onClick={() => {
                window.open(
                  `${getExplorer(chainId)}/address/${account}`,
                  "_blank"
                );
              }}
            >
              <span className="absolute inset-0 rounded-[10px] p-[2px] [background:linear-gradient(to_right,#FF49C1,#00FFF8)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
              <span className="relative z-10">View on Explorer</span>
            </button>
          )}

          <MotionButton
            label="Disconnect Wallet"
            customStyles={{
              fontSize: "14px",
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 6,
              paddingBottom: 6,
              backgroundColor: "#17ECF0",
              fontFamily: "montserrat-bold",
              color: "#131D4B",
            }}
            onClick={() => disconnect()}
          />
        </div>
      </div>
    </div>
  );
};

export default DisconnectModal;
