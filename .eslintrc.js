module.exports = {
    root: true,
    extends: '@react-native-community',
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
    },
  };
  