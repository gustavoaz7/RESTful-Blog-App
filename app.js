const express = require('express'),
      app = express(),
      expressSanitizer = require('express-sanitizer'),
      methodOverride = require('method-override'),  // override route method
      bodyParser = require('body-parser'),
      mongoose = require('mongoose')

// App config
mongoose.connect('mongodb://localhost/restfulblogapp')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())   // Must come after bodyParser
app.use(methodOverride("_method"))

// Mongoose model config
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: String, default: Date}
})
const Blog = mongoose.model('Blog', blogSchema)

// RESTFULL routes
app.get('/', (req,res) => {
  res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, data) => {
    if (err) throw err;
    res.render('index', {blogs: data})
  })
})

// NEW route
app.get('/blogs/new', (req, res) => {
  res.render('new')
})

// CREATE route
app.post('/blogs', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog, (err, data) => {
    if (err) res.render('new')
    else res.redirect('/blogs')
  })
})

// SHOW route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, data) => {
    if (err) res.redirect('/blogs')
    else res.render('show', {blog: data})
  })
})

// EDIT route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, data) => {
    if (err) res.redirect('/blogs')
    else res.render('edit', {blog: data})
  })
})

// UPDATE route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, data) => {
    if (err) res.redirect('/blogs')
    else res.redirect('/blogs/' + req.params.id)
  })
})

// DELETE route
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) res.redirect('/blogs')
    else res.redirect('/blogs')
  })
})

app.listen(5000, function() {
  console.log('Server is up and running...')
})