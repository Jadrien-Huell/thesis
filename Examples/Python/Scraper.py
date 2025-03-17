import requests
import pandas as pd
from bs4 import BeautifulSoup 
from basketball_reference_scraper.teams import get_roster, get_team_stats, get_opp_stats, get_roster_stats, get_team_misc
from basketball_reference_scraper.players import get_stats, get_game_logs, get_player_headshot

def scrape_basketball_reference(url):
    """Scrapes data from a Basketball-Reference URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        #soup = BeautifulSoup(response.content, "html.parser")
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None


def scrape_team_roster(team_url):
    """Scrapes a team's roster from a Basketball-Reference page."""
    soup = scrape_basketball_reference(team_url)
    if soup:
        try:
            table = soup.find("table", {"id": "roster"})
            if table:
                headers = [th.text for th in table.find("thead").find_all("th")]
                data = []
                rows = table.find("tbody").find_all("tr")
                for row in rows:
                    cols = row.find_all("td")
                    if cols:
                        player_link = cols[0].find('a')
                        if player_link:
                            player_href = "https://www.basketball-reference.com" + player_link['href']
                            player_data = [col.text.strip() for col in cols]
                            player_data.append(player_href)
                            data.append(player_data)
                headers.append("player_link")
                df = pd.DataFrame(data, columns=headers)
                return df
            else:
                print("Team roster table not found.")
                return None
        except Exception as e:
            print(f"An error occurred during team roster scraping: {e}")
            return None
    else:
      return None
    

roster = get_roster('SAS', '2020')#get_team_stats('SAS', '2020', 'PER_GAME')

print(roster['PLAYER'])



