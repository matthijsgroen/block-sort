import { useState } from "react";

import { AprilFools } from "@/ui/AprilFools/AprilFools";
import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";

export const AprilFoolsAction: React.FC<{ onClose: VoidFunction }> = ({
  onClose
}) => {
  const [foolsOpen, setFoolsOpen] = useState(true);
  return (
    <>
      {foolsOpen && (
        <AprilFools
          onClose={() => {
            setFoolsOpen(false);
          }}
        />
      )}
      {!foolsOpen && (
        <Dialog onClose={onClose}>
          <DialogTitle>Happy April Fools!</DialogTitle>
          <p>No, this game is not going Commercial!</p>
          <p>
            <strong>Happy April fools!</strong>
          </p>
        </Dialog>
      )}
    </>
  );
};