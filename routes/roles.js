const mysql = require('mysql2');
const inquirer = require('inquirer');
const deptSQL = require('./departments');
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

// function to show all roles 
showRoles = () => {
  console.log('Showing all roles...\n');

  const sql = `SELECT roles.id AS ROLE_ID, title AS ROLE_TITLE, salary AS SALARY, departments.name AS DEPARTMENT FROM roles
               INNER JOIN departments ON roles.department_id = departments.id`;
  
  connection.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    askMeAgain();
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

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          showRoles();
      });
    });
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
                      deptSQL.showDepartments();
                  }
                  if (choices === "View all roles") {
                      showRoles();
                  }
                  if (choices === "View all employees") {
                      employeeSQL.showEmployees();
                  }
                  if (choices === "Add a department") {
                      deptSQL.addDepartment();
                  }
                  if (choices === "Add a role") {
                      addRole();
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
                      deleteRole();
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


module.exports = {showRoles, addRole, deleteRole};