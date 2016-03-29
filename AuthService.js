var AsyncStorage = require ('react-native').AsyncStorage;
var _ = require ('lodash');


const authKey = 'user';


class AuthService {

  getAuthInfo(cb){
    AsyncStorage.multiGet([authKey], (err, val)=> {
      if(err){
        return cb(err);
      }

      if(!val){
        return cb();
      }

      var zippedObj = _.zipObject(val);
      if(!zippedObj['userId']){
        return cb();
      }

      var authInfo = {
        user:JSON.parse(zippedObj[authKey])
      }
      return cb(null, authInfo);
    })
  }

  login(creds, cb){

      fetch('https://portfolioio.herokuapp.com/api/users/signin', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(creds)
      })
      .then((response) => {
        response.json()
          .then((data) => {
            if(data.token) {
              return data;
            }
            throw {
              nouser: data=='User not found',
              badpassword: data=='Wrong password',
            }
          })
          .then((response) => {
            return response;
          })
          .then((results) => {
            AsyncStorage.multiSet([
                ['userId', results.userId.toString()], ['username', results.username], ['token', results.token]
            ], (err)=> {
              if(err){
                throw err;
              }
              return cb({success:true});
            })
          })
          .catch((error)=>{
            return cb(error);
          })
      })
    }
}

module.exports = new AuthService();