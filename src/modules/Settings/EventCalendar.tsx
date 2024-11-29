import { getActiveTheme, themeSchedule } from "@/game/themes";
import { getToday } from "@/support/schedule";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short"
});

export const EventCalendar: React.FC = () => {
  const today = getToday();

  let displayTheme = getActiveTheme(today);
  const isUpcomingTheme = displayTheme === "default";
  if (isUpcomingTheme) {
    for (let i = 1; i < 12; i++) {
      const month = today.getMonth() + i;
      const checkDate = new Date(today.getFullYear(), month, 1);
      displayTheme = getActiveTheme(checkDate);
      if (displayTheme !== "default") {
        break;
      }
    }
  }

  const showThemeInfo = themeSchedule.find(
    (theme) => theme.theme === displayTheme
  );
  if (!showThemeInfo) {
    return null;
  }

  return (
    <>
      <p className="text-xs">
        {isUpcomingTheme ? "Upcoming" : "Current"}: {showThemeInfo.name}
      </p>
      <p className="text-xs">
        {dateFormatter.format(
          new Date(
            new Date().getFullYear(),
            showThemeInfo.begin.month - 1,
            showThemeInfo.begin.day
          )
        )}{" "}
        &ndash;{" "}
        {dateFormatter.format(
          new Date(
            new Date().getFullYear(),
            showThemeInfo.end.month - 1,
            showThemeInfo.end.day
          )
        )}
      </p>
    </>
  );
};
