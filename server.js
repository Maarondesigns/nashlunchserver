const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const cors = require("cors");
const fs = require("fs");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password1234",
//   database: "quantreslunch"
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log("MySQL Connected");
// });

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

//create table
app.get("/createposttable", (req, res) => {
  let sql =
    "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Posts table created");
  });
});

//insert post
app.get("/addpost1", (req, res) => {
  let post = { title: "Post One", body: "This is post one." };
  let sql = "INSERT INTO posts SET ?";
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post one has been added!");
  });
});

//select posts
app.get("/getposts", (req, res) => {
  let sql = "SELECT * FROM posts";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send("Posts fetched!");
  });
});

//select single post
app.get("/getpost/:id", (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(`Post ${req.params.id} fetched!`);
  });
});

//update post
app.get("/updatepost/:id", (req, res) => {
  let newTitle = "Updated Title";
  let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${
    req.params.id
  }`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(`Post ${req.params.id} updated!`);
  });
});

//delete post
app.get("/deletepost/:id", (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(`Post deleted!`);
  });
});

app.get("/currentuser", (req, res) => {
  res.send(fs.readFileSync("./dummy_data/CurrentUser.json", "utf8"));
});

app.post("/updateuser", (req, res) => {
  return fs.readFile("./dummy_data/CurrentUser.json", "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    let user = JSON.parse(data);

    let { name, email, dietary_pref, other, lunch_dates } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (dietary_pref) user.dietary_pref = dietary_pref;
    if (other) user.other = other;
    if (lunch_dates) {
      let dates = JSON.parse(lunch_dates).days_in_range;
      let filter = dates.filter(
        x => user.lunch_dates.days_in_range.indexOf(x) === -1
      );
      console.log(filter);
    }
    // user.lunch_dates = JSON.parse(lunch_dates);}
    return fs.writeFile(
      "./dummy_data/CurrentUser.json",
      JSON.stringify(user),
      "utf8",
      err => {
        if (err) {
          return console.log(err);
        }
        return res.sendStatus(200);
      }
    );
  });
});
