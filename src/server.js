import express from 'express'

const app = express()

const hostname = '0.0.0.0'
const port = 3000

app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1><hr>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello Trung Quan Dev, I am running at ${ hostname }:${ port }/`)
})
