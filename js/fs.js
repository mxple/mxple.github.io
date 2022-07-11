// JSON file system object emulating standard UNIX filesystem
const FS = {
    "bin": {
        "cat": "Outputs file contents",
        "cd": "Change directories",
        "clear": "Clear the terminal",
        "cp": "Copy files from one location to another",
        "echo": "Takes text and outputs it either to the terminal or to a file",
        "ls": "Lists items in current or specified directory",
        "man": "Short for manual, shows available commands",
        "mkdir": "Makes a new directory",
        "mv": "Moves files from one location to another",
        "neofetch": "Eyecandy and r/unixporn essential",
        "pwd": "Where am I?",
        "reboot": "Reboots this site",
        "rm": "Removes the specified file... among other things",
        "rmdir": "Removes the specified directory",
        "sudo": "I got the powahhh!!",
        "touch": "Creates a file",
        "vim": "Remember, :qa!"

    },
    "dev": {},
    "etc": {
        "logfile_07032005.txt": "<span class=''>[2005-03-7|12:34:35]</span> Ohno, I'm prone to losing my passwords.. Good thing I'm smart enough to leave my password in a file somewhere... <span class='error'>NOT in plaintext.</span> -signed, your system admin"
    },
    "home": {
        "guest": {
            "banner.txt":
                "<span style='white-space:pre'><span class='banner rainbow'><br>\
███╗   ███╗██╗  ██╗██████╗ ██╗    ███████╗██████╗ ██╗███╗   ██╗<br>\
████╗ ████║╚██╗██╔╝██╔══██╗██║    ██╔════╝██╔══██╗██║████╗  ██║<br>\
██╔████╔██║ ╚███╔╝ ██████╔╝██║    █████╗  ██████╔╝██║██╔██╗ ██║<br>\
██║╚██╔╝██║ ██╔██╗ ██╔═══╝ ██║    ██╔══╝  ██╔══██╗██║██║╚██╗██║<br>\
██║ ╚═╝ ██║██╔╝ ██╗██║     ██████╗███████╗██║  ██║██║██║ ╚████║<br>\
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ v1.0.1</span>\
<br>\
Try <span class='command'>'neofetch'</span> for eye candy!<br>\
---<br>\
Made with <span style='color:var(--col-6)'>♥</span> by <a href='https://github.com/mxple'>RIN</a><br> \
</span>",
            "about.txt": "This is an interactive terminal-styled website featuring common UNIX commands. Try typing <span class='command'>'man'</span> to get started or use <span class='command'>'cat'</span> to explore the files. Have fun finding all the easter eggs!",
            "repo.txt": "Read more about this site or report issues at <a href'https://github.com/Mxple/mxple.github.io'>https://github.com/Mxple/mxple.github.io<\a>"
        }
    },
    "root": {
        "hint.txt": "<span style='font-size:24px'>🍓</span>"
    },
    "usr": {}
}

// initial directory
var currentDir = ["home", "guest"];

// return reference to object in path, return undefined if the path is invalid
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

// takes a path string and returns a path array ex. "/home/guest" --> ["home","guest"]
function parsePath(p) {
    // assumes start at current directory
    var tempPath = [...currentDir];
    p = p.split("/");
    // gets rid of extra "/" at end
    if (p[p.length - 1] == "") {
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
            tempPath = ["home", user];
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

// takes a path array and returns a path string ex. ["home","guest"] --> "/home/guest"
function unparsePath(p) {
    return ("/" + p.join("/"));
}

// takes array and returns boolean if array is a valid path
function isValidPath(p) {
    return (getObject(p) != undefined);
}