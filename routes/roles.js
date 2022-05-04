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

// function to show all roles 
showRoles = () => {
  console.log('Showing all roles...\n');

  const sql = `SELECT roles.id AS ROLE_ID, title AS ROLE_TITLE, salary AS SALARY, departments.name AS DEPARTMENT FROM roles
               INNER JOIN departments ON roles.department_id = departments.id`;
  
  connection.query(sql, (err, rows) => {
    if (err) throw err; 
    console.log("\n");
    console.table(rows);
    console.log("\n");
    askSheska();
  })
};

// function to add a role 
addRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What role do you want to add?",
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?",
    }
  ])
    .then(answer => {
      const roleParams = [answer.role, answer.salary];

      // grab dept from department table
      const roleSql = `SELECT name, id FROM departments`; 

      connection.query(roleSql, (err, data) => {
        if (err) throw err; 
    
        const deptChoices = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department is this role in?",
          choices: deptChoices
        }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            roleParams.push(dept);

            const sql = `INSERT INTO roles (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.query(sql, roleParams, (err, rows) => {
              if (err) throw err;
              console.log('Added' + answer.role + " to roles!"); 
              console.log("\n");
              showRoles();
              console.log("\n");
              askSheska();
       });
     });
   });
 });
};



// function to delete role
deleteRole = () => {
  const roleSql = `SELECT * FROM roles`; 

  connection.query(roleSql, (err, data) => {
    if (err) throw err; 

    const rolesChoices = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "What role do you want to delete?",
        choices: rolesChoices
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;
        const sql = `DELETE FROM roles WHERE id = ?`;

        connection.query(sql, role, (err, rows) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 
          console.log("\n");
          showRoles();
          console.log("\n");
          askSheska();
      });
    });
  });
};

module.exports = {showRoles, addRole, deleteRole};