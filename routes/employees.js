const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT,
    user: process.env.USERNAME_SQL,
    password: process.env.PASSWORD_SQL,
    database: 'fma_statemilitary_db'
  });

// function to show all employees 
showEmployees = () => {
    console.log('Showing all employees...\n');
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
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
            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.promise().query(roleSql, (err, data) => {
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

                        const managerSql = `SELECT * FROM employee`;

                        connection.promise().query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managersChoices = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

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
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                VALUES (?, ?, ?, ?)`;

                                    connection.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!")

                                        showEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

// function to update an employee 
updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employeesChoices = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

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

                const roleSql = `SELECT * FROM role`;

                connection.promise().query(roleSql, (err, data) => {
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
                            params.push(role);

                            let employee = roster[0]
                            roster[0] = role
                            roster[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            connection.query(sql, roster, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

// function to update an employee 
updateManager = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employeesChoices = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

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

                const managerSql = `SELECT * FROM employee`;

                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managersChoices = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

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
                            roster[0] = role
                            roster[1] = employee

                            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                            connection.query(sql, roster, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

// function to view employee by department
employeeDepartment = () => {
    console.log('Showing employee by departments...\n');
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askSheska();
    });
};

module.exports = { showEmployees, addEmployee, updateEmployee, updateManager, employeeDepartment};
