const mysql = require('mysql2');
const inquirer = require('inquirer');
const roleSQL = require('./roles');
const employeeSQL = require('./employees');
const figlet = require('figlet');
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USERNAME_SQL,
    password: process.env.PASSWORD_SQL,
    database: 'fma_statemilitary_db'
  });

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT id AS DEPT_ID, name AS DEPARTMENT FROM departments`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askMeAgain();
    });
};

// function to add a department 
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "What department do you want to add?",
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO departments (name) VALUES (?)`;
            connection.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.addDept + " to departments!");

                showDepartments();
            });
        });
};

// function to delete department
deleteDepartment = () => {
    const deptSql = `SELECT * FROM departments`;

    connection.query(deptSql, (err, data) => {
        if (err) throw err;

        const deptChoices = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "What department do you want to delete?",
                choices: deptChoices
            }
        ])
            .then(answer => {
                const dept = answer.dept;
                const sql = `DELETE FROM departments WHERE id = ?`;

                connection.query(sql, dept, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    showDepartments();
                });
            });
    });
};

// view department budget 
viewBudget = () => {
    console.log('Showing budget by department...\n');
  
    const sql = `SELECT department_id AS ID, 
                        departments.name AS DEPARTMENT,
                        SUM(salary) AS BUDGET
                 FROM  roles  
                 JOIN departments ON roles.department_id = departments.id GROUP BY department_id`;
    
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
  
      askSheska(); 
    });            
  };

  const askMeAgain = () => {
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
                        showDepartments();
                    }
                    if (choices === "View all roles") {
                        roleSQL.showRoles();
                    }
                    if (choices === "View all employees") {
                        employeeSQL.showEmployees();
                    }
                    if (choices === "Add a department") {
                        addDepartment();
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
                        deleteDepartment();
                    }
                    if (choices === "Delete a role") {
                        roleSQL.deleteRole();
                    }
                    if (choices === "Delete an employee") {
                        employeeSQL.deleteEmployee();
                    }
                    if (choices === "View department budgets") {
                        viewBudget();
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





module.exports = {showDepartments, addDepartment, deleteDepartment, viewBudget};