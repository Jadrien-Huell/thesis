console.log('JavaScript loaded!');

const maxPlayers = 5;
const chartCategories = ["FG%", "FG", "3P%", "3P", "2P%", "2P", "FT%", "FT", "PTS"]; // For chart

let Teams = {};
let TeamTags = {};
let IconsAndLogos = {};
let TeamPlayersData = {};
let LineupData = {
    "team1": {team:null, players:[]}, 
    "team2": {team:null, players:[]}
};

function getChartInfo(info) {
    let chartData = {
        columns: [
            [null],
            ['[Team 1]', 0, 0, 0], // first series
            ['[Team 2]', 0, 0, 0] // second series
        ] 
    };
    for (let i = 0; i<chartCategories.length; i++) {
        const nextIndex = i+1
        chartData.columns[0][nextIndex]=chartCategories[i];
        chartData.columns[1][nextIndex]= info ? info['team1'][chartCategories[i]] : 0
        chartData.columns[2][nextIndex]= info ? info['team2'][chartCategories[i]] : 0
    }

    if (LineupData.team1.team) {
        chartData.columns[1][0] = LineupData.team1.team;
    }
    if (LineupData.team2.team) {
        chartData.columns[2][0] = LineupData.team2.team;
    }

    return chartData
}

function loadChart(info) {
    let data = getChartInfo(info)
    if (data == null) {
        data = {
            columns: [
                [null /*! Do not remove null */, '[Category 1]', '[Category 2]', '[Category 3]'], // categories
                ['[Team Name 1]', 1, 4, 3], // first series
                ['[Team Name 2]', 5, 4, 2] // second series
            ]
        }
    }

    Highcharts.chart('nba-team-stat', {
        data: data,
        chart: {
            type: 'column',
            borderRadius: 5,
        },
        title: {
            text: 'Statistics Comparison'
        },
        subtitle: {
            text: ''
        },
        tooltip: {
            headerFormat: '<b><span style="font-size:12px">{series.name}</span></b></br>',
            pointFormat: '<b>{point.y:.2f}</b> <span style="color:{point.color}">{point.name}</span></br>',
            backgroundColor: 'rgba(0, 0, 0, .75)',
            borderWidth: 2,
            style: {
                color: '#CCCCCC'
            }
        },
        xAxis: {
            type: 'category',
            title: {
                text: ''
            },
            accessibility: {
                description: 'Shot Percentages' //May need revision
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Performance'
            },
            accessibility: {
                description: 'Performance Metrics' //May need revision
            }
        },
        credits : {
            enabled: false
        },
        colors: ['#C8102E', '#1D428A']
    });
}

// User Interface Functionality
document.addEventListener('DOMContentLoaded', function() {
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

        function removeAllPlayers() {
            line["players"] = [];
        }

        return {
            "myLine": line, 
            "setTeam": setTeam,
            "getPlayer": getPlayer, 
            "addPlayer": addPlayer, 
            "removePlayer": removePlayer,
            "removeAllPlayers" : removeAllPlayers
        }
    }
    
    /**
     * @getImages retrieves the NBA teams and logos
     */

    async function getImages() {
        try {
            const response = await fetch('/static/data/nba_teams_and_logos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching JSON:', error);
        }
    }

    // Gets the list of NBA teams to load into dropdown menu
    async function getTeamList() {
        const imageList = await getImages()
        Teams = {}
        try {
            const response = await fetch('/api/teams');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            Teams = data[0];
            TeamTags = data[1];

            for (index in imageList) {
                const imageData = imageList[index]
                const imageName = imageData.name;
                //console.log(imageName.replace(/\W\s/gi, ""));
                const isTeamLogo = Teams[imageName]
                if (isTeamLogo) {
                    IconsAndLogos[imageName] = imageData.logo;
                } else {
                    IconsAndLogos["NBA"] = imageData.logo;
                }
            }
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
            const response = await fetch(`/api/team1`, {
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
            // console.log("Results:", result['data']['score'], result);
            // console.table(result['data']['team1']);
            // console.table(result['data']['team2']);

            const team1Display = document.getElementById("team1-score");
            const team1ScoreLabel = team1Display.querySelector(".team-points");
            team1ScoreLabel.innerText = result['data']['score']['team1PTS'].toFixed(0);

            const team2Display = document.getElementById("team2-score");
            const team2ScoreLabel = team2Display.querySelector(".team-points");
            team2ScoreLabel.innerText = result['data']['score']['team2PTS'].toFixed(0);
            
            loadChart(result['data']);
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
                menu.innerHTML += `
                <div id=${abbreviation} class="dropdown-item">
                    <img src=static/${IconsAndLogos[name]} alt=${name}>
                    <div class="team-name-dropdown-item">${name}</div>
                </div>`;
            }
        });
        loadChart()
        //setInterval(startSimulation, 5000)
    }
    
    const dropdown_containers = document.querySelectorAll('.dropdown-container');
    const lineups_section = document.getElementById("team-lineups");

    dropdown_containers.forEach(container => {
        const trigger = container.querySelector('.trigger');
        const selected = trigger.querySelector('.selected');
        const selected_team = selected.querySelector('.selected-team');
        const image_display = document.querySelectorAll(`.${container.id}-selected-image`);
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

                image_display.forEach(image => {
                    image.src = `static/${IconsAndLogos[item.innerText]}`;
                });

                const lineup_container = lineups_section.querySelector(`#${container.id}`);
                const lineup_field = lineup_container.querySelector('.lineup');
                const roster_field = lineup_container.querySelector('.roster');
                const team_score_display = document.querySelector(`#${container.id}-score`);
                const team_name_label = team_score_display.querySelector(".team-name");
                const lineManager = manageLineup(container.id);

                team_score_display.querySelector(".team-points").innerText = 0;
                team_name_label.innerText = container.team
                lineup_field.innerHTML = "";
                roster_field.innerHTML = "";
                lineManager.removeAllPlayers();
                lineManager.setTeam(item.id);
                loadChart();

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
                startSimulation();
                // console.log(`Adding ${lineManager.getPlayer(player).Player} on ${container.id}`, lineManager.myLine, LineupData);
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
                        startSimulation();
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

    loadPage();
}); 