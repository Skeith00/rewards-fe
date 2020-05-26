function handleUsers(data) {   
    data.forEach(generateRow); 
}

function handleUser(data) {
    $("p#name").text(data.name + ' ' + data.lastName);
    $("p#email").text(data.email);
    $("p#phone").text(data.phone);
    $("p#points").text('Points: ' + data.points);
    $("a#historic").attr("href", `historic?id=${data.id}`);
    $("#qrcode").qrcode({
        width: 200,
        height: 200,
        text: data.id.toString()
    });
}

function loadUser(data) {
    $("#buyerid").val(data.id);
    $("#email").val(data.email);
    $("#name").val(data.name);
    $("#lastname").val(data.lastName);
    $("#phone").val(data.phone);
}

function generateRow(item, index) {    
    var action = `<a id="delete" href="javascript:deleteUser(${item.id});">Delete</a><hr>`;            
    action += `<a class="vertical" href="user-edit?id=${item.id}">Edit</a><hr>`;           
    action += `<a class="vertical" href="user-view?id=${item.id}">View Code</a><hr>`;             
    var row = `<tr id="tr-${item.id}"><td data-label='Email'>${item.email}</td>`;
    row += "<td data-label='Name'>" + item.name + " " + item.lastName + "</td>";
    row += "<td data-label='Action'>" + action + "</td></tr>";
    $("table tbody").append(row);
}

function deleteUser(id) {
    $.ajax({
        type: "POST",
        url: reqUrl.concat("/user/delete/").concat(id),
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data) {
            $(`#tr-${id}`).remove();
        },
        error: function (XMLHttpRequest, textStatus, thrownError) {
            alert("Status: " + textStatus); alert("Error: " + thrownError); 
        }
    });
}

function getHistoric(id) {
    $.ajax({
        type: "GET",
        url: reqUrl.concat("/user/historic/").concat(id),
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data) {
            data.forEach(item => {
                var cssClassName;
                var sign;
                if(item.name == 'Consumption') {
                    cssClassName = 'historic-income'
                    sign = '+'
                } else {
                    cssClassName ='historic-outcome'
                    sign = '-'
                }
                var row = `<tr class='${cssClassName}'><td>${item.name}</td>`;
                row += `<td>${sign}${item.points}</td>`;
                var date = new Date(item.date);
                row += `<td>${date.getDate()}-${date.getMonth()}-${date.getFullYear()}</td></tr>`;
                $("table tbody").append(row);
            });
        },
        error: function (XMLHttpRequest, textStatus, thrownError) {
            alert("Status: " + textStatus); alert("Error: " + thrownError); 
        }
    });
}

function editUser() {
    var jsonObject = new Object();
    jsonObject.name = $("#name").val();
    jsonObject.lastName = $("#lastname").val();
    jsonObject.phone = $("#phone").val();
    var reqBody = JSON.stringify(jsonObject);
    $.ajax({
        type: "POST",
        url: reqUrl.concat("/user/edit/").concat($("#buyerid").val()),
        contentType: "application/json",
        data: reqBody,
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data, status, xhr) {
            alert("User edited");
            window.location.replace("users");
        },
        error: function (XMLHttpRequest, textStatus, thrownError) {
            alert("Status: " + textStatus); alert("Error: " + thrownError); 
        }
   });
}