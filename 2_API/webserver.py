from flask import Flask, request, Response
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# User Credentials
@app.route('/menu/', methods=["GET"])
def get_user_credentials():
    data = {}
    data['username'] = 'bcot'
    data['password'] = 'bcot'
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/menu/', methods=["PUT"])
def login_in():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
        username = arguments.get("username")
        password = arguments.get("password")
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        username = request.form.get("username")
        password = request.form.get("password")
    return Response(None, status=202, mimetype='application/json')

@app.route('/menu/', methods=["POST"])
def sign_up():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
        username = arguments.get("username")
        password = arguments.get("password")
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        username = request.form.get("username")
        password = request.form.get("password")
    return Response(None, status=201, mimetype='application/json')

# Schedule weekly
@app.route('/schedule/week/route/', methods=["GET"])
def get_weekly_route_schedule():
    data = {}
    # Get from database
    data['Monday_AM'] = {'1A': 'Rogers', '2A': None}
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/route/', methods=["POST"])
def create_new_route():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
        route = arguments.get("route")
        driver = arguments.get("driver")
        date = arguments.get("date")
        shift = arguments.get("shift")
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.get_json()
        route = request.form.get("route")
        driver = request.form.get("driver")
        date = request.form.get("date")
        shift = request.form.get("shift")
    # Add to database
    return Response(None, status=201, mimetype='application/json')

@app.route('/schedule/week/route/', methods=["PUT"])
def modify_route():
    return 'Hello, World!'

@app.route('/schedule/week/staff/', methods=["GET"])
def get_available_staff():
    return 'Hello, World!'

@app.route('/schedule/week/item/', methods=["GET"])
def get_route_info_on_click():
    return 'Hello, World!'

# Schedule daily
@app.route('/schedule/day/route/', methods=["GET"])
def get_daily_route_schedule():
    return 'Hello, World!'

@app.route('/schedule/day/weather/', methods=["PUT"])
def modify_weather_condition():
    return 'Hello, World!'

@app.route('/schedule/day/vehicle/', methods=["GET"])
def get_vehicle_information():
    return 'Hello, World!'

@app.route('/schedule/day/vehicle/', methods=["PUT"])
def change_vehicle_status():
    return 'Hello, World!'

@app.route('/schedule/day/staff/', methods=["PUT"])
def change_staff_status():
    return 'Hello, World!'

@app.route('/schedule/day/comments/', methods=["PUT"])
def add_comments():
    return 'Hello, World!'






