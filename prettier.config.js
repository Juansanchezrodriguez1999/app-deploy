const tailwind = require('prettier-plugin-tailwindcss');
const sortImports = require('@trivago/prettier-plugin-sort-imports');

/*
 * TODO - Bug - Temporal work around for working with 'prettier-plugin-tailwindcss' and '@trivago'
 * see: https://github.com/trivago/prettier-plugin-sort-imports/issues/117
 *      https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1024722576
 */
const combinedFormatter = {
  ...tailwind,
  parsers: {
    ...tailwind.parsers,
    ...Object.keys(sortImports.parsers).reduce((acc, key) => {
      acc[key] = {
        ...tailwind.parsers[key],
        preprocess(code, options) {
          return sortImports.parsers[key].preprocess(code, options);
        },
      };
      return acc;
    }, {}),
  },
};

module.exports = {
  printWidth: 120,
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  importOrder: [
    '^(react|react/(.*))$',
    '^next/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/(components|lib|images)/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss', combinedFormatter],
};
