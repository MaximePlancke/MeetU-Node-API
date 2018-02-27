var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var oauth2Controller = require('./controllers/oauth2');
// var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var userController = require('./controllers/users');
var matchesController = require('./controllers/matches');
var conversationController = require('./controllers/conversation');
var messageController = require('./controllers/message');
var configController = require('./controllers/config')

var app = express();


 
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());

require('./controllers/auth');

app.post('/oauth/token', oauth2Controller.token);


//To remove
app.get('/api/userInfo',
    passport.authenticate('bearer', { session: false }), 
        function(req, res) {
            // req.authInfo is set using the `info` argument supplied by
            // `BearerStrategy`.  It is typically used to indicate a scope of the token,
            // and used in access control checks.  For illustrative purposes, this
            // example simply returns the scope in the response.
            res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
        }
);




let router = express.Router();




// router.route('/clients')
//   .post(authController.isAuthenticated, clientController.postClients)
//   .get(authController.isAuthenticated, clientController.getClients);
 
router.route('/users')
  // .get(userController.getUsers)
  .post(userController.postUser)
  .put(passport.authenticate('bearer', { session: false }), userController.putUser);
router.route('/me')
  .get(passport.authenticate('bearer', { session: false }), userController.getUser);

// router.route('/users/:user_id')
//   .get(userController.getUser)
//   .put(userController.putUser)
//   .delete(userController.deleteUser);


// router.route('/matches')
//   .post(authController.isAuthenticated, matchesController.postMatch);
// router.route('/matches/:match_id')
//   .get(authController.isAuthenticated, matchesController.getMatch);


router.route('/matches')
  .post(passport.authenticate('bearer', { session: false }), matchesController.postMatch)
// router.route('/matches')
  .get(passport.authenticate('bearer', { session: false }), matchesController.getMatches)
// router.route('/matches')
  .put(passport.authenticate('bearer', { session: false }), matchesController.putMatch);
// router.route('/matches/:match_id')
//   .get(passport.authenticate('bearer', { session: false }), matchesController.getMatch);


router.route('/conversations')
  .post(passport.authenticate('bearer', { session: false }), conversationController.postConversation)
  .get(passport.authenticate('bearer', { session: false }), conversationController.getConversations);

// router.route('/conversations/:conversation_id')
//   .get(passport.authenticate('bearer', { session: false }), conversationController.getConversation);


router.route('/messages')
  .post(passport.authenticate('bearer', { session: false }), messageController.postMessage)
router.route('/conversations/:conversation_id')
  .get(passport.authenticate('bearer', { session: false }), messageController.getMessages);


router.route('/config')
  .get(passport.authenticate('bearer', { session: false }), configController.getConfig);



app.use('/api', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
}); 

module.exports = app;
