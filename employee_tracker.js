var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3000,

  user: "root",

  password: "",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runTracker();
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
        switch (answer.options) {
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
    runTracker();
}

//update dept

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
    runTracker();
}

//update roles

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
    runTracker();
}

//udpate employees

function viewAll() {
    var query = "SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name";
    query += "FROM employee INNER JOIN role ON (employee.role_id ";
    query += "= role.id) WHERE (employee.role_id = ? AND role.id = ?) ORDER BY employee.first_name, employee.last_name, employee.id";
    query += "FROM role INNER JOIN department ON (role.department_id ";
    query += "= department.id) WHERE (role.department_id = ? AND department.id = ?) ORDER BY role.title";
    

    connection.query(query,
        function(err, res) {
            if (err) throw err;
            console.log(res);

            //console.table
        }
    )

    runTracker();

}

function viewByDept() {
    var query = "SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name";
    query += "FROM department INNER JOIN role ON (department.id ";
    query += "= role.department_id) WHERE (department.id = ? AND role.department_id = ?) ORDER BY department.name";
    query += "FROM role INNER JOIN employee ON (role.id ";
    query += "= employee.role_id) WHERE (role.id = ? AND employee.role_id = ?) ORDER BY role.title";

    connection.query(query,
        function(err, res) {
            if (err) throw err;
            console.log(res);

            //console.table
        }
    )

    runTracker();

}

function viewByRole() {
    var query = "SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name";
    query += "FROM role INNER JOIN employee ON (role.id ";
    query += "= employee.role_id) WHERE (role.id = ? AND employee.role_id = ?) ORDER BY role.title";
    query += "FROM role INNER JOIN department ON (role.department_id ";
    query += "= department.id) WHERE (role.department_id = ? AND department.id = ?)";

    connection.query(query,
        function(err, res) {
            if (err) throw err;
            console.log(res);

            //console.table
        }
    )

    runTracker();

}

function update(){
    var query = "SELECT department.name, role.title, role.salary, employee.first_name, employee.last_name";
    query += "FROM roles INNER JOIN employees ON (roles.id = employee.role_id) ORDER BY role.title";

    connection.query(
        "SELECT * FROM employee", function(err, res) {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: "selectedEmployee",
                        type:"rawlist",
                        choices: function() {
                            var choiceArray = [];
                            for (var i=0; i< res.length; i++) {
                                choiceArray.push(res[i].first_name)
                            }
                        }
                    }
                ])
        }
    )
}
