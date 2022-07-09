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
    "usr": {}
}
// initial directory
var currentDir = ["home","guest"];

function getObject(path) {
    var directory = FS;
    if (path.length == 1 && path[0] == "") {
        return directory;
    }
    path.forEach((item)=>{
        directory = directory[item];
    })
    return directory;
}

// takes string "/home/guest" and returns array
function parsePath(p) {
    var tempPath = currentDir;
    p = p.split("/");
    if (p[p.length-1] == "") {
        p.pop()
    }
    if (p[0] == "") {
        p.shift();
        tempPath = [];
    }
    tempPath.push(...p);
    return tempPath;
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
            addLine("Error: No such file or directory: "+"\'"+p+"\'","error",0);
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
    if (p == "..") {
        currentDir.pop();
    } else if (true) {
        return
    }
}



var temp = getFolder(currentDir);
window.addEventListener("click",console.log(temp));
