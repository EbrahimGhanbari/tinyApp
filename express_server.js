const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const generateRandomString = require("./generateRandomString");

// Varaiables are deifined here
const app = express();
const PORT = 8080; // default port 8080

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

let templateVars = {
  urls: urlDatabase,
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

// functions: This part will be moved to another file later
const userFinder = (email) => { 
  for (let user in users) {
    if (email === users[user].email) {
      return user;
    }
  }
  return false;
}

//this funcation has to be checked
const urlsForUser = (id) => {
  const urlUserDatabse = {};

  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      
      urlUserDatabse[shortUrl] = {
        shortURL: {longURL: urlDatabase[shortUrl].longURL, userID: id}
      };

    }
  }
  return urlUserDatabse;
};


app.get("/urls", (req, res) => {
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("urls_index", templateVars);
  
});

// Here are all page
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body["email"];
  const pass = req.body["password"];
 
  if (!email && !pass) {
    return res.status(400).send('Invalid email and/or passwords');
  }

  if (userFinder(email)) {
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

app.get("/register", (req, res) => {
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("register", templateVars)
});

app.get("/login", (req, res) => {
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("loginForm", templateVars)
});

app.post("/login", (req, res) => {

  const email = req.body.email;
  const pass = req.body.password;
  const id = userFinder(email);
  
  if (id && pass === users[id].password) {
    res.clearCookie('user_id');
    res.cookie('user_id', id); 
    res.redirect("/urls");
  } else {
    return res.status(400).send('User or password is wrong!');
  }

})


app.post("/regShortcut", (req, res) => {
  // res.cookie('username', req.body["username"]);  
  res.redirect('/register');
});

app.post("/loginShortcut", (req, res) => {
  res.redirect('/login');
});
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});



app.get("/urls/new", (req, res) => {
  // 
  if (!users[req.cookies["user_id"]]) {
    return res.redirect("/login");
  }
  templateVars["user"] = users[req.cookies["user_id"]];
  res.render("urls_new", templateVars); 
});

// Add random charactars for each websit
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key]={
    longURL: `http://${req.body['longURL']}`,
    userID: req.cookies["user_id"] 
  };
  res.redirect(`/urls/${key}`);
});


// All the dynamic pages are here
//edit button in creat new url page
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id].longURL = `http://${req.body['NewlongURL']}`
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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  templateVars["user"] = users[req.cookies["user_id"]];

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);  
});