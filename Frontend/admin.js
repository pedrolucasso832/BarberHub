document.addEventListener("DOMContentLoaded", () => {
    const adminMenuToggle = document.getElementById("adminMenuToggle");
    const adminSidebar = document.getElementById("adminSidebar");

    adminMenuToggle.addEventListener("click", () => {
        adminSidebar.classList.toggle("active");
    });
});