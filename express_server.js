const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {generateRandomString, userFinder, urlsForUser} = require("./functions");

// Varaiables are deifined here
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

let templateVars = {
  // urls: urlDatabase,
};

const users = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "funk"
  }
}
// middleware
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));




// ****All static post are hear *****
// This post handles the registration
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body["email"];
  const pass = req.body["password"];
 
  if (!email && !pass) {
    return res.status(400).send('Invalid email and/or passwords');
  }

  if (userFinder(email, users)) {
    return res.status(400).send('User already exists');
  }

  users[id] = {
    id,
    email: email,
    password: pass
  };
  res.cookie('user_id', id);  
  res.redirect("/urls")
});

// This post handles the login request
app.post("/login", (req, res) => {

  const email = req.body.email;
  const pass = req.body.password;
  const id = userFinder(email, users);
  
  if (id && pass === users[id].password) {
    res.clearCookie('user_id');
    res.cookie('user_id', id); 
    res.redirect("/urls");
  } else {
    return res.status(400).send('User or password is wrong!');
  }

})

//this post handle the register button in header
app.post("/regShortcut", (req, res) => {
  res.redirect('/register');
});

//this post handle the login button in header
app.post("/loginShortcut", (req, res) => {
  res.redirect('/login');
});

//this post handle the logout button in header
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// this post handle adding new website
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key]={
    longURL: `http://${req.body['longURL']}`,
    userID: req.cookies["user_id"] 
  };
  res.redirect(`/urls/${key}`);
});

app.get("/urls/req", (req, res) => {
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("urls_logreq", templateVars); 
});

// *****All static gets are hear****
app.get("/urls", (req, res) => {
  const cookieId = req.cookies["user_id"];
  
  if (!cookieId) {
    return res.redirect("/urls/req");
  }

  templateVars = {
    urls: urlsForUser(cookieId, urlDatabase)
  };

  templateVars["user"] = users[cookieId];
  res.render("urls_index", templateVars);
});



app.get("/register", (req, res) => {
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("register", templateVars)
});

app.get("/login", (req, res) => {
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("loginForm", templateVars)
});

app.get("/urls/new", (req, res) => {
  // 
  if (!users[req.cookies["user_id"]]) {
    return res.redirect("/login");
  }
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("urls_new", templateVars); 
});


// All the dynamic pages are here
//edit button in creat new url page
app.post("/urls/:id", (req, res) => {
  
  if (req.cookies["user_id"] === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].longURL = `http://${req.body['NewlongURL']}`
    res.redirect('/urls');
  } else {
    return res.status(405).send('You are not the owner of this URL');
  }

// uncomment these if you want to revert back
  // urlDatabase[req.params.id].longURL = `http://${req.body['NewlongURL']}`
  // res.redirect('/urls');
});

// Edit button in list page
app.post("/urls/:shortURL/edit", (req, res) => {

  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    res.redirect(`/urls/${req.params.shortURL}`);
  } else {
    return res.status(405).send('You are not the owner of this URL');
  }
  
});

// Delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    return res.status(405).send('You are not the owner of this URL');
  }
});

app.get("/urls/:shortURL", (req, res) => {

  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send('Shorted website is not valid');
  }

  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
    templateVars["user"] = users[req.cookies["user_id"]];
    res.render("urls_show", templateVars);
  } else {
    return res.status(405).send('OOPS seems like you are not the owner!');
  }
  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);  
});