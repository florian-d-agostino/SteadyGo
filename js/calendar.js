document.addEventListener('DOMContentLoaded', function() {


    // --- DOM ELEMENTS ---
    const calendarBtn = document.querySelector('.calendar-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const daysGrid = document.getElementById('calendar-days');
    const monthYearText = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const dateTextZone = document.getElementById('date-text');
    const prevDayBtn = document.querySelector('.arrow-btn-prev');
    const nextDayBtn = document.querySelector('.arrow-btn-next');






    // --- STATE VARIABLES ---
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    let savedDate = localStorage.getItem('novaVillaSelectedDate');
    
    let selectedDate;
    if (savedDate) {
        selectedDate = new Date(savedDate);
    } else {
        selectedDate = new Date("2026-04-29");
    }

    let displayMonthDate = new Date(selectedDate);





    // --- UI RENDERING ---

    // Update text display in date navigation bar
    function refreshDateBarText() {
        let day = selectedDate.getDate();
        let month = monthNames[selectedDate.getMonth()].toLowerCase();
        let year = selectedDate.getFullYear();

        dateTextZone.innerText = day + " " + month + " " + year;
    }

    // Render calendar grid days
    function renderCalendar() {
        daysGrid.innerHTML = '';
        
        let year = displayMonthDate.getFullYear();
        let month = displayMonthDate.getMonth();
        
        monthYearText.innerText = monthNames[month] + " " + year;

        let firstDayOfMonth = new Date(year, month, 1).getDay();
        let offset;
        if (firstDayOfMonth === 0) {
            offset = 6;
        } else {
            offset = firstDayOfMonth - 1;
        }

        let lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        // Render empty cell offsets
        for (let i = 0; i < offset; i++) {
            let emptyCell = document.createElement('div');
            emptyCell.classList.add('day');
            emptyCell.classList.add('empty');
            daysGrid.appendChild(emptyCell);
        }

        let today = new Date();

        // Render month days
        for (let i = 1; i <= lastDayOfMonth; i++) {
            let dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.innerText = i;

            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayCell.classList.add('selected');
            }

            // Click day selection handler
            dayCell.addEventListener('click', function() {
                selectedDate = new Date(year, month, i);
                
                localStorage.setItem('novaVillaSelectedDate', selectedDate.toISOString());
                
                refreshDateBarText();
                closeCalendar();
                document.dispatchEvent(new CustomEvent('novaVillaDateChanged', { detail: selectedDate }));
            });

            daysGrid.appendChild(dayCell);
        }
    }







    // --- MODAL MANAGEMENT ---

    // Open calendar picker modal
    function openCalendar() {
        calendarModal.style.display = 'flex';
        setTimeout(function() {
            calendarModal.classList.add('active');
        }, 10);
        renderCalendar();
    }

    // Close calendar picker modal
    function closeCalendar() {
        calendarModal.classList.remove('active');
        setTimeout(function() {
            calendarModal.style.display = 'none';
        }, 300);
    }







    // --- EVENT LISTENERS ---

    // Open/close click bindings
    calendarBtn.addEventListener('click', openCalendar);
    
    calendarModal.addEventListener('click', function(event) {
        if (event.target === calendarModal) {
            closeCalendar();
        }
    });

    // Month nav button bindings
    prevMonthBtn.addEventListener('click', function() {
        displayMonthDate.setMonth(displayMonthDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        displayMonthDate.setMonth(displayMonthDate.getMonth() + 1);
        renderCalendar();
    });

    // Date nav day-subtraction binding
    prevDayBtn.addEventListener('click', function() {
        selectedDate.setDate(selectedDate.getDate() - 1);
        localStorage.setItem('novaVillaSelectedDate', selectedDate.toISOString());
        refreshDateBarText();
        displayMonthDate = new Date(selectedDate);
        renderCalendar();
        document.dispatchEvent(new CustomEvent('novaVillaDateChanged', { detail: selectedDate }));
    });

    // Date nav day-addition binding
    nextDayBtn.addEventListener('click', function() {
        selectedDate.setDate(selectedDate.getDate() + 1);
        localStorage.setItem('novaVillaSelectedDate', selectedDate.toISOString());
        refreshDateBarText();
        displayMonthDate = new Date(selectedDate);
        renderCalendar();
        document.dispatchEvent(new CustomEvent('novaVillaDateChanged', { detail: selectedDate }));
    });






    // --- BOOTSTRAP INITIALIZATION ---
    refreshDateBarText();
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('novaVillaDateChanged', { detail: selectedDate }));
    }, 100);
});
