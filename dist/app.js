"use strict";
const apiUrl = 'http://localhost:3000/habits';
async function fetchHabits() {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        console.error('Failed to fetch habits:', response.statusText);
        return [];
    }
    return await response.json();
}
async function addHabit(habit) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit)
    });
    if (!response.ok) {
        console.error('Failed to add habit:', response.statusText);
        return;
    }
    // Get the newly added habit
    const newHabit = await response.json();
    // Render habits after adding the new one
    renderHabits(await fetchHabits());
}
async function updateHabit(id, habit) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit)
    });
    if (!response.ok) {
        console.error('Failed to update habit:', response.statusText);
    }
}
async function deleteHabit(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        console.error('Failed to delete habit:', response.statusText);
        return;
    }
    // Render habits after deleting
    renderHabits(await fetchHabits());
}
function calculateDaysSince(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
function renderHabits(habits) {
    const habitList = document.getElementById('habit-list');
    if (habitList) {
        habitList.innerHTML = habits.map(habit => `
      <div class="habit-card">
        <h3>${habit.name}</h3>
        <img src="./images/${habit.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${habit.name}">
        <p>Started on: ${habit.startDate}</p>
        <p>Days: ${calculateDaysSince(habit.startDate)}</p>
        <button class="delete-button" data-id="${habit.id}">Delete</button>
      </div>
    `).join('');
        // Attach event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                if (id) {
                    await deleteHabit(id);
                }
                else {
                    console.error('Invalid id:', id);
                }
            });
        });
    }
}
async function addNewHabit() {
    const habitName = document.getElementById('habit-name').value;
    const startDate = document.getElementById('start-date').value;
    if (habitName && startDate) {
        await addHabit({ name: habitName, startDate });
    }
    else {
        console.error('Habit name or start date is missing');
    }
}
document.getElementById('add-habit')?.addEventListener('click', async () => {
    await addNewHabit();
});
document.addEventListener('DOMContentLoaded', async () => {
    renderHabits(await fetchHabits());
});
