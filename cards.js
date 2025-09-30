// Space Facts Navigation
let currentFactIndex = 0;
const speechBubbles = document.querySelectorAll('.speech-bubble');
const prevBtn = document.getElementById('prevFact');
const nextBtn = document.getElementById('nextFact');
const currentFactSpan = document.getElementById('currentFact');
const totalFactsSpan = document.getElementById('totalFacts');
const startBtn = document.getElementById('startFacts');
const totalFacts = speechBubbles.length;

// Set total facts (excluding intro)
totalFactsSpan.textContent = totalFacts - 1;

// Start button - go to first fact
startBtn.addEventListener('click', () => {
    showFact(1);
});

// Function to show a specific fact
function showFact(index) {
    // Remove active class from all speech bubbles
    speechBubbles.forEach(bubble => bubble.classList.remove('active'));
    
    // Add active class to current speech bubble
    speechBubbles[index].classList.add('active');
    
    // Update counter (don't count intro as fact 1)
    if (index === 0) {
        currentFactSpan.textContent = 'Intro';
    } else {
        currentFactSpan.textContent = index;
    }
    
    // Update button states
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalFacts - 1;
    
    currentFactIndex = index;
}

// Previous button click
prevBtn.addEventListener('click', () => {
    if (currentFactIndex > 0) {
        showFact(currentFactIndex - 1);
    }
});

// Next button click
nextBtn.addEventListener('click', () => {
    if (currentFactIndex < totalFacts - 1) {
        showFact(currentFactIndex + 1);
    } else {
        showFact(0); // Loop back to intro
    }
});

// Keyboard navigation (Arrow keys) - Only when not controlling camera
let arrowKeysEnabled = true;

document.addEventListener('keydown', (event) => {
    if (!arrowKeysEnabled) return;
    
    if (event.key === 'ArrowLeft' && currentFactIndex > 0) {
        showFact(currentFactIndex - 1);
    } else if (event.key === 'ArrowRight' && currentFactIndex < totalFacts - 1) {
        showFact(currentFactIndex + 1);
    }
});

// Auto-advance facts every 10 seconds (skip intro after first time)
let autoAdvanceInterval = setInterval(() => {
    if (currentFactIndex === 0) {
        showFact(1); // Skip from intro to first fact
    } else if (currentFactIndex < totalFacts - 1) {
        showFact(currentFactIndex + 1);
    } else {
        showFact(1); // Loop back to first fact (skip intro)
    }
}, 10000);

// Pause auto-advance when hovering over the facts container
const factsContainer = document.getElementById('space-facts-container');
factsContainer.addEventListener('mouseenter', () => {
    clearInterval(autoAdvanceInterval);
});

factsContainer.addEventListener('mouseleave', () => {
    autoAdvanceInterval = setInterval(() => {
        if (currentFactIndex === 0) {
            showFact(1);
        } else if (currentFactIndex < totalFacts - 1) {
            showFact(currentFactIndex + 1);
        } else {
            showFact(1);
        }
    }, 10000);
});

// Initialize - show first fact
showFact(0);
