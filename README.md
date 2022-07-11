# [mxple.github.io](https://mxple.github.io)
A UNIX-like web terminal featuring a virtual filesystem, common UNIX commands, and lots of eye candy - all powered by Javascript. Live website: **https://mxple.github.io**

<img width="893" alt="image" src="https://user-images.githubusercontent.com/83033020/178164741-47708790-aacf-4e9d-bd00-eca22c5dc611.png">

## Features
- Virtual filesystem using JSON objects
- Common UNIX commands to navigate, read, and write to the filesystem
- Familiar CTRL+L and CTRL+C behavior
- Hidden easter eggs like `rm -rf`
- Aesthetic colors including a rainbow `neofetch` command

## Quick start
To build, simply clone the repository and use a host such as `http-server` to get started:
```zsh
$ git clone https://github.com/Mxple/mxple.github.io
$ cd mxple.github.io
$ http-server
```

## Configuring
To add commands, create a function by the exact name of the command (must be lowercase) in `/js/commands.js` and add the function to the `FS[bin]` object (in `/js/fs.js`. The three main functions below should be able to handle all needs related to manipulating files or outputting text:
```js
// takes a path string and returns a path array ex. "/home/guest" --> ["home","guest"]
parsePath(text: string) --> array

// returns reference to object in path, return undefined if the path is invalid
getObject(path: array) --> object reference

// adds the input text as a new line (uses .innerHTML) and pushes the command prompt down
addLine(text: string, style: string) --> none
```

## Contribute
Pull requests, issues, forking, feature-requests, are all welcome. Feel free to use the code from this site with appropriate credit/permissions.

## Credit
Color scheme is [Dracula](https://github.com/dracula/dracula-theme)

glitch-execute.js is from [Commando](https://github.com/commodo/glitch-animation-effect)

glitch.js library is from [Simon Hewitt](https://github.com/sjhewitt/glitch.js)

html2canvas library is from [Niklas von Hertzen](https://github.com/niklasvh/html2canvas)

Initial code foundation from [Forrest Knight](https://github.com/ForrestKnight)

Design and inspiration from [m4tt72](https://github.com/m4tt72/terminal)

## TODO list
- Adding .ico page icon
- Tab autocompletion
- Better formatting of the list commands
- Adding different users (root)
- More genuine command behaviors 

## Password
<details> 
  <summary>The password for the <code>sudo</code> command: </summary>
   strawberry 
</details>
