
function man(p) {
    if (p != "") {
        addLine("Error: Invalid parameter: \'"+p+"\'","error",0);
        return;
    }
    addLine("A list of available commands:<ul>"+getList(commandList.sort(),"command")+"</ul>","normal",0);
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

function echo(p) {
    addLine(p, "normal");
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

// TEMP COMMANDS
// const files = ["about.txt","hello_world.txt","train.txt"];
// function ls(p) {
//     var output = "<span class=\"normal\"><ul></ul></span>";
//     files.sort().forEach((item)=>{
//         let tempString = "<li class=\"normal\">"+item+"</li>";
//         output = output.slice(0,-12)+tempString+output.slice(-12);
//     })
//     addLine(output,"normal",0);
// }

function cat(p) {
    if (files.includes(p)) {
        if (p == "about.txt") {
            addLine("This is a web terminal made by <a href=\"https://discordapp.com/users/432599055949103106/\">RIN</a> =)", "normal", 0);
        }
        if (p == "hello_world.txt") {
            addLine("Hello World!","normal",0);
        }
        if (p == "train.txt") {
            addLine("Shut up ☝️☝️☝️, both of you! Now do you get 🉐🉐🉐 it? I don't know 🤔 where 🤷 the train 🚋 goes BECAUSE of this ⬆️! Is 🈶 this ⬆️ person 👤👤👤 good 👌👍🏾? Is 🈶 that person 👤 bad 📉? There's no 😣😣😣 way ↕️↕️ to tell 🗣️ which way ↕️↕️ the train 🚋🚋 goes if you keep on 🔛 fighting 🥊 with each other! I’ve been here 👈👈, and I’ve seen enough of other people 👫 go through exactly what 😅 you’re doing but still no 😣 one 1️⃣ figures out 🏎️🏍️ where 🤷 the train 🚋🚋🚋 goes. How 🤔 can they get 🉐🉐 on 🔛 without knowing 🤔?", "normal", 0);
        }
    } else if (p.trim() == "") {
        addLine("Error: Too few arguments, expected 1, have 0","error",0);
    } else {
        addLine("Error: No such file or directory: "+"\'"+p+"\'","error",0);
    }
}

// END TEMP COMMANDS

