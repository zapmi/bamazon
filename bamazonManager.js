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

function start() {
    inquirer
        .prompt({
            name: "menuOptions",
            type: "list",
            message: "Would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        })
        .then(function (answer) {
            if (answer.menuOptions === "View Products for Sale") {
                displayItems();
            }
            else if (answer.menuOptions === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.menuOptions === "Add to Inventory") {
                addInventory();
            }
            else if (answer.menuOptions === "Add New Product") {
                addNewProduct();
            }
            else if (answer.menuOptions === "EXIT") {
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
        // secondPrompts();
        start();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, res) {
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
        // secondPrompts();
        start();
    });

}

function addInventory() {
    inquirer
        .prompt([
            {
                name: "id_of_product",
                type: "input",
                message: "What is the ID of the product you would like to add inventory to?",
            },
            {
                name: "item_Quantity",
                type: "input",
                message: "How many units of this product would you like to add?",
            },

        ]).then(function (answer) {
            let itemID = answer.id_of_product;
            let itemQuantity = answer.item_Quantity;
            addedItem(itemID, itemQuantity);
        });

}

function addedItem(ID, amount) {
    connection.query('Select * FROM products WHERE item_id = ' + ID, function (err, res) {
        if (err) {
            console.log(err)
        }

        if (amount > 0) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity + " + amount + " WHERE item_id = " + ID);
        }
        // } else if (amount <= res[0].stock_quantity) {
        //     var totalCost = res[0].price * amount;
        //     console.log("Your total cost for " + amount + " " + res[0].product_name + "(s) is $" + totalCost + ", Thank you!");
        //     connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amount + " WHERE item_id = " + ID);
        // }
        displayItems();
    });

    // connection.end();
}

start();