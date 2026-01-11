import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getEllipsisTxt } from "../../utils/formatters";
import Jazzicons from "./Jazzicons";

export interface AddressInputProps {
  address?: string;
  setAddress?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  autoFocus?: boolean;
  style?: CSSProperties | undefined;
  onChange: Dispatch<SetStateAction<string | undefined>>;
}

const AddressInput: React.FC<AddressInputProps> = (props) => {
  const input = useRef<any>(null);
  const [address, setAddress] = useState<string>("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [isDomain, setIsDomain] = useState<boolean>(false);

  useEffect(() => {
    if (validatedAddress) props.onChange(isDomain ? validatedAddress : address);
    return;
  }, [props, validatedAddress, isDomain, address]);

  const updateAddress = useCallback(async (value: string) => {
    setAddress(value);
    if (isSupportedDomain(value)) {
    } else if (value.length === 42) {
      setValidatedAddress(getEllipsisTxt(value, 10));
      setIsDomain(false);
    } else {
      setValidatedAddress("");
      setIsDomain(false);
    }
  }, []);

  const Cross = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 22 22"
      strokeWidth="2"
      stroke="#E33132"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={() => {
        setValidatedAddress("");
        setIsDomain(false);
        setTimeout(function () {
          if (input.current !== null) {
            input.current.focus();
          }
        });
      }}
      style={{ cursor: "pointer" }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
        {isDomain || address.length === 42 ? (
          <Jazzicons
            seed={(isDomain ? validatedAddress : address).toLowerCase()}
          />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <input
        ref={input}
        placeholder={props.placeholder ? props.placeholder : "Public address"}
        autoFocus={props.autoFocus}
        value={
          isDomain
            ? `${address} (${getEllipsisTxt(validatedAddress)})`
            : validatedAddress || address
        }
        onChange={(e: any) => {
          updateAddress(e.target.value);
        }}
        disabled={validatedAddress.length > 0 ? true : false}
        className={`w-full rounded-lg border bg-transparent py-2 pl-10 pr-10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/30 ${
          validatedAddress ? "border-[rgb(33,191,150)]" : "border-white/20"
        }`}
        style={props?.style}
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        {validatedAddress && <Cross />}
      </div>
    </div>
  );
};

function isSupportedDomain(domain: string) {
  return [
    ".eth",
    ".crypto",
    ".coin",
    ".wallet",
    ".bitcoin",
    ".x",
    ".888",
    ".nft",
    ".dao",
    ".blockchain",
  ].some((tld) => domain.endsWith(tld));
}

export default AddressInput;
