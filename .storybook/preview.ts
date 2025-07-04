import type { Preview } from "@storybook/react-vite";

import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
