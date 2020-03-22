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
@app.route('/schedule/week/route', methods=["GET"])
def get_weekly_route_schedule():
    date = request.args.get('date')
    shift = request.args.get('shift')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
        shift = 'day'
    week_of_month = pendulum.parse(date).week_of_month
    data = {}
    data['week_of_month'] = week_of_month
    data['today'] = datetime.now().strftime("%Y-%m-%d")
    # get from database
    data['monday_am'] = [{'route': '1A',
                          'driver': 'Rogers',
                          'route_status': 'completed'},
                         {'route': '2A',
                          'driver': None,
                          'route_status': 'disabled'}]
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/route/available', methods=["GET"])
def get_avaiable_route_list():
    date = request.args.get('date')
    shift = request.args.get('shift')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
        shift = 'day'
    week_of_month = pendulum.parse(date).week_of_month
    data = []
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/route/action', methods=["POST", "PUT", "DELETE"])
def change_route_week():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    route = arguments.get("route")
    date = arguments.get("date")
    shift = arguments.get("shift")
    driver = arguments.get("driver")
    status = arguments.get("route_status")
    permanent =  arguments.get("permanent")
    if request.method == 'POST':  
        # add to database
        status_code = 201
    elif request.method == 'PUT':
        # modify database
        if int(permanent) == 1:
            pass
        else:
            pass
        status_code = 200
    elif request.method == 'DELETE':
        # delete in database
        status_code = 204
    return Response(None, status=status_code, mimetype='application/json')

@app.route('/schedule/week/route/item', methods=["GET"])
def get_route_info_on_click():
    route = request.args.get('route')
    date = request.args.get('date')
    shift = request.args.get('shift')
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/staff', methods=["GET"])
def get_staff_list():
    route = request.args.get('route')
    date = request.args.get('date')
    shift = request.args.get('shift')
    status = request.args.get('status')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
        shift = 'am'
    week_of_month = pendulum.parse(date).week_of_month
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')

# schedule daily view
@app.route('/schedule/day/overview', methods=["GET"])
def get_daily_overview():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = {}
    # get from database
    data['date'] = date
    data['maps_am'] = 10
    data['maps_pm'] = 9
    data['maps_total'] = data['maps_am'] + data['maps_pm']
    data['maps_holiday'] = 0
    data['maps_served'] = 14
    data['maps_missed'] = 1
    data['maps_to_do'] = 4
    data['success_rate'] = data['maps_served'] / data['maps_total']
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/weather', methods=["GET", "PUT"])
def weather_condition():
    if request.method == 'GET':
        date = request.args.get('date')
        if date == None:
            date = datetime.now().strftime("%Y-%m-%d")
        # retrieve weather from database
        weather = 'sunny'
    elif request.method == 'PUT':
        if request.headers['Content-Type'] == 'application/json':
            arguments = request.get_json()
        if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
            arguments = request.form
        weather = arguments.get("weather")
        # put weather info in database
    return Response(json.dumps({'weather': weather}), status=200, mimetype='application/json')

@app.route('/schedule/day/main', methods=["GET"])
def get_daily_route_schedule():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = {}
    # get from database
    data['am'] = [{'route': '1A',
                   'driver': 'Rogers',
                   'route_status': 'completed',
                   'driver_status': 'regular',
                   'vehicle': 7815},
                  {'route': '2A',
                   'driver': None,
                   'route_status': 'disabled',
                   'driver_status': None,
                   'vehicle': None}]
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/main/action', methods=["PUT"])
def change_route_day():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    date = arguments.get("date")
    route = arguments.get("route")
    shift = arguments.get("shift")
    driver = arguments.get("driver")
    vehicle = arguments.get("vehicle")
    route_status = arguments.get("route_status")
    driver_status = arguments.get("driver_status")
    comment = arguments.get("comment")
    # modify database
    return Response(None, status=200, mimetype='application/json')

@app.route('/schedule/day/vehicle', methods=["GET"])
def get_vehicle_list():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/unplanned', methods=["PUT"])
def get_unplanned_routes():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')


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


# vehicle daily view
@app.route('/vehicle/day', methods=["GET"])
def get_daily_vehicle_infomation():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/vehicle/day/action', methods=["POST", "PUT"])
def change_vehicle_day():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    date = arguments.get("date")
    vehicle = arguments.get("vehicle")
    vehicle_status = arguments.get("vehicle_status")
    comment = arguments.get("comment")
    # modify databast
    if request.method == 'POST':
        status_code = 201
        pass
    elif request.method == 'PUT':
        status_code = 200
        pass
    return Response(None, status=status_code, mimetype='application/json')


# vehicle weekly view
@app.route('/vehicle/week', methods=["GET"])
def get_weekly_vehicle_infomation():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    data[7178] = {'vehicle_status': 'available',
                  'maps_swept': 20,
                  'days_available': 312,
                  'days_out_of_service': 12}
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/vehicle/week/action', methods=["PUT"])
def change_vehicle_week():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    vehicle = arguments.get("vehicle")
    vehicle_status = arguments.get("vehicle_status")
    # modify database
    return Response(None, status=200, mimetype='application/json')


# performance
@app.route('/performance/month', methods=["GET"])
def get_monthly_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = []
    # get from database
    data['3A'] = {'route_family': 3,
                  'frequency': 4,
                  'times_swept': 3,
                  'times_missed': 1,
                  'success_rate': 3/(3+1)}
    return Response(None, status=200, mimetype='application/json')

@app.route('/performance/week', methods=["GET"])
def get_weekly_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = []
    # get from database
    data['3A'] = {'route_family': 3,
                  'frequency': 4,
                  'times_swept': 3,
                  'times_missed': 1,
                  'success_rate': 3/(3+1)}
    return Response(None, status=200, mimetype='application/json')

@app.route('/performance/day', methods=["GET"])
def get_daily_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = []
    # get from database
    data['3A'] = {'route_family': 3,
                  'frequency': 4,
                  'times_swept': 3,
                  'times_missed': 1,
                  'success_rate': 3/(3+1)}
    return Response(None, status=200, mimetype='application/json')
