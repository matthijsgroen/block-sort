import { Dispatch, lazy, Suspense, useState } from "react";

import { Checkbox } from "@/ui/Checkbox";
import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";
import { Switch } from "@/ui/Switch";
import { Transition } from "@/ui/Transition/Transition";
import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import info from "@/../package.json";
import { THEMES } from "@/featureFlags";
import { useGameStorage } from "@/support/useGameStorage";

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
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<
    "settings" | "changes" | "attribution" | "data" | "advanced"
  >("settings");

  const [showThemes, setShowThemes] = useState(false);
  const [hintMode, setHintMode] = useGameStorage("hintMode", "standard");
  const [streak] = useGameStorage<number | null>("streak", null);

  return (
    <Dialog
      wide={activeTab === "changes"}
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
                  icon="calendar_month"
                ></TransparentButton>
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
          <div className="flex flex-row items-center gap-2 text-sm">
            <span>Hint mode:</span>
            <Switch
              items={[
                { name: "Eager", value: "eager" },
                { name: "Standard", value: "standard" },
                { name: "Off", value: "off" }
              ]}
              selected={hintMode}
              onSelectionChange={setHintMode}
            />
          </div>
          <div className="text-center">
            {hintMode === "eager" && (
              <p className="text-sm italic">show hints early</p>
            )}
            {hintMode === "standard" && (
              <p className="text-sm italic">show hints after 15 attempts</p>
            )}
            {hintMode === "off" && (
              <p className="text-sm italic">
                Never show any hints.
                <br />
                Current level streak: <strong>{streak ?? "0"}</strong>{" "}
                {streak !== 1 ? "levels" : "level"} 🔥
              </p>
            )}
          </div>
          {"share" in navigator && (
            <TransparentButton
              size="large"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: "Block Sort",
                    url: "https://matthijsgroen.github.io/block-sort/",
                    text: "A block sorting puzzle game, without ads or tracking. Becomes very challenging, with different level types and seasonal themes."
                  });
                } catch (ignoreError) {
                  // Nothing to do, user probably canceled the share
                }
              }}
              icon="share"
            >
              Share
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
            <TransparentButton
              href={"https://buymeacoffee.com/matthijsgroen"}
              icon="coffee"
            ></TransparentButton>
            <TransparentButton onClick={() => setActiveTab("attribution")}>
              Attribution
            </TransparentButton>
          </div>
        </div>
      )}
      {activeTab === "advanced" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton
            onClick={() => setActiveTab("settings")}
            icon="arrow_back"
          >
            Back
          </TransparentButton>
          <TransparentButton
            onClick={() => setActiveTab("changes")}
            icon="update"
          >
            Recent changes
          </TransparentButton>
          <TransparentButton
            href={"https://buymeacoffee.com/matthijsgroen"}
            icon="coffee"
          >
            Buy me a coffee
          </TransparentButton>
          <TransparentButton
            href={`mailto:matthijs.groen@gmail.com?subject=[BlockSort]-Feedback`}
            icon="mail"
          >
            Feedback
          </TransparentButton>
          <TransparentButton
            onClick={() => {
              setActiveTab("data");
            }}
            icon={"cloud_upload"}
          >
            Transfer game data
          </TransparentButton>
        </div>
      )}
      {activeTab === "changes" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton
            onClick={() => setActiveTab("advanced")}
            icon="arrow_back"
          >
            Back
          </TransparentButton>
          <Suspense fallback={<div>Loading...</div>}>
            <Changelog />
          </Suspense>
        </div>
      )}
      {activeTab === "attribution" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton
            onClick={() => setActiveTab("settings")}
            icon="arrow_back"
          >
            Back
          </TransparentButton>
          <Attribution />
        </div>
      )}
      {activeTab === "data" && (
        <div className="flex flex-col gap-3 pb-4">
          <TransparentButton
            onClick={() => setActiveTab("advanced")}
            icon="arrow_back"
          >
            Back
          </TransparentButton>
          <DataTransfer />
        </div>
      )}
    </Dialog>
  );
};
