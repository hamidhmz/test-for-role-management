const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://dbmongo:27017/test", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
});

let acl = require("acl");
acl = new acl(new acl.mongodbBackend(mongoose.connection,'acl_'));

acl.allow([
  {
    roles: ["guest", "member"],
    allows: [
      { resources: "blogs", permissions: "get" },
      { resources: ["forums", "news"], permissions: ["get", "put", "delete"] }
    ]
  },
  {
    roles: ["gold", "silver"],
    allows: [
      { resources: "cash", permissions: ["sell", "exchange"] },
      { resources: ["account", "deposit"], permissions: ["put", "delete"] }
    ]
  }
]);
acl.addUserRoles('joed', 'guest')


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

app.get("/", aclMiddleware, async (req, res) => {
  res.send("hello world");
});

app.get("/new", aclMiddleware, async (req, res) => {
  const new_user = new User({
    name: "hamidreza",
    email: "test@test.com",
    password: "123456"
  });

  new_user.save();

  res.send("done");
});

app.get("/remove", aclMiddleware, async (req, res) => {
  await User.remove({});

  res.send("done");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function aclMiddleware(req, res, next) {
  console.log(
    "-------------------this is just a test middleware----------------"
  );
  
  next();
}
