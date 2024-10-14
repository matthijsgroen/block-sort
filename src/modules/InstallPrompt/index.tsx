import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";

import styles from "../Settings/TextStyling.module.css";

type Props = {
  onClose?: VoidFunction;
};

export const InstallPrompt: React.FC<Props> = ({ onClose }) => {
  return (
    <Dialog
      wide={false}
      onClose={() => {
        onClose?.();
      }}
    >
      <DialogTitle>Installing Block Sort</DialogTitle>
      <div className={styles.textStyling}>
        <p>You can install Block Sort on your device. Advantages:</p>
        <ul>
          <li>Play offline</li>
          <li>
            Your level data will be stored (in browser it can be wiped after 7
            days)
          </li>
        </ul>
        <h3>How to install on iOS:</h3>
        <ol>
          <li>Tap the share button</li>
          <li>Tap &quot;Add to Home Screen&quot;</li>
          <li>Tap &quot;Add&quot;</li>
        </ol>
        <h3>How to install on Android:</h3>
        <ol>
          <li>Tap the 3 dots of Chrome</li>
          <li>Tap &quot;Add to Home Screen&quot;</li>
          <li>Tap &quot;Add&quot;</li>
        </ol>
        <p>
          You can transfer your progress from the browser version to the
          installed version, using the{" "}
          <strong>&quot;Game data import / export&quot;</strong> button in the
          advanced settings.
        </p>
      </div>
    </Dialog>
  );
};
