const express = require('express'),
  router = express.Router(),
  cookieParser = require('cookie-parser');

const rootPrefix = "..",
  LoginUser = require(rootPrefix + '/app/services/Login'),
  RegisterUser = require(rootPrefix + '/app/services/Register'),
  AddExpense = require(rootPrefix + '/app/services/AddExpense'),
  DeleteExpense = require(rootPrefix + '/app/services/DeleteExpense'),
  ListAllBalances = require(rootPrefix + '/app/services/ListAllBalances'),
  ListAllExpenses = require(rootPrefix + '/app/services/ListAllExpenses'),
  SettleUpWithUser = require(rootPrefix + '/app/services/SettleUpWithUser'),
  GetExpenseWithUser = require(rootPrefix + '/app/services/GetExpenseWithUser'),
  coreConstants = require(rootPrefix + '/coreConstants'),
  cookieHelper = require(rootPrefix + '/helpers/cookie');

router.use(cookieParser(coreConstants.COOKIE_SECRET));

// Register user.
router.post('/register', async function(req, res) {

  const first_name = req.body.first_name,
    last_name = req.body.last_name,
    user_name = req.body.user_name,
    email = req.body.email,
    password = req.body.password;

  new RegisterUser({
    first_name: first_name,
    last_name: last_name,
    user_name: user_name,
    email: email,
    password: password
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        console.log('Rsp ======= if(rsp.success)', rsp);
        res.status(200).json(rsp);
        res.send();
      } else {
        console.log('Rsp ======= else {', rsp);
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});

// Login user.
router.post('/login', async function(req, res) {

  const user_name = req.body.user_name,
    password = req.body.password;

  new LoginUser({
    user_name: user_name,
    password: password
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        cookieHelper.setLoginCookie(res, rsp.data.cookie_value);
        res.status(200).json({success: true,data:{}});
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});


// Add an expense.
router.post('/expenses/add', async function(req, res) {

  console.log('req    ============', req.signedCookies);
  const payer_user_name = req.body.payer_user_name,
    payee_user_name = req.body.payee_user_name,
    owe_amount = req.body.owe_amount,
    description = req.body.description;

  new AddExpense({
    payer_user_name: payer_user_name,
    payee_user_name: payee_user_name,
    owe_amount: owe_amount,
    description: description
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});

// Get balance calculation with particular user.
router.get('/balances/get', async function(req, res) {

  console.log('req    ============', req.signedCookies);
  const current_user_name = req.query.current_user_name,
    other_user_name = req.query.other_user_name;

  new GetExpenseWithUser({
    current_user_name: current_user_name,
    other_user_name: other_user_name
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});
// Negative balance in this service indicates current user owe that balance to other user.

// Delete expense given expense id.
router.post('/expenses/delete', async function(req, res) {

  console.log('req    ============', req.signedCookies);
  const current_user_name = req.body.current_user_name,
    expense_id = req.body.expense_id;

  new DeleteExpense({
    current_user_name: current_user_name,
    expense_id: expense_id
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});

// Settle up all expenses with any particular user.
router.post('/balances/settle', async function(req, res) {

  console.log('req    ============', req.signedCookies);
  const current_user_name = req.body.current_user_name,
    other_user_name = req.body.other_user_name;

  new SettleUpWithUser({
    current_user_name: current_user_name,
    other_user_name: other_user_name
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});


// Get current users all expenses.
router.get('/expenses/list', async function(req, res) {

  console.log('req    ============', req.signedCookies);
  const current_user_id = req.query.current_user_id;

  new ListAllExpenses({
    current_user_id: current_user_id
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});

// Get current users balance calculation with other users.
router.get('/balances/list', async function(req, res) {

  console.log('req    ============', req.signedCookies);
  const current_user_id = req.query.current_user_id;

  new ListAllBalances({
    current_user_id: current_user_id
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});
// Negative balance in this service indicates current user owe that balance to other user.

module.exports = router;
