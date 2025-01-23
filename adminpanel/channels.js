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
    fetch('/api/all-channels', {
        method: 'GET',
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("userlist").innerHTML = ""
        data.forEach(element => {
            document.getElementById("userlist").innerHTML = document.getElementById("userlist").innerHTML + `<div class="user-item">
                <div class="user-item-emailtext">` + element.name + `</div>
                <div class="user-item-emailtext">` + element.desc + `</div>
                <svg onclick="deleteuser('` + element.id + `')" xmlns="http://www.w3.org/2000/svg" style="min-width: 20px; min-height: 20px; margin-right: 20px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>`
        });
        document.getElementById("userlist").innerHTML = document.getElementById("userlist").innerHTML + `<div class="user-item" onclick="$('#adduserdialog').show()">
            <svg xmlns="http://www.w3.org/2000/svg" style="min-width: 20px; min-height: 20px; margin-left: 20px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hash"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
            <div class="user-item-emailtext">Create Channel</div>
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
    if (confirm('do you want to delete this channel')) {
        fetch("/api/delete-channel/" + id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                loaduserslist()
            })
            .catch((error) => console.error(error));
    }
}