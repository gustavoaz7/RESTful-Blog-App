const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose')

// App config
mongoose.connect('mongodb://localhost/restfulblogapp')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// Mongoose model config
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  create: {type: String, default: Date.now}
})
const Blog = mongoose.model('Blog', blogSchema)

// RESTFULL routes
app.get('/', (req,res) => {
  res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, data) => {
    if (err) throw err;
    console.log(data)
    res.render('index', {blogs: data})
  })
})

// NEW route
app.get('/blogs/new', (req, res) => {
  res.render('new')
})

// CREATE route
app.post('/blogs', (req, res) => {
  Blog.create(req.body.blog, (err, data) => {
    if (err) res.render('new')
    else res.redirect('/blogs')
  })
})

app.listen(5000, function() {
  console.log('Server is up and running...')
})