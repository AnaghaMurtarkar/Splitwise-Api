# Splitwise-Api

## Install all the dependency npm packages
```bash
  npm install
```

## Create tables.
```bash
node ./app/sequelize.js
npx sequelize-cli db:migrate
```


## Run Services
```node

RegisterUser = require('./app/services/Register');
new RegisterUser({first_name:'Anagha', last_name:'Murtarkar', user_name:'Anagha123', email:'a@ost.com',password:'12345678'}).perform().then(console.log)

RegisterUser = require('./app/services/Register');
new RegisterUser({first_name:'Ankit', last_name:'Singh', user_name:'Ankit', email:'ankit@ost.com',password:'12345678'}).perform().then(console.log)

RegisterUser = require('./app/services/Register');
new RegisterUser({first_name:'Dhananjay', last_name:'Patil', user_name:'Dhananjay', email:'d@ost.com',password:'12345678'}).perform().then(console.log)


LoginUser = require('./app/services/Login');
new LoginUser({user_name:'Anagha123', password:'12345678'}).perform().then(console.log)


AddExpense = require('./app/services/AddExpense');
new AddExpense({payer_user_name:'Ankit', payee_user_name:'Anagha123', owe_amount: 100 , description:'Lunch'}).perform().then(console.log)


AddExpense = require('./app/services/AddExpense');
new AddExpense({payer_user_name:'Anagha123', payee_user_name:'Ankit', owe_amount: 500 , description:'Cash'}).perform().then(console.log)



AddExpense = require('./app/services/AddExpense');
new AddExpense({payer_user_name:'Anagha123', payee_user_name:'Dhananjay', owe_amount: 50 , description:'Snacks'}).perform().then(console.log)

AddExpense = require('./app/services/AddExpense');
new AddExpense({payer_user_name:'Dhananjay', payee_user_name:'Ankit', owe_amount: 200 , description:'Dinner'}).perform().then(console.log)




GetExpenseWithUser = require('./app/services/GetExpenseWithUser');
new GetExpenseWithUser({current_user_name: 'Anagha123', other_user_name:'Ankit' }).perform().then(console.log)


SettleUpWithUser = require('./app/services/SettleUpWithUser.js');
new SettleUpWithUser({current_user_name: 'Anagha123', other_user_name:'Ankit' }).perform().then(console.log)


DeleteExpense = require('./app/services/DeleteExpense')
new DeleteExpense({current_user_name: 'Anagha123', expense_id:5}).perform().then(console.log)


ListAll = require('./app/services/ListAllBalances')
new ListAll({current_user_id:3}).perform().then(console.log)

ListAllExpenses = require('./app/services/ListAllExpenses')
new ListAllExpenses({current_user_id:3}).perform().then(console.log)


```
