
function cp(p) {
    let tuple = p.trim().split(" ");
    if (tuple.length != 2) {
        addLine("Usage: cp [source_file] [target_file]","error");
        return;
    }
    console.log(tuple);
    if (!isValidPath(parsePath(tuple[0]))) {
        addLine("Error: No such file or directory: "+"\'"+unparsePath(parsePath(tuple[0]))+"\'","error");
        return;
    }
    if (tuple[0] == tuple[1]) {
        addLine("Error: \'"+tuple[0]+"\' and \'"+tuple[1]+"\' are identical (not copied).","error");
        return;
    }
    if (!isValidPath(parsePath(tuple[1]).slice(0,-1))) {
        addLine("Error: No such directory: "+"\'"+unparsePath(parsePath(tuple[1]).pop())+"\'","error");
        return;
    }
    if (isValidPath(parsePath(tuple[1]))) {
        let path = parsePath(tuple[1]);
        let fname = tuple[0];
        getObject(path)[fname] = getObject(parsePath(tuple[0])).toString();        
        return;
    }
    let path = parsePath(tuple[1]);
    let fname = path.pop();
    getObject(path)[fname] = getObject(parsePath(tuple[0])).toString();
}

function man(p) {
    if (p != "") {
        addLine("Error: Invalid parameter: \'"+p+"\'","error");
        return;
    }
    addLine("A list of available commands:<ul>"+getList(commandList.sort(),"command")+"</ul>","normal");
}

function mkdir(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: mkdir [directory]","error");
        return;
    }
    let path = parsePath(p);
    if (isValidPath(path)) {
        addLine("Error: \'"+p+"\' is already a directory","error");
        return;
    }
    let directoriesToMake = [];
    while (!isValidPath(path)) {
        directoriesToMake.push(path.pop());
    }
    console.log(directoriesToMake)
    for (var dname of directoriesToMake.reverse()) {
        console.log(dname)
        getObject(path)[dname] = {};
        path.push(dname);
    }
}

function getList(arr, style) {
    if (typeof style == "string") {
        style = new Array(arr.length).fill(style);
    }
    var output = "";
    for (let i=0; i<arr.length; i++) {
        output += "<li class=\""+style[i]+"\">"+arr[i]+"</li>";
    }
    return(output);
}

// creates a file
function touch(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: touch [file]","error");
        return;
    }
    let path = parsePath(p);
    let fname = path.pop();
    // check if valid
    if (!isValidPath(path)) {
        addLine("Error: No such directory: "+"\'"+unparsePath(path)+"\'","error");
        return;
    }
    getObject(path)[fname] = "";
}

// prints user input to stdout, cannot use addLine() due to HTML conversion
function echo(p) {
    // echo to other output
    let i = p.indexOf(">");
    if (i > -1) {
        let path = parsePath(p.slice(i+2));
        let fname = path.pop().trim();
        getObject(path)[fname] = p.slice(0,i);
        return;
    }
    // stdout
    var next = document.createElement("p");
    next.innerText = p;
    next.className = "normal";

    before.parentNode.insertBefore(next, before);

    if (window.screen.width > 780) {
        window.scrollTo(0, document.body.offsetHeight);
    }
}

// clears the terminal element
function clear(p) {
    setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
    }, 1);
}

function reboot(p) {
    location.reload();
}

////////////////////////
// neofetch eye candy //
////////////////////////
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
function getElapsedTime() {
    let s = Math.floor(performance.now()/1000);
    let hrs = Math.floor(s/3600);
    s %= 3600;
    let mins = Math.floor(s/60);
    s %= 60;
    return (hrs+"h "+mins+"m "+s+"s");
}

function neofetch(p) {
addLine("\
       .:'      "+user+"@rinOS<br>\
    _ :'_       <b>os</b>     rinOS<br>\
 .'`_`-'_``.    <b>host</b>   "+browserName+"<br>\
:________.-'    <b>kernel</b> 4.2.0<br>\
:_______:       <b>uptime</b> "+getElapsedTime()+"<br>\
 :_______`-;    <b>pkgs</b>   "+Object.keys(FS.bin).length+"<br>\
  `._.-._.'     <b>memory</b> "+(10000+Math.floor(Math.random()*22000))+" / 32768M<br>\
","rainbow");
}

function rm(p) {
    p = p.trim();
    if (p == "") {
        addLine("Usage: rm [-r | -f] [path]","error");
        return;
    } else if (p.slice(0,3) == "-rf") {
        // if (user != "root") {
        //     addLine("Permission denied.","error");
        //     return;
        // }
        // GLITCH!!
        disableInput = true;
        cursor.style.animation = "none";
        var gl = Object.create(glitch_exec);
        gl.GLITCH_RENDER_COUNT = 5;
        gl.start(document.body);
        setTimeout(function() {
            document.getElementById("body").innerHTML = "";
            document.getElementById("body").style.backgroundColor = "black";
        }, 6000);
        return; 
    }
    let path = parsePath(p);
    if (!isValidPath(path)) {
        addLine("Error: No such file or directory: "+"\'"+unparsePath(path)+"\'","error");
        return;
    }
    let fname = path.pop();
    delete getObject(path)[fname];

}

// vim is a meme
function vim(p) {
    addLine("Don't open vim, you wouldn't be able to :qa!", "error");
}





// helper funcs