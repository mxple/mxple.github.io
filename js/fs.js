var FS = {
    "bin": {
        "cat"       : "Outputs file contents",
        "cd"        : "Change directories",
        "clear"     : "Clear the terminal",
        "cp"        : "Copy files from one location to another",
        "echo"      : "Takes text and outputs it either to the terminal or to a file",
        "ls"        : "Lists items in current or specified directory",
        "man"       : "Short for manual, shows available commands",
        "mkdir"     : "Makes a new directory",
        "mv"        : "Moves files from one location to another",
        "neofetch"  : "Eyecandy and r/unixporn essential",
        "pwd"       : "Where am I?",
        "reboot"    : "Reboots this site",
        "rm"        : "Removes the specified file... among other things",
        "rmdir"     : "Removes the specified directory",
        "sudo"      : "I got the powahhh!!",
        "touch"     : "Creates a file",
        "vim"       : "Remember, :qa!"

    },
    "dev": {},
    "etc": {
        "logfile_07032005.txt" : "<span class=\'\'>[2005-03-7|12:34:35]</span> Ohno, I'm prone to losing my passwords.. Good thing I'm smart enough to leave my password in a file somewhere... <span class=\'error\'>NOT in plaintext.</span> -signed, your system admin"
    },
    "home": {
        "guest": {
            "banner.txt": 
"<span style=\'white-space:pre\'><span class=\'banner rainbow\' style=\'font-size:12px;line-height:1.2;display:block\'><br>\
███╗   ███╗██╗  ██╗██████╗ ██╗    ███████╗██████╗ ██╗███╗   ██╗<br>\
████╗ ████║╚██╗██╔╝██╔══██╗██║    ██╔════╝██╔══██╗██║████╗  ██║<br>\
██╔████╔██║ ╚███╔╝ ██████╔╝██║    █████╗  ██████╔╝██║██╔██╗ ██║<br>\
██║╚██╔╝██║ ██╔██╗ ██╔═══╝ ██║    ██╔══╝  ██╔══██╗██║██║╚██╗██║<br>\
██║ ╚═╝ ██║██╔╝ ██╗██║     ██████╗███████╗██║  ██║██║██║ ╚████║<br>\
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ v1.0.1</span>\
<br>\
Try <span class=\'command\'>'neofetch'</span> for eye candy!<br>\
---<br>\
Made with <span style=\'color:var(--col-6)\'>♥ </span>by <a href=\'https://github.com/mxple\'>RIN<\a><br> \
</span>",
            "about.txt": "This is an interactive terminal-styled website featuring common UNIX commands. Try typing <span class=\'command\'>'man'</span> to get started or use <span class=\'command\'>'cat'</span> to explore the files. Have fun finding all the easter eggs!",
            "repo.txt": "Read more about this site or report issues at <a href=\'https://github.com/Mxple/mxple.github.io\'>https://github.com/Mxple/mxple.github.io<\a>"
        }
    },
    "root": {
        "hint.txt": "🍓"
    },
    "usr": {}
}
// initial directory
var currentDir = ["home","guest"];

function getObject(path) {
    var directory = FS;
    if (path.length == 1 && path[0] == "") {
        return directory;
    }
    for (var item of path) {
        directory = directory[item];
        if (directory == undefined) {
            return undefined;
        }
    }
    return directory;
}

// takes string "/home/guest" and returns array
function parsePath(p) {
    // assumes start at current directory
    var tempPath = [...currentDir];
    p = p.split("/");
    // gets rid of extra "/" at end
    if (p[p.length-1] == "") {
        p.pop()
    }
    // if starts with "/", use root
    if (p[0] == "") {
        p.shift();
        tempPath = [];
    }
    // if starts with "~", use home
    else if (p[0] == "~") {
        p.shift();
        if (user == "root") {
            tempPath = ["root"];
        } else {
            tempPath = ["home",user];
        }
    }
    // remove excess blanks
    var i = 0;
    while (i < p.length) {
        if (p[i] == "") {
            p.splice(i, 1);
        } else {
            i++;
        }
    }
    tempPath.push(...p);
    return tempPath;
}

function unparsePath(p) {
    return ("/"+p.join("/"));
}

// takes array and turns it into string location
function pwd(p) {
    if (p != "") {
        addLine("Error: Too many arguments, expected 0, got 1.","error");
        return;
    }
    addLine("/"+currentDir.join("/"), "normal");
}

// takes array and returns boolean if array is a valid path
function isValidPath(p) {
    return(getObject(p) != undefined);
}

function ls(p) {
    p = p.trim();
    var folder = getObject(currentDir);
    if (p != "") {
        if (isValidPath(parsePath(p))) {
            if (typeof getObject(parsePath(p)) == "string") {
                addLine("Error: \'"+unparsePath(parsePath(p))+"\' is not a directory.","error",0);
                return;
            }
            folder = getObject(parsePath(p));
        } else {
            addLine("Error: No such file or directory: "+"\'"+unparsePath(parsePath(p))+"\'.","error",0);
            return;
        }
    }
    var keys = [];
    var styles = [];
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
    console.log(styles)
    addLine("<ul>"+getList(keys, styles)+"</ul>");
}

function cd(p) {
    p = p.trim();
    if (p == "..") {
        currentDir.pop();
    } else if (!isValidPath(parsePath(p))) {
        addLine("Error: No such file or directory: "+"\'"+p+"\'.","error",0);
    } else {
        currentDir = [...parsePath(p)];
    }
    updateCmdPrompt();
    updateTitle();
}

function updateCmdPrompt() {
    var end = "$ ";
    var location = "/"+currentDir.join("/");
    if (user == "root") {
      end = "# ";
    }
    if ((currentDir[0] == "home" && currentDir[1] == user && currentDir.length == 2) || (currentDir[0] == user && user == "root" && currentDir.length == 1)) {
        location = "~";
    }
    cmdprompt.innerText = user + "@rinOS:" + location + end;
}

function cat(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: cat [filename]","error");
        return;
    }
    var path = parsePath(p);
    var object = getObject(parsePath(p));
    switch (typeof object) {
        case "object":
            addLine("Error: \'"+unparsePath(path)+"\' is a directory","error",0);
            break;
        case "undefined":
            addLine("Error: No such file or directory: "+"\'"+unparsePath(path)+"\'","error",0);
            break;
        case "string":
            addLine(object, "normal")
            break;
    }
}