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

      return knackClient.isAuthenticated(token).then((data) => {
        if (data.isAuth) {
          req.knackAuth = { session: data.response.body.session, token }
          return next()
        }
        return res.sendStatus(401)
      }).catch(next)
    }
    return res.sendStatus(401);
  }
};

module.exports = auth;
