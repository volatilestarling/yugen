var morgan = require('morgan');
var bodyParser = require('body-parser');
var helpers = require('./helpers.js');
// var methodOverride = require('method-override');

module.exports = function (app, express) {
  var userRouter = express.Router();
  var locationRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
  // app.use(bodyParser.text());
  // app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
  // app.use(methodOverride());


  app.use('/api/users', userRouter);

  app.use('/api/location', locationRouter); // user link router for link request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('../routes/userRoutes.js')(userRouter);
  require('../routes/locationRoutes.js')(locationRouter);
};
