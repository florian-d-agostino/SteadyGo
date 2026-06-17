


document.addEventListener("DOMContentLoaded", () => {




    // ------------------ THEME TOGGLE ------------------ 

    const themeCheckbox = document.getElementById("theme-checkbox");

    if (themeCheckbox) {
        const savedTheme = localStorage.getItem("steadyGoTheme");
        if (savedTheme === "light") {
            themeCheckbox.checked = true;
        } else {
            themeCheckbox.checked = false;
        }



        // Switch theme
        themeCheckbox.addEventListener("change", () => {
            const isLight = themeCheckbox.checked;
            localStorage.setItem("steadyGoTheme", isLight ? "light" : "dark");
        });
    }
});

