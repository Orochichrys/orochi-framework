const iconNames = [
        "menu", "close", "download",
        "arrow-up", "arrow-left", "arrow-right", "arrow-down",
        "arrow-circle-up", "arrow-circle-left", "arrow-circle-right", "arrow-circle-down",
        "search", "user", "user-fill", "user-plus", "user-plus-fill",
        "lock", "lock-fill", "mail", "mail-fill", "bell", "camera",
        "settings", "settings-fill", "calendar", "edit", "trash", "trash-2",
        "share", "share-2", "home", "heart", "star", "plus", "check",
        "info", "alert-circle", "external-link", "phone", "message-square",
        "message-circle", "video", "image", "music", "folder", "hash",
        "shopping-cart", "bookmark", "map", "cloud", "upload", "refresh-cw",
        "refresh-ccw", "rotate-cw", "rotate-ccw", "printer", "filter", "eye",
        "clock", "copy", "spark", "inbox", "plus-circle", "compass"
    ];

    const container = document.querySelector(".orochi-row");

    iconNames.forEach(name => {
        const col = document.createElement("div");
        col.className = "orochi-col-12 orochi-col-xs-4 orochi-col-sm-4 orochi-col-md-4 orochi-col-lg-3";

        col.innerHTML = `
            <div class="orochi-card orochi-p-4 orochi-text-center">
                <i class="oi oi-${name}"></i>
            </div>
            <div class="orochi-text-sm orochi-text-center orochi-mt-2">${name}</div>
        `;

        container.appendChild(col);
    });