from flask import Flask, request, Response
import json
from datetime import datetime, timedelta
import pendulum
from collections import defaultdict
from flask_sqlalchemy import SQLAlchemy
import pymysql
import sys

class MyFalsk(Flask):
    def process_response(self, response):
        #Every response will be processed here first
        response.headers["Access-Control-Allow-Origin"] = '*'
        return(response)

app = MyFalsk(__name__)
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
    wk_start = d-timedelta(days=day_of_wk)
    wk_end = d-timedelta(days=day_of_wk)+timedelta(days=6)
    return (wk_start.strftime("%Y-%m-%d"),wk_end.strftime("%Y-%m-%d"))


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
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = defaultdict(list)#{}
    data['week_of_month'] = week_of_month
    data['today'] = date

    wk_start, wk_end = get_wk_start_end(date_dt)
    data['Monday'] = wk_start
    data['Sunday'] = wk_end

    day_of_wk = date_dt.weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    days_of_wk = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    # get from database

    month_first_dt = datetime(date_dt.year,date_dt.month,1)
    next_month = date_dt.month + 1
    next_year = date_dt.year
    if next_month == 13:
        next_month = 1
        next_year += 1
    next_month_first_dt = datetime(next_year,next_month,1)
    next_month_first_day = next_month_first_dt.weekday()
    

    if week_of_month == 1:
        month_first_day = month_first_dt.weekday()
        days_this_month = [days[i] for i in range(month_first_day,7)]
        days_last_month = [days[i] for i in range(0,month_first_day)]
        wk_days = []
        for d in wk_route_map[5]:
            if d[:3] in days_last_month:
                wk_days.append(d)
        for d in wk_route_map[1]:
            if d[:3] in days_this_month:
                wk_days.append(d)
    elif next_month_first_dt - timedelta(days=7) < date_dt and next_month_first_day > day_of_wk: 
        
        days_this_month = [days[i] for i in range(0,next_month_first_day)]
        days_next_month = [days[i] for i in range(next_month_first_day,7)]
        wk_days = []
        for d in wk_route_map[5]:
            if d[:3] in days_this_month:
                wk_days.append(d)
        for d in wk_route_map[1]:
            if d[:3] in days_next_month:
                wk_days.append(d)
    else:
        day_break = (month_first_dt + timedelta(days=(7*(week_of_month-1)))).weekday()
        days_last_week = [days[i] for i in range(0,day_break)]
        days_this_week = [days[i] for i in range(day_break,7)]
        wk_days = []
        for d in wk_route_map[week_of_month-1]:
            if d[:3] in days_last_week:
                wk_days.append(d)
        for d in wk_route_map[week_of_month]:
            if d[:3] in days_this_week:
                wk_days.append(d)
    data['wk_days'] = wk_days
    
    day = datetime.strptime(wk_start,"%Y-%m-%d")
    day_count = 0
    for d in wk_days:
        d_shift = d.split('_')[1]
        day_str = datetime.strftime(day,"%Y-%m-%d")
        routes_assigned = db.engine.execute("select route_id from ROUTES where {d}=1;".format(d=d))
        for r in routes_assigned:
            route = r[0]
            route_log_info = db.engine.execute("select d.employee_id, d.employee_name, r.completion from ROUTE_LOG r left join DRIVERS d on r.employee_id=d.employee_id where r.route_id='{r}' and r.date_swept='{d}' and r.shift='{s}';".format(r=route,d=day_str,s=d_shift))
            driver_id = 0
            driver_name = ''
            route_status = 'unassigned'
            for l in route_log_info:
                driver_id = l[0]
                driver_name = l[1]
                route_status = l[2]
                if not driver_id:
                    driver_id = 0
                    driver_name = ''
                if not route_status:
                    route_status = 'unassigned' if driver_id == 0 else 'assigned'
            data[d].append({'route':route, 'driver_id': driver_id, 'driver':driver_name, 'route_status':route_status})

        # extra routes that were added but aren't originally assigned for the day
        extra_query = "select route_id from ROUTES where {d}=1".format(d=d)
        routes_extra = db.engine.execute("select r.route_id, d.employee_id, d.employee_name, r.completion from ROUTE_LOG r join DRIVERS d on r.employee_id=d.employee_id where r.route_id not in ({q}) and r.date_swept='{d}' and r.shift='{s}';".format(q=extra_query,d=day_str,s=d_shift))
        for r_e in routes_extra:
            route_id = r_e[0]
            e_id = r_e[1]
            e_name = r_e[2]
            r_stat = r_e[3]
            if not e_id:
                e_id = 0
                e_name = ''
            if not r_stat:
                r_stat = 'unassigned' if e_id == 0 else 'assigned'
            data[d].append({'route':route_id, 'driver_id': e_id, 'driver':e_name, 'route_status':r_stat})
        day_count += 1
        if day_count == 3:
            day = day + timedelta(days=1)
            day_count = 0
    
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/route/available', methods=["GET"])
def get_avaiable_route_list():
    date = request.args.get('date')
    shift = request.args.get('shift')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
        shift = 'day'
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = {'Available':[]}

    # get from database
    day_of_wk = date_dt.weekday()
    #days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_start, wk_end = get_wk_start_end(date_dt)
    data['Monday'] = wk_start
    data['Sunday'] = wk_end

    routes_db = db.engine.execute("select route_id from ROUTES where route_id not in (select route_id from ROUTE_LOG where employee_id is not null and date_swept>='{ds}' and date_swept <= '{de}');".format(ds=wk_start,de=wk_end))
    #routes_db = db.engine.execute("select route_id from ROUTE_LOG where date_swept>='{ds}' and date_swept <= '{de}' and employee_id is NULL;".format(ds=wk_start,de=wk_end))
    for row in routes_db:
        data['Available'].append(row[0])

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/week/route/action', methods=["PUT", "OPTIONS"])
def change_route_week():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
            'Access-Control-Allow-Origin': '*'
        }
        return Response(None, status=200, headers=headers)
    if 'application/json'in request.headers['Content-Type']:
        arguments = request.get_json()
    if 'application/x-www-form-urlencoded' in request.headers['Content-Type']:
        arguments = request.form
    route = arguments.get("route")
    date = arguments.get("date")
    shift = arguments.get("shift")
    driver = arguments.get("operator")
    status = arguments.get("status")
    permanent =  arguments.get("permanent")
    if driver == '0':
        driver = 'null'
    if status == 'assigned' or status == 'unassigned':
        status = 'null'
    else:
        status = "'{}'".format(status)

    # if exists
    log_id = db.engine.execute("select log_id from ROUTE_LOG where route_id='{r}' and date_swept='{d}';".format(r=route, d=date)).fetchone()
    if log_id is not None:
        query = "update ROUTE_LOG set route_id='{r}',date_swept='{d}',shift='{s}',employee_id={e},completion={c} where log_id={l_id};".format(r=route,d=date,s=shift,e=driver,c=status,l_id=log_id[0])
    else:
        query = "insert into `ROUTE_LOG` (date_swept,route_id,shift,employee_id,completion) VALUES ('{d}','{r}','{s}',{e},{c});".format(d=date,r=route,s=shift,e=driver,c=status)
    db.engine.execute(query)
    
    if int(permanent) == 1:
        pass
    else:
        pass

    db.session.commit()
    return Response(None, status=200, mimetype='application/json')

@app.route('/schedule/week/route/item', methods=["GET"])
def get_route_info_on_click():
    route = request.args.get('route')
    if not route:
        route = '1A-1' # dummy
    date = request.args.get('date')
    shift = request.args.get('shift')
    data = {}
    # get from database
    # ANNA is this the log info or the route info
    #date_dt = datetime.now()
    #wk_start, wk_end = get_wk_start_end(date_dt)
    r_info = db.engine.execute("select route_id,monthly_freq,shift_AM,shift_PM,shift_night from ROUTES where route_id='{r}';".format(r=route))
    route_info = []
    for r in r_info:
        route_info = r
    if not route_info:
        data[route] = 'No route info'
    else:
        data[route_info[0]] = {'freq':route_info[1],'AM':route_info[2],'PM':route_info[3],'night':route_info[4]}

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
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = {}

    wk_start,wk_end = get_wk_start_end(date_dt)
    # get from database
    assigned_staff = []
    assigned_query = "select employee_id from ROUTE_LOG where route_id='{r}' and date_swept>='{ds}' and date_swept<='{de}'".format(r=route,ds=wk_start,de=wk_end)
    assigned_query_id = "select employee_id from ROUTE_LOG where route_id='{r}' and date_swept>='{ds}' and date_swept<='{de}'".format(r=route,ds=wk_start,de=wk_end)
    staff_assigned = db.engine.execute(assigned_query+';')

    staff_unassigned = db.engine.execute("select employee_name from DRIVERS where employee_id not in ({a});".format(a=assigned_query_id))

    assigned_list = []
    unassigned_list = []
    for s in staff_assigned:
        assigned_list.append(s[0])
    for s in staff_unassigned:
        unassigned_list.append(s[0])

    data['assigned'] = assigned_list
    data['unassigned'] = unassigned_list


    return Response(json.dumps(data), status=200, mimetype='application/json')

# schedule daily view
@app.route('/schedule/day/overview', methods=["GET"])
def get_daily_overview():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = {}

    # get from database
    # get day of week from date
    day_of_wk = date_dt.weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}

    num_am = db.engine.execute("select count(*) from ROUTES where {d}{w}_AM=1;".format(d=days[day_of_wk],w=week_of_month)).fetchone()[0]
    num_pm = db.engine.execute("select count(*) from ROUTES where {d}{w}_PM=1;".format(d=days[day_of_wk],w=week_of_month)).fetchone()[0]
    num_night = db.engine.execute("select count(*) from ROUTES where {d}{w}_night=1;".format(d=days[day_of_wk],w=week_of_month)).fetchone()[0]
    maps_served = db.engine.execute("select count(*) from ROUTE_LOG where date_swept={date} and completion='completed';".format(date=date)).fetchone()[0]
    maps_missed = db.engine.execute("select count(*) from ROUTE_LOG where date_swept={date} and completion='missed';".format(date=date)).fetchone()[0]
    maps_holiday = db.engine.execute("select count(*) from ROUTE_LOG where date_swept={date} and completion='holiday';".format(date=date)).fetchone()[0]
    # ANNA not sure what the completion status fill values will be (e.g. completed, missed, holiday, etc)

    data['date'] = str(date)
    data['maps_am'] = num_am
    data['maps_pm'] = num_pm
    data['maps_night'] = num_night
    data['maps_total'] = num_am + num_pm + num_night
    data['maps_holiday'] = maps_holiday
    data['maps_served'] = maps_served
    data['maps_missed'] = maps_missed
    data['maps_to_do'] = num_am + num_pm + num_night - maps_served - maps_missed
    if data['maps_total'] == 0:
        data['success_rate'] = 0
    else:
        data['success_rate'] = data['maps_served'] / data['maps_total']
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/overview/day', methods=["GET"])
def get_overview_day():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = {}

    # get day of week from date
    day_of_wk = date_dt.weekday()#datetime.today().weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}

    num_am = db.engine.execute("select count(*) from ROUTES where {d}{w}_AM=1;".format(d=days[day_of_wk],w=week_of_month)).fetchone()[0]
    num_pm = db.engine.execute("select count(*) from ROUTES where {d}{w}_PM=1;".format(d=days[day_of_wk],w=week_of_month)).fetchone()[0]
    num_night = db.engine.execute("select count(*) from ROUTES where {d}{w}_night=1;".format(d=days[day_of_wk],w=week_of_month)).fetchone()[0]
    maps_served = db.engine.execute("select count(*) from ROUTE_LOG where date_swept={date} and completion='completed';".format(date=date)).fetchone()[0]
    maps_missed = db.engine.execute("select count(*) from ROUTE_LOG where date_swept={date} and completion='missed';".format(date=date)).fetchone()[0]

    unassigned_routes = {}
    disabled = db.engine.execute("select route_id,notes from ROUTE_LOG where date_swept={date} and disabled=1;".format(date=date))
    for d in disabled:
        unassigned_routes[d[0]] = 'Disabled'
    unassigned = db.engine.execute("select route_id,notes from ROUTE_LOG where date_swept={date} and employee_id is null;".format(date=date))
    for u in unassigned:
        unassigned_routes[u[0]] = 'Unassigned'


    data['morning'] = num_am
    data['afternoon'] = num_pm
    data['night'] = num_night
    data['complete'] = maps_served
    data['miss'] = maps_missed
    data['unassigned'] = unassigned_routes
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/weather', methods=["GET", "PUT", "OPTIONS"])
def weather_condition():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
            'Access-Control-Allow-Origin': '*'
        }
        return Response(None, status=200, headers=headers)
    if request.method == 'GET':
        date = request.args.get('date')
        if date == None:
            date = datetime.now().strftime("%Y-%m-%d")
        # retrieve weather from database
        w_db = db.engine.execute("select weather from DAY_LOG where log_date='{d}';".format(d=date))
        weather = ''
        for w in w_db:
            weather = w[0]
    elif request.method == 'PUT':
        date = request.args.get('date')
        if date == None:
            date = datetime.now().strftime("%Y-%m-%d")
        if 'application/json'in request.headers['Content-Type']:
            arguments = request.get_json()
        if 'application/x-www-form-urlencoded' in request.headers['Content-Type']:
            arguments = request.form
        weather = arguments.get("weather")
        # put weather info in database
        existing_weather = db.engine.execute("select weather from DAY_LOG where log_date='{d}';".format(d=date))
        if existing_weather.fetchone() is not None:
            query = "UPDATE DAY_LOG SET weather='{w}' where log_date='{d}';".format(w=weather,d=date)
        else:
            query = "INSERT INTO `DAY_LOG` (log_date,weather) VALUES ('{d}','{w}');".format(w=weather,d=date)
        db.engine.execute(query)
        db.session.commit()
    return Response(json.dumps({'weather': weather}), status=200, mimetype='application/json')

@app.route('/schedule/day/main', methods=["GET"])
def get_daily_route_schedule():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    week_of_month = pendulum.parse(date).week_of_month
    data = defaultdict(list)

    # get from database
    route_log_db_query = "select route_id,employee_id,employee_status,vehicle_id,completion,shift from ROUTE_LOG where date_swept='{d}';".format(d=date)
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
    employee_id = db.engine.execute("select employee_id from DRIVERS where employee_name='{n}';".format(n=driver))
    db.engine.execute("insert into `ROUTE_LOG` (date_swept,route_id,shift,employee_id,vehicle_id,completion,notes) VALUES "
        "('{d}','{r}','{s}',{e},{v},'{c}','{n}');".format(d=date,r=route,s=shift,e=employee_id,v=vehicle,c=route_status,n=comment))


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
    maint_query = "select vehicle_id from VEHICLE_MAINTENANCE where date_service='{date}' or (date_service<='{date}' and date_end>='{date}')".format(date=date)
    route_log_query = "select vehicle_id from ROUTE_LOG where date_swept='{d}'".format(d=date)
    available_vehicles = db.engine.execute("select vehicle_id from VEHICLES where vehicle_id not in ({m}) and vehicle_id not in ({r});".format(m=maint_query,r=route_log_query))
    in_use_vehicles = db.engine.execute(route_log_query+';')
    maintenance_vehicles = db.engine.execute(maint_query+';')
    available_list,in_use_list,maint_list = [],[],[]
    for a in available_vehicles:
        available_list.append(a[0])
    for a in in_use_vehicles:
        in_use_list.append(a[0])
    for a in maintenance_vehicles:
        maint_list.append(a[0])
    data['available'] = available_list
    data['in_use'] = in_use_list
    data['maintenance'] = maint_list
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/schedule/day/unplanned', methods=["PUT"])
def get_unplanned_routes():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {'unplanned':[],'planned':[]}
    # get from database
    day_of_wk = date_dt.weekday()
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

@app.route('/schedule/operator', methods=["GET"])
def get_operator_list_to_assign():
    date = request.args.get('date')
    shift = request.args.get('shift')
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    day_of_wk = date_dt.weekday()
    days = {0:'mon',1:'tue',2:'wed',3:'thu',4:'fri',5:'sat',6:'sun'}

    if shift == 'AM' or shift == 'PM':
        day_night = 'day'
    else:
        day_night = 'night'

    absences_query = "select employee_id from ABSENCES where date_absence='{ds}' and shift='{shift}'".format(ds=date,shift=shift)
    assigned_query = "select employee_id from ROUTE_LOG where date_swept='{ds}' and shift='{shift}' and employee_id is not null".format(ds=date,shift=shift)
    drivers = db.engine.execute("select employee_id,employee_name from DRIVERS where (shift_{d}=1 or shift_{d}_pm=1) and shift='{shift}' and employee_id not in ({q1}) and employee_id not in ({q2});".format(d=days[day_of_wk],shift=day_night,q1=absences_query,q2=assigned_query))
    drivers = [(dict(row.items())) for row in drivers]

    return Response(json.dumps(drivers), status=200, mimetype='application/json')


@app.route('/staff/day', methods=["GET"])
def get_staff_day():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {'Day':[],'Night':[],'Off-Duty':[]}
    day_of_wk = date_dt.weekday()
    days = {0:'mon',1:'tue',2:'wed',3:'thu',4:'fri',5:'sat',6:'sun'}
    off_duty_db = db.engine.execute("select employee_name from DRIVERS where shift_{d}=0 and shift_{d}_pm=0;".format(d=days[day_of_wk]))
    for row in off_duty_db:
        data['Off-Duty'].append(row[0])

    am_db = db.engine.execute("select employee_name from DRIVERS where shift_{d}=1;".format(d=days[day_of_wk]))
    for row in am_db:
        data['Day'].append(row[0])

    pm_db = db.engine.execute("select employee_name from DRIVERS where shift_{d}_pm=1;".format(d=days[day_of_wk]))
    for row in pm_db:
        data['Night'].append(row[0])

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
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {'day':[],'night':[]}
    # get from database

    day_of_wk = date_dt.weekday()
    #days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_start, wk_end = get_wk_start_end(date_dt)

    # not sure how we're calculating these global holidays where no one works
    holidays = db.engine.execute("select count(*) from HOLIDAY where holiday_date>='{hs}' and holiday_date<='{he}';".format(hs=wk_start,he=wk_end)).fetchone()[0]
    #holiday_hours = holidays*8

    drivers = db.engine.execute("select employee_id,employee_name,hours,daily_hours,shift from DRIVERS;")
    for driver in drivers:
        driver_id = driver[0]
        driver_name = driver[1]
        driver_hours = driver[2]
        driver_day_hours = driver[3]
        driver_shift = driver[4]
        holiday_hours = holidays*driver_day_hours
        num_routes_query = "select count(*) from ROUTE_LOG where date_swept>='{ds}' and date_swept<='{de}' and employee_id={e} and completion='{c}';"
        driver_routes_swept = db.engine.execute(num_routes_query.format(ds=wk_start,de=wk_end,e=driver_id,c='completed')).fetchone()[0]
        driver_routes_missed = db.engine.execute(num_routes_query.format(ds=wk_start,de=wk_end,e=driver_id,c='missed')).fetchone()[0]

        absences_query = "select HOUR(sum(time_missed)) from ABSENCES where date_absence>='{ds}' and date_absence<='{de}' and employee_id={e};"
        leave_hrs = db.engine.execute(absences_query.format(ds=wk_start,de=wk_end,e=driver_id)).fetchone()[0]

        overtime_query = "select sum(time_over) from OVERTIME where date_overtime>='{ds}' and date_overtime<='{de}' and employee_id={e};"
        overtime_hrs = db.engine.execute(overtime_query.format(ds=wk_start,de=wk_end,e=driver_id)).fetchone()[0]
        if not driver_routes_swept:
            driver_routes_swept = 0
        if not driver_routes_missed:
            driver_routes_missed = 0
        if not leave_hrs:
            leave_hrs = 0
        if not overtime_hrs:
            overtime_hrs = 0

        driver_data = { 'employee_id' : driver_id,
                    'name': driver_name,
                    'working_hrs': driver_hours-leave_hrs-holiday_hours+overtime_hrs,
                    'leave_hrs': leave_hrs,
                    'overtime_hrs': overtime_hrs,
                    'holiday_hrs': holiday_hours,
                    'is_reviewed': True, # what is this
                    'swept_total': driver_routes_swept,
                    'missed_total': driver_routes_missed}

        data[driver_shift].append(driver_data)

    return Response(json.dumps(data), status=200, mimetype='application/json')

# operator daily view
@app.route('/operator/day/onduty', methods=["GET"])
def get_daily_onduty_operator_info():
    date = request.args.get('date')
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {'day':[],'night':[]}

    # get from database
    day_of_wk = date_dt.weekday()
    days = {0:'mon',1:'tue',2:'wed',3:'thu',4:'fri',5:'sat',6:'sun'}

    absences_query = "select employee_id from ABSENCES where date_absence='{ds}' and HOUR(time_missed)>=8"
    drivers = db.engine.execute("select employee_id,employee_name,daily_hours,shift from DRIVERS where (shift_{d}=1 or shift_{d}_pm=1) and employee_id not in ({q});".format(d=days[day_of_wk],q=absences_query))
    for driver in drivers:
        driver_id = driver[0]
        driver_name = driver[1]
        driver_hours = driver[2]
        if not driver_hours:
            driver_hours = 0
        driver_shift = driver[3]
        num_routes_query = "select count(*) from ROUTE_LOG where date_swept='{d}' and employee_id={e} and completion='{c}';"
        driver_routes_swept = db.engine.execute(num_routes_query.format(d=date,e=driver_id,c='completed')).fetchone()[0]
        driver_routes_missed = db.engine.execute(num_routes_query.format(d=date,e=driver_id,c='missed')).fetchone()[0]

        holidays = db.engine.execute("select count(*) from HOLIDAY where holiday_date='{hs}';".format(hs=date)).fetchone()[0]
        if not holidays:
            holidays = 0
        holiday_hours = holidays*driver_hours

        absences_query = "select HOUR(sum(time_missed)) from ABSENCES where date_absence='{ds}' and employee_id={e};"
        leave_hrs = db.engine.execute(absences_query.format(ds=date,e=driver_id)).fetchone()[0]
        if not leave_hrs:
            leave_hrs = 0

        overtime_query = "select sum(time_over) from OVERTIME where date_overtime='{ds}' and employee_id={e};"
        overtime_hrs = db.engine.execute(overtime_query.format(ds=date,e=driver_id)).fetchone()[0]
        if not driver_routes_swept:
            driver_routes_swept = 0
        if not driver_routes_missed:
            driver_routes_missed = 0
        if not overtime_hrs:
            overtime_hrs = 0

        driver_data = {'employee_id': driver_id,
                    'name': driver_name,
                    'working_hrs': driver_hours+overtime_hrs-holiday_hours-leave_hrs,
                    'leave_hrs':leave_hrs,
                    'acting_hrs': 0, # what is this
                    'standby_hrs': 0, # what is this
                    'overtime_hrs': overtime_hrs,
                    'holiday_hrs': holiday_hours,
                    'is_reviewed': True, # what is this
                    'swept_total': driver_routes_swept,
                    'missed_total': driver_routes_missed}

        data[driver_shift].append(driver_data)

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/operator/day/offduty', methods=["GET"])
def get_daily_offduty_operator_info():
    date = request.args.get('date')
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {'day':[],'night':[],'Off-Duty':[]}

    absences_query = "select a.employee_id,d.employee_name,a.type,d.shift from ABSENCES a join DRIVERS d on a.employee_id=d.employee_id where date_absence={d};".format(d=date)
    absences = db.engine.execute(absences_query.format(d=date))

    for a in absences:
        data[a[3]].append({'employee_id':a[0],'name':a[1],'leave':a[2]})

    day_of_wk = date_dt.weekday()
    days = {0:'mon',1:'tue',2:'wed',3:'thu',4:'fri',5:'sat',6:'sun'}
    off_duty_db = db.engine.execute("select employee_id,employee_name from DRIVERS where shift_{d}=0 and shift_{d}_pm=0;".format(d=days[day_of_wk]))
    for row in off_duty_db:
        data['Off-Duty'].append({'employee_id':row[0],'name':row[1],'leave':None})

    return Response(json.dumps(data), status=200, mimetype='application/json')

# @app.route('/operator/day/check', methods=["PUT"])
# def update_review_status():
#     employee_id = request.args.get('employee_id')
#     date = request.args.get('date')
#     # modify database
#     return Response(None, status=200, mimetype='application/json')

# @app.route('/operator/day/unassigned', methods=["GET"])
# def get_unassigned_routes():
#     data = {}
#     # get from database
#     # ANNA is this a particular day or in general?
#     data['day'] = ['7A-1', '11A']
#     data['night'] = ['7A-1', '11A']
#     return Response(data, status=200, mimetype='application/json')

# @app.route('/operator/day/add', methods=["POST"])
# def add_individual_operator():
#     name = request.args.get('name')
#     shift = request.args.get('shift')
#     routes = request.args.get('routes')
#     # modify database
#     # ANNA what is this adding?
#     return Response(None, status=200, mimetype='application/json')


# operator individual view
@app.route('/operator/individual/info', methods=["GET"])
def get_individual_operator_info():
    employee_id = request.args.get('employee_id')
    date = request.args.get('date')
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    if not employee_id:
        employee_id = 2882
    data = {}

    # get from database
    # return: a list of assignments, each assignment includes shift, route, working_hrs, leave_hrs(formatted as such 8:00-10:00, leave it “” if no leave on that day), reason
    day_of_wk = date_dt.weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    wk_of_month = pendulum.parse(date).week_of_month

    operator_info = db.engine.execute("select e.employee_name,r.shift,e.daily_hours,r.route_id,r.notes from DRIVERS e join ROUTE_LOG r on e.employee_id=r.employee_id where r.date_swept='{d}' and e.employee_id={e};".format(d=date,e=employee_id))
    operator_routes = []
    operator_name = ""
    operator_shift = ""
    operator_hours = 0
    operator_comments = ""
    for operator in operator_info:
        operator_name = operator[0]
        operator_shift = operator[1]
        operator_hours = int(operator[2])
        operator_routes.append(operator[3])
        operator_comments = operator[4]

    if not operator_name:
        operator_info = db.engine.execute("select employee_name,shift,daily_hours from DRIVERS where employee_id={e};".format(e=employee_id)).fetchone()
        operator_name = operator_info[0]
        operator_shift = operator_info[1]
        operator_hours = int(operator_info[2])

    absences_query = "select HOUR(sum(time_missed)) from ABSENCES where date_absence='{d}' and employee_id={e};"
    num_leave_hrs = db.engine.execute(absences_query.format(d=date,e=employee_id)).fetchone()[0]
    if not num_leave_hrs:
        num_leave_hrs = 0
    leave_times = db.engine.execute("select time_start,time_end from ABSENCES where date_absence='{d}' and employee_id={e};".format(d=date,e=employee_id))
    leave_hrs = ""
    for l in leave_times:
        if leave_hrs:
            leave_hrs += ","
        leave_hrs += "{s}-{e}".format(s=l[0],e=l[1])

    overtime_query = "select HOUR(sum(time_over)) from OVERTIME where date_overtime='{d}' and employee_id={e};"
    overtime_hrs = db.engine.execute(overtime_query.format(d=date,e=employee_id)).fetchone()[0]
    if not overtime_hrs:
        overtime_hrs = 0

    data['name'] = operator_name
    data['status'] = True

    data['assignments'] = [{'shift': operator_shift,
                            'route': operator_routes,
                            'working_hrs': max(0,operator_hours+overtime_hrs-num_leave_hrs),
                            'overtime_hrs':overtime_hrs,
                            'leave_hrs':leave_hrs,
                            'num_leave_hrs': num_leave_hrs,
                            'comment':operator_comments,
                            'acting_7.5_hrs': 0, # ANNA what are these
                            'acting_12.5_hrs': 0,
                            'standby_hrs': 0}]
    return Response(json.dumps(data), status=200, mimetype='application/json')

# @app.route('/operator/individual/history', methods=["GET"])
# def get_individual_operator_history():
#     employee_id = request.args.get('employee_id')
#     year = request.args.get('year')
#     data = {}
#     # get from database
#     data['history'] = [{'week': '1/6-1/10',
#                         'total_scheduled': 20,
#                         'total_swept': 18,
#                         'success_rate': 95,
#                         'total_working_hrs': 100,
#                         'total_leave_hrs': 10}]
#     return Response(data, status=200, mimetype='application/json')

@app.route('/operator/individual/add_leave', methods=["POST"])
def update_individual_operator_leave():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if 'application/x-www-form-urlencoded' in request.headers['Content-Type']:
        arguments = request.form
    employee_id = arguments.get('employee_id')
    date = arguments.get('date')
    start_time = arguments.get('start_time')
    end_time = arguments.get('end_time')
    reason = arguments.get('reason')
    # modify database
    db.engine.execute("insert into `ABSENCES` ( employee_id,date_absence,time_start,time_end,type) VALUES ({eid},'{d}','{ts}','{te}','{t}');".format(eid=employee_id,d=date,ts=start_time,te=end_time,t=reason))

    return Response(None, status=200, mimetype='application/json')

@app.route('/operator/day/comment', methods=["POST"])
def add_individual_operator_comment():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if 'application/x-www-form-urlencoded' in request.headers['Content-Type']:
        arguments = request.form
    employee_id = arguments.get('employee_id')
    date = arguments.get('date')
    shift = arguments.get('shift')

    comment = arguments.get('comment')

    # modify database
    db.engine.execute("update ROUTE_LOG set notes='{c}' where employee_id={e} and date_swept='{d}' and shift='{s}';".format(c=comment,e=employee_id,d=date,s=shift))
    return Response(None, status=200, mimetype='application/json')

# @app.route('/operator/individual/update_special', methods=["POST"])
# def update_individual_operator_special_assignment():
#     employee_id = request.args.get('employee_id')
#     date = request.args.get('date')
#     hours = request.args.get('hours')
#     assignment_type = request.args.get('assignment_type')
#     # modify database
#     # ANNA what is this
#     return Response(None, status=200, mimetype='application/json')

# @app.route('/operator/week/remove', methods=["POST"])
# def remove_operator():
#     if 'application/json' in request.headers['Content-Type'].lower():
#         arguments = request.get_json()
#     if 'application/x-www-form-urlencoded' in request.headers['Content-Type'].lower():
#         arguments = request.form
#     employee_id = arguments.get('employee_id')
#     # modify database
#     db.engine.execute("delete from DRIVERS where employee_id={e};".format(e=employee_id))
#     return Response(None, status=200, mimetype='application/json')

# @app.route('/operator/individual/assignment', methods=["GET"])
# def get_operator_assignment():
#     employee_id = request.args.get('employee_id')
#     if not employee_id:
#         employee_id = 2882
#     month = request.args.get('month')
#     data = {}
#     data['assignment'] = []
#     # get from database

#     weeks = [1,2,3,4,5]
#     days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
#     times = ['AM','PM','night']
#     driver_select = 'select employee_name'
#     driver_cols = ['employee_name']
#     for w in weeks:
#         for d in days:
#             for t in times:
#             	driver_info = db.engine.execute("select route_id_{d}{w}_{t} from DRIVERS where employee_id={e};".format(d=d,w=w,t=t,e=employee_id)).fetchone()[0]
#             	if driver_info:
#             		data['assignment'].append({'week':w,'shift':t,'route':driver_info})

#     return Response(json.dumps(data), status=200, mimetype='application/json')

# @app.route('/operator/individual/assign', methods=["POST"])
# def modify_a_weekly_assignment():
#     # assign or unassign
#     action = request.args.get('assigned')
#     employee_id = request.args.get('employee_id')
#     date = request.args.get('date')
#     route = request.args.get('route')
#     # modify database
#     return Response(None, status=200, mimetype='application/json')

# @app.route('/operator/individual/update_longterm', methods=["POST","PUT"])
# def modify_longterm_assignment():
#     action = request.args.get('assignment')
#     # modify database
#     employee_id = request.args.get('employee_id')
#     route = request.args.get('route')
#     day = request.args.get('day') #day of week, Mon,Tue,Wed,Thu,Fri,Sat,Sun
#     week = request.args.get('week') #integer
#     shift = request.args.get('shift') # AM, PM, night

#     if action.lower() == 'modify' or action.lower() == 'add':
#     	db.engine.execute("update DRIVERS set route_id_{d}{w}_{t}='{r}' where employee_id={id};".format(d=day,w=week,t=shift,r=route,id=employee_id))
#     elif action.lower() == 'remove':
#     	db.engine.execute("update DRIVERS set route_id_{d}{w}_{t}=null where employee_id={id};".format(d=day,w=week,t=shift,id=employee_id))
#     return Response(None, status=200, mimetype='application/json')

# vehicle daily view
@app.route('/vehicle/day', methods=["GET"])
def get_daily_vehicle_infomation():
    date = request.args.get('date')
    shift = request.args.get('shift') # day, night
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = defaultdict(list)
    # get from database
    if shift == 'day':
        vehicles = db.engine.execute("select vehicle_id from VEHICLES where status_am=1 or status_pm=1;")
        for v in vehicles:
            v_data = {}
            v_default_stat = 'available'
            v_maint = db.engine.execute("select count(*) from VEHICLE_MAINTENANCE where (date_service='{ds}' or (date_service<'{ds}' and date_end>='{ds}')) and vehicle_id={v};".format(ds=date,v=v[0])).fetchone()[0]
            if v_maint > 0:
                v_default_stat = 'out-of-service'
            v_data['8-12 shift'] = ''
            v_data['8-12 operator'] = ''
            v_data['8-12 status'] = v_default_stat
            v_data['12-4 shift'] = ''
            v_data['12-4 operator'] = ''
            v_data['12-4 status'] = v_default_stat
            v_info = db.engine.execute("select route_id,employee_id,shift from ROUTE_LOG where date_swept='{d}' and vehicle_id={v}".format(d=date,v=v[0]))
            for i in v_info:
                if i[2].lower() == 'am':
                    v_data['8-12 shift'] = i[0]
                    v_data['8-12 operator'] = db.engine.execute("select employee_name from DRIVERS where employee_id={e};".format(e=i[1])).fetchone()[0]
                    v_data['8-12 status'] = 'in-use'
                elif i[2].lower() == 'pm':
                    v_data['12-4 shift'] = i[0]
                    v_data['12-4 operator'] = db.engine.execute("select employee_name from DRIVERS where employee_id={e};".format(e=i[1])).fetchone()[0]
                    v_data['12-4 status'] = 'in-use'
            data[v[0]] = v_data
    else:
        vehicles = db.engine.execute("select vehicle_id from VEHICLES where status_night=1;")
        for v in vehicles:
            v_data = {}
            v_default_stat = 'available'
            v_maint = db.engine.execute("select count(*) from VEHICLE_MAINTENANCE where date_service='{ds}' and vehicle_id={v};".format(ds=date,v=v[0])).fetchone()[0]
            if v_maint > 0:
                v_default_stat = 'out-of-service'
            v_data['0-3 shift'] = ''
            v_data['0-3 operator'] = ''
            v_data['0-3 status'] = v_default_stat
            v_data['3-6 shift'] = ''
            v_data['3-6 operator'] = ''
            v_data['3-6 status'] = v_default_stat
            v_info = db.engine.execute("select route_id,employee_id,shift from ROUTE_LOG where date_swept='{d}' and vehicle_id={v}".format(d=date,v=v[0]))
            for i in v_info:
                if i[2].lower() == 'am':
                    v_data['8-12 shift'] = i[0]
                    v_data['8-12 operator'] = db.engine.execute("select employee_name from DRIVERS where employee_id={e};".format(e=i[1])).fetchone()[0]
                    v_data['8-12 status'] = 'in-use'
                elif i[2].lower() == 'pm':
                    v_data['12-4 shift'] = i[0]
                    v_data['12-4 operator'] = db.engine.execute("select employee_name from DRIVERS where employee_id={e};".format(e=i[1])).fetchone()[0]
                    v_data['12-4 status'] = 'in-use'
            data[v[0]] = v_data

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/vehicle/day/maintenance', methods=["GET"])
def get_daily_maintenance_infomation():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database
    vehicles = db.engine.execute("select * from VEHICLES;")
    maintenance_v = db.engine.execute("select vehicle_id from VEHICLE_MAINTENANCE where date_service={d} or (date_service <={d} and date_end >={d});".format(d=date))
    #not sure which fields we need
    for row in vehicles:
        data[row[0]] = {
            'status_am':row[1],
            'status_pm':row[2],
            'status_night':row[3],
            'make':row[4],
            'description':row[5],
            'year':row[7],
            'license':row[8],
            'id_no':row[9]
        }
    for row in maintenance_v:
        if row[0] in data:
            data[row[0]]['status_am'] = 'out-of-service'
            data[row[0]]['status_pm'] = 'out-of-service'
            data[row[0]]['status_night'] = 'out-of-service'

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/vehicle/day/action', methods=["PUT"])
def change_vehicle_day():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    date = arguments.get("date")
    vehicle = arguments.get("vehicle")
    vehicle_status = arguments.get("vehicle_status")
    comment = arguments.get("comment", default="")
    # modify database
    if request.method == 'POST':
        db.engine.execute("insert into `VEHICLE_MAINTENANCE` (date_service,vehicle_id,comment) VALUES ('{d}',{v},'{c}');".format(d=date,v=vehicle,c=comment))
    elif request.method == 'PUT':
        if vehicle_status.lower() == 'available':
            yester = datetime.strptime(date,'%Y-%m-%d') - timedelta(days=1)
            yesterday = datetime.strftime(yester, '%Y-%m-%d')
            db.engine.execute("update VEHICLE_MAINTENANCE set date_end='{y}' where vehicle_id={id} and date_end>='{d}';".format(y=yesterday,id=vehicle,d=date))
        else:
            db.engine.execute("update VEHICLE_MAINTENANCE set comment='{c}' where vehicle_id={id} and date_service='{d}';".format(c=comment,id=vehicle,d=date))
    return Response(None, status=200, mimetype='application/json')

@app.route('/vehicle/day/comment', methods=["GET", "POST", "PUT", "DELETE"])
def get_vehicle_comment():
    if request.headers['Content-Type'] == 'application/json':
        arguments = request.get_json()
    if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
        arguments = request.form
    date = arguments.get("date")
    vehicle = arguments.get("vehicle")
    vehicle_status = arguments.get("vehicle_status")
    shift = arguments.get("shift")
    comment = arguments.get("comment")
    comment_id = arguments.get("comment_id")
    if request.method == "GET":
        data = defaultdict(list)
        log_info = db.engine.execute("select shift,vehicle_log_id,vehicle_id,comment from VEHICLE_DAY_LOG where log_date='{d}';".format(d=date))
        for l in log_info:
            data[row[0]] = {'vehicle_log_id':row[1],'vehicle_id':row[2],'comment':row[3]}
        return Response(json.dumps(data), status=status_code, mimetype='application/json')
    elif request.method == 'POST':
        db.engine.execute("insert into VEHICLE_DAY_LOG (log_date,shift,vehicle_id,comment) VALUES ('{d}','{s}',{v},'{c}');".format(d=date,s=shift,v=vehicle,c=comment))
    elif request.method == 'PUT':
        db.engine.execute("update VEHICLE_DAY_LOG set comment='{c}' where vehicle_log_id={id};".format(c=comment,id=comment_id))
    elif request.method == "DELETE":
        db.engine.execute("delete from VEHICLE_DAY_LOG where vehicle_log_id={id};".format(id=comment_id))

    return Response(None, status=status_code, mimetype='application/json')

# vehicle weekly view
@app.route('/vehicle/week', methods=["GET"])
def get_weekly_vehicle_infomation():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {}

    wk_start, wk_end = get_wk_start_end(date_dt)

    vehicles = db.engine.execute("select vehicle_id from VEHICLES;")
    for v in vehicles:
        num_swept = db.engine.execute("select count(*) from ROUTE_LOG where date_swept>='{ds}' and date_swept <= '{de}' and vehicle_id={v} and completion='completed';".format(ds=wk_start,de=wk_end,v=v[0])).fetchone()[0]
        num_sched = db.engine.execute("select count(*) from ROUTE_LOG where date_swept>='{ds}' and date_swept <= '{de}' and vehicle_id={v};".format(ds=wk_start,de=wk_end,v=v[0])).fetchone()[0]
        num_missed = num_sched-num_swept
        tot_maint_days = db.engine.execute("select sum(DATEDIFF(date_end,date_service)+1) from VEHICLE_MAINTENANCE where (date_service>='{ds}' or (date_service<'{ds}' and date_end>='{ds}')) and date_service<='{de}' and vehicle_id={v};".format(ds=wk_start,de=wk_end,v=v[0])).fetchone()[0]
        if not tot_maint_days:
            tot_maint_days = 0
        maint_days = min(tot_maint_days,5)
        available_days = 5-maint_days
        maint_today = db.engine.execute("select count(*) from VEHICLE_MAINTENANCE where (date_service='{ds}' or (date_service<'{ds}' and date_end>='{ds}')) and vehicle_id={v};".format(ds=date,v=v[0])).fetchone()[0]
        v_status = 'available'
        if maint_today > 0:
            v_status = 'out-of-service'
        maint_hours = db.engine.execute("select HOUR(sum(hours_service)) from VEHICLE_MAINTENANCE where date_service>='{ds}' and date_service<='{de}' and vehicle_id={v};".format(ds=wk_start,de=wk_end,v=v[0])).fetchone()[0]
        v_data = {'status':v_status,'maps_swept':num_swept,'maps_missed':num_missed,'available_days':available_days,'out_of_service_days':maint_days,'hrs_maintenance':maint_hours,'logs':[]}
        v_logs = db.engine.execute("select log_date,shift,comment from VEHICLE_DAY_LOG where log_date>='{ds}' and log_date<='{de}' and vehicle_id={v};".format(ds=wk_start,de=wk_end,v=v[0]))
        for l in v_logs:
            v_data['logs'].append({'log_date':l[0],'log_shift':l[1],'log_comment':l[2]})
        data[v[0]] = v_data

    # vehicles = db.engine.execute("select * from VEHICLES ORDER BY vehicle_id;")
    # maintenance_v = db.engine.execute("select vehicle_id from VEHICLE_MAINTENANCE where date_service <= '{ds}' and date_end >= '{de}';".format(ds=wk_start, de=wk_end))
    # #not sure which fields we need
    # unavailable_vids = [row[0] for row in maintenance_v]
    # availables = []
    # unavailables = []
    # for row in vehicles:
    #     vid = row[0]
    #     if vid not in unavailable_vids:
    #         availables.append({
    #             'vehicle_id':vid,
    #             'status':'available',
    #             'make':row[4],
    #             'description':row[5],
    #             'year':row[7],
    #             'license':row[8],
    #             'id_no':row[9]
    #         })
    #     else:
    #         unavailables.append({
    #             'vehicle_id':vid,
    #             'status':'out-of-service',
    #             'make':row[4],
    #             'description':row[5],
    #             'year':row[7],
    #             'license':row[8],
    #             'id_no':row[9]
    #         })
    # data['data'] = availables+unavailables
    # data['num_availables'] = len(availables)
    # data['num_unavailables'] = len(unavailables)

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/vehicle/action', methods=["POST", "DELETE", "OPTIONS"])
def vehicle_action():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
            'Access-Control-Allow-Origin': '*'
        }
        return Response(None, status=200, headers=headers)
    if 'application/json' in request.headers['Content-Type'].lower():
        arguments = request.get_json()
    if 'application/x-www-form-urlencoded' in request.headers['Content-Type'].lower():
        arguments = request.form
    if request.method == 'DELETE':
        vehicle_id = arguments.get("vehicle_id")
        query = "delete from VEHICLES where vehicle_id={v};".format(v=vehicle_id)
        db.engine.execute(query)
        db.session.commit()
        return Response(None, status=204, mimetype='application/json')
    if request.method == 'POST':
        try:
            vehicle_id = int(arguments.get("vehicle_id"))
        except:
            return Response(None, status=202, mimetype='application/json')
        existing_vehicles = db.engine.execute("select * from VEHICLES where vehicle_id={v};".format(v=vehicle_id))
        if existing_vehicles.fetchone() is not None:
            return Response(None, status=202, mimetype='application/json')
        cng = arguments.get("cng", default='')
        make = arguments.get("make", default='')
        description = arguments.get("description", default='')
        year = arguments.get("year", default=2000)
        license = arguments.get("license", default='')
        id_no = arguments.get("id_no", default='')
        status_am = arguments.get("status_am", default=1)
        status_pm = arguments.get("status_pm", default=1)
        status_night = arguments.get("status_night", default=1)
        query = '''
        INSERT INTO `VEHICLES`
        (vehicle_id,cng,make,description,vehicle_year,license,v_id_no,status_am,status_pm,status_night)
        VALUES ({vid},'{cng}','{make}','{description}',{year},'{license}','{id_no}',{sam},{spm},{snight});
        '''.format(vid=vehicle_id, cng=cng, make=make,
            description=description, year=year, license=license,
            id_no=id_no, sam=status_am, spm=status_pm, snight=status_night)
        db.engine.execute(query)
        db.session.commit()
        return Response(None, status=201, mimetype='application/json')

# @app.route('/vehicle/add', methods=["POST"])
# def add_vehicle():
#     if request.headers['Content-Type'] == 'application/json':
#         arguments = request.get_json()
#     if request.headers['Content-Type'] == 'application/x-www-form-urlencoded':
#         arguments = request.form
#     vehicle_id = arguments.get("vehicle_id")
#     cng = arguments.get("cng", default='')
#     make = arguments.get("make", default='')
#     description = arguments.get("description", default='')
#     year = arguments.get("year", default='')
#     license = arguments.get("license", default='')
#     id_no = arguments.get("id_no", default='')
#     status_am = arguments.get("status_am", default='available')
#     status_pm = arguments.get("status_pm", default='available')
#     status_night = arguments.get("status_night", default='available')
#     query = '''
#     INSERT INTO `VEHICLES`
#     (vehicle_id,cng,make,description,vehicle_year,license,v_id_no,status_am,status_pm,status_night)
#     VALUES ({vid},'{cng}','{make}','{description}',{year},'{license}',{id_no},'{sam}','{spm}','{snight}');
#     '''.format(vehicle_id, cng, make, description, year, license, id_no, status_am, status_pm, status_night)
#     db.engine.execute(query)
#     # modify database
#     return Response(None, status=200, mimetype='application/json')

# performance
@app.route('/performance/month', methods=["GET"])
def get_monthly_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    # get from database
    swept_query = "select count(*) from ROUTE_LOG where route_id='{r}' and completion='{c}' and MONTH(date_swept)={m} and YEAR(date_swept)={y};"
    routes = db.engine.execute("select route_id,monthly_freq from ROUTES;")
    for route_info in routes:
        route = route_info[0]
        freq = route_info[1]
        num_swept = db.engine.execute(swept_query.format(r=route,c='completed',m=date_dt.month,y=date_dt.year)).fetchone()[0]
        num_missed = db.engine.execute(swept_query.format(r=route,c='missed',m=date_dt.month,y=date_dt.year)).fetchone()[0]
        if num_swept + num_missed == 0:
            srate = 0
        else:
            srate = num_swept/(num_swept+num_missed)
        data[route] = {'route_family':route[0],'frequency':freq,'times_swept':num_swept,'times_missed':num_missed,'success_rate':srate}

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/performance/month/operator', methods=["GET"])
def get_monthly_operator_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    # get from database
    swept_query = "select count(*) from ROUTE_LOG where employee_id='{e}' and completion='{c}' and MONTH(date_swept)={m} and YEAR(date_swept)={y};"
    drivers = db.engine.execute("select employee_id,employee_name from DRIVERS;")
    for driver_info in drivers:
        e_id = driver_info[0]
        e_name = driver_info[1]
        num_swept = db.engine.execute(swept_query.format(e=e_id,c='completed',m=date_dt.month,y=date_dt.year)).fetchone()[0]
        num_missed = db.engine.execute(swept_query.format(e=e_id,c='missed',m=date_dt.month,y=date_dt.year)).fetchone()[0]

        data[e_name] = {'employee_id':e_id,'assigned':num_swept+num_missed,'completed':num_swept}

    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/performance/week', methods=["GET"])
def get_weekly_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    data = {}
    # get from database
    week_of_month = pendulum.parse(date).week_of_month
    # get day of week from date
    day_of_wk = date_dt.weekday()
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    #start_date = date-days[day_of_wk]
    #end_date = date-days[day_of_wk]+6
    wk_start, wk_end = get_wk_start_end(date_dt)

    swept_query = "select count(*) from ROUTE_LOG where route_id='{r}' and completion='{c}' and date_swept>='{sd}' and date_swept<='{ed}';"
    routes = db.engine.execute("select route_id,monthly_freq from ROUTES;")
    for route_info in routes:
        route = route_info[0]
        freq = route_info[1]
        num_swept = db.engine.execute(swept_query.format(r=route,c='completed',sd=wk_start,ed=wk_end)).fetchone()[0]
        num_missed = db.engine.execute(swept_query.format(r=route,c='missed',sd=wk_start,ed=wk_end)).fetchone()[0]
        if num_swept + num_missed == 0:
            srate = 0
        else:
            srate = num_swept/(num_swept+num_missed)
        data[route] = {'route_family':route[0],'frequency':freq,'times_swept':num_swept,'times_missed':num_missed,'success_rate':srate}

    data['3A'] = {'route_family': 3,
                  'frequency': 4,
                  'times_swept': 3,
                  'times_missed': 1,
                  'success_rate': 3/(3+1)}
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/performance/day', methods=["GET"])
def get_daily_performance():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    # get from database

    swept_query = "select count(*) from ROUTE_LOG where route_id='{r}' and completion='{c}' and date_swept='{d}';"
    routes = db.engine.execute("select route_id,monthly_freq from ROUTES;")
    for route_info in routes:
        route = route_info[0]
        freq = route_info[1]
        num_swept = db.engine.execute(swept_query.format(r=route,c='completed',d=date)).fetchone()[0]
        num_missed = db.engine.execute(swept_query.format(r=route,c='missed',d=date)).fetchone()[0]
        if num_swept + num_missed == 0:
            srate = 0
        else:
            srate = num_swept/(num_swept+num_missed)
        data[route] = {'route_family':route[0],'frequency':freq,'times_swept':num_swept,'times_missed':num_missed,'success_rate':srate}

    data['3A'] = {'route_family': 3,
                  'frequency': 4,
                  'times_swept': 3,
                  'times_missed': 1,
                  'success_rate': 3/(3+1)}
    return Response(json.dumps(data), status=200, mimetype='application/json')

@app.route('/performance/absences', methods=["GET"])
def get_absences():
    date = request.args.get('date')
    if date == None:
        date = datetime.now().strftime("%Y-%m-%d")
    data = {}
    date_dt = datetime.strptime(date,"%Y-%m-%d")
    # get from database
    month_query = "select HOUR(sum(time_missed)) from ABSENCES where employee_id='{e}' and MONTH(date_absence)={m} and YEAR(date_absence)={y};"
    year_query = "select HOUR(sum(time_missed)) from ABSENCES where employee_id='{e}' and YEAR(date_absence)={y};"
    drivers = db.engine.execute("select employee_id,employee_name from DRIVERS;")
    for driver_info in drivers:
        e_id = driver_info[0]
        e_name = driver_info[1]
        month_absence = db.engine.execute(month_query.format(e=e_id,m=date_dt.month,y=date_dt.year)).fetchone()[0]
        if not month_absence:
        	month_absence = 0
        year_absence = db.engine.execute(year_query.format(e=e_id,y=date_dt.year)).fetchone()[0]
        if not year_absence:
        	year_absence = 0
        data[e_name] = {'employee_id':e_id,'month':month_absence,'year':year_absence}

    return Response(json.dumps(data), status=200, mimetype='application/json')

if __name__ == '__main__':
    print('If you want to print to logs, use sys.stderr!!', file=sys.stderr)
    app.run(debug=True, host='0.0.0.0')
