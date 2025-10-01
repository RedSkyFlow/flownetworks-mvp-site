// === Flow Networks: script.js === //
// Handles interactivity for the MVP homepage

document.addEventListener('DOMContentLoaded', () => {

    const industrySelector = document.getElementById('industry-selector');
    const contentContainer = document.getElementById('explorer-content');

    // Data for each industry use case
    const useCases = {
        hotel: {
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fGhvdGVsfGVufDB8fHx8MTY2NTU4ODg3Mg&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'The Hyper-Personalized Hotel Stay',
            description: 'A business traveler connects to the hotel WiFi. Our AI Gateway recognizes their profile and sends a complimentary business lounge access voucher to their device. The Hotel Manager sees a real-time dashboard showing lobby traffic is peaking and receives an AI recommendation to open a second check-in desk, reducing wait times by 40%.'
        },
        restaurant: {
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHJlc3RhdXJhbnR8ZW58MHx8fHwxNjY1NTg4OTE1&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'The Data-Driven Dining Experience',
            description: 'A family connects to your restaurant\'s WiFi. Upon leaving, a survey is automatically sent asking about their experience. The owner sees on their dashboard that dwell time near the patio is high and uses this insight to run a successful "Patio Happy Hour" promotion, increasing mid-day sales by 25%.'
        },
        mall: {
            image: 'https://images.unsplash.com/photo-1567958451996-29b13659938b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHNob3BwaW5nJTIwbWFsbHxlbnwwfHx8fDE2NjU1ODg5NDU&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'The Intelligent Shopping Mall',
            description: 'A returning shopper connects to the WiFi. The system notes their previous visits to athletic stores and sends a targeted 20% off voucher for a new sports shop. The Mall Operator uses footfall heatmaps to identify an under-utilized area and strategically places a pop-up coffee kiosk there, generating new rental income.'
        }
    };

    // Function to update the content
    function updateContent(industry) {
        const data = useCases[industry];
        contentContainer.innerHTML = `
            <img src="${data.image}" alt="${data.title}">
            <div class="text-content">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            </div>
        `;
    }

    // Event Listener
    industrySelector.addEventListener('change', (event) => {
        updateContent(event.target.value);
    });

    // Initial load
    updateContent('hotel');
});