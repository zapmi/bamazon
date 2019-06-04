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
    console.log("connected as id " + connection.threadId + "\n");
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

        ]).then(function (answers) {
            let itemID = answers.id_of_product;
            let itemQuantity = answers.item_Quantity;
            purchasedItem(id_of_product, item_Quantity);
        });
}

function purchasedItem(id, amount){
    connection.query('Select * FROM products WHERE item_id = ' + id, function(err, res){
        if(err){console.log(err)};
    })
}

start();

