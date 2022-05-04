const mysql = require('mysql2');
const inquirer = require('inquirer');
const roleSQL = require('./routes/roles');
const deptSQL = require('./routes/departments');
const employeeSQL = require('./routes/employees');
const figlet = require('figlet');
// const express = require('express/lib/application');
require('dotenv').config()
// console.log(process.env)

function init() {
    console.log("\n" + "=".repeat(62) + "\n");
    figlet('Employee Manager!', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        askSheska();
    });
}

//Let's start
init();

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
                "View employees by manager",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'Quit']
        },
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
                    if (choices === "View employees by manager") {
                        employeeSQL.employeeManager();
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
                    if (choices === "Quit") {
                        console.log("\n" + "=".repeat(62) + "\n");
                        figlet('Come Back Soon!', function (err, data) {
                            if (err) {
                                console.log('Something went wrong...');
                                console.dir(err);
                                return;
                         }
                         console.log(data);
                            return;
                         });
                    }
            }) 
}
