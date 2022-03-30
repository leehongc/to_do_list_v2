//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const listItemSchema = new mongoose.Schema({
  name: String
});

const listItem = mongoose.model('listItem', listItemSchema);

const firstItem = new listItem({
  name: 'Welcome to your To Do list!'
});
const secondItem = new listItem({
  name: 'Select the + button to add a new item.'
});
const thirdItem = new listItem({
  name: '<-- Check this to delete an item.'
});


app.get("/", function(req, res) {

  listItem.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {

      const defaultItems = [firstItem, secondItem, thirdItem];

      listItem.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Successfully added items to your list!')
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Your To-Do List",
        newListItems: foundItems
      });
    }

  });
});


app.post("/", function(req, res) {
  const item = req.body.newItem;

  const newInsert = new listItem({
    name: item
  });
  newInsert.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkedItem;
  listItem.findByIdAndRemove(checkedItemId, function(err){
    if (!err){
      console.log('Successfully deleted item.');
    }
  });
  res.redirect("/");
});

app.get("/about", function(req, res) {
  res.render("about");
});


app.listen(3000, function() {
  console.log("Server is running on port 3000.")
});
