const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/PostsDB", { useNewUrlParser: true })

const postsSchema = new mongoose.Schema({
  title: String,
  body: String
}
)
const Post = mongoose.model("post", postsSchema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", function (req, res) {
  Post.find(function (err, posts) {
    if (!err)
      res.render("home", { para: homeStartingContent, postsArray: posts })
  })
})

app.get("/about", function (req, res) {
  res.render("about", { para: aboutContent })
})

app.get("/contact", function (req, res) {
  res.render("contact", { para: contactContent })
})

app.get("/compose", function (req, res) {
  res.render("compose")
})

app.get("/editcompose/:id", function (req, res) {
  res.render("editcompose", { postID: req.params.id })
})

app.post("/compose", function (req, res) {
  const post = new Post(
    {
      title: req.body.inputText,
      body: req.body.postText
    }
  )
  post.save(function (err) {
    if (!err)
      res.redirect("/")
  })
})

app.post("/editcompose/:postID", function (req, res) {
  Post.findByIdAndUpdate(req.params.postID, {
    $set: {
      title: req.body.inputText,
      body: req.body.postText
    }
  }, { new: true },
    function (err) {
      if (!err)
        res.redirect("/")
    });
})

app.get("/delete/:id", function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err) {
    if (!err)
      res.redirect("/")
  })
})

app.get("/posts/:postName", function (req, res) {
  var postTitle = _.lowerCase(req.params.postName)
  Post.find(function (err, posts) {
    if (!err) {
      for (var i = 0; i < posts.length; i++) {
        index = _.lowerCase(posts[i].title)
        if (index === postTitle)
          res.render("post", { postLabel: posts[i].title, postCon: posts[i].body, postID: posts[i].id })
      }
    }
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
