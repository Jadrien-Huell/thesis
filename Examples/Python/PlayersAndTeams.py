import random

def createTeam():
    origin = 50
    for x in range(0, 2):
        text = f"team{x+1} = ["
        for i in range(0, 5):
            deviation = random.randint(-5, 5)
            text += f"{origin - deviation},"
        text += "]"
        print(text)

def getTeamSummary(team):
    length = len(team)
    sum = 0
    for i in range(0, length):
        sum += team[i]
    return sum / length


team1 = [53,54,49,55,46]
team2 = [58,52,49,50,49]
