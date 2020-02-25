const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
mongoose.connect("mongodb://dbmongo:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    /// we can use joi-password-complexity
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  }
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/new", (req, res) => {
  const new_user = new User({
    name: "hamidreza",
    email: "test@test.com",
    password: "123456"
  });

  new_user.save();

  res.send("done");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
