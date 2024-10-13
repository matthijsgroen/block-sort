import { Dispatch, lazy, Suspense, useState } from "react";

import { Checkbox } from "@/ui/Checkbox";
import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";
import { Transition } from "@/ui/Transition/Transition";
import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import info from "@/../package.json";
import { THEMES } from "@/featureFlags";
import { TextEmoji } from "@/support/Emoji";

import { Attribution } from "./Attribution";
import { Changelog } from "./Changelog";
import { EventCalendar } from "./EventCalendar";

type Props = {
  soundEnabled?: boolean;
  musicEnabled?: boolean;
  themesEnabled?: boolean;
  onSoundChange?: Dispatch<boolean>;
  onMusicChange?: Dispatch<boolean>;
  onThemesChange?: Dispatch<boolean>;
  onClose?: VoidFunction;
};

export const DataTransfer = lazy(() => import("./DataTransfer"));

export const Settings: React.FC<Props> = ({
  soundEnabled = true,
  musicEnabled = true,
  themesEnabled = true,
  onSoundChange,
  onMusicChange,
  onThemesChange,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "settings" | "changes" | "attribution" | "data" | "advanced"
  >("settings");

  const [showThemes, setShowThemes] = useState(false);

  return (
    <Dialog
      wide={activeTab === "changes" || activeTab === "attribution"}
      onClose={() => {
        onClose?.();
      }}
    >
      <DialogTitle>BlockSort, v{info.version}</DialogTitle>
      {activeTab === "settings" && (
        <div className="flex flex-col gap-3 pb-4">
          <Checkbox
            value={soundEnabled}
            onChange={(value) => onSoundChange?.(value)}
            label="Sound Effects"
          />
          <Checkbox
            value={musicEnabled}
            onChange={(value) => onMusicChange?.(value)}
            label="Music"
          />
          {THEMES && (
            <div className="flex flex-row">
              <Checkbox
                value={themesEnabled}
                onChange={(value) => onThemesChange?.(value)}
                label="Seasonal Themes"
                description="Automatically switch to themed content when available"
              />
              <div>
                <TransparentButton
                  onClick={() => setShowThemes((show) => !show)}
                >
                  📅
                </TransparentButton>
              </div>
            </div>
          )}
          <Transition
            active={showThemes}
            enterStart={{ opacity: 0, height: "0rem" }}
            enterEnd={{ opacity: 1, height: "2.5rem" }}
            exitStart={{ opacity: 1, height: "2.5rem" }}
            exitEnd={{ opacity: 0, height: "0rem" }}
            duration={300}
          >
            <div className="pl-12">
              <EventCalendar />
            </div>
          </Transition>
          {"share" in navigator && (
            <TransparentButton
              size="large"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: "Block Sort",
                    url: "https://matthijsgroen.github.io/block-sort/",
                    text: "A block sorting puzzle game. No ads, cookies, tracking or payments. Just the pure fun!",
                  });
                } catch (ignoreError) {
                  // Nothing to do, user probably canceled the share
                }
              }}
            >
              <TextEmoji emoji="❤︎" className="text-xl" /> Share
            </TransparentButton>
          )}
          <p className="text-xs">
            <a
              href="https://github.com/matthijsgroen"
              target="_blank"
              rel="nofollow noreferrer"
              className="underline"
            >
              Matthijs Groen
            </a>
            , 2024
          </p>
          <div className="flex flex-row justify-between">
            <TransparentButton onClick={() => setActiveTab("advanced")}>
              Advanced
            </TransparentButton>
            <TransparentButton href={"https://buymeacoffee.com/matthijsgroen"}>
              <TextEmoji emoji="☕️" className="text-xl" />
            </TransparentButton>
            <TransparentButton onClick={() => setActiveTab("attribution")}>
              Attribution
            </TransparentButton>
          </div>
        </div>
      )}
      {activeTab === "advanced" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton onClick={() => setActiveTab("settings")}>
            Back
          </TransparentButton>
          <TransparentButton onClick={() => setActiveTab("changes")}>
            Recent changes
          </TransparentButton>
          <TransparentButton href={"https://buymeacoffee.com/matthijsgroen"}>
            <TextEmoji emoji="☕️" className="text-md" /> Buy me a coffee
          </TransparentButton>
          <TransparentButton
            href={`mailto:matthijs.groen@gmail.com?subject=[BlockSort]-Feedback`}
          >
            Feedback
          </TransparentButton>
          <TransparentButton
            onClick={() => {
              setActiveTab("data");
            }}
          >
            Transfer game data
          </TransparentButton>
        </div>
      )}
      {activeTab === "changes" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton onClick={() => setActiveTab("advanced")}>
            Back
          </TransparentButton>
          <Suspense fallback={<div>Loading...</div>}>
            <Changelog />
          </Suspense>
        </div>
      )}
      {activeTab === "attribution" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton onClick={() => setActiveTab("settings")}>
            Back
          </TransparentButton>
          <Attribution />
        </div>
      )}
      {activeTab === "data" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton onClick={() => setActiveTab("advanced")}>
            Back
          </TransparentButton>
          <DataTransfer />
        </div>
      )}
    </Dialog>
  );
};
