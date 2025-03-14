import PlayersAndTeams
import Combination
import math

team1PlayerVariations = Combination.createNumericVariations(PlayersAndTeams.team1)
team2PlayerVariations = Combination.createNumericVariations(PlayersAndTeams.team2)
team1LineUpScenarios = Combination.createCombosV2(team1PlayerVariations)
team2LineUpScenarios = Combination.createCombosV2(team2PlayerVariations)

scoreboard = {
    "team1":0,
    "team2":0,
    "ties":0
}

for i in range(0, len(team1LineUpScenarios)):
    team1Summary = PlayersAndTeams.getTeamSummary(team1LineUpScenarios[i])
    for j in range(0, len(team2LineUpScenarios)):
        team2Summary = PlayersAndTeams.getTeamSummary(team2LineUpScenarios[j])

        if team1Summary > team2Summary:
            scoreboard["team1"] += 1
        elif team2Summary > team1Summary:
            scoreboard["team2"] += 1
        else:
            scoreboard["ties"] += 1

totalGames = scoreboard["team1"] + scoreboard["team2"] + scoreboard["ties"] 
team1Winnings=scoreboard['team1']*100/totalGames
team2Winnings=scoreboard['team2']*100/totalGames
relativeChange=(scoreboard['team2']-scoreboard['team1'])*100/scoreboard["team1"]

print("\n"*2)
print(f"\tTeam1 Player Variations:\n\t{team1PlayerVariations}")
print(f"\tTeam2 Player Variations:\n\t{team2PlayerVariations}\n")
print(f"\tScoreboard:\n\t{scoreboard}\nTotal Games:\n\t{totalGames}\n")
print(str.format('\tTeam1 Win%: {team1Winnings:.2f}%\nTeam2 Win%: {team2Winnings:.2f}%\nRelative Change of Team1-Team2:{relativeChange:.2f}%', 
team1Winnings = team1Winnings, 
team2Winnings = team2Winnings, 
relativeChange= abs(relativeChange)))
print("\n"*2)