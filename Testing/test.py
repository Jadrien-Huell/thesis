import requests
import pandas
from bs4 import BeautifulSoup

def getUrl(team, season):
    return f'https://www.basketball-reference.com/teams/{team}/{season}.html'

def getTeamStats(team, season):
    url = getUrl(team, season)
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')

    table = soup.find('table', attrs={"id":"per_game_stats"})

    stats_titles = table.find_all('th') # attrs={"scope":"col"}
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

    return df

