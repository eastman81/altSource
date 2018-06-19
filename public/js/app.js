$(document).ready(function() {

  // Add user button click
  $("#add-user").on("click", function(event) {
    // Capture user inputs and store them into variables
    var firstName = $("#first-name-input").val().trim();
    var lastName = $("#last-name-input").val().trim();
    var username = $("#username-input").val().trim();
    var password = $("#password-input").val().trim();
    
    // Clear localStorage
    localStorage.clear();

    // Store all content into localStorage
    localStorage.setItem("first-name", firstName);
    localStorage.setItem("last-name", lastName);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
  });

  // Display the content from localStorage
  $("#name-display").text(`${localStorage.getItem("first-name")} ${localStorage.getItem("last-name")}`);

  // Login user button
  $("#login-user").on("click", function(event) {
    event.preventDefault();

    var username = $("#username-login").val().trim();
    var password = $("#password-login").val().trim();

    // Compaire username and password to existing ones to see if they match
    if (localStorage.getItem("username") === username && localStorage.getItem("password") === password) {
      alert(`Login successful, welcome to AltSource Bank ${localStorage.getItem("first-name")}!`);
      goToBank();
    } else if (localStorage.getItem("username") !== username && localStorage.getItem("password") === password) {
      alert('We could not find your username, please enter it again.');
    } else if (localStorage.getItem("username") === username && localStorage.getItem("password") !== password) {
      alert('Your password is incorrect, please enter it again.');
    } else {
      alert('Your username and password are incorrect, please enter them again.');
    }

    $("#username-login").val("");
    $("#password-login").val("");

  });

  function goToBank() {
      window.location.href = "./home.html";
  };

});

