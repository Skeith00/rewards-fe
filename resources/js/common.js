const reqUrl = "http://localhost:8000"; 

function login() {
    console.log("Loging in...");
    $( "div.alert" ).hide()

    var jsonObject = new Object();
    jsonObject.email = $("#email").val();
    jsonObject.password = $("#password").val();
    var reqBody = JSON.stringify(jsonObject);
    $.ajax({
        type: "POST",
        url: reqUrl.concat("/login"),
        contentType: "application/json",
        data: reqBody,

        success: function(data, status, xhr) {
            localStorage.setItem('token', xhr.getResponseHeader('Authorization'));
            window.location.replace("index.html");
        },
        error: function (xhr, statusText, err) {
            let message = getErrorMessage(xhr) 
            $( "div.alert" ).show()
            $( "div.alert #error-message").text(message)
        }
   });
}

function getUsers() {
    $.ajax({
        type: "GET",
        url: reqUrl.concat("/user"),
        dataType: 'json',
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data) {
            handleUsers(data);
        },
        error: function (xhr, textStatus, thrownError) {
            let message = getErrorMessage(xhr) 
            $( "div.alert" ).show()
            $( "div.alert #error-message").text(message)
        }
    });
}

function getUser(id, callback) {
    $.ajax({
        type: "GET",
        url: reqUrl.concat("/user/").concat(id),
        dataType: 'json',
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data) {
            callback(data);
        },
        error: function (xhr, textStatus, thrownError) {
            let message = getErrorMessage(xhr) 
            $( "div.alert" ).show()
            $( "div.alert #error-message").text(message)
        }
    });
}

function getDeals() {
    $.ajax({
        type: "GET",
        url: reqUrl.concat("/org/deal"),
        dataType: 'json',
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data) {
            handleDeals(data);
        },
        error: function (xhr, textStatus, thrownError) {
            let message = getErrorMessage(xhr) 
            $( "div.alert" ).show()
            $( "div.alert #error-message").text(message)
        }
    });
}

function getErrorMessage(xhr) {
    let body = (xhr.responseText == null) ? null: $.parseJSON(xhr.responseText)
    switch (xhr.status) {
        case 0: return "Error communicating with server";
        case 401: return (body.message == null ? "Unauthorized" : body.message);
        case 403: return (body.message == null ? "Forbidden" : body.message);
        default: return body.message;
    }
}

function redirectLogin(milisecs) {
    setTimeout(function () {
        window.location.href = "login"; //will redirect to loginPage
     }, milisecs);                      //will call the function after X milisecs.
}