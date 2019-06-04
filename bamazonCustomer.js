var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    start();
});


// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "purchasing",
            type: "list",
            message: "Would you like to purchase something today?",
            choices: ["YES", "NO"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.purchasing === "YES") {
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    console.log(res);
                    // connection.end();
                });
                // readProducts();
            }
            else if (answer.purchasing === "NO") {
                console.log("Goodbye, Come back soon")
                connection.end();
            }
        });
}

function readProducts() {
    // console.log("Showing all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
}




function postAuction() {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "What is the item ID of the product you would like to buy?"
            },
            {
                name: "productQuantity",
                type: "input",
                message: "How many units of this product would you like to buy?"
            },

        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO auctions SET ?",
                {
                    item_name: answer.item,
                    category: answer.category,
                    starting_bid: answer.startingBid || 0,
                    highest_bid: answer.startingBid || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your auction was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
}