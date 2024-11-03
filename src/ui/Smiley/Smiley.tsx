import { use } from "react";

import { ThemeContext } from "@/modules/Layout/ThemeContext";

import { SmileyDefault } from "./SmileyDefault";
import { SmileySummer } from "./SmileySummer";

export const Smiley = () => {
  const { activeTheme } = use(ThemeContext);
  if (activeTheme === "summer") {
    return <SmileySummer />;
  }
  return <SmileyDefault />;
};
