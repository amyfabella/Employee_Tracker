var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3000,

  user: "root",

  password: "rootRoot",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runTracker() {
  inquirer
    .prompt({
      name: "options",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View all employees",
        "View all employees by department",
        "View all employees by role",
        "Update employee roles",
        "exit"
      ]
    })
    .then(function(answer) {
        switch (answer.action) {
        case "Add departments":
            addDepartment();
            break;

        case "Add role":
            addRole();
            break;

        case "Add employee":
            addEmployee();
            break;

        case "View all employees":
            viewAll();
            break;
  
        case "View all employees by department":
            viewByDept();
            break;
  
        case "View all employees by role":
            viewByRole();
            break;

        case "Update employee roles":
            update();
            break;
  
        case "exit":
            connection.end();
            break;
        }
    });
}

function addDepartment(){
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the new department's name?"
            }
        ])
        .then(function(answer){
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                }
            );
        });
}

function addRole(){
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?"
            },
        ])
        .then(function(answer){
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary
                },
                //function for pulling department id
                function(err) {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                }
            );
        });
}

function addEmployee(){
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the new employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the new employee's last name?"
            }
        ])
        .then(function(answer){
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                },
                //function for pulling role id
                //function for pulling manager id
                function(err) {
                    if (err) throw err;
                    console.log("Your employee was created successfully!");
                }
            );
        });
}

function viewAll() {
    
}

function viewByDept() {

}

function viewByRole() {

}

function update(){

}
