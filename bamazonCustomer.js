let mysql = require("mysql");
let inquirer = require("inquirer");
var Table = require("cli-table");


let connection = mysql.createConnection({
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
    // start();
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
                displayItems();

            }
            else if (answer.purchasing === "NO") {
                console.log("Come back soon, Goodbye")
                connection.end();
            }
        });
}

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var displayTable = new Table ({
			head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"]
			
        });
        for(var i = 0; i < res.length; i++){
			displayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(displayTable.toString());
        

        // Log all results of the SELECT statement
        // console.log(res);
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
                purchaseOrder(id_of_product, item_Quantity);
            });

        // connection.end();
    });
}

start();

