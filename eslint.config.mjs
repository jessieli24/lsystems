import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  vue: true,
  rules: {
    'import/no-mutable-exports': 'off',
    'unused-imports/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-new': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
