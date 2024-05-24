// Define the structure of a Habit
interface Habit {
  id: string; // Unique identifier for each habit
  name: string; // Name of the habit
  startDate: string; // The date when the habit was started
}

// The URL of the API endpoint
const apiUrl = 'http://localhost:3000/habits';

// Function to fetch all habits from the API
async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(apiUrl); // Send a GET request to the API
  if (!response.ok) { // If the response is not OK (status code is not 2xx)
    console.error('Failed to fetch habits:', response.statusText); // Log the status text
    return []; // Return an empty array
  }
  return await response.json(); // Parse the response body as JSON and return it
}

// Function to add a new habit
async function addHabit(habit: Omit<Habit, 'id'>): Promise<void> {
  const response = await fetch(apiUrl, { // Send a POST request to the API
    method: 'POST', // Specify the HTTP method
    headers: { 'Content-Type': 'application/json' }, // Set the content type of the request body
    body: JSON.stringify(habit) // Convert the habit object to a JSON string
  });
  if (!response.ok) { // If the response is not OK
    console.error('Failed to add habit:', response.statusText); // Log the status text
    return; // Exit the function
  }
  
  // Get the newly added habit
  const newHabit = await response.json(); // Parse the response body as JSON
  
  // Render habits after adding the new one
  renderHabits(await fetchHabits()); // Fetch all habits and render them
}

// Function to update a habit
async function updateHabit(id: string, habit: Partial<Habit>): Promise<void> {
  const response = await fetch(`${apiUrl}/${id}`, { // Send a PATCH request to the API
    method: 'PATCH', // Specify the HTTP method
    headers: { 'Content-Type': 'application/json' }, // Set the content type of the request body
    body: JSON.stringify(habit) // Convert the habit object to a JSON string
  });
  if (!response.ok) { // If the response is not OK
    console.error('Failed to update habit:', response.statusText); // Log the status text
  }
}

// Function to delete a habit
async function deleteHabit(id: string): Promise<void> {
  const response = await fetch(`${apiUrl}/${id}`, { // Send a DELETE request to the API
    method: 'DELETE' // Specify the HTTP method
  });
  if (!response.ok) { // If the response is not OK
    console.error('Failed to delete habit:', response.statusText); // Log the status text
    return; // Exit the function
  }
  
  // Render habits after deleting
  renderHabits(await fetchHabits()); // Fetch all habits and render them
}

// Function to calculate the number of days since the habit was started
function calculateDaysSince(startDate: string): number {
  const start = new Date(startDate); // Convert the start date to a Date object
  const now = new Date(); // Get the current date and time
  const diff = now.getTime() - start.getTime(); // Calculate the difference in milliseconds
  return Math.floor(diff / (1000 * 60 * 60 * 24)); // Convert the difference to days
}

// Function to render the habits
function renderHabits(habits: Habit[]): void {
  const habitList = document.getElementById('habit-list'); // Get the habit list element
  if (habitList) { // If the habit list element exists
    habitList.innerHTML = habits.map(habit => ` // Map each habit to a string of HTML
      <div class="habit-card">
        <h3>${habit.name}</h3>
        <img src="./images/${habit.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${habit.name}">
        <p>Started on: ${habit.startDate}</p>
        <p>Days: ${calculateDaysSince(habit.startDate)}</p>
        <button class="delete-button" data-id="${habit.id}">Delete</button>
      </div>
    `).join(''); // Join the array of strings into a single string

    // Attach event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button'); // Get all delete buttons
    deleteButtons.forEach(button => { // For each delete button
      button.addEventListener('click', async (event) => { // Add a click event listener
        const id = (event.target as HTMLElement).getAttribute('data-id'); // Get the id of the habit
        if (id) { // If the id exists
          await deleteHabit(id); // Delete the habit
        } else { // If the id does not exist
          console.error('Invalid id:', id); // Log an error message
        }
      });
    });
  }
}

// Function to add a new habit
async function addNewHabit(): Promise<void> {
  const habitName = (document.getElementById('habit-name') as HTMLInputElement).value; // Get the habit name
  const startDate = (document.getElementById('start-date') as HTMLInputElement).value; // Get the start date

  if (habitName && startDate) { // If the habit name and start date exist
    await addHabit({ name: habitName, startDate }); // Add the habit
  } else { // If the habit name or start date does not exist
    console.error('Habit name or start date is missing'); // Log an error message
  }
}

// Add a click event listener to the add habit button
document.getElementById('add-habit')?.addEventListener('click', async () => {
  await addNewHabit(); // Add a new habit when the button is clicked
});

// Add an event listener for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', async () => {
  renderHabits(await fetchHabits()); // Fetch all habits and render them when the DOM is fully loaded
});