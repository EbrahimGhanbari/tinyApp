const generateRandomString = () => {
  let result = "";
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result;;
};

module.exports = generateRandomString;