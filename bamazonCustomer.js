let mysql = require("mysql");
let inquirer = require("inquirer");


let connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
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
        console.table(res);
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
        if (amount <= res[0].stock_quantity) {
            var totalCost = res[0].price * amount;

            console.log("Your total cost for " + amount + " " + res[0].product_name + " is $" + totalCost + ", Thank you!");
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amount + " WHERE item_id = " + ID);
            
        }else{

            console.log("Insufficient quantity, looks like we don't have enough " + res[0].product_name + " to complete your order.");
            
        }
        displayItems();
    });           
        
}


start();