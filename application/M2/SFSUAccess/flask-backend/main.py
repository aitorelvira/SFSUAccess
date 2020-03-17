from flask import Flask, jsonify
import pymysql

app = Flask(__name__)


class Database:
    def __init__(self):
        host = "csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com"
        user = "admin"
        password = "rdsmysql"
        db = "ProdDB"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()

    def list_categories(self):
        self.cur.execute("SELECT product_category_name FROM Product_Categories LIMIT 50")
        result = self.cur.fetchall()
        return result

    def list_category_entries(self, categoryname):
        query = "SELECT * FROM " + str(categoryname) + "_Products LIMIT 50"
        self.cur.execute(query)
        result = self.cur.fetchall()
        return result

    def list_search_query_entries(self, categoryname, searchquery):
        query = "SELECT * FROM " + str(categoryname) + "_Products WHERE * LIKE %" + str(searchquery) + "% LIMIT 50"
        self.cur.execute(query)
        result = self.cur.fetchall();
        return result


# this function returns all categories
@app.route('/api/search')
def get_search():
    db = Database()
    emps = db.list_categories()
    return jsonify(emps)


# this function returns all entries under specified category
@app.route('/api/search/<category>')
def get_all_category_entries(category):
    db = Database()
    emps = db.list_category_entries(category)
    return jsonify(emps)


@app.route('/api/search/<category>/<searchquery>')
def get_all_search_entries(category, searchquery):
    db = Database()
    emps = db.list_search_query_entries(category, searchquery)
    return jsonify(emps)


# app run
app.run(debug=True)
