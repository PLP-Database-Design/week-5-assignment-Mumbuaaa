//Import dependencies
const express = require('express')
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')

//configure dotenv; environment variables
dotenv.config();

//Create a connection object stored in a variable called db
const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

//test the connection
db.connect ((err) => {
    //if not connected
    if (err) {
        return console.log("Error connecting to the database", err)

    }
    //if connected
    console.log ("Successfully connected to the database", db.threadId)
});

//connecting with ejs
app.set('view engine','ejs')
app.set('views', __dirname + '/views')
 
app.get('/', (req,res) => {
    res.send('Health API');
});

// Question 1 goes here
//Retrieve all patients 
app.get ('/patients', (req,res) => {
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query (getPatients, (err, data) => {
        //if there is an error
        if(err) {
            return res.status(400).send ("Failed to get patients", err)
        }
        //if no error
        //connecting with ejs patients table
        //else {
           // res.status(200).render('patients', {data});
       // }
       res.status(200).send(data)
    });
});

// Question 2 goes here
app.get ('/providers', (req,res) => {
    const getProviders = "SELECT  first_name, last_name, provider_specialty FROM providers"
    db.query (getProviders, (err, data) => {
        //if there is an error
        if(err) {
            return res.status(400).send ("Failed to get providers", err)
        }
        //if no error
       res.status(200).send(data)
    });
});

// Question 3 goes here
app.get('/patients/by-first-name', (req, res) => {
    const firstName = req.query.first_name; // Get first name from query parameter

    // Check if first name is provided
    if (!firstName) {
        return res.status(400).send("First name query parameter is required.");
    }

    // SQL query to retrieve patients with the specified first name
    const getPatientsByFirstName = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";

    // Execute the query
    db.query(getPatientsByFirstName, [firstName], (err, data) => {
        // If there is an error
        if (err) {
            console.error("Error fetching patients by first name:", err.message); // Log the error
            return res.status(400).send("Failed to get patients by first name: " + err.message);
        }

        // Send the retrieved data as the response
        res.status(200).send(data);
    });
});


// Question 4 goes here
// Retrieve all providers by specialty
app.get('/providers/by-specialty', (req, res) => {
    const specialty = req.query.specialty; // Get specialty from query parameter

    // Check if specialty is provided
    if (!specialty) {
        return res.status(400).send("Specialty query parameter is required.");
    }

    // SQL query to retrieve providers with the specified specialty
    const getProvidersBySpecialty = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";

    // Execute the query
    db.query(getProvidersBySpecialty, [specialty], (err, data) => {
        // If there is an error
        if (err) {
            console.error("Error fetching providers by specialty:", err.message); // Log the error
            return res.status(400).send("Failed to get providers by specialty: " + err.message);
        }

        // Send the retrieved data as the response
        res.status(200).send(data);
    });
});



// listen to the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});