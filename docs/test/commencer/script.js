 document.addEventListener("DOMContentLoaded", () => {
        const toggler = document.querySelector(".sidebar-toggler");
        const sidebar = document.getElementById("sidebar");
        toggler.addEventListener("click", () => {
          sidebar.classList.toggle("active");
        });
      });