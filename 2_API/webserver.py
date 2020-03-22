from flask import Flask, request, Response
import json
from datetime import datetime
import pendulum

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# user credentials
@app.route('/menu', methods=["GET"])
def get_user_information():
    data = {}
    # get from database
    data['username'] = 'bcot'
    data['name'] = 'bcot'
    data['email'] = 'bcot'
    data['role'] = 'bcot'
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/menu', methods=["PUT"])
def login_in():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    username = arguments.get("username")
    email = arguments.get("email")
    password = arguments.get("password")
    # check with database
    return Response(None, status=200, mimetype='application/json')

@app.route('/menu', methods=["POST"])
def sign_up():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form   
    username = arguments.get("username")
    password = arguments.get("password")
    name = arguments.get("name")
    email = arguments.get("email")
    role = arguments.get("role")
    # add to database
    return Response(None, status=201, mimetype='application/json')


# schedule weekly view
@app.route('/schedule/week/route?date=<date>&shift=<shift>', methods=["GET"])
def get_weekly_route_schedule(date, shift):
    week_of_month = pendulum.parse(date).week_of_month
    data = {}
    data['week_of_month'] = week_of_month
    data['today'] = datetime.date(datetime.now())
    # get from database
    data['monday_am'] = [('1A', 'Rogers', True, 'Completed'),
                         ('2A', None, False, 'Unassigned')]
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/route', methods=["POST"])
def create_new_route():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form 
    route = arguments.get("route")
    driver = arguments.get("driver")
    date = arguments.get("date")
    shift = arguments.get("shift")
    status = arguments.get("status")
    # add to database
    return Response(None, status=201, mimetype='application/json')

@app.route('/schedule/week/route', methods=["PUT"])
def modify_route():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form 
    route = arguments.get("route")
    driver = arguments.get("driver")
    date = arguments.get("date")
    shift = arguments.get("shift")
    status = arguments.get("status")
    # modify database
    return Response(None, status=200, mimetype='application/json')

@app.route('/schedule/week/staff', methods=["GET"])
def get_staff_list():
    date = datetime.date(datetime.now())
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/item?route=<route>&date=<date>&shift=<shift>', methods=["GET"])
def get_route_info_on_click(route, date, shift):
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')


# schedule daily view
@app.route('/schedule/day/route', methods=["GET"])
def get_daily_route_schedule():
    return 'Hello, World!'

@app.route('/schedule/day/weather', methods=["PUT"])
def modify_weather_condition():
    return 'Hello, World!'

@app.route('/schedule/day/vehicle', methods=["GET"])
def get_vehicle_information():
    return 'Hello, World!'

@app.route('/schedule/day/vehicle', methods=["PUT"])
def change_vehicle_status():
    return 'Hello, World!'

@app.route('/schedule/day/staff', methods=["PUT"])
def change_staff_status():
    return 'Hello, World!'

@app.route('/schedule/day/comments', methods=["PUT"])
def add_comments():
    return 'Hello, World!'


# operator weekley view
@app.route('/operator/week/info', methods=["GET"])
def get_weekly_operator_info():
    return 'weekly operator info'

@app.route('/operator/week/comment', methods=["POST"])
def add_weekly_operator_comment():
    return 'add_weekly_operator_comment'

@app.route('/operator/week/remove', methods=["POST"])
def remove_operator():
    return 'remove operator'

@app.route('/operator/week/add', methods=["POST"])
def add_operator():
    return 'add operator'

# operator daily view
@app.route('/operator/day/info', methods=["GET"])
def get_daily_operator_info():
    return 'daily operator info'

@app.route('/operator/day/hours', methods=["POST"])
def change_hours():
    return 'change_hours'

@app.route('/operator/day/comment', methods=["POST"])
def add_daily_operator_comment():
    return 'add_daily_operator_comment'

@app.route('/operator/day/individual', methods=["POST"])
def add_individual_operator_info():
    return 'add_individual_operator_info'