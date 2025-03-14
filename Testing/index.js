console.log("Hello World")

// Team Dropdown Menu
const ddcontainers = document.querySelectorAll('.dropdown-container');
ddcontainers.forEach(container => {
    const trigger = container.querySelector('.dropdown-trigger');
    const menu = container.querySelector('.dropdown-menu');
    const options = menu.querySelectorAll('.dropdown-item');

    // Display menu trigger
    trigger.addEventListener('click', function() {
        menu.classList.toggle('show');
    });

    // Hides menu when not used
    document.addEventListener('click', function(event) {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
    
    // Item selction action
    options.forEach(button => {
        button.addEventListener('click', function() {
            trigger.innerText = button.innerText;
        });
    });
});

// Line-Up Selection
const playerDDContainers = document.querySelectorAll('.lineup-container');
const maxPlayers = 5

playerDDContainers.forEach(container => {
    const trigger = container.querySelector('.trigger');
    const menu = container.querySelector('.menu');
    const playerCards = menu.querySelectorAll('.moveableButton')

    // Display menu trigger
    trigger.addEventListener('click', function(event){
        if (trigger.contains(event.target)) {
          menu.classList.toggle('show');  
        }
    });

    // Hides menu when not used
    document.addEventListener('click', function(event) {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });

    // Relocate players to/from line-up
    playerCards.forEach(player => {
        player.addEventListener('click', function() {
            if (player.parentElement === menu) {
                if (trigger.children.length < maxPlayers) {
                    trigger.appendChild(player);
                }
            } else {
                menu.appendChild(player);
            }
        });
    });
});


