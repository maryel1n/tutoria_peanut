require('@babel/register')()
require('babel-polyfill')
const port = 3000

const App = require('./api.js')

const app = new App()

app.setup().then((api) => {
  api.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })
})