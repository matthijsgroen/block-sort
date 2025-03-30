import { lazy, Suspense } from "react";

import { Dialog } from "@/ui/Dialog/Dialog";

const HelpDialog = lazy(() => import("./HelpContent"));

type Props = {
  onClose?: VoidFunction;
};

export const Help: React.FC<Props> = ({ onClose }) => (
  <Dialog
    wide={true}
    onClose={() => {
      onClose?.();
    }}
  >
    <Suspense fallback={<p>Loading...</p>}>
      <HelpDialog />
    </Suspense>
  </Dialog>
);
