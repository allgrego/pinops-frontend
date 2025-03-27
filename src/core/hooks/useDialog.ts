import { useState } from "react";

type Params = {
  onOpen?: () => void;
  onClose?: () => void;
};

const useDialog = (params?: Params) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = () => {
    setIsOpen(true);
    // Execute if exists
    params?.onOpen?.();
  };

  const close = () => {
    setIsOpen(false);
    // Execute if exists
    params?.onClose?.();
  };

  const toggle = () =>
    setIsOpen((isOp) => {
      if (isOp && params?.onClose) params.onClose();

      if (!isOp && params?.onOpen) params.onOpen();

      return !isOp;
    });

  return { isOpen, open, close, toggle, setIsOpen };
};

export default useDialog;
