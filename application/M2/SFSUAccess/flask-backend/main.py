from flask import Flask, jsonify, request
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

    def list_members(self):
        self.cur.execute("SELECT first_name FROM Team_Members LIMIT 50")
        result = self.cur.fetchall()
        return result

    def list_category_entries(self, categoryname):
        query = "SELECT * FROM " + str(categoryname) + "_Products LIMIT 50"
        self.cur.execute(query)
        result = self.cur.fetchall()
        return result

    def list_search_query_entries(self, categoryname, paramsobject):
        product_fields = ["product_name", "product_file_size", "product_description", "product_author"]

        if "search_query" in paramsobject and len(paramsobject) == 1:
            result = []
            for field in product_fields:
                query = "SELECT * FROM " + str(categoryname) + "_Products WHERE " + field + " LIKE '%" + paramsobject[
                    "search_query"] + "%' LIMIT 50"
                print(query)
                self.cur.execute(query)
                result += self.cur.fetchall()
            return result

        for field in product_fields:
            if field in paramsobject:
                query = "SELECT * FROM " + str(categoryname) + "_Products WHERE " + field + " LIKE '%" + paramsobject[
                    field] + "%' LIMIT 50"
        self.cur.execute(query)
        result = self.cur.fetchall()
        query = "SELECT * FROM " + str(categoryname) + "_Products WHERE product_name LIKE '%Goodbye%' LIMIT 50"
        self.cur.execute(query)
        result2 = self.cur.fetchall()
        final = result + result2
        return final


# this function returns all requested data searched from given category
@app.route('/api/search/<category>')
def get_search(category):
    db = Database()
    paramsobject = request.args
    if len(paramsobject) == 0:
        emps = db.list_category_entries(category)
    else:
        emps = db.list_search_query_entries(category, paramsobject)
    return jsonify(emps)


@app.route('/api/search')
def list_categories():
    db = Database()
    emps = db.list_categories()
    return jsonify(emps)


# app run
app.run(debug=True)
