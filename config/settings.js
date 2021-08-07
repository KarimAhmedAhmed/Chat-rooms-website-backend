
const bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer();
const passport = require('passport')




function configure_myapp(app, express) {
  // middle wares to read request data
  app.use(upload.array());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  
  
  





};

module.exports = configure_myapp