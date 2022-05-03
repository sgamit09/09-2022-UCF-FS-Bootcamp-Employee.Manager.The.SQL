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

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT id AS DEPT_ID, name AS DEPARTMENT FROM departments`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askSheska();
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

module.exports = {showDepartments, addDepartment, deleteDepartment};