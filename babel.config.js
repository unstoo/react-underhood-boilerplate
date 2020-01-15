module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [['@babel/transform-react-jsx', { pragma: 'OwnReact.createElement' }]],
}
