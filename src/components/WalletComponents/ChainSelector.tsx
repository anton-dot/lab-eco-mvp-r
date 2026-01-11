import { useEffect, useMemo, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { useSwitchChain } from "../../hooks/useSwitchChain";

import ethereum_Logo from "../assets/ethereum_Logo.png";
import bsc_Logo from "../assets/svg/bsc_Logo.svg";

function ChainSelector() {
  const switchChain = useSwitchChain();
  const { chainId, isActive } = useWeb3React();
  const [selected, setSelected] = useState<any>(1);

  const labelToShow = (logo: string, alt: string) => {
    return (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <img
          src={logo}
          alt={alt}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            marginRight: "5px",
          }}
        />
      </div>
    );
  };

  const items = useMemo(
    () => [
      {
        label: "Ethereum",
        key: "1",
        icon: labelToShow(ethereum_Logo, "Ethereum_logo"),
      },
      {
        label: "Goerli",
        key: "5",
        icon: labelToShow(ethereum_Logo, "Ethereum_logo"),
      },
      {
        label: "Sepolia",
        key: "11155111",
        icon: labelToShow(ethereum_Logo, "Ethereum_logo"),
      },
      {
        label: "BNB Chain",
        key: "56",
        icon: labelToShow(bsc_Logo, "BNB_logo"),
      },
      {
        label: "BNB Testnet",
        key: "97",
        icon: labelToShow(bsc_Logo, "BNB_logo"),
      },
    ],
    []
  );

  useEffect(() => {
    if (!chainId) return undefined;
    setSelected(items.find((item: any) => item?.key === chainId.toString()));
    return;
  }, [chainId, items]);

  const handleChange = async (event: any) => {
    await switchChain(parseInt(event.target.value));
    // window.location.reload();
  };

  if (!chainId || !isActive) return null;

  return (
    <select
      onChange={handleChange}
      className="h-full w-full rounded-[35px] border border-[#FF49C1] bg-transparent px-3 py-1.5 font-[montserrat-medium] font-bold text-white shadow-[0_0_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-white/30"
      value={selected?.key}
    >
      {items.map((item) => (
        <option key={item.key} value={item.key} className="bg-[#0b0f2e]">
          {item.label}
        </option>
      ))}
    </select>
  );
}

export default ChainSelector;
