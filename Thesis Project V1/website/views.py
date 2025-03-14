from flask import Blueprint, render_template, jsonify, request
from .static.sampleData import Teams
from .static import utils

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("main.html")

@views.route('/api/teams')
def teams():
    print(len(Teams))
    return jsonify(Teams)

@views.route('/api/process_data', methods=['POST'])
def process_data():
    data = request.get_json()

    test = utils.getGameDetails(data)
    # Process the data
    result = {'message': "Success", "data":test}
    return jsonify(result)