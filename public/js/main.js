$(document).ready(function() {
	var depositAmount;
	var withdrawAmount;
	var balanceAmount = [];
	var storedBalance;

	// Deposit money
	$("#deposit").on("click", function(event) {
	    event.preventDefault();

	    // Capture user inputs and store them into variables
	    depositAmount = $("#deposit-input").val().trim();

	    if (depositAmount > .00) {
	    	balanceAmount.push(depositAmount);
	    } else {
	    	alert("Please enter a dollar amount!")
	    }
	    
	    // Store all content into localStorage
	    localStorage.setItem("balance", JSON.stringify(balanceAmount));

	    storedBalance = JSON.parse(localStorage.getItem("balance"));

	    $("#deposit-input").val("");

	    findBalance(storedBalance);

	});

	// Withdraw money
	$("#withdraw").on("click", function(event) {
	    event.preventDefault();

	    // Capture user inputs and store them into variables
	    withdrawAmount = $("#withdraw-input").val().trim();

	    if (withdrawAmount > .00) {
	    	balanceAmount.push("-" + withdrawAmount);
	    } else {
	    	alert("Please enter a dollar amount!")
	    }

	    // Store all content into localStorage
	    localStorage.setItem("balance", JSON.stringify(balanceAmount));

	    storedBalance = JSON.parse(localStorage.getItem("balance"));

	    $("#withdraw-input").val("");

	    findBalance(storedBalance);

	});

	// Show transaction history
	function findBalance(array) {
		var result = 0;    

	    // Loop through our balance info and add them together to get a sum.
	    for (var i = 0; i < array.length; i++) {
	      	if (parseFloat(array[i])) {
	        	result += parseFloat(array[i]);
	      	}
	    }

	    $("#account-history").text(result);
	    $("#account-table").empty();

	    // Display transaction history
		for (var i = 0; i < array.length; i++) {
	      	if (array[i].startsWith('-')) {
	      		$("#account-table").append(
		      		`<tr class="table-danger">
		                <th scope="row">Withdraw</th>
		                <td>${array[i]}</td>
		            </tr>`
		        );
	      	} else {
	      		$("#account-table").append(
		      		`<tr class="table-success">
		                <th scope="row">Deposit</th>
		                <td>${array[i]}</td>
		            </tr>`
		        );
	      	}
	    }
	}

});