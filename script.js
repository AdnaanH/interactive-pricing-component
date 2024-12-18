const sliderContainer = document.querySelector('.range-selector');
const sliderTrack = document.querySelector('.slider-track');
const sliderHandle = document.getElementById('handle');
const pagesDisplay = document.getElementById('pages');
const amountDisplay = document.getElementById('amount');
const billingToggle = document.getElementById('toggle');
const monthText = document.getElementById('month');

let isDragging = false;
let currentSliderValue = 0; // Store the current slider value to prevent changes when toggling billing

// Function to format the number of pages
function formatPages(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; // Format as K
    }
    return value;
}

// Function to format the amount with commas and two decimal places
function formatAmount(value) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to update the position of the handle and track
function updateSlider(event) {
    const rect = sliderContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left; // Get the mouse position relative to the slider
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1); // Clamp the value between 0 and 1
    const handlePosition = percentage * 100; // Convert to percentage for the handle position

    sliderHandle.style.left = `${handlePosition}%`; // Move the handle
    sliderTrack.style.background = `linear-gradient(to right, var(--primary-soft-cyan) ${handlePosition}%, var(--neutral-light-grayish-blue) ${handlePosition}%)`; // Update track color

    // Calculate the value based on the slider position
    const value = Math.round(percentage * 100); // Assuming the slider represents 0-100
    const pages = 100000 * (value / 100); // Calculate pages based on the slider value
    const monthlyPrice = 16; // Base monthly price
    let amount;

    // Calculate amount based on billing type
    if (billingToggle.checked) {
        // Yearly billing
        amount = (monthlyPrice * (value / 100) * 12) * 0.75; // Calculate based on slider value and apply 25% discount
    } else {
        // Monthly billing
        amount = monthlyPrice * (value / 100); // Calculate amount based on slider value
    }

    // Update the displayed values
    pagesDisplay.textContent = formatPages(pages);
    amountDisplay.textContent = formatAmount(amount);
}

// Mouse down event to start dragging
sliderHandle.addEventListener('mousedown', (event) => {
    isDragging = true;
    updateSlider(event); // Update on mouse down
});

// Mouse move event to update the slider while dragging
document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        updateSlider(event);
    }
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Toggle billing type
billingToggle.addEventListener('change', () => {
    if (billingToggle.checked) {
        monthText.textContent = '/year'; 
    } else {
        monthText.textContent = '/month'; 
    }
    
    const percentage = sliderHandle.offsetLeft / sliderContainer.offsetWidth; 
    const value = Math.round(percentage * 100);
    const pages = 100000 * (value / 100);
    const monthlyPrice = 16; 
    let amount;

    if (billingToggle.checked) {
        // Yearly billing
        amount = (monthlyPrice * (value / 100) * 12) * 0.75;
    } else {
        // Monthly billing
        amount = monthlyPrice * (value / 100);
    }

    // Update the displayed values
    pagesDisplay.textContent = formatPages(pages);
    amountDisplay.textContent = formatAmount(amount);
});


// Initialize display
updateSlider({ clientX: sliderContainer.getBoundingClientRect().left + (sliderHandle.offsetLeft + 12) }); // Initialize on page load
