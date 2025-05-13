// Wait for Simple Analytics to load
function waitForSimpleAnalytics(callback) {
    if (window.sa_loaded) {
        callback();
    } else {
        window.addEventListener('sa_loaded', callback);
    }
}

// Initialize analytics tracking
function initAnalytics() {
    // Track filter changes
    const dateFilter = document.getElementById('dateFilter');
    const locationFilter = document.getElementById('locationFilter');
    const artistFilter = document.getElementById('artistFilter');
    const selectionFilter = document.getElementById('selectionFilter');

    dateFilter.addEventListener('change', () => {
        sa_event('filter_date', { value: dateFilter.value });
    });

    locationFilter.addEventListener('change', () => {
        sa_event('filter_location', { value: locationFilter.value });
    });

    artistFilter.addEventListener('input', () => {
        sa_event('filter_artist', { value: artistFilter.value });
    });

    selectionFilter.addEventListener('change', () => {
        sa_event('filter_selection', { value: selectionFilter.value });
    });

    // Track event selection/deselection
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.addEventListener('click', (e) => {
        const eventCard = e.target.closest('[onclick*="toggleEventSelection"]');
        if (eventCard) {
            const eventId = eventCard.getAttribute('onclick').match(/'([^']+)'/)[1];
            const isSelected = window.selectedEvents.has(eventId);
            const event = window.allEvents.find(e => e.id === eventId);
            
            if (event) {
                event_name_clean = event.summary
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                    .replace(/[^a-zA-Z0-9_]/g, '_') // Replace special chars with underscore
                    .replace(/_+/g, '_') // Replace multiple underscores with single
                    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
                tracking_event_name = isSelected ? 'event_deselected' : 'event_selected' + '_' + event_name_clean;
                sa_event(tracking_event_name);
            }
        }
    });

    // Track details panel expansion/collapse
    const toggleDetails = document.getElementById('toggleDetails');
    toggleDetails.addEventListener('click', () => {
        const detailsSection = document.getElementById('stageDetails');
        const isExpanded = !detailsSection.classList.contains('hidden');
        sa_event(isExpanded ? 'details_expanded' : 'details_collapsed', {
            selected_events_count: window.selectedEvents.size
        });
    });

    // Track selection panel button clicks
    const downloadIcs = document.getElementById('downloadIcs');
    const addToCalendar = document.getElementById('addToCalendar');

    downloadIcs.addEventListener('click', () => {
        sa_event('download_ics_clicked', {
            selected_events_count: window.selectedEvents.size
        });
    });

    addToCalendar.addEventListener('click', () => {
        sa_event('add_to_calendar_clicked', {
            selected_events_count: window.selectedEvents.size
        });
    });
}

// Initialize analytics when Simple Analytics is loaded
waitForSimpleAnalytics(initAnalytics); 