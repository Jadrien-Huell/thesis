console.log('JavaScript loaded!');

// User Interface Functionality
document.addEventListener('DOMContentLoaded', function() {
    const ddcontainers = document.querySelectorAll('.dropdown-container');
    const playerDDContainers = document.querySelectorAll('.lineup-container');
    const maxPlayers = 5;
    let Teams;

    function createPlayerElement(player) {
        const element = document.createElement('div');
        element.className = 'player-card';
        element.dataset.playerId = player.id; // Use data attribute
        element.innerHTML = `
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="blank-profile-picture">
            <div class="player-card-content">
                <div class="player-card-name">${player.name}</div>
                <div class="player-card-details">
                    <p>Number: ${player.number}</p>
                </div>
            </div>
        `;
        return element;
    }

    async function generate() {
        try {
            const response = await fetch('/api/teams');
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            Teams = data;
            console.log("Teams data loaded", Teams); // For debugging
            return Teams; // Return the data if needed
        } catch (error) {
            console.error('Error fetching teams:', error);
            return null; // Handle the error gracefully
        }
    }
    
    async function loadPage() {
        await generate();
        if (!Teams) { console.log("Teams data failed to load."); }

        // Team Dropdown Menu
        ddcontainers.forEach(dropdown => {
            const ddtrigger = dropdown.querySelector('.dropdown-trigger');
            const ddmenu = dropdown.querySelector('.dropdown-menu');
            const container = document.querySelector(`.${dropdown.id}-lu`);

            ddmenu.innerHTML = "";
            for (let i = 0; i < Teams.length; i++) {
                team = Teams[i];
                ddmenu.innerHTML += `<div id=${i} class="dropdown-item">${team.name}</div>`;
            }

            const options = ddmenu.querySelectorAll('.dropdown-item');

            // Display menu trigger
            ddtrigger.addEventListener('click', function() {
                ddmenu.classList.toggle('show');
            });

            // Hides menu when not used
            document.addEventListener('click', function(event) {
                if (!ddtrigger.contains(event.target) && !ddmenu.contains(event.target)) {
                    ddmenu.classList.remove('show');
                }
            });
            
            // Item selction action
            options.forEach(button => {
                button.addEventListener('click', function() {
                    ddtrigger.innerText = button.innerText
                    
                    const teamIndexPosition = button.id;
                    const team = Teams[teamIndexPosition];
                    const trigger = container.querySelector('.trigger');
                    const menu = container.querySelector('.menu');
                    
                    console.log(container, team.name, team.players);
                    menu.innerHTML="";
                    for (let i=0; i<team.players.length; i++) {
                        const player = team.players[i]; 
                        const card = createPlayerElement(player);
                        menu.appendChild(card);
                    }
                    
                    let playerCards = menu.querySelectorAll('.player-card')

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
                                // Opens the menu when user is managing players
                                if (!menu.classList.contains('show')) {
                                    console.log("show menu");
                                    menu.classList.add('show');
                                } else {
                                    console.log("already open");
                                }
                                menu.appendChild(player);
                            }
                        });
                    });

                });
            });
        });

        /*/ Line-Up Selection
        playerDDContainers.forEach((container, index) => {
            //const teamSelectionBox = document.getElementById(`team${index}`);
            const trigger = container.querySelector('.trigger');
            const menu = container.querySelector('.menu');
            const playerCards = menu.querySelectorAll('.player-card')

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
                        // Opens the menu when user is managing players
                        if (!menu.classList.contains('show')) {
                            console.log("show menu");
                            menu.classList.add('show');
                        } else {
                            console.log("already open");
                        }
                        menu.appendChild(player);
                    }
                });
            });
        });
        //*/

    }
    
    loadPage()
});