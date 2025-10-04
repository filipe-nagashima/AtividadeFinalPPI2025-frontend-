document.addEventListener("DOMContentLoaded", function() {
  const menuContainer = document.getElementById("menu");

  fetch("menu.html")
    .then(response => response.text())
    .then(data => {
      
      menuContainer.innerHTML = data;
    })
});