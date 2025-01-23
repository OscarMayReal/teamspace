var user = {}
    
fetch('/api/current-user', {
    method: 'GET',
    credentials: 'same-origin',
})
.then(response => response.json())
.then(data => {
    document.getElementById("username-text").innerHTML = data.email
    document.getElementById("welcomesection-text").innerHTML = "Welcome back, " + data.name
    user = data
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
        if (user.role == "admin") {
            document.getElementById("userlist").innerHTML = document.getElementById("userlist").innerHTML + `<a href="/admin"><div class="user-item" onclick="$('#adduserdialog').show()">
                <svg xmlns="http://www.w3.org/2000/svg" style="min-width: 20px; min-height: 20px; margin-left: 20px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                <div class="user-item-emailtext">Manage Organisation</div>
            </div></a>`
        }
        data.forEach(element => {
            document.getElementById("userlist").innerHTML = document.getElementById("userlist").innerHTML + `<a href="/dashboard/channel?id=` + element.id + `"><div class="user-item">
                <div class="user-item-emailtext">` + element.name + `</div>
                <div class="user-item-emailtext">` + element.desc + `</div>
            </div></a>`
        });
    })
    .catch(error => {
        console.error('Error fetching current user:', error);
    });
}

loaduserslist()