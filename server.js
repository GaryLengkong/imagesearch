// server.js
// where your node app starts

// init project
const request = require('request')
const express = require('express')
const app = express()

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

let history = []

app.get('/api/latest/imagesearch/', (req, res) => {
  res.json(history)
})

app.get('/api/imagesearch/:query', (req, res) => {
  request.get({ 
    url: 'https://www.googleapis.com/customsearch/v1', 
    qs: {
      q: req.params.query,
      searchType: 'image',
      start: req.query.offset ? req.query.offset : undefined,
      cx: '003488502517554548369:wocpxhvffsm',
      key: 'AIzaSyBr_ZeSrmV3l8qSZscGOMcYoW955W-b6Ls'
    }
  }, function(err, result, body) {
    if (err) {
      res.json(err)
      return
    }
    history.unshift({
      term: req.params.query,
      when: new Date().toString()
    })
    res.json(JSON.parse(body).items.map(function(item) {
      return {
        url: item.link,
        snippet: item.snippet,
        thumbnail: item.image.thumbnailLink,
        context: item.image.contextLink
      }
    }))
  })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
