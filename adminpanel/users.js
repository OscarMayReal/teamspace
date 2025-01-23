fetch('/api/current-user', {
    method: 'GET',
    credentials: 'same-origin',
})
.then(response => response.json())
.then(data => {
    document.getElementById("username-text").innerHTML = data.email
})
.catch(error => {
    console.error('Error fetching current user:', error);
});

var loaduserslist = function() {
    fetch('/api/all-users', {
        method: 'GET',
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("userlist").innerHTML = ""
        data.forEach(element => {
            document.getElementById("userlist").innerHTML = document.getElementById("userlist").innerHTML + `<div class="user-item">
                <div class="user-item-emailtext">` + element.name + `</div>
                <div class="user-item-emailtext">` + element.email + `</div>
                <svg onclick="deleteuser('` + element.id + `')" xmlns="http://www.w3.org/2000/svg" style="min-width: 20px; min-height: 20px; margin-right: 20px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>`
        });
        document.getElementById("userlist").innerHTML = document.getElementById("userlist").innerHTML + `<div class="user-item" onclick="$('#adduserdialog').show()">
            <svg xmlns="http://www.w3.org/2000/svg" style="min-width: 20px; min-height: 20px; margin-left: 20px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            <div class="user-item-emailtext">Create User</div>
        </div>`
    })
    .catch(error => {
        console.error('Error fetching current user:', error);
    });
}

loaduserslist()

document.getElementById("regform").addEventListener("onsubmit", function(event){
    event.preventDefault()
    $("#adduserdialog").hide()
});

var deleteuser = function(id) {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };
    if (confirm('do you want to delete user')) {
        fetch("/api/delete-user/" + id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                loaduserslist()
            })
            .catch((error) => console.error(error));
    }
}