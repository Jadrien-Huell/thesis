console.log('JavaScript loaded!');

// User Interface Functionality
document.addEventListener('DOMContentLoaded', function() {
    const maxPlayers = 5
    let Teams;
    let TeamTags;
    let TeamPlayersData = {}
    let LineupData = {
        "team1": {team:"", players:[]}, 
        "team2": {team:"", players:[]}
    }

    function manageLineup(sectionId) {
        const line = LineupData[sectionId]
        
        function setTeam(team) {
            line["team"] = team;
        }

        function getPlayer(player) {
            return TeamPlayersData[sectionId][player.dataset.playerId];
        }

        function addPlayer(player) {
            const playerInfo = getPlayer(player);
            line["players"].push(playerInfo);
        }

        function removePlayer(player) {
            const playerInfo = getPlayer(player);
            const index = line["players"].indexOf(playerInfo)
            line["players"].splice(index, 1)
        }

        return {
            "myLine": line, 
            "setTeam": setTeam,
            "getPlayer": getPlayer, 
            "addPlayer": addPlayer, 
            "removePlayer": removePlayer
        }
    }

    // Gets the list of NBA teams to load into dropdown menu
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
            const response = await fetch(`/api/${teamSection}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(name),
            });
            if (!response.ok) { throw new Error('Network response was not ok'); }
            const result = await response.json();
            TeamPlayersData[teamSection] = result['data'];
            return TeamPlayersData[teamSection];
        } catch(error) {
            console.error('Error fetching teams:', error);
            return null;
        }
    }

    // Sends data for processing & starting simulation
    async function startSimulation() {
        try {
            const response = await fetch(`/api/process_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([LineupData.team1, LineupData.team2]),
            });
            if (!response.ok) { throw new Error('Network response was not ok'); }
            const result = await response.json();
            console.log("Results:", result['data']['score'], result);

            const team1Display = document.getElementById("team1-score");
            const team1ScoreLabel = team1Display.querySelector(".team-points");
            team1ScoreLabel.innerText = result['data']['score']['team1PTS'].toFixed(0);

            const team2Display = document.getElementById("team2-score");
            const team2ScoreLabel = team2Display.querySelector(".team-points");
            team2ScoreLabel.innerText = result['data']['score']['team2PTS'].toFixed(0);

        } catch(error) {
            console.error('Error fetching teams:', error);
            return null;
        }
    }

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
                <div class="player-card-rank">${playerInfo.Rk}</div>
                <img src="${imgScr}" onerror="this.src='${defaultImgScr}'" alt="${playerInfo.Player} Headshot">
                <div class="player-card-name">${playerNameShort}</div>
                <div class="player-card-details">
                    <p>${playerInfo.Pos}</p>
                    <!-- <p>${team} </p> -->
                </div>
            </div>
        `;
        return element;
    }

    async function loadPage() {
        await getTeamList();
        if (!Teams) { console.log("Teams data failed to load."); }

        const dropdown_menus = document.querySelectorAll('.dropdown-menu')
        dropdown_menus.forEach(menu => {
            menu.innerHTML = ""
            for (const name in Teams) {
                abbreviation = Teams[name];
                menu.innerHTML += `<div id=${abbreviation} class="dropdown-item">${name}</div>`;
            }
        });
    }
    
    const dropdown_containers = document.querySelectorAll('.dropdown-container');
    const lineups_section = document.getElementById("team-lineups");

    dropdown_containers.forEach(container => {
        const trigger = container.querySelector('.trigger');
        const selected = trigger.querySelector('.selected');
        const selected_team = selected.querySelector('.selected-team')
        const menu  = container.querySelector('.dropdown-menu');

        trigger.addEventListener('click', function(event) {
            menu.classList.toggle('show');
        })

        // Hides menu when not used
        document.addEventListener('click', function(event) {
            if (!trigger.contains(event.target) && !menu.contains(event.target)) {
                menu.classList.remove('show');
            }
        });

        menu.addEventListener('click', function(event) {
            const item = event.target.closest('.dropdown-item');
            if (item) {
                selected_team.innerText = item.innerText;
                container.team = item.id;

                const lineup_container = lineups_section.querySelector(`#${container.id}`);
                const lineup_field = lineup_container.querySelector('.lineup');
                const roster_field = lineup_container.querySelector('.roster');
                const team_score_display = document.querySelector(`#${container.id}-score`);
                const team_name_label = team_score_display.querySelector(".team-name");
                
                team_name_label.innerText = container.team
                lineup_field.innerHTML = "";
                roster_field.innerHTML = "";

                async function getTeamPlayerData(teamName, teamSection) {
                    await getTeamData(teamName, teamSection);
                    players = TeamPlayersData[teamSection]

                    const fragment = document.createDocumentFragment();
                    for (let i = 0; i < players.length - 1; i++) {
                        const playerInfo = players[i];
                        const card = createPlayerElement(playerInfo, i, teamName);
                        fragment.appendChild(card);
                    }
                    roster_field.appendChild(fragment);
                }
                getTeamPlayerData(container.team, container.id);
            }
        });
    })
    
    const lineup_containers = document.querySelectorAll('.lineup-container');
    lineup_containers.forEach(container => {
        const trigger = container.querySelector('.trigger');
        const menu = container.querySelector('.roster')

        trigger.addEventListener('click', function(event) {
            const player = event.target.closest('.player-card')
            if (player) {
                if (!menu.classList.contains('show')) {
                    menu.classList.add('show');
                }
                menu.appendChild(player);
                // Remove from player list
                const lineManager = manageLineup(container.id);
                lineManager.removePlayer(player);
                startSimulation()
                // console.log(`Removing ${lineManager.getPlayer(player).Player} on ${container.id}`, lineManager.myLine, LineupData);
            }else{
                menu.classList.toggle('show');    
            }
        });

        menu.addEventListener('click', function(event) {
            const player = event.target.closest('.player-card');
            if (player) {
                if (player.parentElement === menu) {
                    if (trigger.children.length < maxPlayers) {
                        trigger.appendChild(player);
                        // Add to player list
                        const lineManager = manageLineup(container.id);
                        lineManager.addPlayer(player);
                        startSimulation()
                        // console.log(`Adding ${lineManager.getPlayer(player).Player} on ${container.id}`, lineManager.myLine, LineupData);
                    }
                }
            }
        });

        // Hides menu when not used
        document.addEventListener('click', function(event) {
            if (!trigger.contains(event.target) && !menu.contains(event.target)) {
                menu.classList.remove('show');
            }
        });
    });

    loadPage()
});