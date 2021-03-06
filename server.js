var mysql = require('mysql');
var bodyParser = require('body-parser');
var express = require('express');

var conn = mysql.createConnection({
	'host': 'localhost',
	'user': 'root',
	'password': '',
	'database': 'wholefit'
});

conn.connect(function(err){ 
	if(err) throw err;
	console.log('Connected to database!');
});

var app = express();
var server = app.listen(process.env.PORT || 8000, function(){
	console.log('Connected to server on port ' + server.address().port);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Load all files

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
})

// Scripts

app.get('/scripts/services/app.js', function(req, res){
	res.sendFile(__dirname + '/scripts/services/app.js')
})

app.get('/scripts/controllers/homeCtrl.js', function(req, res){
	res.sendFile(__dirname + '/scripts/controllers/homeCtrl.js');
})

app.get('/scripts/controllers/accountEnterCtrl.js', function(req, res){
	res.sendFile(__dirname + '/scripts/controllers/accountEnterCtrl.js');
})

app.get('/scripts/controllers/headerCtrl.js', function(req, res){
	res.sendFile(__dirname + '/scripts/controllers/headerCtrl.js');
})

app.get('/scripts/controllers/footerCtrl.js', function(req, res){
	res.sendFile(__dirname + '/scripts/controllers/footerCtrl.js');
})

// Templates

app.get('/templates/header.html', function(req, res){
	res.sendFile(__dirname + '/templates/header.html');
})

app.get('/templates/home.html', function(req, res){
	res.sendFile(__dirname + '/templates/home.html');
})

app.get('/templates/footer.html', function(req, res){
	res.sendFile(__dirname + '/templates/footer.html');
})

app.get('/templates/accountEnter.html', function(req, res){
	res.sendFile(__dirname + '/templates/accountEnter.html');
})

// Resources

app.get('/resources/mainBanner.jpg', function(req, res){
	res.sendFile(__dirname + '/resources/mainBanner.jpg');
})

// Stylesheets

app.get('/styles/firstPageStyle.css', function(req, res){
	res.sendFile(__dirname + '/styles/firstPageStyle.css');
})

app.get('/styles/headerStyle.css', function(req, res){
	res.sendFile(__dirname + '/styles/headerStyle.css');
})

app.get('/styles/mainStyle.css', function(req, res){
	res.sendFile(__dirname + '/styles/mainStyle.css');
})

app.get('/styles/accountEnterStyle.css', function(req, res){
	res.sendFile(__dirname + '/styles/accountEnterStyle.css');
})

// New user

	// first step 

app.post('/submitUser', function(req, res) {
	var userData = "('" + req.body.name + "', '" + req.body.email + "', '" + req.body.password + "')";
	var insertDataQuery = "INSERT INTO users (name, email, password) VALUES " + userData;
	
	conn.query(insertDataQuery, function(err, results) {
		if (err) throw err;
		console.log(results);
	})
	res.end();
});

	// check whether the email the user is trying to use already exists in the database

app.get('/checkAvailableEmail/:email', function(req, res) {
	conn.query("SELECT uid FROM users WHERE email = ?", req.params.email, function(err, results){
		if (err) throw err;
		console.log(results);

		res.send(results);
	})
})

	// second step -- user details

app.post('/newUserDetails', function(req, res){

	// Add some user details

	var insertionQuery = "UPDATE users SET age = " + req.body.age + " AND height = " + req.body.height + "AND personal_table = '" + req.body.tableName 
						+ "' WHERE email = '" + req.body.email + "'";

	conn.query(insertionQuery, function(err, results) {
		if (err) throw err;
		console.log(results);	
	});

	// Create unique table for each user with given structure

	conn.query("CREATE TABLE " + req.body.tableName.toUpperCase() + " ( \
			WEIGHT	INT,	\
			AT_DATE DATE, \
			TOTAL_CALORIES INT, \
			FAT INT, \
			CARBOHYDRATES INT, \
			PROTEIN INT, \
		)", function(err, results) {
		if (err) throw err;
		console.log(results);

	});

	// Add the first table entry

	var currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

	conn.query("INSERT INTO " + req.body.tableName + " (weight, at_date) VALUES (" + req.body.weight + ", '" + currentDate + "')" , function(err, results) {
		if (err) throw err;
		console.log(results);
	});
});

// Login

app.get('/verifyEmail/:email', function(req, res) {
	var searchQuery = "SELECT uid FROM users WHERE email = '" + req.params.email + "'";

	console.log(searchQuery);

	conn.query(searchQuery, function(err, results) {
		if (err) throw err;
		console.log(results);
		res.send(results);
		res.end();
	});
});

app.get('/verifyPass/:pass/:email', function(req, res) {
	var searchQuery = "SELECT uid FROM users WHERE email = '" + req.params.email + "' AND password = '" + req.params.pass + "'";
	
	console.log(searchQuery);

	conn.query(searchQuery, function(err, results) {

		console.log(searchQuery);

		if (err) throw err;
		console.log(results);
		res.send(results);
		res.end();
	})
})
	