var before = document.getElementById("before");
var cmdprompt = document.getElementById("cmdprompt");
var cursor = document.getElementById("cursor");
var command = document.getElementById("textbox");  
var terminal = document.getElementById("terminal");
var textbox = document.getElementById("hiddeninput");

var hist = [];
var histIndex = 0;
var cursorIndex = 0;
var disableInput = false;

var user = "guest";

const commandList = ["man","cd","pwd","ls","echo","cat","neofetch","clear","mkdir","rm","rmdir","cp","mv","touch","vim","sudo","reboot"];

window.addEventListener("keydown", enterKey);

// init
cmdprompt.innerText = "guest@rinOS:~$ ";

// handle input
function enterKey(e) {
  if (disableInput) {
    return;
  }
  // if [ENTER] key, add command to history and try to execute
  if (e.which == 13) {
    if (command.innerText.trim() != "") {
      histIndex = hist.push(command.innerText);
    }
    addLine(cmdprompt.innerText + command.innerText);
    readLine(command.innerText);
    // reset things
    command.innerText = "";
    cursorIndex = 0;
  }
  // if [BACKSPACE] and not at beginning, delete previous character
  else if (e.which == 8 && cursorIndex > 0) {
    command.innerText = command.innerText.slice(0, cursorIndex-1)+command.innerText.slice(cursorIndex);
    cursorIndex = Math.max(cursorIndex-1, 0);
  }
  // prevent [TAB] behavior
  else if (e.which == 9) {
    e.preventDefault();
  }
  // if CTRL + C, cancel
  // if CTRL + L, clear screen
  else if (e.which == 76 && e.ctrlKey == true) {
    setTimeout(function() {
      terminal.innerHTML = '<a id="before"></a>';
      before = document.getElementById("before");
    }, 1);
  }
  // if [UP] and history is not empty, repeat previous command
  else if (e.which == 38 && hist.length != 0) {
    histIndex = Math.max(histIndex-1, 0);
    command.innerText = hist[histIndex];
    cursorIndex = command.innerText.length
  }
  // if [DOWN] and histIndex is not at the bottom, go down a command
  else if (e.which == 40 && histIndex != hist.length) {
    histIndex += 1;
    if (hist[histIndex] === undefined) {
      command.innerText = "";
    } else {
      command.innerText = hist[histIndex];
    }
    cursorIndex = command.innerText.length
  }
  // if [LEFT], move cursor left
  else if (e.which == 37) {
    cursorIndex = Math.max(cursorIndex - 1,0);
  }
  // if [RIGHT], move cursor right
  else if (e.which == 39) {
    cursorIndex = Math.min(cursorIndex + 1, command.innerText.length);
  }
  // get rid of non-printables
  else if (
        (e.which > 47 && e.which < 62)   || // number keys
        (e.which == 32 || e.which == 13) || // spacebar & return key(s) (if you want to allow carriage returns)
        (e.which > 64 && e.which < 91)   || // letter keys
        (e.which > 95 && e.which < 112)  || // numpad keys
        (e.which == 173)                 || // - sign
        (e.which > 185 && e.which < 193) || // ;=,-./` (in order)
        (e.which > 218 && e.which < 223)    // [\]' (in order)
  ) {
    // prevent quickfind
    if(e.which == 222 || e.which == 191) {
      e.preventDefault();
    }
    command.innerText = command.innerText.slice(0,cursorIndex)+ e.key + command.innerText.slice(cursorIndex);
    cursorIndex += 1;
  }
  // move cursor
  cursor.style.left = -9.61*(command.innerText.length-cursorIndex) + "px";
  // clear textbox (mobile only)
  textbox.innerText = "";
}

function readLine(line) {
  line = line.split(" ");
  var cmd = line[0].toLowerCase();
  line.shift()
  var param = line.join(" ");
  if (cmd.trim() == "") {
    return;
  } else if (commandList.includes(cmd)) {
    console.log(cmd+"("+param+")");
    eval(cmd+"(\'"+param+"\')");
  } else {
    addLine("<span class=\"error\">Command not found. For a list of commands, type <span class=\"command\">'man'</span>.</span>", "error", 0);
  }
}

function addLine(text, style, delay) {
  var next = document.createElement("p");
  next.innerHTML = text;
  next.className = style;

  before.parentNode.insertBefore(next, before);

  if (window.screen.width > 780) {
    window.scrollTo(0, document.body.offsetHeight);
  }
}

function updateTitle() {
  document.title=unparsePath(currentDir);
}