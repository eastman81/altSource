// DEPENDENCIES
var inquirer = require('inquirer');
var Table = require('cli-table');
var express = require('express');
var colors = require('colors');

// Cache setup
const NodeCache = require('node-cache');
const myCache = new NodeCache();

// Server Stuff
var app = express();
var PORT = 3000;

// Variables
var accountInfo;
var depositAmount;
var withdrawalAmount;
var balanceAmount = [];

// Starting our awesome bank
function startBank() {
	console.log(`\nWelcome to AltSource Bank, the world's greatest banking ledger!`);

	inquirer.prompt([
		{
			type: 'list',
			name: 'bankStart',
			message: 'What would you like to do?',
			choices: ['Login', 'Exit bank'],
			filter: function(answer) {
				if (answer === 'Exit bank') {
					shutDown();
				}
			}
		},
		{
			type: 'list',
			name: 'member',
			message: 'Are you a new or existing member?',
			choices: ['New Member', 'Existing Member']
		}
	]).then(function(answer) {
		if (answer.member === 'New Member') {
			memberCreate()
		} else {
			memberLogin()
		}
	})
}

// New member create
function memberCreate() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'firstName',
			message: 'What is your first name?'
		},
		{
			type: 'input',
			name: 'lastName',
			message: 'What is your last name?'
		},
		{
			type: 'input',
			name: 'usernameCreate',
			message: 'Create a Username:'
		},
		{
			type: 'password',
			name: 'passwordCreate',
			message: 'Create a Password:',
		}
	]).then(function(answer) {
		obj = { 
			firstName: answer.firstName,
			lastName: answer.lastName,
			username: answer.usernameCreate,
			password: answer.passwordCreate
		};
		success = myCache.set( 'accountKey', obj, 10000 );
		accountInfo = myCache.get( 'accountKey' );

		console.log(`Login successful, welcome to AltSource Bank ${accountInfo.firstName}!`);

		accountOptions();
	})
}

// Existing member log in
function memberLogin() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'username',
			message: 'What is your username?'
		},
		{
			type: 'password',
			name: 'password',
			message: 'What is your password?'
		}
	]).then(function(answer) {
		// Check and see if any accounts are in the cache, and if not, send them to make a new one
		try{
		    value = myCache.get( "accountKey", true );
		} catch( err ){
		    console.log('No member account found, please create a new account below.');
			memberCreate();
			return;
		}

		// Compaire username and password to existing ones to see if they match
		if (answer.username === accountInfo.username && answer.password === accountInfo.password) {
			console.log(`Login successful, welcome to AltSource Bank ${accountInfo.firstName}!`);
			accountOptions()
		} else if (answer.username !== accountInfo.username && answer.password === accountInfo.password) {
			console.log('Your username is incorrect, please enter it again.');
			memberLogin();
		} else if (answer.username === accountInfo.username && answer.password !== accountInfo.password) {
			console.log('Your password is incorrect, please enter it again.');
			memberLogin();
		} else {
			console.log('Your username and password are incorrect, please enter them again.');
			memberLogin();
		}
	});
}

function accountOptions() {
	inquirer.prompt([
		{
			type: 'list',
			name: 'options',
			message: 'What would you like to do?',
			choices: ['Make a deposit', 'Make a withdrawal', 'Check balance and transaction history', 'Log out']
		}
	]).then(function(answer) {

		switch (answer.options) {
		  	case 'Make a deposit':
		    	deposit();
		    	break;

		  	case 'Make a withdrawal':
		   		withdrawal();
		    	break;

		  	case 'Check balance and transaction history':
		    	showBalance();
		    	break;

		    case 'Log out':
		    	logOut();
		    	break;
		}
	})
}

// Make a deposit
function deposit() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'deposit',
			message: 'How much do you want to deposit?',
			validate: function(input) {
				if (input > .00) {
					return true;
				} else {
					console.log('\nPlease enter a dollar amount.');
				}
			}
		}
	]).then(function(answer) {
		balanceAmount.push(answer.deposit);
		success = myCache.set( "depositKey", balanceAmount, 10000 );

		accountOptions();
	})
}

// Make a withdrawal
function withdrawal() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'withdrawal',
			message: 'How much do you want to withdrawal?',
			validate: function(input) {
				if (input > .00) {
					return true;
				} else {
					console.log('\nPlease enter a dollar amount.');
				}
			}
		}
	]).then(function(answer) {
		balanceAmount.push('-' + answer.withdrawal);
		success = myCache.set( "depositKey", balanceAmount, 10000 );

		accountOptions();
	})
}

// Show all account info
function showBalance() {
	console.log('\nBelow is your account information:');

    var result = 0;
    var table = new Table({ 
    	head: ['', 'Amount'.cyan],
    	colWidths: [12, 12]
    });

    var table2 = new Table({
    	colWidths: [12, 12]
    });

    // Loop through our balance info and add them together to get a sum.
    for (var i = 0; i < balanceAmount.length; i++) {
      	if (parseFloat(balanceAmount[i])) {
        	result += parseFloat(balanceAmount[i]);
      	}
    }
 
	table.push(
		{ ['Balance'.cyan]: `${result}` }
	);

	// Build transaction history in table
	for (var i = 0; i < balanceAmount.length; i++) {
      	if (balanceAmount[i].startsWith('-')) {
      		table2.push(
				{ ['Withdrawal'.red]: `${parseFloat(balanceAmount[i])}` }
			);
      	} else {
      		table2.push(
				{ ['Deposit'.green]: `${parseFloat(balanceAmount[i])}` }
			);
      	}
    }
	 
	console.log(table.toString());
	console.log(table2.toString());

	if (result === 0) {
    	console.log('Account balance is $0, looks like you need a job... I hear AltSource is hiring.')
    }

	accountOptions();	
}

function logOut() {
	startBank();
}

function shutDown() {
	server.close(function() {
    	myCache.close();
    	process.exit();
  	});
}

// Start server
var server = app.listen(PORT, function() {
  	startBank()
});
