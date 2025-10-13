import Christmas from "@/docs/christmas.md";
import Halloween from "@/docs/halloween.md";
import Spring from "@/docs/spring.mdx";
import Summer from "@/docs/summer.md";
import { getActiveTheme } from "@/game/themes";
import { getToday } from "@/support/schedule";

const ThemeInfo = () => {
  const today = getToday();
  const displayTheme = getActiveTheme(today);

  if (displayTheme === "halloween") {
    return <Halloween />;
  }
  if (displayTheme === "winter") {
    return <Christmas />;
  }
  if (displayTheme === "spring") {
    return <Spring />;
  }
  if (displayTheme === "summer") {
    return <Summer />;
  }
};

export default ThemeInfo;
