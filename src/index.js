const ArvanExporter = require('./arvanexporter')
const { API_KEY, PORT, DOMAINS, MODE } = require('./config')
const express = require('express')
const pino = require('pino-http')()
const app = express()

const exporter = new ArvanExporter(API_KEY, DOMAINS, MODE)

app.use(pino)
app.use(async (req, res) => {
  res.send(await exporter.scrapeMetrics())
})

app.listen(PORT, () => {
  console.log(`Exporter listening at port ${PORT}`)
})