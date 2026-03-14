import { useState } from "react";

import { useStudy } from "./StudyContext";

export const StudyLockOverlay: React.FC = () => {
  const { username, unlockWithStudy, cooldownSeconds, canUnlock } = useStudy();
  const [nameInput, setNameInput] = useState(username);
  const [studyInput, setStudyInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-center bg-black/80 px-6 pb-6 pt-14 text-white">
      <form
        className="w-full max-w-lg space-y-3 rounded-xl bg-stone-900 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (nameInput.trim().length < 2) {
            setError("Please enter your name (at least 2 characters).");
            return;
          }
          if (studyInput.trim().length < 3) {
            setError(
              "Please add at least 3 characters about what you studied."
            );
            return;
          }
          void unlockWithStudy(nameInput, studyInput).then((didUnlock) => {
            if (!didUnlock) {
              setError("Cooldown is still active. Please wait.");
              return;
            }
            setStudyInput("");
            setError(null);
          });
        }}
      >
        <h2 className="text-xl font-bold">Study lock active</h2>
        <label className="block text-sm">Who is studying?</label>
        <input
          className="w-full rounded bg-stone-700 p-2"
          value={nameInput}
          onChange={(event) => {
            setNameInput(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Your name"
        />
        <label className="block text-sm">
          What amazing thing did you just learn?
        </label>
        <textarea
          className="h-24 w-full rounded bg-stone-700 p-2"
          value={studyInput}
          onChange={(event) => {
            setStudyInput(event.target.value);
            if (error) setError(null);
          }}
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {!canUnlock && (
          <p className="text-sm text-yellow-300">
            Cooldown active: {cooldownSeconds}s remaining before unlock.
          </p>
        )}
        <button
          type="submit"
          disabled={!canUnlock}
          className="w-full rounded bg-emerald-500 p-2 font-bold disabled:opacity-40"
        >
          Unlock play session
        </button>
      </form>
    </div>
  );
};
