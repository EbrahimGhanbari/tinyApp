
// this function find the user
const getUserByEmail = (email, users) => { 
  for (let user in users) {
    if (email === users[user].email) {
      return user;
    }
  }
  return false;
}


module.exports = getUserByEmail;