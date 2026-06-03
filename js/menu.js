document.addEventListener("DOMContentLoaded", () => {
    const themeCheckbox = document.getElementById("theme-checkbox");

    if (themeCheckbox) {
        const savedTheme = localStorage.getItem("novaVillaTheme");
        if (savedTheme === "light") {
            themeCheckbox.checked = true;
        } else {
            themeCheckbox.checked = false;
        }

        themeCheckbox.addEventListener("change", () => {
            const isLight = themeCheckbox.checked;
            localStorage.setItem("novaVillaTheme", isLight ? "light" : "dark");
        });
    }
});

