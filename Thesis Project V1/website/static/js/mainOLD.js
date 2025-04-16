console.log('JavaScript loaded!');
// TODO: DELETE COMMENTS WHEN FINISHED

// User Interface Functionality
document.addEventListener('DOMContentLoaded', function() {
    const ddcontainers = document.querySelectorAll('.dropdown-container');
    const datacontainer = document.querySelector('.data-container');
    const maxPlayers = 5;
    
    let Teams;
    let TeamTags;
    let TeamPlayersData = {}

    // Creates player card elements with player attributes
    function createPlayerElement(playerInfo, id, team) {
        const element = document.createElement('div');
        // https://basketball.realgm.com/images/nba/4.2/profiles/photos/2006/Wallerpince_Taurean_mil24.jpg
        // https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png
        const playerNames = playerInfo.Player.split(" ");
        const playerNameShort = `${playerNames[0].substring(0, 1)}. ${playerNames[1]}`
        const tag = TeamTags[team]
        const imgScr = `https://basketball.realgm.com/images/nba/4.2/profiles/photos/2006/${playerNames[1]}_${playerNames[0]}_${tag}24.jpg`
        const defaultImgScr = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        element.className = 'player-card';
        element.dataset.playerId = id; // Use data attribute
        
        element.innerHTML = `
            <div class="player-card-content">
                <img src="${imgScr}" onerror="this.src='${defaultImgScr}'" alt="${playerInfo.Player} Headshot">
                <div class="player-card-name">${playerNameShort}</div>
                <div class="player-card-details">
                    <p>Position: ${playerInfo.Pos}</p>
                    <p>${team} </p>
                    <p>Rank: ${playerInfo.Rk}</p>
                </div>
            </div>
        `;
        return element;
    }

    // Gets the list of NBA teams to load into dropdown music
    async function getTeamList() {
        Teams = {}
        try {
            const response = await fetch('/api/teams');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            Teams = data[0];
            TeamTags = data[1];
            // console.log("Teams data loaded", data); // For debugging
            return Teams; // Return the data if needed
        } catch (error) {
            console.error('Error fetching teams:', error);
            return null; // Handle the error gracefully
        }
    }

    // Fetch the team's player data & assigns data to dictionary
    async function getTeamData(name, teamSection) {
        TeamPlayersData[teamSection] = []
        try {
            await fetch(`/api/${teamSection}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(name),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(result => {
                TeamPlayersData[teamSection] = result['data']
                return TeamPlayersData[teamSection]
            }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.error("Error:", error);
        }
        return [];
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
                        if (key == "SC") {
                            //continue;
                        }   
                        content.innerText += `${key}: ${stats[key].toFixed(2)}\n`;
                    }   
                    //content.innerText = content.innerText.replace(/%g/g, "\t_|_\t")
                });
                
                
                datacontainer.innerText = `Team1's Chances: ${(score['team1Win%']).toFixed(2)}% Team2's Chances: ${score['team2Win%'].toFixed(2)}%`
            } else {
                console.error('Error sending data:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Updates touch & text UI elements
    async function update() {
        const data = [];
        let teamsHavePlayers = true;
    
        for (const container of ddcontainers) { // Use for...of for cleaner iteration
            const lineupContainer = document.querySelector(`.${container.id}-lu`);
            const lineup = lineupContainer.querySelector('.lineup');
            const lineup_player_cards = lineup.children;
            const teamID = container.team;
            const sectionID = container.id
    
            if (lineup_player_cards.length === 0) {
                teamsHavePlayers = false;
            }
    
            if (teamID) {
                const info = { team: teamID, players: [] };
                for (const playerCard of lineup.children) { // Use for...of for cleaner iteration
                    const playerID = playerCard.dataset.playerId;
                    try {
                        const playerData = await getTeamData(teamID, sectionID);
                        const playerInfo = TeamPlayersData[sectionID][playerID]
                        if (playerData) {
                            info.players.push(playerInfo);
                        }
                    } catch (error) {
                        console.error("Error fetching player data:", error);
                        // Handle the error appropriately (e.g., skip this player)
                    }
                }
                data.push(info);
            }
        }
    
        if (teamsHavePlayers) {
            // console.log("PLAY BALL!\n", data);
            sendDataToPython(data);
        } else {
            // console.log("Both teams need player's in lineup...")
        }
    }

    // Loads the page of the application    
    async function loadPage() {
        await getTeamList();
        if (!Teams) { console.log("Teams data failed to load."); }

        // Team Dropdown Menu
        ddcontainers.forEach(dropdown => {
            const ddtrigger = dropdown.querySelector('.dropdown-trigger');
            const ddmenu = dropdown.querySelector('.dropdown-menu');
            const container = document.querySelector(`.${dropdown.id}-lu`);
            const trigger = container.querySelector('.trigger')
            const menu = container.querySelector('.menu')

            ddmenu.innerHTML = "";
            for (const name in Teams) {
                abbreviation = Teams[name]
                ddmenu.innerHTML += `<div id=${abbreviation} class="dropdown-item">${name}</div>`;
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
            
            // Team selection controls
            ddmenu.addEventListener('click', function(event) {
                const item = event.target.closest('.dropdown-item');

                if (item) {
                    const teamSection = dropdown.id
                    dropdown.team = item.id;
                    ddtrigger.innerText = item.innerText;

                    // Clears UI Elements for new selection
                    trigger.innerHTML = ""
                    menu.innerHTML = "";
                    
                    console.log(`${teamSection}:\n\t${dropdown.team}`)

                    async function getTeamPlayerData() {
                        await getTeamData(dropdown.team, teamSection);
                        players = TeamPlayersData[teamSection]
                        console.log('FROM JS:',TeamPlayersData[teamSection]);

                        const fragment = document.createDocumentFragment();
                        for (let i = 0; i < players.length - 1; i++) {
                            const playerInfo = players[i];
                            const card = createPlayerElement(playerInfo, i, dropdown.team);
                            fragment.appendChild(card);
                        }
                        menu.appendChild(fragment);
                       
                    }
                    getTeamPlayerData();
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
            
            // Close menus when clicking away
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
    //update();
    //setInterval(update, 5000)
});