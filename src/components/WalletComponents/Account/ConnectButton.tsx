const ConnectButton = ({
  label,
  image,
  onClick,
}: {
  label: string;
  image: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      key={label}
      onClick={onClick}
      className="mb-3 inline-flex w-80 items-center justify-start rounded-lg bg-white px-4 py-2 text-black shadow-[0_4px_4px_rgba(0,0,0,.25),0_0_5px_rgba(0,0,0,.25),inset_0_0_10px_#fff] hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
    >
      <img
        src={image}
        width={32}
        height={32}
        alt="WalletImage"
        className="mr-4"
      />
      <span className="text-xl font-semibold">{label}</span>
    </button>
  );
};

export default ConnectButton;
