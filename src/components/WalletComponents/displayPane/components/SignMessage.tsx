import { MouseEvent, ReactElement, SetStateAction, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";

const SignMessage: React.FC = (): ReactElement => {
  const { account, provider, chainId } = useWeb3React();
  const [messageAuth, setMessageAuth] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const handleMessageChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setMessageAuth(e.target.value);
  };

  function handleSignMessage(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!provider || !account) {
      window.alert("Wallet not connected");
      return;
    }

    const domain = {
      // Give a user friendly name to the specific contract you are signing for
      name: "Motion",
      // Just let's you know the latest version.
      version: "1",
      // Define the chain
      chainId: chainId,
      // Add verifying contract to make sure you are establishing contracts with the proper entity
      verifyingContract: `${process.env.REACT_APP_VERIFYING_CONTRACT}`,
    };

    const types = {
      Message: [{ name: "Title", type: "string" }],
    };

    async function signMessage(account: string): Promise<void> {
      const authMessage =
        messageAuth.length > 0
          ? { Title: `${messageAuth}` }
          : { Title: "Hello Web3!" };
      if (provider) {
        try {
          const signature = await provider
            .getSigner(account)
            ._signTypedData(domain, types, authMessage);
          enqueueSnackbar(`Success!\n\n${signature}`, {
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

    signMessage(account);
  }

  return (
    <div style={{ width: "40%", minWidth: "250px" }}>
      <textarea
        value={messageAuth}
        onChange={handleMessageChange}
        placeholder="Input message to sign"
        className="w-full rounded-lg border border-white/20 bg-transparent p-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/30"
        rows={3}
      />
      <button
        type="button"
        className="mx-auto mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-black hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        onClick={handleSignMessage}
      >
        Sign Message
      </button>
    </div>
  );
};

export default SignMessage;
