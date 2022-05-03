const mysql = require('mysql2');
const inquirer = require('inquirer');
// const cTable = require('console.table');
const roleSQL = require('./queries/roles');
const deptSQL = require('./queries/departments');
const employeeSQL = require('./queries/employees');
const ascii = require('ascii-art-font');

// connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SvgSQL0409!!',
    database: 'FMA_StateMilitary_db'
});

init = () => {

    console.log("\n"+"=".repeat(62)+"\n");
    ascii.create('    Employee','Doom',(err, result) => {
        if (err) throw err;
        console.log(result);
        ascii.create('      Manager','Doom',(err, result) => {
            if (err) throw err;
            console.log(result);
            console.log("\n"+"=".repeat(62)+"\n");
            askSheska();
        });
    });
    
}

//Generate prompts  
const askSheska = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'No Action']
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                deptSQL.showDepartments();
            }

            if (choices === "View all roles") {
                roleSQL.showRoles();
            }

            if (choices === "View all employees") {
                employeeSQL.showEmployees();
            }

            if (choices === "Add a department") {
                deptSQL.addDepartment();
            }

            if (choices === "Add a role") {
                roleSQL.addRole();
            }

            if (choices === "Add an employee") {
                employeeSQL.addEmployee();
            }

            if (choices === "Update an employee role") {
                employeeSQL.updateEmployee();
            }

            if (choices === "Update an employee manager") {
                employeeSQL.updateManager();
            }

            if (choices === "View employees by department") {
                employeeSQL.employeeDepartment();
            }

            if (choices === "Delete a department") {
                deptSQL.deleteDepartment();
            }

            if (choices === "Delete a role") {
                roleSQL.deleteRole();
            }

            if (choices === "Delete an employee") {
                employeeSQL.deleteEmployee();
            }

            if (choices === "View department budgets") {
                deptSQL.viewBudget();
            }

            if (choices === "No Action") {
                connection.end()
            };
        });
}