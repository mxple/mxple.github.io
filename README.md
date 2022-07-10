# mxple.github.io
A UNIX-like web terminal featuring a virtual filesystem, common UNIX commands, and lots of eye candy - all powered by Javascript. Live website: https://mxple.github.io
<img width="893" alt="image" src="https://user-images.githubusercontent.com/83033020/178164723-c651c5e3-0c38-4c5b-9e0e-cb233f850b63.png">

## Configuring
To build, simply clone the repository and use a host such as `http-server` to get started. All commands can be in `js/commands.js`. 

To add your own command, in addition to writing the JS function, you must add the command to the `/bin` folder in the `FS` vaariable found in `js/FS.js`.

To change the color scheme or color-coding, 9 color variables are used in `css/style.css` and can be adjusted as seen fit.

### Important functions
To add a line to the terminal output, use `addLine(<HTML text>,<style / class>)`.

To autotype a line using the typewriter effect, use `autoType(<text>)`.


*More documentation coming soon*

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
- Better formatting of the list commands
- Adding different users (root)
- More genuine command behaviors 

## Password
<details> 
  <summary>The password for the <code>sudo</code> command: </summary>
   strawberry 
</details>
