/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

declare module "*.md" {
  // "unknown" would be more detailed depends on how you structure frontmatter
  const attributes: Record<string, unknown>;

  // When "Mode.React" is requested. FC could take a generic like React.FC<{ MyComponent: TypeOfMyComponent }>
  import type React from "react";
  const ReactComponent: React.FC;

  // Modify below per your usage
  export { attributes, ReactComponent };
}
