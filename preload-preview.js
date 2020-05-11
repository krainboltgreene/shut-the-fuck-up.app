// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {remote} = require("electron")

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("display-name").innerText = window.location.hash

  let remaining = 5;

  setInterval(() => document.getElementById("countdown").innerText = remaining -= 1, 1000)

  setTimeout(() => remote.getCurrentWindow().close(), remaining * 1000)
})
