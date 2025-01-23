fetch('/api/current-user', {
    method: 'GET',
    credentials: 'same-origin',
})
.then(response => response.json())
.then(data => {
    document.getElementById("username-text").innerHTML = data.email
    document.getElementById("welcomesection-text").innerHTML = "Welcome back, " + data.name
    document.getElementById("emailcontainer").innerHTML = data.email
    document.getElementById("namecontainer").innerHTML = data.name
    user = data
})
.catch(error => {
    console.error('Error fetching current user:', error);
});


var updatename = function(newname) {
    fetch("/api/update-user/" + user.id + "/name/" + newname, {
        method: 'POST',
        credentials: 'same-origin',
    })
    .then(() => {
        location.reload()
    })
}

var updateemail = function(newemail) {
    fetch("/api/update-user/" + user.id + "/email/" + newemail, {
        method: 'POST',
        credentials: 'same-origin',
    })
    .then(() => {
        location.reload()
    })
}