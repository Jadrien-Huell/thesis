import math
from .sampleData import Teams

# Create player variant sets: A player with different versions of themself
def createPlayerVariationSet(player):
    variantList = [player]
    for i in range(0, 2):
        variant = {} #player.copy()
        x = (i-1) * 5

        # Modify player stats
        for statName in ["PTS","FG%","3P%","FT%"]:
            statValue = player[statName]
            variant[statName]=statValue*(1+x/100)

        # Adds variant to list
        variantList.append(variant)

    return variantList



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

# Calculates the average for the team score
def getLineupSummary(lineup):
    stats = {"SC":0}
    for statName in ["PTS","FG%","3P%","FT%"]:
        stats[statName] = 0

    for player in lineup:
        for statName in ["PTS","FG%","3P%","FT%"]:
            stats[statName] += player[statName] / len(lineup)

    for player in lineup:
        for statName in ["FG%","3P%","FT%"]:
            stats['SC'] += (player['PTS'] * player[statName] / 100)
    
    return stats

# Creates Set of Player Variations
def createLineupSetWithVariations(teamData):
    lineup = []
    for player in teamData['players']:
        lineup.append(createPlayerVariationSet(player))
    return lineup

# Creates Unique Combinations 
def createLineupVariationSet(teamData):
    lineupSet = createLineupSetWithVariations(teamData)
    return createCombinations(lineupSet)

# Compares Teams' Unique Combinations
def getComparison(data):
    board = {"team1":0, "team2":0, "tie": 0}
    team1 = createLineupVariationSet(data[0])
    team2 = createLineupVariationSet(data[1])
    mainStat = "SC"

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

    return board

def getGameDetails(data):
    details = {}
    
    details['team1'] = getLineupSummary(data[0]["players"])
    details["team2"] = getLineupSummary(data[1]["players"])
    details['score'] = getComparison(data)

    return details
