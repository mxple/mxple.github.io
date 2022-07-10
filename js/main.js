var before = document.getElementById("before");
var cmdprompt = document.getElementById("cmdprompt");
var cursor = document.getElementById("cursor");
var command = document.getElementById("textbox");
var terminal = document.getElementById("terminal");
var textbox = document.getElementById("hiddeninput");

var hist = [];
var histIndex = 0;
var cursorIndex = 0;
var enteringPassword = false;
var disableInput = false;

var user = "guest";
var pass = "";
var secret = "strawberry";
var sudoCommand = "";

var commandList;

// init
function init() {
	updateTitle();
	updateCmdPrompt();
	updateCommandList();
	autoType("cat banner.txt");
}
window.onload = init;

window.addEventListener("keydown", enterKey);

// handles input
function enterKey(e) {
	if (disableInput) {
		return;
	}
	// if [ENTER] key, add command to history and try to execute
	if (e.which == 13) {
		if (command.innerText.trim() != "") {
			histIndex = hist.push(command.innerText);
		}
		addLine(cmdprompt.innerText.slice(0,-1)+"&nbsp" + command.innerText, "enteredCommand");
		// password mode
		if (enteringPassword) {
			if (pass == secret) {
				readLine(sudoCommand);
			} else {
				addLine("Incorrect password, permission denied.", "error")
			}
			// resetting
			updateCmdPrompt();
			sudoCommand = "";
			enteringPassword = false;
			pass = "";
			command.innerText = "";
			cursorIndex = 0;
			return;
		}
		// sudo behavior
		if (command.innerText.toLowerCase().slice(0, 4) == "sudo") {
			cmdprompt.innerText = "Password: ";
			enteringPassword = true;
			sudoCommand = command.innerText;
			command.innerText = "";
			cursorIndex = 0;
			return;
		}
		readLine(command.innerText);
		// reset things
		command.innerText = "";
		cursorIndex = 0;
	}
	// if [BACKSPACE] and not at beginning, delete previous character
	else if (e.which == 8 && cursorIndex > 0) {
		if (!enteringPassword) {
			command.innerText = command.innerText.slice(0, cursorIndex - 1) + command.innerText.slice(cursorIndex);
			cursorIndex = Math.max(cursorIndex - 1, 0);
		} else {
			pass = pass.slice(0, cursorIndex - 1) + pass.slice(cursorIndex);
			cursorIndex = Math.max(cursorIndex - 1, 0);
		}
	}
	// prevent [TAB] behavior
	else if (e.which == 9 && !enteringPassword) {
		e.preventDefault();
	}
	// if CTRL + C, cancel
	else if (e.which == 67 && e.ctrlKey == true && !enteringPassword) {
		addLine(cmdprompt.innerText + command.innerText);
		command.innerText = "";
		cursorIndex = 0;
	}
	// if CTRL + L, clear screen
	else if (e.which == 76 && e.ctrlKey == true && !enteringPassword) {
		setTimeout(function () {
			terminal.innerHTML = '<a id="before"></a>';
			before = document.getElementById("before");
		}, 1);
	}
	// if [UP] and history is not empty, repeat previous command
	else if (e.which == 38 && hist.length != 0 && !enteringPassword) {
		histIndex = Math.max(histIndex - 1, 0);
		command.innerText = hist[histIndex];
		cursorIndex = command.innerText.length
	}
	// if [DOWN] and histIndex is not at the bottom, go down a command
	else if (e.which == 40 && histIndex != hist.length && !enteringPassword) {
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
		cursorIndex = Math.max(cursorIndex - 1, 0);
	}
	// if [RIGHT], move cursor right
	else if (e.which == 39) {
		cursorIndex = Math.min(cursorIndex + 1, command.innerText.length);
	}
	// get rid of non-printables
	else if (
		(e.which > 47 && e.which < 62) || // number keys
		(e.which == 32 || e.which == 13) || // spacebar & return key(s) (if you want to allow carriage returns)
		(e.which > 64 && e.which < 91) || // letter keys
		(e.which > 95 && e.which < 112) || // numpad keys
		(e.which == 173) || // - sign
		(e.which > 185 && e.which < 193) || // ;=,-./` (in order)
		(e.which > 218 && e.which < 223)    // [\]' (in order)
	) {
		// prevent quickfind
		if (e.which == 222 || e.which == 191) {
			e.preventDefault();
		}
		if (!enteringPassword) {
			command.innerText = command.innerText.slice(0, cursorIndex) + e.key + command.innerText.slice(cursorIndex);
		} else {
			pass = pass.slice(0, cursorIndex) + e.key + pass.slice(cursorIndex);
		}
		cursorIndex += 1;
	}
	// move cursor
	if (!enteringPassword) {
		cursor.style.left = -9.61 * (command.innerText.length - cursorIndex) + "px";
	}
	// clear textbox (mobile only)
	textbox.innerText = "";
}

// processes the line and evaluates the command if there is one
// TODO: check for security risks using eval function
function readLine(line) {
	line = line.split(" ");
	var cmd = line[0].toLowerCase();
	line.shift()
	var param = line.join(" ");
	if (cmd.trim() == "") {
		return;
	} else if (commandList.includes(cmd)) {
		eval(cmd + "(\'" + param + "\')");
	} else {
		addLine("<span class='error'>Command not found. For a list of commands, type <span class='command'>'man'</span>.</span>", "error", 0);
	}
}

// adds a new line above the textbox element
function addLine(text, style) {
	var next = document.createElement("p");
	next.innerHTML = text;
	next.className = style;

	before.parentNode.insertBefore(next, before);

	if (window.screen.width > 780) {
		window.scrollTo(0, document.body.offsetHeight);
	}
}

// updates the command prompt based on user and current directory
function updateCmdPrompt() {
	var end = "$&nbsp";
	var location = "/" + currentDir.join("/");
	if (user == "root") {
		end = "# ";
	}
	if ((currentDir[0] == "home" && currentDir[1] == user && currentDir.length == 2) || (currentDir[0] == user && user == "root" && currentDir.length == 1)) {
		location = "~";
	}
	cmdprompt.innerHTML = user + "@rinOS:" + location + end;
}

// updates the site title to match the output of "pwd"
function updateTitle() {
	document.title = unparsePath(currentDir);
}

// updates the commandList variable to match with the /bin folder
function updateCommandList() {
	let bin = getObject(["bin"]);
	if (bin == undefined) {
		return;
	}
	commandList = Object.keys(bin);
}

// locks user input and simulates typewriter effect with input
function autoType(input) {
	disableInput = true;
	var delay = 80; // delay in ms between chars
	input = input.split("");
	var autoTyper = setInterval(function () {
		command.innerText += input.shift();
		if (input.length < 1) {
			clearInterval(autoTyper);
			addLine(cmdprompt.innerText + command.innerText);
			readLine(command.innerText);
			command.innerText = "";
			disableInput = false;
		}
	}, delay);
}

// returns a list of elements to be used in certain commands
function getList(arr, style) {
	if (typeof style == "string") {
		style = new Array(arr.length).fill(style);
	}
	var output = "";
	for (let i = 0; i < arr.length; i++) {
		output += "<li class=\"" + style[i] + "\">" + arr[i] + "</li>";
	}
	return (output);
}