from flask import Blueprint, render_template, jsonify, request
from .static.sampleData import Teams
from .static.data import TeamNames, TeamImageTags, getTeam
from .static import utils

views = Blueprint('views', __name__)

# Home
@views.route('/')
def home():
    return render_template("main.html")

# Retrieve and send team names
@views.route('/api/teams')
def get_all_teams():
    return jsonify(TeamNames, TeamImageTags)

# Retrieve and send team roster with stats
@views.route('/api/team1', methods=['POST'])
@views.route('/api/team2', methods=['POST'])
def get_team_data():
    name = request.get_json()
    data = getTeam(name)
    return jsonify({'message' : 'Success', "data" : data})

# Processes the team data
@views.route('/api/process_data', methods=['POST'])
def process_data():
    data = request.get_json()
    test = utils.getGameDetails(data)
    result = {'message': "Success", "data": test}
    return jsonify(result)