Link = "https://stories.nba.com/5e2ebaf4-6615-4d9e-ea53-3a18825b9d58"

"""
Traditional splits used to calaculate.
Stats estimate: (p+(p*0.5+15)*1.23)

"""

Teams = {
    '''
    "Example" : [
        { "name": "",         "age": 0, "number": 0, "PTS":0,    "FG%": 0,   "3P%": 0,    "FT%": 0, },
    ],
    '''

    "Pacers" : [
        { "name": "Tyrese Haliburton",  "age": 25, "number": "0",  "PTS":18.5,    "FG%": 46.7,   "3P%": 38.9,    "FT%": 86.3, },
        { "name": "Bennedict Mathurin", "age": 22, "number": "00", "PTS":16.2,    "FG%": 47.0,   "3P%": 35.7,    "FT%": 82.9, },
        { "name": "Obi Toppin",         "age": 27, "number": "1",  "PTS":9.9,     "FG%": 53.2,   "3P%": 33.8,    "FT%": 80.5, },
        { "name": "Andrew Nembhard",    "age": 25, "number": "2",  "PTS":10.3,    "FG%": 47.1,   "3P%": 31.1,    "FT%": 79.4, },
        { "name": "Thomas Bryant",      "age": 27, "number": "3",  "PTS":6.9,     "FG%": 52.0,   "3P%": 35.5,    "FT%": 82.6, },
        { "name": "Jarace Walker",      "age": 21, "number": "5",  "PTS":5.5,    "FG%": 45.6,   "3P%": 36.4,    "FT%": 63.9, },
        { "name": "Enrique Freeman",    "age": 24, "number": "8",  "PTS":1.7,    "FG%": 48.0,   "3P%": 16.7,    "FT%": 53.8, },
        { "name": "T.J. McConnell",     "age": 32, "number": "9",  "PTS":9.5,    "FG%": 52.3,   "3P%": 31.0,    "FT%": 74.6, },
        { "name": "RayJ Dennis",        "age": 23, "number": "10", "PTS":0.9,    "FG%": 20.0,   "3P%": 14.3,    "FT%": 100, },
        { "name": "Johnny Furphy",      "age": 20, "number": "12", "PTS":1.7,    "FG%": 36.5,   "3P%": 30.6,    "FT%": 100, },
        { "name": "James Johnson",      "age": 38, "number": "16", "PTS":0.7,    "FG%": 36.4,   "3P%": 0,    "FT%": 0, },
        { "name": "Isaiah Jackson",     "age": 23, "number": "22", "PTS":7.0,    "FG%": 60.9,   "3P%": 0,    "FT%": 50.0, },
        { "name": "Aaron Nesmith",      "age": 25, "number": "23", "PTS":10.4,    "FG%": 48.4,   "3P%": 38.3,    "FT%": 91.1, },
        { "name": "Ben Sheppard",       "age": 23, "number": "26", "PTS":6.0,    "FG%": 43.9,   "3P%": 36.3,    "FT%": 91.3, },
        { "name": "Quenton Jackson",    "age": 26, "number": "29", "PTS":5.5,    "FG%": 47.7,   "3P%": 35.7,    "FT%": 71.4, },
        { "name": "Myles Turner",       "age": 28, "number": "33", "PTS":15.5,   "FG%": 47.5,   "3P%": 39.7,    "FT%": 77.2, },
        { "name": "Pascal Siakam",      "age": 30, "number": "43", "PTS":20.8,   "FG%": 52.4,   "3P%": 40.1,    "FT%": 74.7, },
        
    ],

    "76ers": [
        { "name": "Tyrese Maxey",       "age": 24, "number": "0",  "PTS":26.3, "FG%": 43.7,   "3P%": 33.7,    "FT%": 87.9, },
        { "name": "Andre Drummond",     "age": 31, "number": "1",  "PTS":7.4,  "FG%": 50.4,   "3P%": 15.8,    "FT%": 62.2, },
        { "name": "Quentin Grimes",     "age": 24, "number": "5",  "PTS":12.1, "FG%": 47.8,   "3P%": 39.5,    "FT%": 73.8, },
        { "name": "Kyle Lowry",         "age": 38, "number": "7",  "PTS":4,    "FG%": 35.1,   "3P%": 33.7,    "FT%": 81.8, },
        { "name": "Paul George",        "age": 34, "number": "8",  "PTS":16.2, "FG%": 43.0,   "3P%": 41.3,    "FT%": 81.4, },
        { "name": "Kelly Oubre Jr.",    "age": 29, "number": "9",  "PTS":15.1, "FG%": 47.1,   "3P%": 29.6,    "FT%": 76.0, },
        { "name": "Jeff Dowtin Jr.",    "age": 27, "number": "11", "PTS":4.5,  "FG%": 45.5,   "3P%": 41.0,    "FT%": 69.2, },
        { "name": "Jared Butler",       "age": 24, "number": "12", "PTS":7.1,  "FG%": 47.1,   "3P%": 34.7,    "FT%": 79.3, },
        { "name": "Ricky Council IV",   "age": 23, "number": "14", "PTS":6.3,  "FG%": 40.8,   "3P%": 29.0,    "FT%": 82.6, },
        { "name": "Lonnie Walker IV",   "age": 26, "number": "16", "PTS":9.1,  "FG%": 35.0,   "3P%": 32.7,    "FT%": 83.3, },
        { "name": "Jalen Hood-Schifino","age": 21, "number": "17", "PTS":2.0,  "FG%": 100,    "3P%": 0,       "FT%": 100, },
        { "name": "Justin Edwards",     "age": 21, "number": "19", "PTS":8.4,  "FG%": 45.4,   "3P%": 36.1,    "FT%": 70.4, },
        { "name": "Jared McCain",       "age": 21, "number": "20", "PTS":15.3, "FG%": 46.0,   "3P%": 38.3,    "FT%": 87.5, },
        { "name": "Joel Embiid",        "age": 30, "number": "21", "PTS":23.8, "FG%": 44.4,   "3P%": 29.9,    "FT%": 88.2, },
        { "name": "Eric Gordon",        "age": 36, "number": "23", "PTS":6.8,  "FG%": 42.6,   "3P%": 40.9,    "FT%": 75.0, },
        { "name": "Guerschon Yabusele", "age": 29, "number": "28", "PTS":10.5, "FG%": 50.1,   "3P%": 38.8,    "FT%": 74.3, },
        { "name": "Adem Bona",          "age": 21, "number": "30", "PTS":3.5,  "FG%": 68.5,   "3P%": 0,       "FT%": 65.5, },
        { "name": "Alex Reese",         "age": 25, "number": "65", "PTS":3.8,  "FG%": 50.0,   "3P%": 25.0,    "FT%": 60.0, },
    ]
}

print(f"Pacers v. 76ers: {Link}")