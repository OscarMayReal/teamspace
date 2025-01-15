class globalnavmenu extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
            <div style="width: 100vw; height: 100vh; background-color: rgba(37, 37, 37, 0.435); position: fixed; top: 0px; left: 0px;" onclick="document.querySelector('global-nav-menu').remove()">
                <div style="height: calc(100vh - 50px); width: 300px; padding: 25px; background-color: white; box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;" onclick="event.stopPropagation()">
                    <div style="padding-left: 10px; padding-top: 0px; border-bottom: 2px solid #e4e4e7; font-size: 14px; font-family: figtree; font-weight: 400; color: #666666; padding-bottom: 20px;">Navigation</div>
                    <div id="navlist" style="border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; margin-bottom: 20px;">
                        <a href="/dashboard">
                            <div style="padding-left: 10px; display: flex; flex-direction: row; align-items: center; margin-top: 20px; color: #666666;">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                                </div>
                                <div style="padding-left: 10px; font-size: 16px; font-family: figtree; font-weight: 500;">Dashboard</div>
                            </div>
                        </a>
                        <a href="/userpanel">
                            <div style="padding-left: 10px; display: flex; flex-direction: row; align-items: center; margin-top: 20px; color: #666666;">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
                                </div>
                                <div style="padding-left: 10px; font-size: 16px; font-family: figtree; font-weight: 500;">User Settings</div>
                            </div>
                        </a>
                    </div>
                    <div style="padding-left: 10px; font-size: 14px; padding-top: 20px; font-family: figtree; font-weight: 400; color: #666666; padding-bottom: 20px;">Your Channels</div>
                    <div id="channelslist-sb">
                        
                    </div>
                </div>
            </div>
        `;
        var user = {}

        fetch('/api/current-user', {
            method: 'GET',
            credentials: 'same-origin',
        })
        .then(response => response.json())
        .then(data => {
            user = data
            if (user.role == "admin") {
                document.getElementById("navlist").innerHTML = document.getElementById("navlist").innerHTML + `<a href="/admin"><div style="padding-left: 10px; display: flex; flex-direction: row; align-items: center; margin-top: 20px; color: #666666;">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                    </div>
                    <div style="padding-left: 10px; font-size: 16px; font-family: figtree; font-weight: 500;">
                        Admin
                    </div>
                </div></a>`
            }
        })

        fetch('/api/all-channels', {
            method: 'GET',
            credentials: 'same-origin',
        })

        .then(response => response.json())
        .then(data => {
            document.getElementById("channelslist-sb").innerHTML = ""
            data.forEach(element => {
                document.getElementById("channelslist-sb").innerHTML = document.getElementById("channelslist-sb").innerHTML + `<a href="/dashboard/channel?id=` + element.id + `">
                <div style="padding-left: 10px; padding-top: 15px; border-top: 2px solid #e4e4e7;">
                    <div style="font-size: 17px; font-family: figtree; font-weight: 500; color: #666666; margin-bottom: 10px;">
                        ` + element.name + `
                    </div>
                    <div style="font-size: 15px; font-family: figtree; font-weight: 400; color: #666666; margin-bottom: 20px;">
                        ` + element.desc + `
                    </div>
                </div></a>`
            });
        })
        .catch(error => {
            console.error('Error fetching current user:', error);
        });
    }
}

customElements.define("global-nav-menu", globalnavmenu);