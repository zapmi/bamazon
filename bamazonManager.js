let mysql = require("mysql");
let inquirer = require("inquirer");


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
        console.table(res);
        start();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, res) {
        if (err) throw err;
        console.table(res);
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
            updateItem(itemID, itemQuantity);
        });

}

function updateItem(ID, amount) {
    connection.query('Select * FROM products WHERE item_id = ' + ID, function (err, res) {
        if (err) {
            console.log(err)
        }

        if (amount > 0) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity + " + amount + " WHERE item_id = " + ID);
        }
        displayItems();
    });
}

function addNewProduct() {
    inquirer
        .prompt([
            // {
            //     name: "item_id",
            //     type: "input",
            //     message: "What is the ID of this product?",
            // },
            {
                name: "addName",
                type: "input",
                message: "What is the name of the product you would like to add?",
            },
            {
                name: "addItemCategory",
                type: "input",
                message: "What category does this belong to?",
            },
            {
                name: "addProductPrice",
                type: "input",
                message: "How much does this product cost?",
            },
            {
                name: "addProductQuantity",
                type: "input",
                message: "How many do you want to add to inventory?",
            }

        ]).then(function (answer) {
            // let productID = answer.item_id;
            let productName = answer.addName;
            let itemCategory = answer.addItemCategory;
            let productPrice = answer.addProductPrice;
            let productQuantity = answer.addProductQuantity;
            addedItem(productName, itemCategory, productPrice, productQuantity);
        });
}


function addedItem(productName, itemCategory, productPrice, productQuantity) {
    connection.query('INSERT INTO products (item_id,product_name,department_name,price,stock_quantity) VALUES("'  + productName + '","' + itemCategory + '",' + productPrice + ',' + productQuantity + ')');
    displayItems();

};


start();