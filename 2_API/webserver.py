from flask import Flask, request, Response
import json
from datetime import datetime
import pendulum
from collections import defaultdict

app = Flask(__name__)
# NOTE: switch out mypass with your own docker password
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:mypass@mariadb-bcot.db-network/OAKLAND_STREET_SWEEPING'
db = SQLAlchemy(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


def get_wk_start_end(d):
    # d is the date
    day_of_wk = d.weekday()
    #days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_start = d-day_of_wk
    wk_end = d-day_of_wk+6
    return (wk_start,wk_end)


# user credentials
@app.route('/menu', methods=["GET"])
def get_user_information():
    data = {}
    # get from database
    # ANNA how to store secure info (password etc)

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

wk_route_map = {1:['Mon1_AM','Mon1_PM','Mon1_night','Tue1_AM','Tue1_PM','Tue1_night','Wed1_AM','Wed1_PM','Wed1_night','Thu1_AM','Thu1_PM','Thu1_night','Fri1_AM','Fri1_PM','Fri1_night','Sat1_AM','Sat1_PM','Sat1_night','Sun1_AM','Sun1_PM','Sun1_night'],2:['Mon2_AM','Mon2_PM','Mon2_night','Tue2_AM','Tue2_PM','Tue2_night','Wed2_AM','Wed2_PM','Wed2_night','Thu2_AM','Thu2_PM','Thu2_night','Fri2_AM','Fri2_PM','Fri2_night','Sat2_AM','Sat2_PM','Sat2_night','Sun2_AM','Sun2_PM','Sun2_night'],3:['Mon3_AM','Mon3_PM','Mon3_night','Tue3_AM','Tue3_PM','Tue3_night','Wed3_AM','Wed3_PM','Wed3_night','Thu3_AM','Thu3_PM','Thu3_night','Fri3_AM','Fri3_PM','Fri3_night','Sat3_AM','Sat3_PM','Sat3_night','Sun3_AM','Sun3_PM','Sun3_night'],4:['Mon4_AM','Mon4_PM','Mon4_night','Tue4_AM','Tue4_PM','Tue4_night','Wed4_AM','Wed4_PM','Wed4_night','Thu4_AM','Thu4_PM','Thu4_night','Fri4_AM','Fri4_PM','Fri4_night','Sat4_AM','Sat4_PM','Sat4_night','Sun4_AM','Sun4_PM','Sun4_night'],5:['Mon5_AM','Mon5_PM','Mon5_night','Tue5_AM','Tue5_PM','Tue5_night','Wed5_AM','Wed5_PM','Wed5_night','Thu5_AM','Thu5_PM','Thu5_night','Fri5_AM','Fri5_PM','Fri5_night','Sat5_AM','Sat5_PM','Sat5_night','Sun5_AM','Sun5_PM','Sun5_night']}

# schedule weekly view
@app.route('/schedule/week/route', methods=["GET"])
def get_weekly_route_schedule():
    date = request.args.get('date')
    shift = request.args.get('shift')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
        shift = 'day'
    week_of_month = pendulum.parse(date).week_of_month
    data = defaultdict(list)#{}
    data['week_of_month'] = week_of_month
    data['today'] = datetime.now().strftime("%Y-%m-%d")
    
    # get from database
    wk_days = wk_route_map[week_of_month]
    for d in wk_days:
        if len(d) >7: #night
            s=d[:3]+"_night"
        else:
            s = d[:3]+d[-3:]
        routes_db = db.engine.execute("select ro.route_id, d.employee_name, r.completed from ROUTES ro join ROUTE_LOG r on ro.route_id = r.route_id join DRIVERS d on r.employee_id = d.employee_id where ro.{d}=1;".format(d=d))
        data[s].append({'route':routes_db[0], 'driver':routes_db[1], 'route_status':routes_db[2]})


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
    day_of_wk = date.weekday()
    #days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_start = date-day_of_wk
    wk_end = date-day_of_wk+6

    routes_db = db.engine.execute("select route_id from ROUTE_LOG where date>={ds} and date <= {de} and employee_id=NULL;".format(ds=wk_start,de=wk_end))
    for row in routes_db:
        data.append(row)

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

    l_id = 1234 # for log_id, not sure how to get this for editing/deleting certain route logs
    if request.method == 'POST':  
        # add to database
        last_id = db.engine.execute("select MAX(log_id) from ROUTE_LOG;")
        employee_id = db.engine.execute("select employee_id from DRIVERS where employee_name='{n}';".format(n=driver))
        db.engine.execute("insert into ROUTE_LOG (log_id,date_swept,route_id,shift,employee_id,completion) VALUES "
            "({id},{d},{r},{s},{e},{v},{c},{n});".format(id=last_id+1,d=date,r=route,s=shift,e=employee_id,c=status))
        status_code = 201
    elif request.method == 'PUT':
        # modify database
        emp_id = db.engine.execute("select employee_id from DRIVERS where employee_name={e}".format(e=driver))
        db.engine.execute("update ROUTE_LOG set route_id={r},date_swept={d},shift={s},driver={e},completion={c} where log_id={l_id};".format(r=route,d=date,s=shift,e=emp_id,c=status,l_id=l_id))

        if int(permanent) == 1:
            pass
        else:
            pass
        status_code = 200
    elif request.method == 'DELETE':
        # delete in database
        db.engine.execute("delete from ROUTE_LOG where log_id={l}".format(l=l_id))
        status_code = 204
    return Response(None, status=status_code, mimetype='application/json')

@app.route('/schedule/week/route/item', methods=["GET"])
def get_route_info_on_click():
    route = request.args.get('route')
    date = request.args.get('date')
    shift = request.args.get('shift')
    data = {}
    # get from database
    # ANNA is this the log info or the route info
    route_info db.engine.execute("select route_id,monthly_freq from ROUTES where route_id={r};".format(r=route))

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

    wk_start,wk_end = get_wk_start_end(date)
    # get from database
    assigned_staff = []
    assigned_query = "select employee_name from ROUTE_LOG where route_id={r} and date_swept>={ds} and date_swept<={de};".format(ds=wk_start,de=wk_end)
    assigned_query_id = "select employee_id from ROUTE_LOG where route_id={r} and date_swept>={ds} and date_swept<={de};".format(ds=wk_start,de=wk_end)
    staff_assigned = db.engine.execute(assigned_query)
    
    staff_unassigned = db.engine.execute("select employee_name from DRIVERS where employee_id not in ({a});".format(a=assigned_query_id))

    data['assigned'] = staff_assigned
    data['unassigned'] = staff_unassigned


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
    # get day of week from date
    day_of_wk = date.weekday()#datetime.today().weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}

    routes_db = db.engine.execute("select * from ROUTES where {d}{w}_AM=1 or {d}{w}_PM=1".format(d=days[day_of_wk],w=week_of_month))
    num_am = db.engine.execute("select count(*) from ROUTES where {d}{w}_AM=1".format(d=days[day_of_wk],w=week_of_month))
    num_pm = db.engine.execute("select count(*) from ROUTES where {d}{w}_PM=1".format(d=days[day_of_wk],w=week_of_month))
    maps_served = db.engine.execute("select count(*) from ROUTE_LOG where date={date} and completion='completed';".format(date=date))
    maps_missed = db.engine.execute("select count(*) from ROUTE_LOG where date={date} and completion='missed';".format(date=date))
    maps_holiday = db.engine.execute("select count(*) from ROUTE_LOG where date={date} and completion='holiday';".format(date=date))
    # ANNA not sure what the completion status fill values will be (e.g. completed, missed, holiday, etc)

    data['date'] = date
    data['maps_am'] = num_am
    data['maps_pm'] = num_pm
    data['maps_total'] = num_am + num_pm
    data['maps_holiday'] = maps_holiday
    data['maps_served'] = maps_served
    data['maps_missed'] = maps_missed
    data['maps_to_do'] = num_am + num_pm - maps_served - maps_missed
    data['success_rate'] = data['maps_served'] / data['maps_total']
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/weather', methods=["GET", "PUT"])
def weather_condition():
    if request.method == 'GET':
        date = request.args.get('date')
        if date == None:
            date = datetime.now().strftime("%Y-%m-%d")
        # retrieve weather from database
        weather = db.engine.execute("select weather from DAY_LOG where log_date={d};".format(d=date))
    elif request.method == 'PUT':
        date = request.args.get('date')
        if date == None:
            date = datetime.now().strftime("%Y-%m-%d")
        if request.headers['Content-Type'] == 'application/json':
            arguments = request.get_json()
        if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
            arguments = request.form
        weather = arguments.get("weather")
        # put weather info in database
        db.engine.execute("update DAY_LOG set weather='{w}' where log_date={d};".format(w=weather,d=date))
    return Response(json.dumps({'weather': weather}), status=200, mimetype='application/json')

@app.route('/schedule/day/main', methods=["GET"])
def get_daily_route_schedule():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = defaultdict(list)

    data['am'] = [{'route': '1A',
                   'driver': 'Rogers',
                   'route_status': 'completed',
                   'driver_status': 'regular', # ANNA what is driver status
                   'vehicle': 7815},
                  {'route': '2A',
                   'driver': None,
                   'route_status': 'disabled',
                   'driver_status': None,
                   'vehicle': None}]
    
    # get from database
    route_log_db_query = "select route_id,employee_id,employee_status,vehicle_id,completion,shift from ROUTE_LOG where date_swept={d};".format(date)
    route_db = db.engine.execute(route_log_db_query)
    #route_db = db.engine.execute("select r.route_id, r.completion, r.vehicle_id, r.shift, D.employee_name from ROUTE_LOG r join DRIVERS D on r.employee_id = D.employee_id where date_swept={d} and shift='AM';".format(d=date))
    for route_log in route_db:
        route_id, driver, driver_status, vehicle, route_status, shift  = route_log
        data[shift].append({'route':route_id,'driver':driver,'driver_status':driver_status,'route_status':route_status,'vehicle':vehicle})

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
    driver = arguments.get("driver") #ANNA id or name?
    vehicle = arguments.get("vehicle")
    route_status = arguments.get("route_status")
    driver_status = arguments.get("driver_status")
    comment = arguments.get("comment")

    # modify database
    last_id = db.engine.execute("select MAX(log_id) from ROUTE_LOG;")
    employee_id = db.engine.execute("select employee_id from DRIVERS where employee_name='{n}';".format(n=driver))
    db.engine.execute("insert into ROUTE_LOG (log_id,date_swept,route_id,shift,employee_id,vehicle_id,completion,notes) VALUES "
    	"({id},{d},{r},{s},{e},{v},{c},{n});".format(id=last_id+1,d=date,r=route,s=shift,e=employee_id,v=vehicle,c=route_status,n=comment))


    return Response(None, status=200, mimetype='application/json')

@app.route('/schedule/day/vehicle', methods=["GET"]) 
def get_vehicle_list():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    # in use: in ROUTE_LOG for day
    # available: not in maintenance and not in ROUTE_LOG for day
    # unavailable: in maintenance
    maint_query = "select vehicle_id from VEHICLE_MAINTENANCE where date_service={date} or (date_service<={date} and date_end>={date}".format(date=date)
    route_log_query = "select vehicle_id from ROUTE_LOG where date_swept={d}".format(d=date)
    available_vehicles = db.engine.execute("select vehicle_id from VEHICLES where vehicle_id not in (maint_query) and vehicle_id not in (route_log_query);")
    in_use_vehicles = db.engine.execute(route_log_query)
    maintenance_vehicles = db.engine.execute(maint_query)
    data['available'] = available_vehicles
    data['in_use'] = in_use_vehicles
    data['maintenance'] = maintenance_vehicles
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/unplanned', methods=["PUT"])  # ANNA what is this
def get_unplanned_routes():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {'unplanned':[],'planned':[]}
    # get from database
    day_of_wk = date.weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_of_month = pendulum.parse(date).week_of_month
    routes_today = db.engine.execute("select route_id from ROUTE_LOG where date_swept={d}".format(d=date))
    for route in routes_today:
        route_today = db.engine.execute("select {d}{w}_AM,{d}{w}_PM,{d}{w}_night from ROUTES where route_id={r};".format(r=route))
        if route_today[0] == None and route_today[1] == None and route_today[2] == None:
            data['unplanned'].append(route)
        else:
            data['planned'].append(route)


    return Response(json.dumps(data), status=200, mimetype='application/json')


driver_night_shifts = ['shift_mon_pm','shift_tue_pm','shift_wed_pm','shift_thu_pm','shift_fri_pm','shift_sat_pm','shift_sun_pm']
driver_day_shifts = ['shift_mon','shift_tue','shift_wed','shift_thu','shift_fri','shift_sat','shift_sun']
driver_night_where = "shift_mon_pm=1 or shift_tue_pm=1 or shift_wed_pm=1 or shift_thu_pm=1 or shift_fri_pm=1 or shift_sat_pm=1 or shift_sun_pm=1"
driver_day_where = "shift_mon=1 or shift_tue=1 or shift_wed=1 or shift_thu=1 or shift_fri=1 or shift_sat=1 or shift_sun=1"
#operator weekly view
@app.route('/operator/week', methods=["GET"])
def get_weekly_operator_info():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {'day':[],'night':[]}
    # get from database

    day_of_wk = date.weekday()
    #days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_start = date-day_of_wk
    wk_end = date-day_of_wk+6

    # not sure how we're calculating these global holidays where no one works
    holidays = db.engine.execute("select count(*) from HOLIDAY where holiday_date>={hs} and holiday_date<={he};".format(hs=wk_start,he=wk_end))
    holiday_hours = holidays*8

    drivers = db.engine.execute("select employee_id,employee_name,hours,shift from DRIVERS;")
    for driver in drivers:
        driver_id = driver[0]
        driver_name = driver[1]
        driver_hours = driver[2]
        driver_shift = driver[3]
        num_routes_query = "select count(*) from ROUTE_LOG where date_swept>={ds} and date_swept<={de} and employee_id={e} and completion='{c}';"
        driver_routes_swept = db.engine.execute(num_routes_query.format(ds=wk_start,de=wk_end,e=driver_id,c='completed'))
        driver_routes_missed = db.engine.execute(num_routes_query.format(ds=wk_start,de=wk_end,e=driver_id,c='missed'))

        absences_query = "select sum(time_missed) from ABSENCES where date_absence>={ds} and date_absence<={de} and employee_id={e};"
        leave_hrs = db.engine.execute(absences_query.format(ds=wk_start,de=wk_end,e=driver_id))

        overtime_query = "select sum(time_over) from OVERTIME where date_overtime>={ds} and date_overtime<={de} and employee_id={e};"
        overtime_hrs = db.engine.execute(overtime_query.format(ds=wk_start,de=wk_end,e=driver_id))

        driver_data = {'name': driver_name,
                    'working_hrs': driver_hours-leave_hrs-holiday_hours+overtime_hrs,
                    'leave_hrs': leave_hrs,
                    'acting_hrs': 0, # what is this
                    'standby_hrs': 0, # what is this
                    'overtime_hrs': overtime_hrs,
                    'holiday_hrs': holiday_hours,
                    'is_reviewed': True, # what is this
                    'swept_total': driver_routes_swept,
                    'missed_total': driver_routes_missed}

        data[driver_shift].append(driver_data)



    data['day'] = [{'name': 'Roger',
                    'working_hrs': 8,
                    'leave_hrs': 0,
                    'acting_hrs': 0,
                    'standby_hrs': 0, # what is this
                    'overtime_hrs': 0,
                    'holiday_hrs': 0,
                    'is_reviewed': True, # what is this
                    'swept_total': 5,
                    'missed_total': 0},
                   {'name': 'Michael',
                    'working_hrs': 3,
                    'leave_hrs': 5,
                    'acting_hrs': 1,
                    'standby_hrs': 1,
                    'overtime_hrs': 1,
                    'holiday_hrs': 1,
                    'is_reviewed': False,
                    'swept_total': 4,
                    'missed_total': 1}]
    data['night'] = [{'name': 'Roger',
                    'working_hrs': 8,
                    'leave_hrs': 0,
                    'acting_hrs': 0,
                    'standby_hrs': 0,
                    'overtime_hrs': 0,
                    'holiday_hrs': 0,
                    'is_reviewed': True,
                    'swept_total': 5,
                    'missed_total': 0},
                   {'name': 'Michael',
                    'working_hrs': 3,
                    'leave_hrs': 5,
                    'acting_hrs': 1,
                    'standby_hrs': 1,
                    'overtime_hrs': 1,
                    'holiday_hrs': 1,
                    'is_reviewed': False,
                    'swept_total': 4,
                    'missed_total': 1}]

    return Response(json.dumps(data), status=200, mimetype='application/json')

# operator daily view
@app.route('/operator/day/onduty', methods=["GET"])
def get_daily_onduty_operator_info():
    date = request.args.get('date')
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # how is this different from the previous method

    # get from database
    data['day'] = [{'name': 'Roger',
                    'working_hrs': 8,
                    'leave_hrs': 0,
                    'acting_hrs': 0,
                    'standby_hrs': 0,
                    'overtime_hrs': 0,
                    'holiday_hrs': 0,
                    'is_reviewed': True},
                   {'name': 'Michael',
                    'working_hrs': 3,
                    'leave_hrs': 5,
                    'acting_hrs': 1,
                    'standby_hrs': 1,
                    'overtime_hrs': 1,
                    'holiday_hrs': 1,
                    'is_reviewed': False}]
    data['night'] = [{'name': 'Roger',
                    'working_hrs': 8,
                    'leave_hrs': 3,
                    'acting_hrs': 0,
                    'standby_hrs': 0,
                    'overtime_hrs': 0,
                    'holiday_hrs': 0,
                    'is_reviewed': False},
                     {'name': 'Roger',
                      'working_hrs': 8,
                      'leave_hrs': 3,
                      'acting_hrs': 0,
                      'standby_hrs': 0,
                      'overtime_hrs': 0,
                      'holiday_hrs': 0,
                      'is_reviewed': True}]
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/operator/day/offduty', methods=["GET"])
def get_daily_offduty_operator_info():
    date = request.args.get('date')
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {'day':[],'night':[]}
    # get from database
    absences_query = "select a.employee_id,d.employee_name,a.type,d.shift from ABSENCES a join DRIVERS d on a.employee_id=d.employee_id where date_absence={d};".format(d=date)
    absences = db.engine.execute(absences_query.format(ds=wk_start,de=wk_end,e=driver_id,c='missed'))

    for a in absences:
        data[a[3]].append({'employee_id':a[0],'name':a[1],'leave':a[2]})

    data['day'] = [{'employee_id': '1',
                    'name':'Mike',
                    'leave': 'Sick'},
                   {'employee_id': '2',
                    'name': 'Rick',
                    'leave': 'Family'}]
    data['night'] = [{'employee_id': '1',
                    'name':'Mike',
                    'leave': 'Sick'},
                   {'employee_id': '2',
                    'name': 'Rick',
                    'leave': 'Family'}]
    return Response(data, status=200, mimetype='application/json')

@app.route('/operator/day/check', methods=["PUT"])
def update_review_status():
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    # modify database
    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/day/unassigned', methods=["GET"])
def get_unassigned_routes():
    data = {}
    # get from database
    # ANNA is this a particular day or in general?
    data['day'] = ['7A-1', '11A']
    data['night'] = ['7A-1', '11A']
    return Response(data, status=200, mimetype='application/json')

@app.route('/operator/day/add', methods=["POST"])
def add_individual_operator():
    name = request.args.get('name')
    shift = request.args.get('shift')
    routes = request.args.get('routes')
    # modify database
    # ANNA what is this adding?
    return Response(None, status=200, mimetype='application/json')


# operator individual view
@app.route('/operator/individual/info', methods=["GET"])
def get_individual_operator_info():
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    data = {}
    # get from database
    day_of_wk = datetime.today().weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_of_month = pendulum.parse(date).week_of_month
    operator = db.engine.execute("select name,shift,hours,route_id_{d}{w}_AM,route_id_{d}{w}_PM,route_id_{d}{w}_night from DRIVERS where employee_id={e}".format(d=days[day_of_wk],w=wk_of_month,e=employee_id))

    absences_query = "select sum(time_missed) from ABSENCES where date_absence={d} and employee_id={e};"
    leave_hrs = db.engine.execute(absences_query.format(d=date,e=employee_id))

    overtime_query = "select sum(time_over) from OVERTIME where date_overtime={d} and employee_id={e};"
    overtime_hrs = db.engine.execute(overtime_query.format(d=date,e=employee_id))

    data['name'] = operator[0]#'Roger'
    data['status'] = True
    operator_routes = []
    for o in operator[3:]:
        if o:
            operator_routes.append(o)
    routes = operator[2]+','+operator[3]+','+operator[4]
    data['assignments'] = [{'shift': operator[1],#'AM',
                            'route': operator_routes,#['7A'], 

                            'working_hrs': operator[2]+overtime_hrs-leave_hrs,
                            'overtime_hrs':overtime_hrs,
                            'leave_hrs': leave_hrs,
                            'acting_7.5_hrs': 0, # ANNA what are these
                            'acting_12.5_hrs': 0,
                            'standby_hrs': 0,
                            'holiday_hrs': 5}]
    return Response(data, status=200, mimetype='application/json')

@app.route('/operator/individual/history', methods=["GET"])
def get_individual_operator_history():
    employee_id = request.args.get('employee_id')
    year = request.args.get('year')
    data = {}
    # get from database
    data['history'] = [{'week': '1/6-1/10',
                        'total_scheduled': 20,
                        'total_swept': 18,
                        'success_rate': 95,
                        'total_working_hrs': 100,
                        'total_leave_hrs': 10}]
    return Response(data, status=200, mimetype='application/json')

@app.route('/operator/individual/add_leave', methods=["POST"])
def update_individual_operator_leave():
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')
    reason = request.args.get('reason')
    # modify database
    last_id = db.engine.execute("select max(absence_id) from ABSENCES;")
    db.engine.execute("insert into `ABSENCES` (absence_id, employee_id,date_absence,time_start,time_end,type) VALUES ({id},{eid},{d},{ts},{td},{t});".format(id=last_id+1,eid=employee_id,d=date,ts=start_time,te=end_time,t=reason))

    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/day/comment', methods=["PUT"])
def add_individual_operator_comment():
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    shift = request.args.get('shift')

    # modify database
    # ANNA add comment to what?
    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/individual/update_special', methods=["POST"])
def update_individual_operator_special_assignment():
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    hours = request.args.get('hours')
    assignment_type = request.args.get('assignment_type')
    # modify database
    # ANNA what is this
    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/week/remove', methods=["POST"])
def remove_operator():
    employee_id = request.args.get('employee_id')
    # modify database
    db.engine.execute("delete from DRIVERS where employee_id={e}".format(e=employee_id))
    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/individual/assignment', methods=["GET"])
def get_operator_assignment():
    employee_id = request.args.get('employee_id')
    month = request.args.get('month')
    data = {}
    # get from database
    # ANNA does employee need to go in the data?

    data['assignment'] = [{'week': 1,
                           'shift': 'AM',
                           'route': ['7A', '7A-1']}]
    return Response(data, status=200, mimetype='application/json')

@app.route('/operator/individual/assign', methods=["POST"])
def modify_a_weekly_assignment():
    # assign or unassign
    action = request.args.get('assigned')
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    route = request.args.get('route')
    # modify database
    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/individual/update_longterm', methods=["POST"])
def modify_longterm_assignment():
    action = request.args.get('assignment')
    # modify database
    #what is action?
    employee_id = request.args.get('employee_id')
    route = request.args.get('route')
    day = request.args.get('day') #day of week, Mon,Tue,Wed,Thu,Fri,Sat,Sun
    week = request.args.get('week') #integer
    shift = request.args.get('shift') # AM, PM, night
    db.engine.execute("update DRIVERS set route_id_{d}{w}_{t}=1 where employee_id={id};".format(d=day,w=week,t=shift,id=employee_id))
    return Response(None, status=200, mimetype='application/json')

# vehicle daily view
@app.route('/vehicle/day', methods=["GET"])
def get_daily_vehicle_infomation():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    vehicles = db.engine.execute("select * from VEHICLES;")
    maintenance_v = db.engine.execute("select vehicle_id from VEHICLE_MAINTENANCE where date_service={d} or (date_service <={d} and date_end >={d});".format(d=date))
    #not sure which fields we need
    for v in vehicles:
        if v[0] not in maintenance_v:
            data[v[0]] = {'status_am':v[1],'status_pm':v[2],'status_night':v[3],'make':v[4],'description':v[5],'year':v[7],'license':v[8],'id_no':v[9]}

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
    # ANNA is this for maintenance or adding vehicles?
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
    swept_query = "select sum(*) from ROUTE_LOG where route_id={r} and completion={c} and MONTH(date_swept)={m} and YEAR(date_swept)={y};"
    routes = db.engine.execute("select route_id,monthly_freq from ROUTES;")
    for route_info in routes:
        route = route_info[0]
        freq = route_info[1]
        num_swept = db.engine.execute(swept_query.format(r=route,c='completed',m=date.month,y=date.year))
        num_missed = db.engine.execute(swept_query.format(r=route,c='missed',m=date.month,y=date.year))
        date[route] = {'route_family':route[0],'frequency':freq,'times_swept':num_swept,'times_missed':num_missed,'success_rate':num_swept/(num_swept+num_missed)}

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
    week_of_month = pendulum.parse(date).week_of_month
    # get day of week from date
    day_of_wk = date.weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    start_date = date-days[day_of_wk]
    end_date = date-days[day_of_wk]+6

    swept_query = "select sum(*) from ROUTE_LOG where route_id={r} and completion={c} and date_swept>={sd} and date_swept<={ed};"
    routes = db.engine.execute("select route_id,monthly_freq from ROUTES;")
    for route_info in routes:
        route = route_info[0]
        freq = route_info[1]
        num_swept = db.engine.execute(swept_query.format(r=route,c='completed',sd=start_date,ed=end_date))
        num_missed = db.engine.execute(swept_query.format(r=route,c='missed',sd=start_date,ed=end_date))
        date[route] = {'route_family':route[0],'frequency':freq,'times_swept':num_swept,'times_missed':num_missed,'success_rate':num_swept/(num_swept+num_missed)}

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

    swept_query = "select sum(*) from ROUTE_LOG where route_id={r} and completion={c} and date_swept={d};"
    routes = db.engine.execute("select route_id,monthly_freq from ROUTES;")
    for route_info in routes:
        route = route_info[0]
        freq = route_info[1]
        num_swept = db.engine.execute(swept_query.format(r=route,c='completed',d=date))
        num_missed = db.engine.execute(swept_query.format(r=route,c='missed',d=date))
        date[route] = {'route_family':route[0],'frequency':freq,'times_swept':num_swept,'times_missed':num_missed,'success_rate':num_swept/(num_swept+num_missed)}

    data['3A'] = {'route_family': 3,
                  'frequency': 4,
                  'times_swept': 3,
                  'times_missed': 1,
                  'success_rate': 3/(3+1)}
    return Response(None, status=200, mimetype='application/json')
