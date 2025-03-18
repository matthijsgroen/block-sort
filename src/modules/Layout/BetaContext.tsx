import type { Dispatch, PropsWithChildren } from "react";
import { createContext, useState } from "react";

export const BetaContext = createContext<{
  showBeta: boolean;
  setShowBeta: Dispatch<boolean>;
}>({
  showBeta: false,
  setShowBeta: () => {}
});

export const BetaProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showBeta, setShowBeta] = useState<boolean>(false);
  return (
    <BetaContext
      value={{
        showBeta,
        setShowBeta
      }}
    >
      {children}
    </BetaContext>
  );
};
