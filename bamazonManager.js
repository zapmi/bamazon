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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            if (answer.menuOptions === "View Products for Sale") {
                displayItems();
            }
            else if (answer.menuOptions === "View Low Inventory") {
               lowInventory(); 
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
    });
}

function lowInventory(){
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
    });

}

start();