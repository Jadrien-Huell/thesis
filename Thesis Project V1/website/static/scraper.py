import requests
import pandas
from bs4 import BeautifulSoup

# Basketball-reference team url format
def getUrl(team, season):
    return f'https://www.basketball-reference.com/teams/{team}/{season}.html'

# Gets team data from season via web-scrape
def getTeamStats(team, season):
    df = pandas.DataFrame()
    try:
        url = getUrl(team, season)
        page = None
        page = requests.get(url)
        soup = BeautifulSoup(page.text, 'html.parser')
        table = soup.find('table', attrs={"id":"per_game_stats"})
        print(url)

        if table:
            stats_titles = table.find_all('th') #attrs={"scope":"col"}
            stats_table_titles = [ titles.text.strip() for titles in stats_titles[:30] ]
            df = pandas.DataFrame(columns=stats_table_titles)

            stats_columns = table.find_all('tr')
            for stats_row in stats_columns[1:]:
                row_data = stats_row.find_all('td')
                rank_data = stats_row.find_all('th')

                rank = [ data.text.strip() for data in rank_data ]
                stats = [ data.text.strip() for data in row_data ]
                stats.insert(0, rank[0])

                df.loc[len(df)] = stats
            else:
                # print(f"Table 'per_game_stats' not found for {team} {season}")
                pass
    except requests.exceptions.RequestException as e:
        print(f"Error fetching page: {e}")
    except AttributeError as e:
        print(f"Error parsing HTML: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    
    return df

