from flask import Flask, Response, jsonify
import pymysql
app = Flask(__name__)


class Database:
    def __init__(self):
        host = "127.0.0.1"
        user = "root"
        password = "localmysql"
        db = "ProductionDB"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()
    def list_categories(self):
        self.cur.execute("SELECT product_category_name FROM Product_Categories LIMIT 50")
        result = self.cur.fetchall()
        return result

@app.route('/api/search')
def get_search():
    def db_query():
        db = Database()
        emps = db.list_categories()
        return emps
    res = db_query()
    return jsonify(res)
app.run(debug=True)
