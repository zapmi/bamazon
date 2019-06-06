let mysql = require("mysql");
let inquirer = require("inquirer");
var Table = require("cli-table");


let connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

function start() {
    inquirer
        .prompt({
            name: "purchasing",
            type: "list",
            message: "Would you like to purchase something today?",
            choices: ["YES", "NO"]
        })
        .then(function (answer) {
            if (answer.purchasing === "YES") {
                displayItems();
            }
            else if (answer.purchasing === "NO") {
                console.log("Waves are free, Goodbye.")
                connection.end();
            }
        });
}

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Category", "Price", "Quantity"]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        secondPrompts();
    });
}

function secondPrompts() {
    inquirer
        .prompt([
            {
                name: "id_of_product",
                type: "input",
                message: "What is the ID of the product you would like to buy?",
            },
            {
                name: "item_Quantity",
                type: "input",
                message: "How many units of this product would you like to buy?",
            },

        ]).then(function (answer) {
            let itemID = answer.id_of_product;
            let itemQuantity = answer.item_Quantity;
            purchasedItem(itemID, itemQuantity);
        });
}

function purchasedItem(ID, amount) {
    connection.query('Select * FROM products WHERE item_id = ' + ID, function (err, res) {
        if (err) {
            console.log(err)
        }
        // if (ID !== res[0].item_id){
        //     console.log("Not an ID number");
        // }
        if (amount > res[0].stock_quantity) {
            console.log("Insufficient quantity! Try again!");

        } else if (amount <= res[0].stock_quantity) {
            var totalCost = res[0].price * amount;
            console.log("Your total cost for " + amount + " " + res[0].product_name + "(s) is $" + totalCost + ", Thank you!");
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amount + " WHERE item_id = " + ID);
        }
        displayItems();
    });

    // connection.end();
}


start();

