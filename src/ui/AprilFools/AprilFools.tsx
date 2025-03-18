import type { FC } from "react";

import { Block } from "../Block/Block";
import { Dialog } from "../Dialog/Dialog";
import { DialogTitle } from "../Dialog/DialogTitle";
import { TransparentButton } from "../TransparentButton/TransparentButton";

type Props = { onClose?: VoidFunction };

const AprilFools: FC<Props> = ({ onClose }) => {
  return (
    <Dialog wide onClose={onClose}>
      <DialogTitle>Block Pass for April</DialogTitle>
      <div className="flex flex-col gap-3">
        <p>
          Only{" "}
          <span className="text-2xl font-bold">
            <span className="text-xl line-through">$ 24,49</span> $ 19,99
          </span>{" "}
          if you buy now you will get your first <strong>LootBox</strong> for
          free!
        </p>
        <p>
          Also contains <strong>40 block bucks!</strong>
        </p>
        <TransparentButton onClick={onClose} size="large">
          Buy now
        </TransparentButton>
        <div>
          <span className="inline-block origin-left scale-75">
            <Block color="gold" moved={false} shape="$" />
          </span>
          <h2 className="inline-block text-lg font-bold">Block bucks!</h2>
          <span className="inline-block origin-right scale-75">
            <Block color="gold" moved={false} shape="$" />
          </span>
        </div>
        <p>The coins you have been waiting for will get you the following:</p>
        <ul className="ml-6 list-disc">
          <li>
            Unlock extra plays if your energy is up, no more waiting between
            level plays
          </li>
          <li>Get extra placement columns when you get stuck</li>
          <li>Extra colored block themes</li>
          <li>Extra retries without losing your streak</li>
          <li>Remove ads for a single day!</li>
        </ul>
        <TransparentButton onClick={onClose} size="large">
          Buy now
        </TransparentButton>
        <p className="mb-3 italic">
          You even get a 2% discount if you subscribe to our yearly plan!
        </p>
      </div>
    </Dialog>
  );
};

export default AprilFools;
