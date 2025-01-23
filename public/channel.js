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

const searchParams = new URLSearchParams(window.location.search);

var channelid = searchParams.get("id")

document.getElementById("userlist").innerHTML = `<div class="user-item nobghover" style="width: 100% !important">
            <form id="sendmsg" action="/api/send-message/` + channelid + `" method="POST" id="regform" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 20px; margin-top: 20px; margin-left: 20px; margin-right: 20px;">
                <input type="text" name="content" id="content" required style="border: 0px solid white; background-color: none; width: 100%; margin-left: 20px; outline: none;" />
                <button type="submit" class="submitbutton">Send</button>
            </form>
        </div>
        <div id="msglist"></div>`

var loadmessagelist = function() {
    fetch('/api/all-messages/' + channelid, {
        method: 'GET',
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("msglist").innerHTML = ''
        data.forEach(element => {
            console.log(element)
            document.getElementById("msglist").innerHTML = `<div class="user-item">
                <div class="user-item-emailtext" style="text-wrap: nowrap; width: fit-content; margin-right: 15px; color: rgb(18, 100, 86);">` + element.sender.name + `</div>
                <div class="user-item-emailtext">` + element.content + `</div>
            </div>` + document.getElementById("msglist").innerHTML
        });
    })
    .catch(error => {
        console.error('Error fetching current user:', error);
    });
}

loadmessagelist()

setInterval(() => {
    loadmessagelist()
}, 1000);

fetch('/api/get-info/' + channelid, {
    method: 'GET',
    credentials: 'same-origin',
})
.then(response => response.json())
.then(data => {
    document.getElementById("pagetitle").innerHTML = "TeamSpace - " + data.name
    document.getElementById("welcomesection-text").innerHTML = "#" + data.name
    document.getElementById("welcomesection-subtext").innerHTML = data.desc
})
.catch(error => {
    console.error('Error fetching current user:', error);
});