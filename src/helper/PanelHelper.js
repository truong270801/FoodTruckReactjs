// panelHelpers.js

export function closePanel() {
    var elm = document.querySelector(".wrapper .left-panel");
    if (elm) {
      elm.style.left = "-100%";
    }
    document.querySelector(".wrapper .open-panel").style.display = "flex";
  }
  
  export function openPanel() {
    var elm = document.querySelector(".wrapper .left-panel");
    if (elm) {
      elm.style.left = "1rem";
    }
  }
  