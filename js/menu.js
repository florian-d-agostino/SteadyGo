document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle checkbox element
    const themeCheckbox = document.getElementById("theme-checkbox");

    if (themeCheckbox) {
        // Load saved theme preference
        const savedTheme = localStorage.getItem("novaVillaTheme");
        if (savedTheme === "light") {
            themeCheckbox.checked = true;
        } else {
            themeCheckbox.checked = false;
        }

        // Save theme changes on toggle
        themeCheckbox.addEventListener("change", () => {
            const isLight = themeCheckbox.checked;
            localStorage.setItem("novaVillaTheme", isLight ? "light" : "dark");
        });
    }
});

