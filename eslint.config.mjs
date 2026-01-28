import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js 配置
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Airbnb 和 TypeScript 配置
  ...compat.extends("airbnb", "plugin:@typescript-eslint/recommended"),
  ...compat.plugins(eslintPluginJsxA11y),
  // 全局配置
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // React 相关规则
      "react/jsx-filename-extension": [1, { extensions: [".tsx", ".ts"] }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/prop-types": "off",
      "react/button-has-type": "off",
      "react/no-deprecated": "off",
      "react/self-closing-comp": "off",
      "react/jsx-indent": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/no-array-index-key": "off",
      
      // TypeScript 相关规则
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // Import 相关规则 - 全部禁用以避免解析问题
      "import/extensions": "off",
      "import/prefer-default-export": "off",
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-cycle": "off",
      "import/named": "off",
      "import/no-duplicates": "off",
      "import/order": "off",
      "import/no-self-import": "off",
      "import/no-relative-packages": "off",
      
      // 其他规则
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-param-reassign": "off",
      "no-use-before-define": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "quote-props": "off",
      "comma-dangle": "off",
      "indent": "off",
      "linebreak-style": "off",
      "semi": "off",
      "quotes": "off",
      "eol-last": "off",
      "no-trailing-spaces": "off",
      "no-multi-spaces": "off",
      "react/jsx-props-no-multi-spaces": "off",
      "object-curly-newline": "off",
      "arrow-parens": "off",
      "max-len": "off",
      "no-continue": "off",
      "no-restricted-syntax": "off",
      "no-bitwise": "off",
      "no-nested-ternary": "off",
      "max-classes-per-file": "off",
      "no-unused-vars": "off",
      "no-plusplus": "off",
      "consistent-return": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  
  // 测试文件覆盖配置
  {
    files: ["*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx"],
    languageOptions: {
      globals: {
        jest: "readonly",
      },
    },
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
];

export default eslintConfig;
