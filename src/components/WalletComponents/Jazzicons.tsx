import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const Jazzicons = ({ seed, size }: { seed: string; size?: number }) => {
  if (!seed)
    return <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />;

  if (size) return <Jazzicon seed={jsNumberForAddress(seed)} diameter={size} />;

  return <Jazzicon seed={jsNumberForAddress(seed)} />;
};

export default Jazzicons;
