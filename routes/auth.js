const { ViewBasedClient }  = require('knackhq-client');


function getTokenFromHeader(req){
  if (req.headers.authorization) {
    return req.headers.authorization;
  }

  return null;
}

var auth = {
  required: (req, res, next) => {
    const token = getTokenFromHeader(req)
    if (token) {

      const knackClient = new ViewBasedClient({app_id: process.env.APP_ID, auth_scene: process.env.AUTH_SCENE, auth_view: process.env.AUTH_VIEW});

      knackClient.isAuthenticated(token).then((res) => {
        console.log('~~~~ The Response in the auth required middleware is ~~~~', res)
        return next(res)
      }).catch(next)
    }
    console.log('we got here', token)
    return res.sendStatus(401);
  }
};

module.exports = auth;
