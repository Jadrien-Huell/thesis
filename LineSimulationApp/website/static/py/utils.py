import math
from .data import getNumber, getTeam, Teams

# Important stats to look at
statistics = ["FG%", "FG", "3P%", "3P", "2P%", "2P", "FT%", "FT", "PTS"]

# Create player variant sets: A player with different versions of themself
def createPlayerVariationSet(player):
    variantList = [player]
    for x in [-5, 5]:
        variant = {}
        
         # Modify player stats v2
        originPTS = player.get("PTS", 1)
        newPTS = max(originPTS + x, 1)
        percent = newPTS / originPTS
        #print(f"nPTS: {newPTS} - {percent*100}%")

        # Modify player stats
        for statName in statistics:
            statValue = player[statName]
            if getNumber(statValue):
                variant[statName] = statValue * percent
        variant["Player"] = player["Player"]

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
    stats = {
        "SC": 0,
        "3PTS": 0,
        "2PTS": 0,
        "FGPTS": 0,
        "TS%":0,
        "AV":0,
        }

    # Initialize keys with zeros
    for statName in statistics:
        stats[statName] = 0.0

    # Calculate team overall stats
    for player in lineup:
        for statName in statistics:
            stat = player.get(statName, 0) # Helps prevent missing values
            stats[statName] += stat #/ len(lineup)

    # Calculating team score
    for player in lineup:
        playerStats = {}

        # gets player stats
        for statName in statistics:
            playerStats[statName] = player.get(statName, 0)

        playerStats["FGA"]    = player.get("FGA", 1)
        playerStats["FTA"]    = player.get("FTA", 1)
        playerStats["3PTS"]   = playerStats["3P"] * 3 # 3-points per game
        playerStats["2PTS"]   = playerStats["2P"] * 2 # 2-points per game
        playerStats["FGPTS"]  = playerStats["3PTS"] + playerStats["2PTS"] # field-goal-points per game
        playerStats["FTPTS"]  = playerStats["PTS"] - playerStats["FGPTS"] # free-throw-points per game
        playerStats["3CP"]    = playerStats["3PTS"] / max(playerStats["PTS"],1) # % of points that are 3-points
        playerStats["2CP"]    = playerStats["2PTS"] / max(playerStats["PTS"],1) # % of points that are 2-points
        playerStats["FTCP"]   = playerStats["FTPTS"] / max(playerStats["PTS"],1) # % of points that are free-throws
        playerStats["CP"]     = playerStats["PTS"] / stats["PTS"]
        playerStats["TS%"]    = playerStats["PTS"] / (2 * (playerStats["FGA"] + 0.44 * playerStats["FTA"]))
        playerStats["AV"]     = (playerStats["3CP"] * 3) + (playerStats["2CP"] * 2) + (playerStats["FTCP"] * 1)
        
        stats["3PTS"]         += playerStats["3PTS"]
        stats["2PTS"]         += playerStats["2PTS"]
        stats["FGPTS"]        += playerStats["FGPTS"]
        stats["TS%"]          += playerStats["TS%"]
        stats["AV"]           += playerStats["AV"]
        stats["SC"]           += (10 + playerStats["TS%"]) 
        
    return stats

# Compares Teams' Unique Combinations
def getComparison(data):
    board = {"team1":0, "team2":0, "tie": 0, "total": 0, "team1Win%" : 0, "team2Win%" : 0, "team1P":0, "team2P":0}
    team1 = createLineupVariationSet(data[0])
    team2 = createLineupVariationSet(data[1])

    # for x in team2:
    #     print()
    #     for p in x:
    #         print(p["Player"], p["PTS"])

    threshold = 5
    mainStat = "SC"
    # print(board)

    # Comparing teams' line up
    if (len(team1)>1 and len(team2)>1):
        for team1line in team1:
            team1Sum = getLineupSummary(team1line)

            for team2line in team2:
                team2Sum = getLineupSummary(team2line)
                diff = team1Sum[mainStat] - team2Sum[mainStat]
                if abs(diff) > threshold:
                    if diff > 0:
                        board["team1"] += 1
                        board["team1P"] += team1Sum["AV"]
                    else:
                        board["team2"] += 1
                        board["team2P"] += team2Sum["AV"]
                    # print(f"| {board['team1P']:.2f} | {board['team2P']:.2f} |")
                    # print(f"Team1:{board['team1']}-{board['team2']}:Team2 | Team1:{team1Sum[mainStat]:.2f}\tTeam2:{team2Sum[mainStat]:.2f}")
                else:
                    board['tie'] += 1
                    board["team1P"] += team1Sum["AV"]
                    board["team2P"] += team2Sum["AV"]
                

    # Information on the teams' lineup comparisions
    board["total"] = board["team1"] + board["team2"] + board["tie"]
    if (board["total"] > 0):
        board["team1Win%"] = (board["team1"] + board["tie"] * 0.5) / board["total"] 
        board["team2Win%"] = (board["team2"] + board["tie"] * 0.5) / board["total"]
        
        board["team1P"] /= board["total"]
        board["team2P"] /= board["total"]

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
    # averagePTS = (details["team1"]["PTS"] + details["team2"]["PTS"]) * 0.30 #* 0.25
    # details['score']["team1PTS"] = details["score"]["team1Win%"] * (averagePTS * 1 + details["team1"]["PTS"] * 0)
    # details['score']["team2PTS"] = details["score"]["team2Win%"] * (averagePTS * 1 + details["team2"]["PTS"] * 0)
    details['score']["team1PTS"] = details["score"]["team1P"] * 5
    details['score']["team2PTS"] = details["score"]["team2P"] * 5

    return details


# td = {"team": "BOS", "players": []}
# team1 = getTeam(td["team"])
# for x in [1, 2, 3, 4, 6]: #
#     plr = team1[x]
#     td["players"].append(plr)
#     print(plr["Player"].encode("utf-7"))

# td2 = {"team": "PHO", "players": []}
# team2 = getTeam(td2["team"])
# for x in [1, 0, 7, 8, 12]: #
#     plr = team2[x]
#     td2["players"].append(plr)
#     print(plr["Player"].encode("utf-7"))

# comp = getComparison([td, td2])
# print(comp)