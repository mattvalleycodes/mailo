module.exports = {
  plugins: ["prettier"],
  extends: ["airbnb-base", "prettier"],
  env: {
    mocha: true,
    node: true,
  },
  rules: {
    "prettier/prettier": "error",
    "global-require": 0,
    "no-continue": 0,
    "no-await-in-loop": 0,
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["src/*.int.js", "src/*.spec.js", "mocha.js"] },
    ],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-param-reassign": ["error", { ignorePropertyModificationsFor: ["tmp"] }],
    "no-use-before-define": ["error", "nofunc"],
    "class-methods-use-this": ["off"],
    "no-nested-ternary": ["off"],
  },
};
