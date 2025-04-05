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