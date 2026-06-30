





/**
 * SteadyGo API - Centralized service for fetching events and managing data fallback.
 */



// Constants
const SteadyGoAPI = {
    API_KEY: "512a334322fe409fbbfb9da05c29440a",
    UID: "21769447",









    // Mock data if Open Agenda is Offline
    MOCK_EVENTS: [
        {
            title: "Festival des Arts",
            category: "Festival",
            date: "29 Avril 2026",
            location: { name: "127 Blvd Taschereau, Marseille" },
            image: "./assets/img/festival.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Soirée Jazz au Vieux-Port",
            category: "Concert",
            date: "05 Mai 2026",
            location: { name: "Vieux Port, Marseille" },
            image: "./assets/img/concert.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Tournoi de Tennis SteadyGo",
            category: "Sportif",
            date: "12 Mai 2026",
            location: { name: "Corniche Kennedy, Marseille" },
            image: "./assets/img/sportif - tennis.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Sortie Pique-Nique en Famille",
            category: "Famille",
            date: "15 Mai 2026",
            location: { name: "Parc Borély, Marseille" },
            image: "./assets/img/famille.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Grand Concert Électro",
            category: "Concert",
            date: "22 Mai 2026",
            location: { name: "Le Dôme, Marseille" },
            image: "./assets/img/concert.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Raid VTT Urbain",
            category: "Sportif",
            date: "28 Mai 2026",
            location: { name: "Luminy, Marseille" },
            image: "./assets/img/sportif - tennis.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Foire de Printemps",
            category: "Festival",
            date: "02 Juin 2026",
            location: { name: "Esplanade de la Major, Marseille" },
            image: "./assets/img/festival.jpg",
            registration: [{ value: "https://openagenda.com" }]
        },
        {
            title: "Chasse au Trésor des Minots",
            category: "Famille",
            date: "06 Juin 2026",
            location: { name: "Palais Longchamp, Marseille" },
            image: "./assets/img/famille.jpg",
            registration: [{ value: "https://openagenda.com" }]
        }
    ],







    /**
     * Resolve Assets Path
     */


    // Folder Nav for assets
    getAssetPath(relativePath) {
        if (!relativePath) return "";
        const isSubPage = window.location.pathname.includes('/html/');
        if (isSubPage) {
            return relativePath.replace(/^\.\//, '../');
        }
        return relativePath;
    },







    /**
     * Helper to parse French date into ISO YYYY-MM-DD
     */
    parseMockDate(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.trim().split(" ");
        if (parts.length < 2) return "";
        const day = parts[0].padStart(2, "0");
        const monthName = parts[1].toLowerCase();
        const year = parts[2] || new Date().getFullYear();
        
        const months = {
            "janvier": "01", "février": "02", "mars": "03", "avril": "04", "mai": "05", "juin": "06",
            "juillet": "07", "août": "08", "septembre": "09", "octobre": "10", "novembre": "11", "décembre": "12"
        };
        const month = months[monthName] || "04";
        return `${year}-${month}-${day}`;
    },

    /**
     * Format ISO date string into French date (e.g. '30 Juin' or '30 Juin 2026')
     */
    formatDate(isoString, includeYear = false) {
        if (!isoString) return "";
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return "";
        const day = d.getDate();
        const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        const monthName = months[d.getMonth()] || "Avril";
        return includeYear ? `${day} ${monthName} ${d.getFullYear()}` : `${day} ${monthName}`;
    },










    /**
     * Fetch events from OpenAgenda API or fallback to mock data
     */



     // Cache reset Eco
    async loadEvents() {
        const CACHE_KEY = "steadygo_events_cache";
        const CACHE_TIME_KEY = "steadygo_events_cache_time";
        const CACHE_DURATION = 15 * 60 * 1000; // for 15 min cache 



        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();





        // Calculate cache is under 15 minutes
        if (cachedData && cachedTime && (now - cachedTime < CACHE_DURATION)) {
            return JSON.parse(cachedData);
        }


        // Mock if no API key or UID
        if (!this.API_KEY || !this.UID) {
            return this.MOCK_EVENTS;
        }



        // API Call
        const url = `https://api.openagenda.com/v2/agendas/${this.UID}/events?key=${this.API_KEY}&monolingual=fr&detailed=1&relative%5B0%5D=current&relative%5B1%5D=upcoming&size=100`;




        try {
            console.log(" Requête Open Agenda ");
            const response = await fetch(url);


            if (!response.ok) {
                throw new Error(`HTTP Erreur: ${response.status}`);
            }
            const data = await response.json();
            const events = data.events || [];
            const result = events.length === 0 ? this.MOCK_EVENTS : events;



            // Cache result
            localStorage.setItem(CACHE_KEY, JSON.stringify(result));
            localStorage.setItem(CACHE_TIME_KEY, now.toString());

            return result;
        } catch (error) {
            console.warn("Failed to load events from OpenAgenda. Trying cached fallback.", error);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            return this.MOCK_EVENTS;
        }
    },

    /**
     * Centralized helper to analyze event titles, resolve category, color, and correctly format images.
     * Prevents code duplication across carousel.js, event_page.js, and map.js.
     */


    getEventDetails(event) {
        const title = event.title?.fr || event.title || event.name || "Événement SteadyGo";
        const titleText = title.toLowerCase();
        
        let category = "Festival";
        let color = "#B000FF";
        let fallbackImg = "./assets/img/festival.jpg";
        
        if (titleText.includes("concert") || titleText.includes("jazz") || titleText.includes("musique")) {
            category = "Concert";
            color = "#FF2975";
            fallbackImg = "./assets/img/concert.jpg";
        } else if (titleText.includes("sport") || titleText.includes("tennis") || titleText.includes("marathon") || titleText.includes("vélo") || titleText.includes("ride") || titleText.includes("challenge")) {
            category = "Sportif";
            color = "#17FF62";
            fallbackImg = "./assets/img/sportif - tennis.jpg";
        } else if (titleText.includes("famille") || titleText.includes("enfant") || titleText.includes("atelier")) {
            category = "Famille";
            color = "#FFD319";
            fallbackImg = "./assets/img/famille.jpg";
        }





        // Resolve image URL
        let image = this.getAssetPath(fallbackImg);
        if (event.image) {
            if (typeof event.image === "string") {
                image = event.image.startsWith("http") ? event.image : this.getAssetPath(event.image);
            } else if (event.image.base && event.image.filename) {
                image = event.image.base + event.image.filename;
            } else if (event.image.square) {
                image = this.getAssetPath(event.image.square);
            } else if (event.image.original) {
                image = this.getAssetPath(event.image.original);
            }
        }

        return {
            title,
            category,
            color,
            image,
            fallbackImage: this.getAssetPath(fallbackImg)
        };
    }
};
