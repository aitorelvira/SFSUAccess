import time
from flask import Flask, Response, jsonify
import pymysql
app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': 123}


class Database:
    def __init__(self):
        host = "127.0.0.1"
        user = "root"
        password = "localmysql"
        db = "employees"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()
    def list_employees(self):
        self.cur.execute("SELECT first_name, last_name, gender FROM employees LIMIT 50")
        result = self.cur.fetchall()
        return result

@app.route('/search')
def get_search():
    def db_query():
        db = Database()
        emps = db.list_employees()
        return emps
    res = db_query()
    return jsonify(res)
app.run(debug=True)
