// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const alertModal = document.getElementById('alert-modal');
const closeModal = document.querySelector('.close-modal');

// User Data
let userData = {
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    goal: ''
};

// Daily Stats
let dailyStats = {
    steps: 0,
    caloriesBurned: 0,
    foodCalories: 0,
    waterGlasses: 0,
    workouts: [],
    meals: []
};

// Load data from localStorage
function loadData() {
    const savedUserData = localStorage.getItem('userData');
    const savedDailyStats = localStorage.getItem('dailyStats');
    
    if (savedUserData) {
        userData = JSON.parse(savedUserData);
        updateProfileForm();
        calculateBMI();
    }
    
    if (savedDailyStats) {
        dailyStats = JSON.parse(savedDailyStats);
        updateDashboard();
        updateWorkoutHistory();
        updateMealHistory();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    });
});
// Journal functionality
const journalForm = document.getElementById('journal-form');
const journalEntries = document.getElementById('journal-entries');
const searchJournal = document.getElementById('search-journal');
const filterTags = document.getElementById('filter-tags');

// Journal entries array
let journalData = [];

// Load journal entries from localStorage
function loadJournalEntries() {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
        journalData = JSON.parse(savedEntries);
        updateJournalDisplay();
    }
}

// Save journal entries to localStorage
function saveJournalEntries() {
    localStorage.setItem('journalEntries', JSON.stringify(journalData));
}

// Add new journal entry
journalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('entry-title').value;
    const mood = document.getElementById('entry-mood').value;
    const content = document.getElementById('entry-content').value;
    const tags = Array.from(document.querySelectorAll('.tag input:checked'))
        .map(checkbox => checkbox.value);
    
    const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        title,
        mood,
        content,
        tags
    };
    
    journalData.unshift(newEntry);
    saveJournalEntries();
    updateJournalDisplay();
    journalForm.reset();
    
    showAlert('Success', 'Journal entry saved!');
});

// Update journal display
function updateJournalDisplay() {
    const searchTerm = searchJournal.value.toLowerCase();
    const filterTag = filterTags.value;
    
    const filteredEntries = journalData.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm) ||
                            entry.content.toLowerCase().includes(searchTerm);
        const matchesTag = !filterTag || entry.tags.includes(filterTag);
        return matchesSearch && matchesTag;
    });
    
    journalEntries.innerHTML = filteredEntries.map(entry => `
        <div class="journal-entry">
            <div class="entry-header">
                <span class="entry-title">${entry.title}</span>
                <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
            </div>
            <div>
                <span class="entry-mood">${getMoodEmoji(entry.mood)}</span>
            </div>
            <div class="entry-content">${entry.content}</div>
            <div class="entry-tags-list">
                ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Get mood emoji
function getMoodEmoji(mood) {
    const moodEmojis = {
        energetic: '🔋',
        good: '😊',
        tired: '😴',
        sore: '🤕',
        motivated: '💪'
    };
    return moodEmojis[mood] || '😊';
}

// Search and filter functionality
searchJournal.addEventListener('input', updateJournalDisplay);
filterTags.addEventListener('change', updateJournalDisplay);

// Initialize journal
document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
});
// Profile Form
const profileForm = document.getElementById('profile-form');
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    userData = {
        name: document.getElementById('user-name').value,
        age: parseInt(document.getElementById('user-age').value),
        weight: parseFloat(document.getElementById('user-weight').value),
        height: parseFloat(document.getElementById('user-height').value),
        goal: document.getElementById('user-goal').value
    };
    
    saveData();
    calculateBMI();
    showAlert('Profile Updated', 'Your profile has been successfully updated!');
});

function updateProfileForm() {
    document.getElementById('user-name').value = userData.name;
    document.getElementById('user-age').value = userData.age;
    document.getElementById('user-weight').value = userData.weight;
    document.getElementById('user-height').value = userData.height;
    document.getElementById('user-goal').value = userData.goal;
}

// BMI Calculator
function calculateBMI() {
    if (userData.weight && userData.height) {
        const heightInMeters = userData.height / 100;
        const bmi = userData.weight / (heightInMeters * heightInMeters);
        const bmiResult = document.getElementById('bmi-result');
        bmiResult.textContent = `BMI: ${bmi.toFixed(1)}`;
    }
}

// Step Counter
const incrementSteps = document.getElementById('increment-steps');
const decrementSteps = document.getElementById('decrement-steps');
const currentSteps = document.getElementById('current-steps');

incrementSteps.addEventListener('click', () => {
    dailyStats.steps += 100;
    updateSteps();
    checkStepGoal();
});

decrementSteps.addEventListener('click', () => {
    dailyStats.steps = Math.max(0, dailyStats.steps - 100);
    updateSteps();
});

function updateSteps() {
    currentSteps.textContent = dailyStats.steps;
    document.getElementById('total-steps').textContent = dailyStats.steps;
    document.getElementById('steps-progress').style.width = `${Math.min(100, (dailyStats.steps / 10000) * 100)}%`;
    saveData();
}

// Workout Form
const workoutForm = document.getElementById('workout-form');
workoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const workout = {
        type: document.getElementById('workout-type').value,
        duration: parseInt(document.getElementById('workout-duration').value),
        calories: parseInt(document.getElementById('workout-calories').value),
        timestamp: new Date().toLocaleTimeString()
    };
    
    dailyStats.workouts.push(workout);
    dailyStats.caloriesBurned += workout.calories;
    
    updateWorkoutHistory();
    updateDashboard();
    saveData();
    
    workoutForm.reset();
});

function updateWorkoutHistory() {
    const historyList = document.getElementById('workout-history');
    historyList.innerHTML = '';
    
    dailyStats.workouts.forEach(workout => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span>${workout.type} (${workout.duration} min)</span>
            <span>${workout.calories} cal</span>
        `;
        historyList.appendChild(item);
    });
}

// Meal Form
const mealForm = document.getElementById('meal-form');
mealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const meal = {
        name: document.getElementById('meal-name').value,
        calories: parseInt(document.getElementById('meal-calories').value),
        timestamp: new Date().toLocaleTimeString()
    };
    
    dailyStats.meals.push(meal);
    dailyStats.foodCalories += meal.calories;
    
    updateMealHistory();
    updateDashboard();
    saveData();
    
    mealForm.reset();
});

function updateMealHistory() {
    const historyList = document.getElementById('meal-history');
    historyList.innerHTML = '';
    
    dailyStats.meals.forEach(meal => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span>${meal.name}</span>
            <span>${meal.calories} cal</span>
        `;
        historyList.appendChild(item);
    });
}

// Water Tracker
const addWater = document.getElementById('add-water');
addWater.addEventListener('click', () => {
    dailyStats.waterGlasses++;
    updateWaterIntake();
    checkWaterGoal();
});

function updateWaterIntake() {
    document.getElementById('total-water').textContent = dailyStats.waterGlasses;
    document.getElementById('current-water-glasses').textContent = dailyStats.waterGlasses;
    document.getElementById('water-progress').style.width = `${Math.min(100, (dailyStats.waterGlasses / 8) * 100)}%`;
    saveData();
}

// Dashboard Updates
function updateDashboard() {
    document.getElementById('total-calories').textContent = dailyStats.caloriesBurned;
    document.getElementById('total-food-calories').textContent = dailyStats.foodCalories;
}

// Goal Alerts
function checkStepGoal() {
    if (dailyStats.steps >= 10000) {
        showAlert('Step Goal Achieved!', 'Congratulations! You have reached your daily step goal of 10,000 steps!');
    }
}

function checkWaterGoal() {
    if (dailyStats.waterGlasses >= 8) {
        showAlert('Water Goal Achieved!', 'Great job! You have reached your daily water intake goal of 8 glasses!');
    }
}

// Alert Modal
function showAlert(title, message) {
    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').textContent = message;
    alertModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    alertModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === alertModal) {
        alertModal.style.display = 'none';
    }
});

// Initialize
loadData();
updateSteps();
updateWaterIntake();

// Initialize the chart after data is loaded
initializeActivityChart();

// Initialize Chart.js
function initializeActivityChart() {
    console.log('Initializing Activity Chart');
    console.log('Daily Stats:', dailyStats);
    const ctx = document.getElementById('activityChart').getContext('2d');
    const activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Steps', 'Calories Burned', 'Water Glasses'],
            datasets: [{
                label: 'Daily Activity',
                data: [dailyStats.steps, dailyStats.caloriesBurned, dailyStats.waterGlasses],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    console.log('Chart Initialized');
} 