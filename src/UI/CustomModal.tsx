import React, { ReactElement, useEffect, useRef } from "react";

type Props = {
  open: boolean;
  handleClose: any;
  header?: ReactElement;
  body: ReactElement;
  footer?: ReactElement;
};

const CustomModal = ({
  handleClose,
  open,
  header = <></>,
  body = <></>,
  footer = <></>,
}: Props) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="w-full max-w-md rounded-md bg-white p-4 shadow-2xl outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {header}
            <button
              type="button"
              className="absolute right-3 top-2 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="max-h-[90vh] overflow-y-auto rounded-md">{body}</div>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
