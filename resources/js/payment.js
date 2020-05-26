const codeReader = new ZXing.BrowserQRCodeReader();

function decodeOnce(selectedDeviceId) {
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
        getUser(result, handleUser);
    }).catch((err) => {
      console.error(err)
      document.getElementById('result').textContent = err
    })
}

window.addEventListener('load', () => {
    codeReader.listVideoInputDevices()
        .then(videoInputDevices => {
            handleCameras(videoInputDevices)
        })
});

function handleCameras(videoInputDevices) {
    videoInputDevices.forEach(device => {
        var o = new Option(device.label, device.deviceId);
        /// jquerify the DOM object 'o' so we can use the html method
        $(o).html(device.label);
        $("#camera").append(o);
    });
}

function selectCamera() {
    $("#video").show();
    decodeOnce($("#camera").val())
}

function handleUser(data) {
    $("#name").val(data.name + " " + data.lastName)
    $("#buyerid").val(data.id)
    $("#video").hide()
    $.each(data.availableDeals, function (i, item) {
        var o = new Option(item.name, item.id);
        /// jquerify the DOM object 'o' so we can use the html method
        $(o).html(item.name);
        $("#deals").append(o);
    });
}

function pay() {
    var jsonObject = new Object();
    jsonObject.price = parseFloat($("#price").val());
    jsonObject.dealId = $("#deals").val();
    var reqBody = JSON.stringify(jsonObject);

    $.ajax({
        type: "POST",
        url: reqUrl.concat("/user/pay/").concat($("#buyerid").val()),
        contentType: "application/json",
        data: reqBody,
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(data, status, xhr) {
            alert("Success!");
            window.location.replace("index");
        },
        error: function (XMLHttpRequest, textStatus, thrownError) {
            alert("Status: " + textStatus); alert("Error: " + thrownError); 
        }
    });
}