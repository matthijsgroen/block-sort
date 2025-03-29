import eslintConfigPrettier from "eslint-config-prettier";
import * as importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    plugins: {
      "react-compiler": reactCompiler
    },
    rules: {
      "react-compiler/react-compiler": "error"
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    ignores: [
      ".yarn/*",
      "dist/*",
      ".pnp.*",
      "storybook-static/",
      "public/*",
      "src/workers/worker.js"
    ]
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.commonjs } } },
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat?.recommended,
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    plugins: {
      import: importPlugin
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    rules: {
      "import/extensions": [
        "error",
        "never",
        {
          mp3: "always",
          json: "always",
          md: "always",
          mdx: "always",
          aac: "always",
          css: "always"
        }
      ],
      "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
      "@typescript-eslint/consistent-type-imports": "error"
    }
  },
  eslintConfigPrettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "react/prop-types": "off", // Does not work nicely with React.FC TS declarations

      // Enable these if your TSConfig is preserve and you don't need a React import in scope for JSX
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^ignore" }
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Packages `react` related packages come first.
            ["^react", "^@?\\w"],
            // Internal packages.
            ["^(@/ui)(/.*|$)"],
            ["^(@|components)(/.*|$)"],
            // Side effect imports.
            ["^\\u0000"],
            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports.
            ["^.+\\.?(css)$"]
          ]
        }
      ],
      "max-len": [
        "error",
        {
          code: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true
        }
      ]
    }
  },
  {
    plugins: {
      "unused-imports": unusedImports
    },
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^ignore"
        }
      ]
    }
  },
  eslintPluginPrettierRecommended
];
