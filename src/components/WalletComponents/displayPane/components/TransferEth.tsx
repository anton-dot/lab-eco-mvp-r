import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { parseEther } from "ethers/lib/utils";

import { useNativeBalance } from "../../../../hooks/useNativeBalance";
import { parseBigNumberToFloat } from "../../../../utils/formatters";
import AddressInput from "../../AddressInput";

const TransferEth: React.FC = () => {
  const { account, provider } = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const balance = useNativeBalance(provider, account);
  const [amount, setAmount] = useState<number | null>();
  const [receiver, setReceiver] = useState<string>();

  function handleSignMessage(event: { preventDefault: () => void }): void {
    event.preventDefault();

    if (!provider || !account) {
      window.alert("Wallet not connected");
      return;
    }

    async function transfer(amt: number): Promise<void> {
      const amtStrg = amt.toString();
      const tx = {
        to: receiver,
        value: parseEther(amtStrg),
      };

      if (provider) {
        try {
          const receipt = await provider.getSigner(account).sendTransaction(tx);
          enqueueSnackbar(`Success!\n\nTx Hash: ${receipt.hash}`, {
            variant: "success",
          });
        } catch (error) {
          if (typeof error === "string") {
            enqueueSnackbar(`Error! \n\n${error}`, {
              variant: "error",
            });
          } else if (error instanceof Error) {
            enqueueSnackbar(`Error! \n\n${error.message}`, {
              variant: "error",
            });
          }
        }
      }
    }

    if (amount) transfer(amount);
  }

  return (
    <div style={{ width: "40%", minWidth: "250px" }}>
      <AddressInput onChange={setReceiver} address={receiver} />
      <div style={{ display: "inline-flex", gap: "10px", width: "100%" }}>
        <input
          type="number"
          value={amount as any}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Amount to transfer"
          min={0}
          max={balance ? parseBigNumberToFloat(balance) : 0}
          className="h-10 w-full rounded-lg border border-white/20 bg-transparent px-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/30"
        />

        <button
          type="button"
          className="ml-auto inline-flex rounded-lg bg-white px-4 py-2 text-black hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          onClick={handleSignMessage}
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default TransferEth;
