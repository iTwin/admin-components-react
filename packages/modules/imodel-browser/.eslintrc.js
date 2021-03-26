module.exports = {
  extends: [
    "../../../common/scripts/.eslintrc.ts.autofix.json",
    "../../../common/scripts/.eslintrc.ts.json",
  ],
  rules: {
    "prettier/prettier": [
      "off",
      {
        endOfLine: "lf",
      },
    ],
  },
};
