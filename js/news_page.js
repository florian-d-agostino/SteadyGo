



document.addEventListener("DOMContentLoaded", () => {
    const subscribeForm = document.getElementById("subscribe-form");
    const unsubscribeForm = document.getElementById("unsubscribe-form");
    const unsubscribeCheckbox = document.getElementById("unsubscribe-checkbox");





    // Get subscribers
    function getStoredSubscribers() {
        const stored = localStorage.getItem("novavilla_newsletter_subscribers");
        return stored ? JSON.parse(stored) : [];
    }





    // Save suscrbiers
    function saveSubscribers(list) {
        localStorage.setItem("novavilla_newsletter_subscribers", JSON.stringify(list));
    }



    // Registration form
    if (subscribeForm) {
        subscribeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("subscribe-email");
            const email = emailInput.value.trim();


            // Add subscribers
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







    // Unsubscribe form
    if (unsubscribeForm) {
        unsubscribeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("unsubscribe-email");
            const email = emailInput.value.trim();






            // Remove subscribers
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

