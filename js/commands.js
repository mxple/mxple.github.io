// takes string path as input and tries to print the value of the key, if it is a string
function cat(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: cat [filename]", "error");
        return;
    }
    const path = parsePath(p);
    const object = getObject(parsePath(p));
    switch (typeof object) {
        case "object":
            addLine("Error: '" + unparsePath(path) + "' is a directory.", "error");
            break;
        case "undefined":
            addLine("Error: No such file or directory: '" + unparsePath(path) + "'.", "error");
            break;
        case "string":
            addLine(object, "normal")
            break;
    }
}

// navigates the file system by changing currentDir and updates the command prompt and title of the site
function cd(p) {
    p = p.trim();
    if (p == "..") {
        currentDir.pop();
    } else if (!isValidPath(parsePath(p))) {
        addLine("Error: No such file or directory: '" + p + "'.", "error", 0);
    } else {
        currentDir = [...parsePath(p)];
    }
    updateCmdPrompt();
    updateTitle();
}

// clears the terminal element
function clear() {
    setTimeout(function () {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
    }, 1);
}

// takes two paths as input, copies object at path one to path two
// does not copy directories; nor can it duplicate a file
// TODO: account for multiple spaces between paths
function cp(p) {
    let tuple = p.trim().split(" ");
    // catch invalid commands and throw errors
    if (tuple.length != 2) {
        addLine("Usage: cp [source_file] [target_file]", "error");
        return;
    }
    let tuplePaths = [parsePath(tuple[0]), parsePath(tuple[1])];
    if (tuple[0] == tuple[1]) {
        addLine("Error: '" + tuple[0] + "' and '" + tuple[1] + "' are identical (not copied).", "error");
        return;
    }
    if (!isValidPath(tuplePaths[0])) {
        addLine("Error: No such file or directory: '" + unparsePath(tuplePaths[0]) + "'.", "error");
        return;
    }
    if (typeof getObject(tuplePaths[0]) == "object") {
        addLine("Error: '" + unparsePath(tuplePaths[0]) + "' is a directory.", "error");
        return;
    }
    if (!isValidPath(tuplePaths[1].slice(0, -1))) {
        addLine("Error: No such directory: '" + unparsePath(tuplePaths[1].slice(0, -1)) + "/'.", "error");
        return;
    }
    // if the destination is a directory
    if (tuple[1].slice(-1) == "/" && typeof getObject(tuplePaths[1]) != "object") {
        // if the directory does not exist
        addLine("Error: No such directory: '" + unparsePath(tuplePaths[1]) + "/'.", "error");
        return;
    }
    // no rename
    if (isValidPath(tuplePaths[1])) {
        let fname = tuple[0];
        getObject(tuplePaths[1])[fname] = getObject(tuplePaths[0]).toString();
        return;
    }
    // yes rename
    let fname = tuplePaths[1].pop();
    getObject(tuplePaths[1])[fname] = getObject(tuplePaths[0]).toString();
}

// prints user input to stdout, cannot use addLine() due to HTML conversion
function echo(p) {
    // echo to other output
    let i = p.indexOf(">");
    if (i > -1) {
        // TODO: account for white space variability
        let path = parsePath(p.slice(i + 2));
        let fname = path.pop().trim();
        if (!isValidPath(path)) {
            addLine("Error: No such directory: '" + unparsePath(path) + "'.", "error");
            return;
        }
        // create or redeclare key-value pair
        getObject(path)[fname] = p.slice(0, i);
        return;
    }
    // stdout
    var next = document.createElement("p");
    next.innerText = p;
    next.className = "normal";

    before.parentNode.insertBefore(next, before);

    border.scrollTo(0, border.scrollHeight);
}

// lists keys of specified object, throws error otherwise
function ls(p) {
    p = p.trim();
    let folder = getObject(currentDir);
    let path = parsePath(p);
    if (p != "") {
        if (!isValidPath(path)) {
            addLine("Error: No such file or directory: '" + unparsePath(path) + "'.", "error", 0);
            return;
        }
        if (typeof getObject(path) == "string") {
            addLine("Error: '" + unparsePath(path) + "' is not a directory.", "error", 0);
            return;
        }
        folder = getObject(path);
    }
    // files are normal style, folders are folder styled
    let keys = [];
    let styles = [];
    for (var key in folder) {
        if (folder.hasOwnProperty(key)) {
            keys.push(key);
            if (typeof folder[key] == "object") {
                styles.push("folder");
            } else {
                styles.push("normal");
            }
        }
    }
    addLine("<ul>" + getList(keys, styles) + "</ul>");
}

// pulls up manual which changes based on contents of /bin
function man(p) {
    if (commandList.includes(p.toLowerCase())) {
        addLine(getObject(["bin", p.toLowerCase()]), "normal");
        return;
    }
    if (p != "") {
        addLine("Error: Not a command: '" + p + "'.", "error");
        return;
    }
    addLine("A list of available commands:<ul>" + getList(commandList.sort(), "command") + "</ul>", "normal");
}

// creates an object paired to the specified key; can make multiple at once
function mkdir(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: mkdir [directory]", "error");
        return;
    }
    let path = parsePath(p);
    if (isValidPath(path)) {
        addLine("Error: '" + p + " is already a directory.", "error");
        return;
    }
    let directoriesToMake = [];
    while (!isValidPath(path)) {
        directoriesToMake.push(path.pop());
    }
    for (var dname of directoriesToMake.reverse()) {
        getObject(path)[dname] = {};
        path.push(dname);
    }
}

// moves a file by copying it, then removing it (combines cp and rm)
function mv(p) {
    let tuple = p.trim().split(" ");
    if (tuple.length != 2) {
        addLine("Usage: mv [source_file] [target_location].", "error");
        return;
    }
    let tuplePaths = [parsePath(tuple[0]), parsePath(tuple[1])];
    if (!isValidPath(tuplePaths[0])) {
        addLine("Error: No such file or directory: '" + unparsePath(tuplePaths[0]) + "'.", "error");
        return;
    }
    if (typeof getObject(tuplePaths[0]) == "object") {
        addLine("Error: '" + unparsePath(tuplePaths[0]) + "' is a directory.", "error");
        return;
    }
    if (tuple[0] == tuple[1]) {
        addLine("Error: '" + tuple[0] + "' and '" + tuple[1] + "' are identical (not moved).", "error");
        return;
    }
    if (!isValidPath(tuplePaths[1].slice(0, -1))) {
        addLine("Error: No such directory: '" + unparsePath(tuplePaths[1].slice(0, -1)) + "/'.", "error");
        return;
    }
    // if the destination is a directory
    if (tuple[1].slice(-1) == "/" && typeof getObject(tuplePaths[1]) != "object") {
        // if the directory does not exist
        addLine("Error: No such directory: '" + unparsePath(tuplePaths[1]) + "/'.", "error");
        return;
    }
    // renaming and moving over
    if (isValidPath(tuplePaths[1])) {
        let fname = tuple[0];
        getObject(tuplePaths[1])[fname] = getObject(tuplePaths[0]).toString();
    }
    // just moving over
    else {
        let fname = tuplePaths[1].pop();
        getObject(tuplePaths[1])[fname] = getObject(tuplePaths[0]).toString();
    }
    // deleting here
    let tempPath = tuplePaths[0];
    let fname = tempPath.pop();
    delete getObject(tempPath)[fname];
}

// neofetch eye candy 
function neofetch(p) {
    // gets browser name using userAgent string
    var browserName = (function (agent) {
        switch (true) {
            case agent.indexOf("edge") > -1: return "MS Edge";
            case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
            case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
            case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
            case agent.indexOf("trident") > -1: return "MS IE";
            case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
            case agent.indexOf("safari") > -1: return "Safari";
            default: return "other";
        }
    })(window.navigator.userAgent.toLowerCase());
    // gets time spent on site using performance.now() and returns it in
    // a "_h _m _s" format
    var getElapsedTime = (function () {
        let s = Math.floor(performance.now() / 1000);
        let hrs = Math.floor(s / 3600);
        s %= 3600;
        let mins = Math.floor(s / 60);
        s %= 60;
        return (hrs + "h " + mins + "m " + s + "s");
    });
    // this is actually pfetch lol
    addLine("</span style='white-space:nowrap'>\
       .:'      "+ user + "@rinOS<br>\
    _ :'_       <b>os</b>     rinOS<br>\
 .'`_`-'_``.    <b>host</b>   "+ browserName + "<br>\
:________.-'    <b>kernel</b> 4.2.0<br>\
:_______:       <b>uptime</b> "+ getElapsedTime() + "<br>\
 :_______`-;    <b>pkgs</b>   "+ Object.keys(FS.bin).length + "<br>\
  `._.-._.'     <b>memory</b> "+ (10000 + Math.floor(Math.random() * 22000)) + " / 32768M<br>\
</span>\
", "rainbow");
}

// takes array and outputs the string location
function pwd(p) {
    if (p != "") {
        addLine("Error: Too many arguments, expected 0, got 1.", "error");
        return;
    }
    addLine("/" + currentDir.join("/"), "normal");
}

// reloads page
function reboot(p) {
    location.reload();
}

// creates a file
function touch(p) {
    p = p.trim();
    // if input is empty or is a directory
    if (p == "" || p.slice(-1) == "/") {
        addLine("Usage: touch [file]", "error");
        return;
    }
    let path = parsePath(p);
    let fname = path.pop();
    // check if valid
    if (!isValidPath(path)) {
        addLine("Error: No such directory: '" + unparsePath(path) + "/'.", "error");
        return;
    }
    getObject(path)[fname] = "";
}

// removes specified file. does not handle directories. contains rm -rf easter egg
function rm(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: rm [-r | -f] [file]", "error");
        return;
    } else if (p == "-rf") {
        if (user != "root") {
            addLine("Permission denied.", "error");
            return;
        }
        // GLITCH effect: disables input, starts glitch, makes page unusable after delay
        disableInput = true;
        cursor.style.animation = "none";
        var gl = Object.create(glitch_exec);
        gl.GLITCH_RENDER_COUNT = 5;
        gl.start(document.body);
        setTimeout(function () {
            document.getElementById("body").innerHTML = "";
            document.getElementById("body").style.backgroundColor = "black";
            document.getElementById("body").style.padding = "100%";
            document.getElementById("body").style.cursor = "none";
            document.addEventListener('contextmenu', event => event.preventDefault());
        }, 6000);
        return;
    }
    let path = parsePath(p);
    if (!isValidPath(path)) {
        addLine("Error: No such file or directory: '" + unparsePath(path) + "'.", "error");
        return;
    }
    if (typeof getObject(path) == "object" || p.slice(-1) == "/") {
        addLine("Error: '" + unparsePath(path) + "' is a directory.", "error");
        return;
    }
    let fname = path.pop();
    delete getObject(path)[fname];
    // in case of removal of /bin items
    updateCommandList();
}

// removes directories, even if they are not empty. cannot be used to remove first level directories
function rmdir(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: rmdir [-r | -f] [path]", "error");
        return;
    }
    let path = parsePath(p);
    if (!isValidPath(path)) {
        addLine("Error: No such file or directory: '" + unparsePath(path) + "'.", "error");
        return;
    }
    if (typeof getObject(path) == "string") {
        addLine("Error: '" + unparsePath(path) + "' is not a directory.", "error");
        return;
    }
    if (path.length <= 1) {
        console.log(path)
        addLine("Permission denied.", "error");
        return;
    }
    let fname = path.pop();
    delete getObject(path)[fname];
}

// runs command p as root. password authentication is handled in main.js
function sudo(p) {
    p = p.split(" ");
    var cmd = p[0].toLowerCase();
    p.shift();
    var param = p.join(" ");
    if (cmd.trim() == "") {
        return;
    } else if (commandList.includes(cmd)) {
        let tempUser = user;
        user = "root";
        eval(cmd + "(\'" + param + "\')");
        user = tempUser;
    } else {
        addLine("<span class='error'>Command not found. For a list of commands, type <span class='command'>'man'</span>.</span>", "error", 0);
    }
}

// vim is a meme
function vim(p) {
    addLine("Don't open vim, you wouldn't be able to :qa!", "error");
}
