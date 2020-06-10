const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const generateRandomString = require("./generateRandomString");


// Varaiables are deifined here
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let templateVars = {
  urls: urlDatabase,
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
// middleware
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


// Here are all page
app.post("/register", (req, res) => {
  const id = generateRandomString();

  if (!req.body["email"] && !req.body["password"]) {
    return res.status(400).send('Invalid email and/or passwords');
  }

  for (let user in users) {
    if (req.body["email"] === users[user].email) {
      return res.status(400).send('User already exists');
    };
  }

  users[id] = {
    id,
    email: req.body["email"],
    password: req.body["password"]
  };
  res.cookie('user_id', id);  
  res.redirect("/urls")
});

app.get("/register", (req, res) => {
  res.render("register", templateVars)
});




app.post("/login", (req, res) => {
  res.cookie('username', req.body["username"]);  
  res.redirect('/urls');
  });

  app.post("/logout", (req, res) => {
    // res.clearCookie('username', templateVars['username'])
    // templateVars['username'] = "";
    res.redirect('/urls');
  });

  app.get("/urls", (req, res) => {
    templateVars["user"] = users[req.cookies["user_id"]];
    console.log(users);
    res.render("urls_index", templateVars);
  });




  app.get("/urls/new", (req, res) => {
    
    res.render("urls_new", templateVars); 
});

// Add random charactars for each websit
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key]= `http://${req.body['longURL']}`;
  console.log(urlDatabase);
  res.redirect(`/urls/${key}`);
});

//edit button in creat new url page
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = `http://${req.body['NewlongURL']}`
  console.log(urlDatabase[req.params.id])
  res.redirect('/urls');
});

// Edit button in list page
app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

// Delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);  
});



