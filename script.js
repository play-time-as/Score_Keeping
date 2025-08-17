document.addEventListener('DOMContentLoaded', () => {

    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const minusBtn = counter.querySelector('.minus-btn');
        const plusBtn = counter.querySelector('.plus-btn');
        const input = counter.querySelector('input');
        
        const pointsPerClick = parseInt(counter.dataset.pointsPerClick, 10);
        
        // Use the input's ID as the key for local storage
        const storageKey = input.id;

        // 1. Retrieve and set initial value from local storage
        const savedValue = localStorage.getItem(storageKey);
        if (savedValue !== null) {
            input.value = savedValue;
        }

        // Function to save the current value to local storage
        const saveValue = () => {
            localStorage.setItem(storageKey, input.value);
        };
        
        // 2. Add event listeners to save on change
        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value, 10);
            if (!isNaN(currentValue)) {
                input.value = currentValue + pointsPerClick;
            } else {
                input.value = pointsPerClick;
            }
            saveValue(); // Call the save function
        });

        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value, 10);
            if (!isNaN(currentValue) && currentValue - pointsPerClick >= 0) {
                input.value = currentValue - pointsPerClick;
            } else {
                input.value = 0;
            }
            saveValue(); // Call the save function
        });
        
        // For the manual input field, save on 'input' event
        if (!input.readOnly) {
            input.addEventListener('input', () => {
                // Ensure the input is a valid number before saving
                if (!isNaN(parseInt(input.value))) {
                    saveValue();
                }
            });
        }
    });

    const checkbox = document.getElementById('checkbox');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Set initial theme based on local storage
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        checkbox.checked = true;
    }

    // Listen for changes to the checkbox
    checkbox.addEventListener('change', () => {
        body.classList.toggle('dark-mode');

        // Save the theme preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    // Point Redeeming Logic
    const redeemForms = document.querySelectorAll('.redeem-form');

    // Function to load saved data from localStorage
    const loadRedeemedItems = (player) => {
        const list = document.getElementById(`${player}-redeem-list`);
        const savedItems = JSON.parse(localStorage.getItem(`${player}-redeemed-items`)) || [];

        savedItems.forEach(item => {
            addListItem(list, item.task, item.points, item.completed);
        });
    };

    // New function to create and add a list item
    const addListItem = (list, task, points, completed = false) => {
        const li = document.createElement('li');
        li.className = 'redeemed-item';

        // Add a class for completed items
        if (completed) {
            li.classList.add('completed-task');
        }

        li.innerHTML = `
            <label class="task-checkbox-label">
                <input type="checkbox" class="task-completed-checkbox" ${completed ? 'checked' : ''}>
                <span class="custom-checkbox"></span>
            </label>
            <span class="task-text">${task}</span>
            <span class="task-points">${points} points</span>
        `;
        
        // Add a change listener to the checkbox
        const checkbox = li.querySelector('.task-completed-checkbox');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed-task');
                list.appendChild(li); // Move to the bottom of the list
            } else {
                li.classList.remove('completed-task');
                list.prepend(li); // Move back to the top
            }
            saveRedeemedItems(list.id.split('-')[0]);
        });

        // Append completed tasks to the bottom of the list
        if (completed) {
            list.appendChild(li);
        } else {
            list.prepend(li); // Add new tasks to the top
        }
    };

    // Function to save all list items for a player
    const saveRedeemedItems = (player) => {
        const list = document.getElementById(`${player}-redeem-list`);
        const items = [];
        list.querySelectorAll('.redeemed-item').forEach(li => {
            items.push({
                task: li.querySelector('.task-text').textContent,
                points: li.querySelector('.task-points').textContent.replace(' points', ''),
                completed: li.classList.contains('completed-task')
            });
        });
        localStorage.setItem(`${player}-redeemed-items`, JSON.stringify(items));
    };

    // Load items for each player on page load
    loadRedeemedItems('sania');
    loadRedeemedItems('adarsh');

    redeemForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const player = form.dataset.player;
            const taskInput = form.querySelector('.task-input');
            const pointsInput = form.querySelector('.points-input');
            const list = document.getElementById(`${player}-redeem-list`);

            const task = taskInput.value.trim();
            const points = pointsInput.value.trim();

            if (task === '' || points === '') {
                return;
            }

            addListItem(list, task, points);
            saveRedeemedItems(player);

            taskInput.value = '';
            pointsInput.value = '';
        });
    });

    // Clear Data Functionality
    const clearDataBtn = document.getElementById('clear-data-btn');

    clearDataBtn.addEventListener('click', () => {
        // Clear all data from localStorage
        localStorage.clear();
        
        // Reload the page to reset the counters and lists to their default state
        window.location.reload();

        alert("All data has been cleared!");
    });

});