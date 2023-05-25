

Budget Api Routes Docs
End Point :  https://example.com/api

Register User
•	API URL: /users/register
•	Method: POST
•	Description: Register a new user.
•	Request Body:
•	email (String, required): The email address of the user.
•	firstname (String): The first name of the user.
•	lastname (String): The last name of the user.
•	password (String, required): The password of the user.
•	Response: The registered user object.
Login User
•	API URL: /users/login
•	Method: POST
•	Description: Login a user.
•	Request Body:
•	email (String, required): The email address of the user.
•	password (String, required): The password of the user.
•	Response: An authentication token.
Get User Details
•	API URL: /users/me
•	Method: GET
•	Description: Get the details of the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: The user object.
Create Expense
•	API URL: /users/expenses
•	Method: POST
•	Description: Create a new expense for the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	amount (Number, required): The amount of the expense.
•	category (String, required): The category of the expense.
•	name (String, required): The name of the expense.
•	Response: The created expense object.
Create Income
•	API URL: /users/incomes
•	Method: POST
•	Description: Create a new income for the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	amount (Number, required): The amount of the income.
•	category (String, required): The category of the income.
•	name (String, required): The name of the income.
•	Response: The created income object.
Get All Incomes
•	API URL: /users/incomes
•	Method: GET
•	Description: Get all incomes of the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: An array of income objects.
Get All Expenses
•	API URL: /users/expenses
•	Method: GET
•	Description: Get all expenses of the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: An array of expense objects.
Get User Information
•	API URL: /users/user-info
•	Method: GET
•	Description: Get detailed information about the authenticated user, including their expenses, incomes, budgets, goals, bill reminders, and savings.
•	Authentication: Bearer Token (JWT)
•	Response: The user object with detailed information.
Create Savings
•	API URL: /users/savings
•	Method: POST
•	Description: Create a new savings goal for the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	name (String, required): The name of the savings goal.
•	amount (Number, required): The target amount of the savings goal.
•	targetDate (Date, required): The target date to achieve the savings goal.
•	Response: The created savings object.
Get All Savings
•	API URL: /users/savings
•	Method: GET
•	Description: Get all savings goals of theauthenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: An array of savings goal objects.
Create Bill Reminder
•	API URL: /users/bill-reminders
•	Method: POST
•	Description: Create a new bill reminder for the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	name (String, required): The name of the bill reminder.
•	dueDate (Date, required): The due date of the bill reminder.
•	Response: The created bill reminder object.
Get All Bill Reminders
•	API URL: /users/bill-reminders
•	Method: GET
•	Description: Get all bill reminders of the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: An array of bill reminder objects.
Create Budget
•	API URL: /users/budgets
•	Method: POST
•	Description: Create a new budget for the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	category (String, required): The category of the budget.
•	limit (Number, required): The budget limit amount.
•	Response: The created budget object.
Get All Budgets
•	API URL: /users/budgets
•	Method: GET
•	Description: Get all budgets of the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: An array of budget objects.
Create Goal
•	API URL: /users/goals
•	Method: POST
•	Description: Create a new goal for the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	name (String, required): The name of the goal.
•	targetAmount (Number, required): The target amount of the goal.
•	dueDate (Date, required): The due date of the goal.
•	Response: The created goal object.
Get All Goals
•	API URL: /users/goals
•	Method: GET
•	Description: Get all goals of the authenticated user.
•	Authentication: Bearer Token (JWT)
•	Response: An array of goal objects.
Get Expense Report
•	API URL: /users/reports/expenses
•	Method: GET
•	Description: Get a report of user expenses.
•	Authentication: Bearer Token (JWT)
•	Response: A report object containing total expenses and other relevant fields.
Get Budget Report
•	API URL: /users/reports/budgets
•	Method: GET
•	Description: Get a report of user budgets.
•	Authentication: Bearer Token (JWT)
•	Response: A report object containing total budget limits and other relevant fields.
Get Savings Report
•	API URL: /users/reports/savings
•	Method: GET
•	Description: Get a report of user savings.
•	Authentication: Bearer Token (JWT)
•	Response: A report object containing total savings amount and other relevant fields.
Get Goal Report
•	API URL: /users/reports/goals
•	Method: GET
•	Description: Get a report of user goals.
•	Authentication: Bearer Token (JWT)
•	Response: A report object containing total target amount, current amount, and other relevant fields.

Admin Routes
Register Admin
•	API URL: /admin/register
•	Method: POST
•	Description: Register a new admin.
•	Request Body:
•	email (String, required): The email address of the admin.
•	username (String, required): The username of the admin.
•	password (String, required): The password of the admin.
•	Response: The registered admin object with a token.
Login Admin
•	API URL: /admin/login
•	Method: POST
•	Description: Login an admin.
•	Request Body:
•	username (String, required): The username of the admin.
•	password (String, required): The password of the admin.
•	Response: The logged-in admin object with a token.
Get Current Admin
•	API URL: /admin/me
•	Method: GET
•	Description: Get the details of the authenticated admin.
•	Authentication: Bearer Token (JWT)
•	Response: The admin object.
Visual Routes
Get All Visuals
•	API URL: /visuals
•	Method: GET
•	Description: Get all visuals.
•	Authentication: Bearer Token (JWT)
•	Response: An array of visual objects.
Create Visual
•	API URL: /visuals/create
•	Method: POST
•	Description: Create a new visual.
•	Authentication: Bearer Token (JWT)
•	Request Body:
•	title (String, required): The title of the visual.
•	content (String, required): The content of the visual.
•	image (String): The image URL of the visual (optional).
•	Response: The created visual object.
Get Single Visual
•	API URL: /visuals/:visualid
•	Method: GET
•	Description: Get a single visual by its ID.
•	Request Parameters:
•	visualid (String, required): The ID of the visual.
•	Response: The visual object.
Update Visual
•	API URL: /visuals/:id
•	Method: PUT
•	Description: Update a visual by its ID.
•	Authentication: Bearer Token (JWT)
•	Request Parameters:
•	id (String, required): The ID of the visual.
•	Request Body: (Any of the following fields can be updated)
•	title (String): The updated title of the visual.
•	content (String): The updated content of the visual.
•	image (String): The updated image URL of the visual.
•	Response: The updated visual object.
Delete Visual
•	API URL: /visuals/:id
•	Method: DELETE
•	Description: Delete a visual by its ID.
•	Authentication: Bearer Token (JWT)
•	Request Parameters:
•	id (String, required): The ID of the visual.
•	Response: A success message indicating the deletion of the visual.
Get All Visuals (Public)
•	API URL: /visuals/all
•	Method: GET
•	Description: Get all visuals (public endpoint, no authentication required).
•	Response: An array of visual objects.

Note: All routes that require authentication expect the authentication token to be included in the request headers as a Bearer Token.

