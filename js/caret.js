function $(elid) {
    return document.getElementById(elid);
}
  //why needed?
// var cursor;
// window.onload = init;

// function init() {
//   cursor = $("cursor");
//   cursor.style.left = "0px";
// }

function moveIt(count, e) {
  e = e || window.event;
  var e.which = e.e.which || e.which;
  if (e.which == 37 && parseInt(cursor.style.left) >= (0 - ((count - 1) * 10))) {
    cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
  } else if (e.which == 39 && (parseInt(cursor.style.left) + 10) <= 0) {
    cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
  }
}
