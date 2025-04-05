// Motivational Quotes
const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Success starts with self-discipline.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Don't stop when you're tired. Stop when you're done.",
    "The only way to do great work is to love what you do.",
    "Your self-worth is determined by you. You don't have to depend on someone telling you who you are.",
    "The difference between try and triumph is a little umph!",
    "The only person you are destined to become is the person you decide to be.",
    "Believe you can and you're halfway there."
];


const badgeRequirements = {
    steps: 10000, // Daily step goal
    water: 8,     // Glasses of water
    streak: 7     // Days in a row
};

// User Progress
let userProgress = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    badges: {
        steps: false,
        water: false,
        streak: false
    },
    currentStreak: 0
};

// Initialize Gamification
function initGamification() {
    loadUserProgress();
    updateMotivationalQuote();
    updateLevelDisplay();
    updateBadges();
    setInterval(updateMotivationalQuote, 300000); // Update quote every 5 minutes
}

// Load user progress from localStorage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
}

// Save user progress to localStorage
function saveUserProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

// Update motivational quote
function updateMotivationalQuote() {
    const quoteElement = document.getElementById('motivational-quote');
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    quoteElement.textContent = randomQuote;
}

// Update level display
function updateLevelDisplay() {
    document.getElementById('user-level').textContent = userProgress.level;
    document.getElementById('level-progress').style.width = `${(userProgress.xp / userProgress.xpToNextLevel) * 100}%`;
    document.getElementById('xp-display').textContent = `${userProgress.xp}/${userProgress.xpToNextLevel} XP`;
}

// Update badges display
function updateBadges() {
    const badges = {
        steps: document.getElementById('steps-badge'),
        water: document.getElementById('water-badge'),
        streak: document.getElementById('streak-badge')
    };

    Object.keys(badges).forEach(badge => {
        if (userProgress.badges[badge]) {
            badges[badge].classList.add('earned');
        }
    });
}

// Check and award badges
function checkBadges() {
    // Check steps badge
    if (parseInt(document.getElementById('total-steps').textContent) >= badgeRequirements.steps) {
        userProgress.badges.steps = true;
    }

    // Check water badge
    if (parseInt(document.getElementById('total-water').textContent) >= badgeRequirements.water) {
        userProgress.badges.water = true;
    }

    // Check streak badge
    if (userProgress.currentStreak >= badgeRequirements.streak) {
        userProgress.badges.streak = true;
    }

    updateBadges();
    saveUserProgress();
}

// Add XP
function addXP(amount) {
    userProgress.xp += amount;
    
    // Level up if enough XP
    while (userProgress.xp >= userProgress.xpToNextLevel) {
        userProgress.xp -= userProgress.xpToNextLevel;
        userProgress.level++;
        userProgress.xpToNextLevel = Math.floor(userProgress.xpToNextLevel * 1.5);
        
        // Show level up notification
        showAlert('Level Up!', `Congratulations! You've reached level ${userProgress.level}!`);
    }
    
    updateLevelDisplay();
    saveUserProgress();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGamification); 