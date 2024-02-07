const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Array to store customers
let customers = [];

// Route for handling POST requests from clients
app.post('/customers', (req, res) => {
    // Data received in the POST request
    const newCustomers = req.body;

    // Validate each customer in the request
    newCustomers.forEach(newCustomer => {

        // Check if all fields are supplied
        if (!newCustomer.firstName) {
            return res.status(400).json({ message: 'First name is required.' });
        }
        else if (!newCustomer.lastName) {
            return res.status(400).json({ message: 'Last name is required.' });
        }
        else if (!newCustomer.age) {
            return res.status(400).json({ message: 'Age is required.' });
        }
        else if (!newCustomer.id) {
            return res.status(400).json({ message: 'ID is required.' });
        }

        // Validate age
        if (newCustomer.age <= 18) {
            return res.status(400).json({ message: 'Age must be above 18 for each customer.' });
        }

        // Check if ID is already used
        const idExists = customers.some(customer => customer.id === newCustomer.id);

        if (idExists) {
            return res.status(400).json({ message: 'Customer ID already in use.' });
        }

        // Insert the new customer in sorted order (by last name, then first name)
        let inserted = false;

        for (let i = 0; i < customers.length; i++) {
            if (newCustomer.lastName < customers[i].lastName ||
                (newCustomer.lastName === customers[i].lastName && newCustomer.firstName < customers[i].firstName)) {
                customers.splice(i, 0, newCustomer);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            customers.push(newCustomer);
        }
    });

    // Return success response
    res.status(201).json({ message: 'Customers added successfully.' });
});

// Function to generate random customers
function generateRandomCustomers() {
    let randomCustomers = [];

    // Array of first names and last names from the Appendix
    const firstNames = ['Leia', 'Sadie', 'Jose', 'Sara', 'Frank', 'Dewey', 'Tomas', 'Joel', 'Lukas', 'Carlos'];
    const lastNames = ['Liberty', 'Ray', 'Harrison', 'Ronan', 'Drew', 'Powell', 'Larsen', 'Chan', 'Anderson', 'Lane'];

    // Generate random number of customers between 2 and 5
    const numCustomers = Math.floor(Math.random() * 4) + 2;

    // Generate random customers
    for (let i = 0; i < numCustomers; i++) {
        // Generate random age between 10 and 90
        let age = Math.floor(Math.random() * 81) + 10;

        // Generate incremental ID
        let id = i + 1;

        // Choose random names from the Appendix
        let firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        // Create customer object
        let customer = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            id: id
        };

        // Add customer to the array of random customers
        randomCustomers.push(customer);
    }

    return randomCustomers;
}

// Route for handling GET requests from clients
app.get('/customers', (req, res) => {
    // Gerar random costumers
    let randomCustomers = generateRandomCustomers();

    // Return the array of customers with all fields
    res.status(200).json(randomCustomers);
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
