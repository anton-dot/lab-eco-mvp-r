import React from "react";

import { MotionButtonProps } from "../constants/types";

const MotionButton = ({
  type = "button",
  color,
  label,
  startIcon,
  onClick,
  customStyles,
  loading = false,
  disabled = false,
  fullWidth = false,
}: MotionButtonProps) => {
  return (
    <div className="relative flex justify-center">
      <button
        type={type}
        onClick={onClick}
        disabled={loading || disabled}
        className={`inline-flex items-center justify-center rounded-[10px] bg-[#17ECF0] text-[#131D4B] font-[montserrat-bold] text-sm px-4 py-2 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90 ${
          fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        style={customStyles}
        aria-busy={loading}
      >
        {startIcon && (
          <span className="mr-2 inline-flex items-center" aria-hidden>
            {startIcon}
          </span>
        )}
        {label}
      </button>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span className="sr-only">Loading</span>
        </span>
      )}
    </div>
  );
};

export default MotionButton;
