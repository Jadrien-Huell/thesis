import math
from .data import getNumber, getTeam, Teams
# from .sampleData import Teams

# Important stats to look at
statistics = ["FG%", "FG", "3P%", "3P", "2P%", "2P", "FT%", "FT", "PTS"]

# Create player variant sets: A player with different versions of themself
def createPlayerVariationSet(player):
    variantList = [player]
    x = 8
    for i in range(0, 2):
        variant = {}
        x *= -1
        change = (1+x/100)

        # Modify player stats
        for statName in statistics:
            statValue = player[statName]
            if getNumber(statValue):
                variant[statName]=statValue*change

        # Adds variant to list
        variantList.append(variant)

    return variantList

# Creates Set of Player Variations
def createLineupOfVariationSets(teamData):
    lineup = []
    for player in teamData['players']:
        lineup.append(createPlayerVariationSet(player))
    return lineup

# Generates unique combinations using an array of arrays containing components
def createCombinations(componentLists):
    repetitions = []
    listOfCombinations = []
    numberOfCombos = 1

    # Gets total number of combinations
    for list in componentLists:
        numberOfCombos *= len(list)

    # Gets total number of reps before a set
    product = numberOfCombos
    for i in range(0, len(componentLists)):
        product /= len(componentLists[i])
        repetitions.insert(i, product)

    # Create unique combinations
    for i in range(0, numberOfCombos):
        combo = []
        for j in range(0, len(componentLists)):
            index = int(math.fmod(math.floor(i/repetitions[j]), len(componentLists[j])))
            combo.append(componentLists[j][index])
        listOfCombinations.append(combo)    
    
    return listOfCombinations

# Creates Unique Combinations 
def createLineupVariationSet(teamData):
    lineupSet = createLineupOfVariationSets(teamData)
    return createCombinations(lineupSet)

# Calculates the average for the team score
def getLineupSummary(lineup):
    stats = {"SC":0}

    # Initialize keys with zeros
    for statName in statistics:
        stats[statName] = 0.0

    # Calculate team average
    for player in lineup:
        for statName in statistics:
            stat = player.get(statName, 0) # Helps prevent missing values
            stats[statName] += stat #/ len(lineup)

    # Calculating team score
    for player in lineup:
        for statName in ["FG","3P","2P","FT"]:
            point = player.get("PTS", 0)
            stat_point = player.get(statName, 0) 
            percent = player.get(f"{statName}%", 0) 
            stats["SC"] += (point*0.5 + stat_point*0.5) * percent
    
    return stats

# Compares Teams' Unique Combinations
def getComparison(data):
    board = {"team1":0, "team2":0, "tie": 0, "total": 0, "team1Win%" : 0, "team2Win%" : 0}
    team1 = createLineupVariationSet(data[0])
    team2 = createLineupVariationSet(data[1])
    mainStat = "SC"

    # Comparing teams' line up
    if (len(team1)>1 and len(team2)>1):
        for team1line in team1:
            for team2line in team2:
                team1Sum = getLineupSummary(team1line)
                team2Sum = getLineupSummary(team2line)

                if team1Sum[mainStat] > team2Sum[mainStat]:
                    board["team1"] += 1
                elif team1Sum[mainStat] < team2Sum[mainStat]:
                    board["team2"] += 1
                else:
                    board['tie'] += 1

    # Information on the teams' lineup comparisions
    board["total"] = board["team1"] + board["team2"] + board["tie"]
    if (board["total"] > 0):
        board["team1Win%"] = board["team1"] / board["total"] 
        board["team2Win%"] = board["team2"] / board["total"]

    return board

# Gets the game details of lineup & predictions
def getGameDetails(data):
    details = {}
    
    # Gets the teams overall stats
    details['team1'] = getLineupSummary(data[0]["players"])
    details["team2"] = getLineupSummary(data[1]["players"])

    # Compare teams' lineup to determine chances of winning
    details['score'] = getComparison(data)

    # Estimate points
    averagePTS = (details["team1"]["PTS"] + details["team1"]["PTS"]) * 0.5
    details['score']["team1PTS"] = details["score"]["team1Win%"] * averagePTS
    details['score']["team2PTS"] = details["score"]["team2Win%"] * averagePTS

    return details

# Ben Simmons Problem:
# team = getTeam('BRK')
# td = {"team": "BOS", "players": [team[8]]}
# comp = getComparison([td, td])
# print(comp)