document.addEventListener('DOMContentLoaded', function() {





    // ----------------- INITIALIZE MAP VIEW ----------------- 







    // Map configuration
    var myMap = L.map('map').setView([43.2965, 5.3698], 13); // Coordinates Marseille

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(myMap);






    // ----------------- CONFIG & STATE ----------------- 





    // Config
    const OPENAGENDA_API_KEY = "512a334322fe409fbbfb9da05c29440a";
    const OPENAGENDA_UID = "21769447";

    var eventList = [];
    var savedDateStr = sessionStorage.getItem('steadyGoSelectedDate');
    var selectedFilterDate = savedDateStr ? new Date(savedDateStr) : new Date();
    var selectedFilterCategory = "Tous";
    var rawApiEvents = [];





    // Mock events
    const MOCK_EVENTS = [
        {
            name: "Festival des Arts",
            date: "29 Avril",
            location: "127 Blvd Taschereau, Marseille",
            image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
            gps: [43.2965, 5.3698],
            type: "Festival",
            color: "#B000FF",
            bookingUrl: "https://openagenda.com"
        },
        {
            name: "Soirée Jazz",
            date: "05 Mai",
            location: "Vieux Port, Marseille",
            image: "https://images.unsplash.com/photo-1511192303578-4a7b974a4286?w=400",
            gps: [43.2850, 5.3750],
            type: "Concert",
            color: "#FF2975",
            bookingUrl: "https://openagenda.com"
        },
        {
            name: "Marathon Marseille",
            date: "12 Mai",
            location: "Corniche Kennedy, Marseille",
            image: "https://images.unsplash.com/photo-1530549387631-afb168514626?w=400",
            gps: [43.3000, 5.3800],
            type: "Sportif",
            color: "#17FF62",
            bookingUrl: "https://openagenda.com"
        },
        {
            name: "Sortie Famille Parc",
            date: "15 Mai",
            location: "Parc Borély, Marseille",
            image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400",
            gps: [43.2600, 5.3800],
            type: "Famille",
            color: "#FFD319",
            bookingUrl: "https://openagenda.com"
        }
    ];






    // ----------------- MARKERS ----------------- 




    // Markers render
    var markerGroup = L.layerGroup().addTo(myMap);





    // Marker points
    function displayPoints(chosenCategory) {
        
        markerGroup.clearLayers();

        for (var i = 0; i < eventList.length; i++) {
            var event = eventList[i];

            if (chosenCategory === "Tous" || event.type === chosenCategory) {
                
                var colorIcon = L.divIcon({
                    className: 'marker-style',
                    html: '<div style="background-color:' + event.color + '; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>',
                    iconSize: [15, 15]
                });

                var marker = L.marker(event.gps, { icon: colorIcon });




                // Open custom info popup on marker click
                marker.on('click', function(e) {
                    document.getElementById('popup-title').innerText = this.options.eventTitle;
                    document.getElementById('popup-date').innerText = this.options.eventDate;
                    document.getElementById('popup-address').innerText = this.options.eventLocation;
                    document.getElementById('popup-img').src = this.options.eventImage;

                    // Set reservation button click action to open the booking URL
                    var reserveBtn = document.querySelector('.popup-reserve-btn');
                    if (reserveBtn) {
                        var bookingUrl = this.options.eventBookingUrl;
                        reserveBtn.onclick = function() {
                            window.open(bookingUrl, '_blank');
                        };
                    }

                    var popupElement = document.getElementById('custom-popup');
                    popupElement.style.background = "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, " + this.options.eventColor + " 100%)";
                    popupElement.classList.add('active');
                });

                marker.options.eventTitle = event.name;
                marker.options.eventDate = event.date;
                marker.options.eventLocation = event.location;
                marker.options.eventImage = event.image;
                marker.options.eventColor = event.color;
                marker.options.eventBookingUrl = event.bookingUrl || "https://openagenda.com";

                marker.addTo(markerGroup);
            }
        }
    }






    // ------------------ CATEGORY SELECTOR CONTROLS ------------------ 




    // Menu selectors
    var menuBtn = document.getElementById('categories-btn');
    var menuList = document.getElementById('categories-menu');
    var menuOptions = document.getElementsByClassName('category-option');




    // Dropdown toggle
    menuBtn.addEventListener('click', function() {
        menuList.classList.toggle('active');
    });




    // Category filters
    for (var j = 0; j < menuOptions.length; j++) {
        menuOptions[j].addEventListener('click', function() {
            var categoryName = this.getAttribute('data-category');
            
            menuBtn.innerText = categoryName;

            selectedFilterCategory = categoryName;
            filterAndDisplayPoints();

            menuList.classList.remove('active');
        });
    }






    // ------------------ EVENT POPUP DISMISSAL ------------------ 




    var closePopupBtn = document.querySelector('.close-popup');
    
    closePopupBtn.addEventListener('click', function() {
        document.getElementById('custom-popup').classList.remove('active');
    });

    myMap.on('click', function() {
        document.getElementById('custom-popup').classList.remove('active');
    });






    // ------------------ UTILITY FUNCTIONS ------------------ 




    // (Local parseMockDate removed, using SteadyGoAPI.parseMockDate instead)





    // Filter points
    function filterAndDisplayPoints() {
        var targetDate = new Date(selectedFilterDate);
        targetDate.setHours(0, 0, 0, 0);

        eventList = rawApiEvents.filter(function(event) {
            if (selectedFilterCategory !== "Tous" && event.type !== selectedFilterCategory) {
                return false;
            }

            if (event.rawTimings && event.rawTimings.length > 0) {
                return event.rawTimings.some(function(timing) {
                    var startStr = timing.begin || timing.start;
                    if (!startStr) return false;
                    var startDate = new Date(startStr);
                    startDate.setHours(0, 0, 0, 0);
                    var endDate = new Date(timing.end);
                    endDate.setHours(0, 0, 0, 0);
                    return targetDate >= startDate && targetDate <= endDate;
                });
            }

            if (event.rawDate) {
                if (event.rawDate.includes("-")) {
                    var eventDate = new Date(event.rawDate);
                    eventDate.setHours(0, 0, 0, 0);
                    return eventDate.getTime() === targetDate.getTime();
                } else {
                    var dateStr = SteadyGoAPI.parseMockDate(event.rawDate);
                    if (dateStr) {
                        var eventDate = new Date(dateStr);
                        eventDate.setHours(0, 0, 0, 0);
                        return eventDate.getTime() === targetDate.getTime();
                    }
                }
            }

            return true;
        });

        displayPoints("Tous");
    }






    // ------------------ LOAD DYNAMIC EVENTS DATA ------------------ 




    // Init map events
    async function initMapEvents() {
        if (!OPENAGENDA_API_KEY || !OPENAGENDA_UID) {
            rawApiEvents = MOCK_EVENTS.map(function(ev) {
                return {
                    name: ev.name,
                    date: ev.date,
                    location: ev.location,
                    image: ev.image,
                    gps: ev.gps,
                    type: ev.type,
                    color: ev.color,
                    rawDate: ev.date,
                    bookingUrl: ev.bookingUrl || "https://openagenda.com"
                };
            });
            filterAndDisplayPoints();
            return;
        }


        // Api events loading
        const url = `https://api.openagenda.com/v2/agendas/${OPENAGENDA_UID}/events?key=${OPENAGENDA_API_KEY}&monolingual=fr&detailed=1&relative%5B0%5D=current&relative%5B1%5D=upcoming&size=100`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("API Error");
            const data = await response.json();
            const apiEvents = data.events || [];

            if (apiEvents.length === 0) {
                rawApiEvents = MOCK_EVENTS.map(function(ev) {
                    return {
                        name: ev.name,
                        date: ev.date,
                        location: ev.location,
                        image: ev.image,
                        gps: ev.gps,
                        type: ev.type,
                        color: ev.color,
                        rawDate: ev.date,
                        bookingUrl: ev.bookingUrl || "https://openagenda.com"
                    };
                });
            } else {


                rawApiEvents = apiEvents.map(event => {
                    const { title, category, color, image } = SteadyGoAPI.getEventDetails(event);
                    let lat = event.location?.latitude || 43.2965;
                    let lng = event.location?.longitude || 5.3698;
                    const startStr = event.timings?.[0]?.begin || event.timings?.[0]?.start;

                    return {
                        name: title,
                        date: event.dateRange || (startStr ? SteadyGoAPI.formatDate(startStr) : "Prochainement"),
                        location: event.location?.name || event.location?.address || "Marseille",
                        image: image,
                        gps: [lat, lng],
                        type: category,
                        color: color,
                        rawTimings: event.timings,
                        rawDate: startStr,
                        bookingUrl: event.registration?.[0]?.value || (event.slug ? `https://openagenda.com/steadygo/events/${event.slug}` : "") || "https://openagenda.com"
                    };
                });
            }





        } catch (error) {
            console.warn("Could not load OpenAgenda events for map. Using offline mock.", error);
            rawApiEvents = MOCK_EVENTS.map(function(ev) {
                return {
                    name: ev.name,
                    date: ev.date,
                    location: ev.location,
                    image: ev.image,
                    gps: ev.gps,
                    type: ev.type,
                    color: ev.color,
                    rawDate: ev.date,
                    bookingUrl: ev.bookingUrl || "https://openagenda.com"
                };
            });
        }
        filterAndDisplayPoints();
    }


    // Listen to date changed event
    document.addEventListener("steadyGoDateChanged", function(e) {
        selectedFilterDate = e.detail;
        filterAndDisplayPoints();
    });







    // Init map events
    initMapEvents();

});
