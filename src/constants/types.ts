import { ReactElement, CSSProperties } from "react";
import { Contract } from "ethers";

export type CustomAccordionProps = {
  title?: string;
  body?: ReactElement;
};

export type MotionButtonProps = {
  label: string;
  color?: string;
  type?: "button" | "submit" | "reset";
  startIcon?: ReactElement;
  onClick?: any;
  customStyles?: CSSProperties;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export type AuthContextProps = {
  token: string;
  isAuthenticated: boolean;
  setToken: any;
  handleAuthSuccess: any;
  handleLogout: any;
  user?: any;
  showLoader?: boolean;
  toggleLoader?: any;
  generateAvatarUrl: () => string;
  updteUserAddress: (userAddress: string) => void;
};
export type BlockchainContextProps = {
  tokenContract: Contract;
  crowdsaleContract: Contract;
  stableCoin: Contract;
  tokenAddress: string;
  crowdsaleAddress: string;
  readCrowdsaleAddress: string;
  stablecoinAddress: string;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
};

export type ToasterContextType = {
  open: boolean;
  severity: string;
  message: string;
  vertical: any;
  horizontal: any;
};
