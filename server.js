var express =     require('express');
var bodyParser =  require('body-parser');
var RateLimit =   require('express-rate-limit');
var path =        require('path');

//------------------------------SERVER SETUP-----------------------------------------

const app = express();
 

//-----------------------------------MIDDLEWARE------------------------------------------------
var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 50, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
app.use(limiter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.use(express.static(path.join(__dirname, '/build')));

//-----------------------------------SERVER INIT------------------------------------------------

//Listen
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Server listening on port: ' + port);
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})