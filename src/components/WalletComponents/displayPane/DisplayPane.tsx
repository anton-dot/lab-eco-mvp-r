import { useWeb3React } from "@web3-react/core";

import { useWindowWidthAndHeight } from "../../../hooks/useWindowWidthAndHeight";
import { Infos, SignMessage, Status, TransferEth } from "./components/index";

const styles = {
  container: {
    background: "#f5f4f4",
    width: "80%",
    minWidth: "340px",
    maxWidth: "900px",
    textAlign: "center",
    margin: "auto",
    padding: "30px 0",
    borderRadius: "20px",
  },
  title: {
    color: "black",
    fontWeight: 600,
    fontSize: "30px",
    marginBottom: "10px",
  },
  content: {
    width: "85%",
    margin: "auto",
    fontSize: "17px",
  },
  action: {
    display: "inline-flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
} as const;

const DisplayPane: React.FC = () => {
  const { chainId, isActivating, isActive } = useWeb3React();
  const [width] = useWindowWidthAndHeight();
  const isMobile = width <= 768;

  return (
    <div style={styles.container}>
      <div style={styles.title}>Display Info</div>
      <div style={styles.content}>
        <Status isActivating={isActivating} isActive={isActive} />
        <Infos chainId={chainId} />

        {isActive && (
          <>
            <hr className="my-4 border-white/10" />
            <div style={styles.action}>
              <SignMessage />
              {!isMobile && <div className="mx-2 h-24 w-px bg-white/10" />}
              <TransferEth />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayPane;
