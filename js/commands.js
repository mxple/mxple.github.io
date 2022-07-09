
function man(p) {
    if (p != "") {
        addLine("Error: Invalid parameter: \'"+p+"\'","error");
        return;
    }
    addLine("A list of available commands:<ul>"+getList(commandList.sort(),"command")+"</ul>","normal");
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
        addLine("Error: Too few arguments, expected 1, got 0","error");
        return;
    }
    let path = parsePath(p);
    let fname = path.pop();
    getObject(path)[fname] = "";
}

// prints user input to stdout, cannot use addLine() due to HTML conversion
function echo(p) {
    // echo to other output
    let i = p.indexOf(">");
    if (i > -1) {
        console.log("YEABITCH")
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
