from flask import Blueprint, request, jsonify, Response

from db_credentials import cur, connection

auth_bp = Blueprint('auth_bp', import_name=__name__)

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    form = request.get_json()
    email = form['email']
    password = form['password']
    sql = "SELECT email,first_name,last_name,id,privelege_type FROM registered_users WHERE email =%s AND password =%s"
    if bool(cur.execute(sql,(email,password))):
        #log in successful
        return jsonify(cur.fetchall()),202
    else:
        #information incorrect
        status_code = Response(status=401)
        return status_code

@auth_bp.route('/auth/register', methods=['POST'])
#POST REQUEST USING JSON DATA, THE COMMENT BLOCK IS FORM-DATA
def register_user():
#     this block of comment is if we get around to fixing React to post a FORM instead of JSON
#     email = request.form['email']
#     password = request.form['password']
#     first_name = request.form['first_name']
#     last_name = request.form['last_name']
    form = request.get_json()
    email = form['email']
    password = form['password']
    first_name = form['first_name']
    last_name = form['last_name']
    # TODO Add functionality to discern from Student to Faculty, need React team to update form to reflect that
    #check if unregistered first
    sql = "SELECT email FROM registered_users WHERE email = %s"
    if not cur.execute(sql,email):
        #user is not registered yet, may proceed with registration, TODO 2 as the final value sets privelege_type to Student by default
        sql = "INSERT INTO registered_users(email,password,first_name,last_name,privelege_type) VALUES (%s,%s,%s,%s,2)"
        cur.execute(sql,(email,password,first_name,last_name))
        connection.commit()
        status_code = Response(status=201)
        return status_code
    else:
        #user is registered already
        status_code = Response(status=409)
        return status_code