from .scraper import getTeamStats

Season = "2025" # 2024-2025
Teams = {}
Requesting = []

# List of NBA team names
TeamNames = {
    "Atlanta Hawks"         : "ATL",	 
    "Boston Celtics"        : "BOS",
    "Brooklyn Nets "        : "BRK",	        
    "Charlotte Hornets"     : "CHO",	 
    "Chicago Bulls"         : "CHI",	 
    "Cleveland Cavaliers"   : "CLE",	 
    "Dallas Mavericks"      : "DAL",

    "Denver Nuggets"        : "DEN",	 
    "Detroit Pistons"       : "DET",	 
    "Golden State Warriors" : "GSW",	  
    "Houston Rockets"       : "HOU",     
    "Indiana Pacers"        : "IND",	 
    "Los Angeles Clippers"  : "LAC",     
    "Los Angeles Lakers"    : "LAL",

    "Memphis Grizzlies"     : "MEM",	 
    "Miami Heat"            : "MIA",	 
    "Milwaukee Bucks"       : "MIL",	 
    "Minnesota Timberwolves": "MIN",	 
    "New Orleans Pelicans"  : "NOP",	 
    "New York Knicks"       : "NYK",	 
    "Oklahoma City Thunder" : "OKC",

    "Orlando Magic"         : "ORL",	 
    "Philadelphia 76ers"    : "PHI",	 
    "Phoenix Suns"          : "PHO",	 
    "Portland Trail Blazers": "POR",	 
    "Sacramento Kings"      : "SAC",
    "San Antonio Spurs"     : "SAS",	 
    "Toronto Raptors"       : "TOR",

    "Utah Jazz"             : "UTA",	 
    "Washington Wizards"    : "WAS",		 
}

# suffix - 24.jpg
TeamImageTags = {
    "ATL" : "atl",	 
    "BOS" : "bos",
    "BRK" : "bkn",	        
    "CHO" : "cha",	 
    "CHI" : "chi",	 
    "CLE" : "cle",	 
    "DAL" : "dal",

    "DEN" : "den",	 
    "DET" : "det",	 
    "GSW" : "gsw",	  
    "HOU" : "hou",     
    "IND" : "ind",	 
    "LAC" : "lac",     
    "LAL" : "lal",

    "MEM" : "mem",	 
    "MIA" : "mia",	 
    "MIL" : "mil",	 
    "MIN" : "min",	 
    "NOP" : "noh",	 
    "NYK" : "nyk",	 

    "OKC" : "okc",	 
    "ORL" : "orl",	 
    "PHI" : "phi",	 
    "PHO" : "pho",	 
    "POR" : "por",	 
    "SAC" : "sac",
    "SAS" : "sas",	 

    "TOR" : "tor",	 
    "UTA" : "uth",	 
    "WAS" : "was",		 
}

# Converts string into number
def getNumber(data):
    try:
        return float(data)
    except:
        return None

# Converts team data into to useable data
def convertTeamData(teamDF):
    data = []
    for row in range(0, len(teamDF)):
        playerInfo = {}
        for attribute in teamDF.columns:
            value = teamDF[attribute][row]
            number = getNumber(value)

            # When value is missing, it is replaced with a zero
            if (value == None or value.replace(" ", "") == "") and not (attribute == "Awards"):
                # print(f"{attribute}:{value}\n") 
                value = getNumber(0)

            # When a number is found in the string, the value is assign to the number
            if not (number==None):
                value = number
            
            playerInfo[attribute] = value
        data.append(playerInfo)
    return data

# Request team stats from abbreviation & add team to list
def addTeam(teamShort):
    dataFrame = getTeamStats(teamShort, Season)
    Teams[teamShort] = convertTeamData(dataFrame)

# Extending addTeam | Request checks
def getTeam(teamShort):
    if teamShort in Teams:
        print("Present")
    else:
        # TODO: Make log to stop multiple calls
        if (not (teamShort in Requesting)):
            print("Requesting...")
            Requesting.append(teamShort)
            addTeam(teamShort)
            Requesting.remove(teamShort)
        else:
            print("Already requested.")
    return Teams[teamShort]