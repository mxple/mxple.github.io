var FS = {
    "bin": {
        "ls": "js code",
        "cd": "js code",
        "rm": "js code"
    },
    "dev": {},
    "etc": {},
    "home": {
        "guest": {
            "foo.txt": "some string",
            "bar.txt": "some other string"
        }
    },
    "root": {},
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
        addLine("Error: Too many arguments, expected 0, got 1","error");
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
            folder = getObject(parsePath(p));
        } else {
            addLine("Error: No such file or directory: "+"\'"+unparsePath(parsePath(p))+"\'","error",0);
            return;
        }
    }
    var keys = [];
    for (var key in folder) {
        if (folder.hasOwnProperty(key)) {
          keys.push(key);
        }
    }
    addLine("<ul>"+getList(keys, "normal")+"</ul>");
}

function cd(p) {
    p = p.trim();
    if (p == "..") {
        currentDir.pop();
    } else if (!isValidPath(parsePath(p))) {
        addLine("Error: No such file or directory: "+"\'"+p+"\'","error",0);
    } else {
        currentDir = [...parsePath(p)];
    }
    updateCmdPrompt();
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
        addLine("Error: Too few arguments, expected 1, got 0","error");
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