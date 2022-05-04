const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USERNAME_SQL,
    password: process.env.PASSWORD_SQL,
    database: 'fma_statemilitary_db'
});

// function to show all employees 
showEmployees = () => {
    console.log('Showing all employees...\n');
    const sql = `SELECT employees.id AS EMPLOYEE_ID, 
                        employees.firstName AS FIRST_NAME, 
                        employees.lastName AS LAST_NAME, 
                        roles.title AS ROLE_TITLE, 
                        departments.name AS DEPARTMENT,
                        roles.salary AS SALARY, 
                        CONCAT (manager.firstName, " ", manager.lastName) AS manager
                 FROM employees
                        LEFT JOIN roles ON employees.role_id = roles.id
                        LEFT JOIN departments ON roles.department_id = departments.id
                        LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        console.log("\n");
        askSheska();
    });
};

// function to add an employee 
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
        }
    ])
        .then(answer => {
            const nameEmp = [answer.firstName, answer.lastName]

            // grab roles from roles table
            const roleSql = `SELECT roles.id, roles.title FROM roles`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const rolesChoices = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: rolesChoices
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        nameEmp.push(role);

                        const managerSql = `SELECT * FROM employees`;

                        connection.query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managersChoices = data.map(({ id, firstName, lastName }) => ({ name: firstName + " " + lastName, value: id }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managersChoices
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    nameEmp.push(manager);

                                    const sql = `INSERT INTO employees (firstName, lastName, role_id, manager_id)
                                                VALUES (?, ?, ?, ?)`;

                                    connection.query(sql, nameEmp, (err, rows) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!")
                                        console.log("\n");
                                        showEmployees();
                                        console.log("\n");
                                        askSheska();
                                    });
                                });
                        });
                    });
            });
        });
};

// function to update an employee 
updateEmployee = () => {
    // get employees FROM employees table 
    const employeeSql = `SELECT * FROM employees`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employeesChoices = data.map(({ id, firstName, lastName }) => ({ name: firstName + " " + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employeesChoices
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const roster = [];
                roster.push(employee);

                const roleSql = `SELECT * FROM roles`;

                connection.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const rolesChoices = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: rolesChoices
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            roster.push(role);

                            let employee = roster[0]
                            roster[0] = role
                            roster[1] = employee

                            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;

                            connection.query(sql, roster, (err, rows) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");
                                console.log("\n");
                                showEmployees();
                                console.log("\n");
                                askSheska();
                            });
                        });
                });
            });
    });
};

// function to update an employee 
updateManager = () => {
    // get employees FROM employees table 
    const employeeSql = `SELECT * FROM employees`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employeesChoices = data.map(({ id, firstName, lastName }) => ({ name: firstName + " " + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employeesChoices
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const roster = [];
                roster.push(employee);

                const managerSql = `SELECT * FROM employees`;

                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managersChoices = data.map(({ id, firstName, lastName }) => ({ name: firstName + " " + lastName, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managersChoices
                        }
                    ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            roster.push(manager);

                            let employee = roster[0]
                            roster[0] = manager
                            roster[1] = employee

                            const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;

                            connection.query(sql, roster, (err, rows) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");
                                console.log("\n");
                                console.table(rows);
                                console.log("\n");
                                askSheska();
                            });
                        });
                });
            });
    });
};

// function to view employee by department
employeeDepartment = () => {
    console.log('Showing employee by departments...\n');
    const sql = `SELECT employees.firstName, 
                        employees.lastName, 
                        departments.name AS department
                 FROM employees 
                 LEFT JOIN roles ON employees.role_id = roles.id 
                 LEFT JOIN departments ON roles.department_id = departments.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        console.log("\n");
        askSheska();
    });
};

employeeManager = () => {
    console.log('Showing employee by manager...\n');
    const sql = `SELECT employees.id AS EMPLOYEE_ID, 
                        employees.firstName AS FIRST_NAME, 
                        employees.lastName AS LAST_NAME, 
                        CONCAT (manager.firstName, " ", manager.lastName) AS manager
                 FROM employees
                        LEFT JOIN roles ON employees.role_id = roles.id
                        LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("\n");
        console.table(rows);
        console.log("\n");
        askSheska();
    });
};

// function to delete employees
deleteEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employees`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, firstName, lastName }) => ({ name: firstName + " " + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;

                const sql = `DELETE FROM employees WHERE id = ?`;

                connection.query(sql, employee, (err, rows) => {
                    if (err) throw err;
                    console.log("Successfully Deleted!");
                    console.log("\n");
                    showEmployees();
                    console.log("\n");
                    askSheska();
                });
            });
    });
};

module.exports = { showEmployees, addEmployee, updateEmployee, updateManager, employeeDepartment, employeeManager, deleteEmployee };
