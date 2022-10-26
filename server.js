'use strict'

// Express
const PORT = 3239;  // Don't change port number.
const express = require("express");  // Import express.
const app = express();  // Create application instance.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database
const db = require('./db-connector.js')// Database connection file.

// Handlebars
const { engine } = require('express-handlebars')
const handlebars = require('express-handlebars')// Import express handlebars.
app.engine('.hbs', engine({ extname: '.hbs' }))// Create instance of handlebars engine to process templates.
app.set('view engine', '.hbs')// Tell express to use handlebars engine whenever it encounters a .hbs file.


// Routes

app.get('/', function (req, res) { // Render response ensures the templating engine will process file prior to
    res.render('index')          // sending finished html back to client.
});



//Code for arrivals requests
app.get("/arrivals", function(req, res){

    let query1 = "SELECT * FROM arrivals;";  // Define our query.
    db.pool.query(query1, function(error, rows, fields){
	
        res.render("arrivals", {data: rows});  // Render the arrivals and also send the renderer an object were data 
    })                                     // is equal to the rows we recieved from the query.

});

app.post('/add-arrival', function(req, res){
    let data = req.body;

    let query1 = `INSERT INTO arrivals (arrivalLocation) VALUES ('${data['arrivalLocation']}')`;
    db.pool.query(query1, function(error, rows, fields){
	if (error){
	    console.log(error);
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/arrivals');
	}
    })  
});

app.post('/update-arrival', function(req, res){

    let data = req.body;
    let arrivalId = data['arrivalId'];
    let arrivalLocation = data['arrivalLocation'];

    let query1 = `UPDATE arrivals SET arrivalLocation = '${arrivalLocation}' WHERE arrivalId = '${arrivalId}'`;

    db.pool.query(query1, function(error, rows, fields){
	if (error){
	    console.log(error);
	}
	else{
	    res.redirect('/arrivals');
	}
    })
});

//Code for departures requests
app.get("/departures", function(req, res){

    let query1 = "SELECT * FROM departures;";  // Define our query.
    db.pool.query(query1, function(error, rows, fields){
	
        res.render("departures", {data: rows});  // Render the trains and also send the renderer an object were data 
    })                                     // is equal to the rows we recieved from the query.
});


app.post('/add-departure', function(req, res){
    let data = req.body;

    let query1 = `INSERT INTO departures VALUES (NULL, '${data['departureLocation']}')`;

    db.pool.query(query1, function(error, rows, fields){
	if (error){
	    console.log(error);
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/departures');
	    
	}
    })  
});


app.post('/update-departure', function(req, res){

    let data = req.body;
    let departureId = data['departureId'];
    let departureLocation = data['departureLocation'];
    

    let query1 = `UPDATE departures SET departureLocation = '${departureLocation}' WHERE departureId = '${departureId}'`;

    db.pool.query(query1, function(error, rows, fields){
	if (error){
	    console.log(error);
	}
	else{
	    res.redirect('/departures');
	}
    })
});



//Code for passengers requests
app.get("/passengers", function (req, res) {

    let query1;  // Declare query.

    if (req.query.passengerId === undefined){  // Display all passengers in table if filter undefined.
        query1 = "SELECT * FROM passengers;";  
    }

    else if (req.query.passengerId !== ""){  // Filter by passengerId.
        query1 = `SELECT * FROM passengers WHERE passengerId = "${req.query.passengerId}";`;
    }

    else if (req.query.firstName !== ""){  // Filter by firstName, firstName & lastName & dob, firstName & lastName, firstName & dob.
        if (req.query.lastName === "" && req.query.dob === ""){
            query1 = `SELECT * FROM passengers WHERE firstName = "${req.query.firstName}";`;
        }
        else if(req.query.lastName !== "" && req.query.dob !== ""){
            query1 = `SELECT * FROM passengers WHERE firstName = "${req.query.firstName}" AND lastName = "${req.query.lastName}"
            AND dob = "${req.query.dob};"`;
        }
        else if (req.query.lastName !== ""){
            query1 = `SELECT * FROM passengers WHERE firstName = "${req.query.firstName}" AND lastName = "${req.query.lastName}";`;
        }
        else {
            query1 = `SELECT * FROM passengers WHERE firstName = "${req.query.firstName}" AND dob = "${req.query.dob}";`;
        }
    }

    else if (req.query.lastName !== ""){  // Filter by lastName, lastName & dob.
        if(req.query.firstName === "" && req.query.dob === ""){
            query1 = `SELECT * FROM passengers WHERE lastName = "${req.query.lastName}";`;
        }
        else {
            query1 = `SELECT * FROM passengers WHERE lastName = "${req.query.lastName}" AND dob = "${req.query.dob}";`;
        }
    }

    else {  // Filter by dob.
        query1 = `SELECT * FROM passengers WHERE dob = "${req.query.dob}";`;
    }

    db.pool.query(query1, function(error, rows, fields){
	
        res.render("passengers", {data: rows});  // Render the passengers and also send the renderer an object were data 
    })                                     // is equal to the rows we recieved from the query.

});

app.post("/add-passenger", function(req, res){

    let data = req.body
    let fname = data['firstName'];
    let lname = data['lastName'];
    let dob = data['dob']

    if (dob === '' || fname === '' || lname === '')
    {
	res.redirect('/passengers');
	return;
    }
    
    let query1 = `INSERT INTO passengers VALUES (NULL, '${fname}', '${lname}', '${dob}')`;
    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data);
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/passengers');
	}
    })  
});



//Code for tickets requests
app.get("/tickets", function(req, res){

    let query1;  // Declare query.

    if (req.query.ticketNumber === undefined){  // Display all tickets if filter undefined.
        query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
        LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
        LEFT JOIN trips ON tickets.tripId = trips.tripId 
        LEFT JOIN departures ON trips.departureId = departures.departureId 
        LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId;`;  
    }

    else if(req.query.ticketNumber !== ""){  // Filter by ticketNumber.
        query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
        LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
        LEFT JOIN trips ON tickets.tripId = trips.tripId 
        LEFT JOIN departures ON trips.departureId = departures.departureId 
        LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
        WHERE ticketNumber = "${req.query.ticketNumber}";`;
    }

    else if(req.query.firstName !== ""){  // Filter by passenger, passenger & trip, passenger & trip & train, passenger & trip & train & date.
        if(req.query.departureLocation === "" && req.query.trainId === "" && req.query.date === ""){  
            query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE firstName = "${req.query.firstName}" AND lastName = "${req.query.lastName}";`; 
        }
        else if(req.query.departureLocation !== ""){
            if(req.query.trainId === "" && req.query.date === ""){
                query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
                LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
                LEFT JOIN trips ON tickets.tripId = trips.tripId 
                LEFT JOIN departures ON trips.departureId = departures.departureId 
                LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
                WHERE firstName = "${req.query.firstName}" AND lastName = "${req.query.lastName}"
                AND departureLocation = "${req.query.departureLocation}" AND arrivalLocation = "${req.query.arrivalLocation}";`;
            }
            else if(req.query.date === ""){
                query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
                LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
                LEFT JOIN trips ON tickets.tripId = trips.tripId 
                LEFT JOIN departures ON trips.departureId = departures.departureId 
                LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
                WHERE firstName = "${req.query.firstName}" AND lastName = "${req.query.lastName}"
                AND departureLocation = "${req.query.departureLocation}" AND arrivalLocation = "${req.query.arrivalLocation}"
                AND trainId = "${req.query.trainId}";`;
            }
            else {
                query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
                LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
                LEFT JOIN trips ON tickets.tripId = trips.tripId 
                LEFT JOIN departures ON trips.departureId = departures.departureId 
                LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
                WHERE firstName = "${req.query.firstName}" AND lastName = "${req.query.lastName}"
                AND departureLocation = "${req.query.departureLocation}" AND arrivalLocation = "${req.query.arrivalLocation}"
                AND trainId = "${req.query.trainId}" AND tripDate = "${req.query.date}";`;
            }
        }
    }

    else if (req.query.departureLocation !== ""){  // Filter by trip, trip & train, trip & train & date.
        if(req.query.trainId === "" && req.query.date === ""){
            query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE departureLocation = "${req.query.departureLocation}" AND arrivalLocation = "${req.query.arrivalLocation}";`;
        }
        else if(req.query.date === ""){
            query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE departureLocation = "${req.query.departureLocation}" AND arrivalLocation = "${req.query.arrivalLocation}"
            AND trainId = "${req.query.trainId}";`;
        }
        else{
            query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE departureLocation = "${req.query.departureLocation}" AND arrivalLocation = "${req.query.arrivalLocation}"
            AND trainId = "${req.query.trainId}" AND tripDate = "${req.query.date}";`;
        }
    }

    else if(req.query.trainId !== ""){  // Filter by train, train & date.
        if(req.query.date === ""){
            query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE trainId = "${req.query.trainId}";`;
        }
        else{
            query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE trainId = "${req.query.trainId}" AND tripDate = "${req.query.date}";`;
        }
    }

    else{  // Filter by date only.
        query1 = `SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
            LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
            LEFT JOIN trips ON tickets.tripId = trips.tripId 
            LEFT JOIN departures ON trips.departureId = departures.departureId 
            LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId
            WHERE tripDate = "${req.query.date}";`;
    }   

    let query2 = `SELECT passengerId, firstName, lastName FROM passengers;`;  // Query for passengers dropdown.

    let query3 = `SELECT tripId, departureLocation, arrivalLocation FROM trips
    LEFT JOIN departures ON trips.departureId = departures.departureId
    LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId;`;  // Query for trips dropdown.

    let query4 = 'SELECT trainId FROM trains;';  // Query for trains dropdown.


    db.pool.query(query1, function(error, rows, fields){

        let data = rows;  // Save tickets data.

        db.pool.query(query2, function(error, rows, fields){

            let passengers = rows;  // Save passengers.

            db.pool.query(query3, function(error, rows, fields){

                let trips = rows;  // Save trips.

                db.pool.query(query4, function(error, rows, fields){

                    let trains = rows;  // Save trains.
                    
                    // Render page and send renderer an object with the data recieved from the 4 queries.
                    res.render("tickets", {data: data, passenger: passengers, trip: trips, train: trains});
                });
            });
        });

    });
});

app.post("/add-ticket", function(req, res){
    let data = req.body;
    let passengerId = parseInt(data['input-passenger']);
    let tripId = parseInt(data['input-trip']);
    let trainId = parseInt(data['input-trainId']);
    if (trainId === '' || isNaN(trainId))
    {
	
	trainId = 'NULL';
    }

    if (passengerId === '' || isNaN(passengerId) || tripId === '' || isNan(tripId))
    {
	res.redirect('/tickets');
	return;
    }
    
    let tripDate = data['tripDate'];
    let query1 = `INSERT INTO tickets (passengerId, tripId, trainId, tripDate) VALUES (${passengerId}, ${tripId}, ${trainId}, '${tripDate}')`;
    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/tickets');
	}
    })  
});

app.post("/delete-ticket", function(req, res){

    let data = req.body;
    let ticketNumber = parseInt(data['ticketNumber']);

    let query1 = `DELETE FROM tickets WHERE ticketNumber = '${ticketNumber}'`;
    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/tickets');
	}
    })
});

app.post("/update-ticket", function(req, res){

    let data = req.body;
    
    let ticketNumber = parseInt(data['ticketNumber']);
    let trainId = parseInt(data['input-trainId']);
    let query1 = `UPDATE tickets SET trainId = '${trainId}' where ticketNumber = '${ticketNumber}';`;

    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/tickets');
	}
    })  
});


//Code for trains requests
app.get("/trains", function(req, res){

    let query1 = "SELECT * FROM trains;";  // Define our query.
    db.pool.query(query1, function(error, rows, fields){
	
        res.render("trains", {data: rows});  // Render the trains and also send the renderer an object were data 
    })                                     // is equal to the rows we recieved from the query.

});


app.post("/add-train", function(req, res){

    let data = req.body;
    
    let capacity = parseInt(data['capacity']);
    let inOperation = data['operationStatus'];

    if (inOperation) {
	inOperation = 1;
    }
    else{
	inOperation = 0;
    }
    
    let query1 = `INSERT INTO trains VALUES (NULL, ${capacity}, ${inOperation})`;
    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/trains');
	}
    })  
});

app.post("/update-train", function(req, res){

    let data = req.body;
    
    let trainId = parseInt(data['trainId']);
    let inOperation = data['inOperation'];

    if (inOperation) {
	inOperation = 1;
    }
    else {
	inOperation = 0;
    }

    let query1 = `UPDATE trains SET inOperation = '${inOperation}' where trainId = '${trainId}'`;

    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/trains');
	}
    })  
});

app.post("/delete-train", function(req, res){

    let data = req.body;
    let trainId = parseInt(data['trainId']);

    let query1 = `DELETE FROM trains WHERE trainId = '${trainId}';`;

    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/trains');
	}
    })
});


//Code for trips requests
app.get("/trips", function(req, res){
    
    let query1 = `SELECT tripId, departureLocation, arrivalLocation, price FROM trips 
    LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId 
    LEFT JOIN departures ON trips.departureId = departures.departureId;`;  // Query to fill trips html table.

    let query2 = `SELECT departureId, departureLocation FROM departures`;  // Query for departures drop down menu.

    let query3 = `SELECT arrivalId, arrivalLocation FROM arrivals`;  // Query for arrivals drop down manu.

    
    // Run first query.
    db.pool.query(query1, function(error, rows, fields){

        let trips = rows;  // Save trips.

        // Run second query.
        db.pool.query(query2, function(error, rows, fields){

            let departures = rows;  // Save departures.
            
            // Run third query.
            db.pool.query(query3, function(error, rows, fields){

                let arrivals = rows;  // Save arrivals.
                
                // Render page and send renderer an object with the data recieved from the 3 queries.
                res.render("trips", {data: trips, departure: departures, arrival: arrivals});
            });

        });

    });   
});


app.post("/add-trip", function(req, res){

    let data = req.body;
    
    let departureId = parseInt(data['input-departure']);
    let arrivalId = parseInt(data['input-arrival']);
    let price = data['price'];
    let query1 = `INSERT INTO trips VALUES (NULL, ${departureId}, ${arrivalId}, ${price})`;
    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/trips');
	}
    })  
});


app.post("/update-trip", function(req, res){

    let data = req.body;
    
    let tripId = parseInt(data['tripId']);
    let price = parseInt(data['price']);
    let query1 = `UPDATE trips SET price = '${price}' where tripId = '${tripId}'`;
    db.pool.query(query1, function(error, rows, fields){
	if (error)
	{
	    console.log(error);
	    console.log(data)
	    res.sendStatus(400);
	}
	else
	{
	    res.redirect('/trips');
	}
    })  
});




// Listener
app.listen(PORT, () => { // Message sent when server is listening.
    console.log(`Server listening on port ${PORT}...`)
})
