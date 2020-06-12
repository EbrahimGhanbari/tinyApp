// this function create random string
const generateRandomString = () => {
  let result = "";
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result;;
};

// this function find the user
const userFinder = (email, users) => { 
  for (let user in users) {
    if (email === users[user].email) {
      return user;
    }
  }
  return false;
}

//this fun get the id and return database pertaining to that id
const urlsForUser = (id, urlDatabase) => {
  const urlUserDatabse = {};

  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      
      urlUserDatabse[shortUrl] = {
        longURL: urlDatabase[shortUrl].longURL, 
        userID: id
      };

    }
  }
  return urlUserDatabse;
};

module.exports = {generateRandomString, userFinder, urlsForUser};