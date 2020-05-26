function handleDeals(data) {   
    data.forEach(generateRow); 
}

function generateRow(item, index) {    
    var date = new Date(item.expiry_date);
    var action = `<a id="delete" href="javascript:deleteDeal(${item.id});">Delete</a><hr>`;
    action += `<a class="vertical" href="deal-edit?id=${item.id}">Edit</a><hr>`;
    action += `<a class="vertical" href="deal-view?id=${item.id}">View Deal</a><hr>`;
    var row = `<tr id="tr-${item.id}"><td data-label='Name'>${item.name}</td>`;
    row += `<td data-label='Points'>${item.points}</td>`;
    row += `<td data-label='Expiry date'>${date.getDate()}-${date.getMonth()}-${date.getFullYear()}</td>`;
    row += "<td data-label='Action'>" + action + "</td></tr>";
    $("table tbody").append(row);
}

function addDeal() {
    var jsonObject = new Object();
    jsonObject.name = $("#name").val();
    jsonObject.description = $("#description").val();
    jsonObject.points = $("#points").val();

    var date = new Date($("#expiry").val());
    jsonObject.expiryDate = date;

    var reqBody = JSON.stringify(jsonObject);
    $.ajax({
        type: "POST",
        url: reqUrl.concat("/org/deal/add"),
        contentType: "application/json",
        data: reqBody,
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data, status, xhr) {
            alert("Deal added");
            window.location.replace("deals");
        },
        error: function (XMLHttpRequest, textStatus, thrownError) {
                        let message = getErrorMessage(xhr) 
            $( "div.alert" ).show()
            $( "div.alert #error-message").text(message)
        }
   });
}