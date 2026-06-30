document.addEventListener("DOMContentLoaded", () => {





    // --- DOM SELECTORS ---
    const carouselContainer = document.getElementById("events-container");
    const gridContainer = document.getElementById("events-grid");
    const prevBtn = document.getElementById("prev-event");
    const nextBtn = document.getElementById("next-event");
    const categoriesBtn = document.getElementById("categories-btn");
    const categoriesMenu = document.getElementById("categories-menu");
    const categoryOptions = document.querySelectorAll(".category-option");




    // Carousel state
    let currentIndex = 0;
    let originalEventsList = [];
    let activeCategory = "Tous";

    let savedDateStr = sessionStorage.getItem('steadyGoSelectedDate');
    let selectedDate = savedDateStr ? new Date(savedDateStr) : new Date();






    // ---------------- PAGE INITIALIZATION ---------------- 




    async function initPage() {
        if (categoriesBtn) {
            categoriesBtn.addEventListener("click", () => {
                categoriesMenu.classList.toggle("active");
            });
        }

        // Close category click outside
        document.addEventListener("click", (e) => {
            if (categoriesBtn && categoriesMenu && !categoriesBtn.contains(e.target) && !categoriesMenu.contains(e.target)) {
                categoriesMenu.classList.remove("active");
            }
        });



        // Category filter click handler
        categoryOptions.forEach(option => {
            option.addEventListener("click", () => {
                activeCategory = option.getAttribute("data-category");
                categoriesBtn.innerText = activeCategory === "Tous" ? "Catégories" : activeCategory;
                categoriesMenu.classList.remove("active");
                filterAndRender();
            });
        });

        console.log("Connecting to SteadyGo API...");
        originalEventsList = await SteadyGoAPI.loadEvents();
        filterAndRender();
    }





    // ------------------- FILTER AND RENDER ENGINE ------------------- 




    // Filter events
    function filterAndRender() {
        const targetDate = new Date(selectedDate);
        targetDate.setHours(0, 0, 0, 0);

        const dateFilteredEvents = originalEventsList.filter(event => {
            if (event.timings && event.timings.length > 0) {
                return event.timings.some(timing => {
                    const startStr = timing.begin || timing.start;
                    if (!startStr) return false;
                    const startDate = new Date(startStr);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(timing.end);
                    endDate.setHours(0, 0, 0, 0);
                    return targetDate >= startDate && targetDate <= endDate;
                });
            }

            const dateStr = event.date;
            if (dateStr) {
                if (dateStr.includes("-")) {
                    const eventDate = new Date(dateStr);
                    eventDate.setHours(0, 0, 0, 0);
                    return eventDate.getTime() === targetDate.getTime();
                } else {
                    const eventDateStr = SteadyGoAPI.parseMockDate(dateStr);
                    if (eventDateStr) {
                        const eventDate = new Date(eventDateStr);
                        eventDate.setHours(0, 0, 0, 0);
                        return eventDate.getTime() === targetDate.getTime();
                    }
                }
            }
            return true;
        });





        // Map data structure
        const mappedEvents = dateFilteredEvents.map(event => {
            const { title, category, image } = SteadyGoAPI.getEventDetails(event);
            const startStr = event.timings?.[0]?.begin || event.timings?.[0]?.start;
            const dateStr = event.dateRange || (startStr ? SteadyGoAPI.formatDate(startStr, true) : "Prochainement");

            return {
                title,
                category,
                date: event.date || dateStr,
                address: event.location?.name || event.location?.address || event.address || "Marseille",
                image,
                bookingUrl: event.registration?.[0]?.value || event.bookingUrl || "#"
            };
        });





        // Filter events by category
        const eventsToShow = activeCategory === "Tous"
            ? mappedEvents
            : mappedEvents.filter(e => e.category === activeCategory);

        renderCarousel(eventsToShow);
        renderGrid(eventsToShow);
    }

    // Custom date changed event
    document.addEventListener("steadyGoDateChanged", (e) => {
        selectedDate = e.detail;
        filterAndRender();
    });






    // --------------------- CAROUSEL RENDERING --------------------- 




    // Carousel events renderer
    function renderCarousel(events) {
        carouselContainer.innerHTML = "";
        currentIndex = 0;

        if (events.length === 0) {
            carouselContainer.innerHTML = `
                <li class="main-card empty">
                    <section>
                        <h3>Aucun événement</h3>
                        <p>Il n'y a aucun événement planifié à partir de cette date dans cette catégorie.</p>
                    </section>
                </li>
            `;
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
            return;
        }

        events.forEach(event => {
            const cardHTML = `
                <li class="main-card">
                    <header class="card-header">${event.title}</header>
                    <section class="card-body">
                        <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='../assets/map.png';">
                    </section>
                    <footer class="card-footer">
                        ${event.address}
                        <button class="button-booking" onclick="window.open('${event.bookingUrl}', '_blank')">Reservation</button>
                    </footer>
                </li>
            `;
            carouselContainer.insertAdjacentHTML("beforeend", cardHTML);
        });

        initSwitcherControls(events.length);
    }




    // Toggle switcher arrow visibility
    function initSwitcherControls(length) {
        if (length <= 1) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
        } else {
            if (prevBtn) prevBtn.style.display = "flex";
            if (nextBtn) nextBtn.style.display = "flex";
        }
        updateSwitcher(length);
    }




    // Update carousel slider position
    function updateSwitcher(length) {
        const offset = currentIndex * -100;
        carouselContainer.style.transform = `translateX(${offset}%)`;

        if (prevBtn && nextBtn) {
            prevBtn.classList.toggle("disabled", currentIndex === 0);
            nextBtn.classList.toggle("disabled", currentIndex === length - 1);
        }
    }

    // Carousel navigation
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const length = carouselContainer.querySelectorAll(".main-card").length;
            if (currentIndex > 0) {
                currentIndex--;
                updateSwitcher(length);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const length = carouselContainer.querySelectorAll(".main-card").length;
            if (currentIndex < length - 1) {
                currentIndex++;
                updateSwitcher(length);
            }
        });
    }






    // --------------------- EVENT GRID RENDERING --------------------- 




    // Render grid
    function renderGrid(events) {
        gridContainer.innerHTML = "";

        if (events.length === 0) {
            gridContainer.innerHTML = `
                <section class="empty-grid-message">
                    <p>Aucun événement dans cette catégorie pour le moment.</p>
                </section>
            `;
            return;
        }

        events.forEach(event => {
            const catClass = event.category.toLowerCase();
            const gridCardHTML = `
                <article class="event-grid-card ${catClass} fade-in">
                    <figure class="grid-card-img-wrapper">
                        <img src="${event.image}" alt="${event.title}" onerror="this.src='../assets/map.png';">
                        <span class="category-badge ${catClass}">${event.category}</span>
                    </figure>
                    <section class="grid-card-content">
                        <h3 class="grid-card-title">${event.title}</h3>
                        <footer class="grid-card-meta">
                            <p class="grid-card-date"><i class="fa-regular fa-calendar-days"></i> ${event.date}</p>
                            <p class="grid-card-address"><i class="fa-solid fa-location-dot"></i> ${event.address}</p>
                        </footer>
                        <button class="button-booking" onclick="window.open('${event.bookingUrl}', '_blank')">Reservation</button>
                    </section>
                </article>
            `;
            gridContainer.insertAdjacentHTML("beforeend", gridCardHTML);
        });
    }




    // initialization
    initPage();
});
