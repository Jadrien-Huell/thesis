console.log('JavaScript loaded!');

// User Interface Functionality
document.addEventListener('DOMContentLoaded', function() {
    const ddcontainers = document.querySelectorAll('.dropdown-container');
    const datacontainer = document.querySelector('.data-container');

    const maxPlayers = 5;
    let Teams;

    function createPlayerElement(team, player, id) {
        const element = document.createElement('div');
        element.className = 'player-card';
        element.dataset.playerId = id; // Use data attribute
        element.innerHTML = `
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="blank-profile-picture">
            <div class="player-card-content">
                <div class="player-card-name">${player.name}</div>
                <div class="player-card-details">
                    <p>Position: Forward</p>
                    <p>Team: Example Team</p>
                    <p>Number: ${player.number}</p>
                </div>
            </div>
        `;
        return element;
    }

    async function update() {
        const data = []

        ddcontainers.forEach(container => {
            const lineupContainer = document.querySelector(`.${container.id}-lu`);
            const lineup = lineupContainer.querySelector('.lineup');
            const teamID = container.team; 

            if (teamID) {
                info = {team: Teams[teamID], players: []};
                for (let i = 0; i < lineup.children.length; i++) {
                    const playerID = lineup.children[i].dataset.playerId
                    info.players.push(Teams[teamID]['players'][playerID])
                }
                data.push(info)   
            }

        });

        sendDataToPython(data);
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

    // Sends Python Data To Process
    async function sendDataToPython(data) {
        try {
                const response = await fetch('/api/process_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
                body: JSON.stringify(data),
            });
            
            // Updating Information
            if (response.ok) {
                const result = await response.json();
                const details = result["data"];
                const score = details['score'];
                console.log('Python response:', result);
                
                ddcontainers.forEach(dropdown => {
                    const stats = details[dropdown.id];
                    const container = document.querySelector(`.${dropdown.id}-lu`);
                    const content = container.querySelector(`.${dropdown.id}`);
                    
                    content.innerText = "";
                    for (const key in stats) {
                        content.innerText += `\n${key}: ${stats[key]}`;
                    }   
                });

                const total = (score['team1']+score['team2']+score['tie'])/100
                datacontainer.innerText = `Team1's Chances: ${ score['team1']/total }% Team2's Chances: ${ score['team2']/total }%`
            } else {
                console.error('Error sending data:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
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
            const trigger = container.querySelector('.trigger')
            const menu = container.querySelector('.menu')

            ddmenu.innerHTML = "";
            for (let i = 0; i < Teams.length; i++) {
                team = Teams[i];
                ddmenu.innerHTML += `<div id=${i} class="dropdown-item">${team.name}</div>`;
            }

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
            
            // Insert Players
            ddmenu.addEventListener('click', function(event) {
                const item = event.target.closest('.dropdown-item');
                if (item) {
                    ddtrigger.innerText = item.innerText;
                    dropdown.team = item.id;
                    const team = Teams[item.id];
                    const fragment = document.createDocumentFragment();

                    menu.innerHTML = "";
                    for (let i = 0; i < team.players.length; i++) {
                        const player = team.players[i];
                        const card = createPlayerElement(team, player, i);
                        fragment.appendChild(card);
                    }
                    menu.appendChild(fragment);
                }
            });

            // Line-up Controls
            trigger.addEventListener('click', function(event) {
                const player = event.target.closest('.player-card')
                if (player) {
                    if (!menu.classList.contains('show')) {
                        menu.classList.add('show');
                    }
                    menu.appendChild(player);
                }else{
                    menu.classList.toggle('show');    
                }
            });

            // Roster Controls
            menu.addEventListener('click', function(event) {
                const player = event.target.closest('.player-card');
                if (player) {
                    if (player.parentElement === menu) {
                        if (trigger.children.length < maxPlayers) {
                            trigger.appendChild(player);
                        }
                    }
                }
            });
            
            // Close pop-ups when clicking away
            document.addEventListener('click', function(event) {
                if (!trigger.contains(event.target) && !menu.contains(event.target)) {
                    menu.classList.remove('show');
                }
            });
        });
    }
    
    // Initialize
    loadPage();

    // Calculate & Compare
    update();
    setInterval(update, 3000)
});