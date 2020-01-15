import App from '../samples/App'
import OwnReact from '../src'

test('nothing here', () => {
  expect(1 + 2).toBe(3)
})

test('jsx works', () => {
  const app = new App()
  expect(app.render()).toEqual(['h1', { prop1: 'prop value' }, ' Hello World '])
})

test('render to string', () => {
  expect(OwnReact.renderToString(App)).toBeDefined()
})
