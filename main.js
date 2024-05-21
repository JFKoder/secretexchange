
const express = require('express')
const app = express()
const port = 3000

console.log(process.env.STORAGE)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

