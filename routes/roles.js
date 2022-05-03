const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT,
    user: process.env.USERNAME_SQL,
    password: process.env.PASSWORD_SQL,
    database: 'fma_statemilitary_db'
  });

// function to show all roles 
showRoles = () => {
  console.log('Showing all roles...\n');

  const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
  
  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
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
      const roleSql = `SELECT name, id FROM department`; 

      connection.promise().query(roleSql, (err, data) => {
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

            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.query(sql, roleParams, (err, result) => {
              if (err) throw err;
              console.log('Added' + answer.role + " to roles!"); 

              showRoles();
       });
     });
   });
 });
};



// function to delete role
deleteRole = () => {
  const roleSql = `SELECT * FROM role`; 

  connection.promise().query(roleSql, (err, data) => {
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
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          showRoles();
      });
    });
  });
};

module.exports = {showRoles, addRole, deleteRole};