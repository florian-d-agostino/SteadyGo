




document.addEventListener("DOMContentLoaded", () => {




    // ------------------ NEWSLETTER HANDLER ------------------ 

    const subscribeForm = document.getElementById("subscribe-form");
    const unsubscribeForm = document.getElementById("unsubscribe-form");
    const unsubscribeCheckbox = document.getElementById("unsubscribe-checkbox");


    // Local storage email
    function getStoredSubscribers() {
        const stored = localStorage.getItem("novavilla_newsletter_subscribers");
        return stored ? JSON.parse(stored) : [];
    }


    // Local storage email update
    function saveSubscribers(list) {
        localStorage.setItem("novavilla_newsletter_subscribers", JSON.stringify(list));
    }


    // Subscribe newsletter
    if (subscribeForm) {
        subscribeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("subscribe-email");
            const email = emailInput.value.trim();

            if (email) {
                const subscribers = getStoredSubscribers();
                if (subscribers.includes(email)) {
                    alert("Cette adresse e-mail est déjà inscrite à la newsletter NovaVilla !");
                    return;
                }
                subscribers.push(email);
                saveSubscribers(subscribers);
                alert("Inscription réussie ! Vous recevrez désormais les actualités NovaVilla par e-mail.");
                emailInput.value = "";
            }
        });
    }





    // Unsubscribe newsletter
    if (unsubscribeForm) {
        unsubscribeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("unsubscribe-email");
            const email = emailInput.value.trim();

            if (email) {
                const subscribers = getStoredSubscribers();
                if (!subscribers.includes(email)) {
                    alert("Cette adresse e-mail n'est pas inscrite à notre newsletter.");
                    return;
                }
                const updated = subscribers.filter(e => e !== email);
                saveSubscribers(updated);
                alert("Désinscription validée. Votre adresse e-mail a été supprimée avec succès.");
                emailInput.value = "";
                if (unsubscribeCheckbox) {
                    unsubscribeCheckbox.checked = false;
                }
            }
        });
    }
});
