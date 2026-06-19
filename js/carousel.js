document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements for switcher carousel
    const container = document.getElementById("events-container");
    const prevBtn = document.getElementById("prev-event");
    const nextBtn = document.getElementById("next-event");





    // Tracker for active slide and total slide count
    let currentIndex = 0;
    let totalCards = 0;





    // Event list state and date state
    let originalEventsList = [];
    let savedDateStr = localStorage.getItem('steadyGoSelectedDate');
    let selectedDate = savedDateStr ? new Date(savedDateStr) : new Date("2026-04-29");




    // Initialize switcher application
    async function initApp() {
        console.log("Connecting to SteadyGo API...");
        originalEventsList = await SteadyGoAPI.loadEvents();
        filterAndDisplayEvents();
    }





    // Filter events by selected date and render them
    function filterAndDisplayEvents() {
        const targetDate = new Date(selectedDate);
        targetDate.setHours(0, 0, 0, 0);

        const filtered = originalEventsList.filter(event => {
            if (event.timings && event.timings.length > 0) {
                return event.timings.some(timing => {
                    const endDate = new Date(timing.end);
                    endDate.setHours(0, 0, 0, 0);
                    return endDate >= targetDate;
                });
            }

            const dateStr = event.date;
            if (dateStr) {
                if (dateStr.includes("-")) {
                    const eventDate = new Date(dateStr);
                    eventDate.setHours(0, 0, 0, 0);
                    return eventDate >= targetDate;
                } else {
                    const eventDateStr = SteadyGoAPI.parseMockDate(dateStr);
                    if (eventDateStr) {
                        const eventDate = new Date(eventDateStr);
                        eventDate.setHours(0, 0, 0, 0);
                        return eventDate >= targetDate;
                    }
                }
            }
            return true;
        });

        renderEvents(filtered);
    }




    // Listen to custom date changed event
    document.addEventListener("steadyGoDateChanged", (e) => {
        selectedDate = e.detail;
        filterAndDisplayEvents();
    });





    // Render list of event cards inside the container
    function renderEvents(events) {
        currentIndex = 0;
        container.innerHTML = "";

        if (events.length === 0) {
            totalCards = 0;
            container.innerHTML = `
                <li class="main-card empty">
                    <section>
                        <h3><i class="fa-regular fa-calendar-xmark"></i> Aucun événement</h3>
                        <p>Il n'y a aucun événement planifié à partir de cette date.</p>
                    </section>
                </li>
            `;
            initSwitcherControls();
            return;
        }

        const eventsToDisplay = events.slice(0, 5);
        totalCards = eventsToDisplay.length;

        eventsToDisplay.forEach(event => {
            const { title, image, fallbackImage } = SteadyGoAPI.getEventDetails(event);
            const address = event.location?.name || event.location?.address || "Location unspecified";
            const bookingUrl = event.registration?.[0]?.value || `https://openagenda.com/steadygo/events/${event.slug}` || "#";

            const cardHTML = `
                <li class="main-card">
                    <header class="card-header">${title}</header>
                    <section class="card-body">
                        <img src="${image}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='${fallbackImage}';">
                    </section>
                    <footer class="card-footer">
                        ${address}
                        <button class="button-booking" onclick="window.open('${bookingUrl}', '_blank')">Reservation</button>
                    </footer>
                </li>
            `;
            container.insertAdjacentHTML("beforeend", cardHTML);
        });

        initSwitcherControls();
    }





    // Initialize switcher states from static HTML
    function initFromHTML() {
        const cards = container.querySelectorAll(".main-card");
        totalCards = cards.length;
        initSwitcherControls();
    }





    // Set visibility of carousel buttons and apply reset styles if needed
    function initSwitcherControls() {
        if (totalCards <= 1) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
            container.style.transform = "translateX(0%)";
            return;
        } else {
            if (prevBtn) prevBtn.style.display = "flex";
            if (nextBtn) nextBtn.style.display = "flex";
        }
        updateSwitcher();
    }





    // Slide carousel using CSS transform translation
    function updateSwitcher() {
        const offset = currentIndex * -100;
        container.style.transform = `translateX(${offset}%)`;

        prevBtn.classList.toggle("disabled", currentIndex === 0);
        nextBtn.classList.toggle("disabled", currentIndex === totalCards - 1);
    }





    // Click handler for previous event card button
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSwitcher();
        }
    });






    // Click handler for next event card button
    nextBtn.addEventListener("click", () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateSwitcher();
        }
    });






    // Listen to touch gestures for mobile swiping
    let touchStartX = 0;
    container.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX, { passive: true });

    container.addEventListener("touchend", e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50 && currentIndex < totalCards - 1) {
            currentIndex++;
            updateSwitcher();
        } else if (touchEndX > touchStartX + 50 && currentIndex > 0) {
            currentIndex--;
            updateSwitcher();
        }
    }, { passive: true });






    // Bootstrap app initialization
    initApp();
});
