from flask import Flask, jsonify, request
import pymysql

app = Flask(__name__)


class Database:
    def __init__(self):
        host = "csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com"
        user = "admin"
        password = "rdsmysql"
        db = "proddb"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()

    def list_categories(self):
        self.cur.execute("SELECT product_category_name FROM product_categories LIMIT 50")
        result = self.cur.fetchall()
        return result

    def list_members(self):
        self.cur.execute("SELECT first_name FROM Team_Members LIMIT 50")
        result = self.cur.fetchall()
        return result

    def list_category_entries(self, categoryname):
        query = "SELECT * FROM " + str(categoryname) + "_products LIMIT 50"
        self.cur.execute(query)
        result = self.cur.fetchall()
        return result

    def list_all_category_entries(self, paramobjects):
        product_categories = ["class_notes", "video", "music"]
        product_fields = ["product_name", "product_file_size", "product_description", "product_author"]
        result = []
        for category in product_categories:
            if "search_query" in paramobjects and len(paramobjects) == 1:
                result = []
                for field in product_fields:
                    query = "SELECT * FROM " + category + "_products WHERE " + field + " LIKE '%" + \
                            paramobjects[
                                "search_query"] + "%' LIMIT 50"
                    self.cur.execute(query)
                    result += self.cur.fetchall()
                return result
            for field in product_fields:
                if field in paramobjects:
                    query = "SELECT * FROM " + category + "_products WHERE " + field + " LIKE '%" + \
                            paramobjects[
                                field] + "%' LIMIT 50"
                    self.cur.execute(query)
                    result += self.cur.fetchall()
        return result

    # this function will return any entry where any field matches the search_query url parameter or if a field is specified. FROM SPECIFIED CATEGORY
    def list_search_query_entries(self, categoryname, paramsobject):
        product_fields = ["product_name", "product_file_size", "product_description", "product_author"]

        if "search_query" in paramsobject and len(paramsobject) == 1:
            result = []
            for field in product_fields:
                query = "SELECT * FROM " + str(categoryname) + "_products WHERE " + field + " LIKE '%" + paramsobject[
                    "search_query"] + "%' LIMIT 50"
                self.cur.execute(query)
                result += self.cur.fetchall()
            return result
        for field in product_fields:
            if field in paramsobject:
                query = "SELECT * FROM " + str(categoryname) + "_products WHERE " + field + " LIKE '%" + paramsobject[
                    field] + "%' LIMIT 50"
            self.cur.execute(query)
        return self.cur.fetchall()


# this function returns all requested data searched from given category
@app.route('/api/search/<category>')
def get_search(category):
    db = Database()
    paramsobject = request.args
    fixed_case = str(category.lower())
    if category == "all" or category == "All":
        emps = db.list_all_category_entries(paramsobject)
        return jsonify(emps)
    # capitalize all first letters of a category
    # fixed_case = fixed_case.capitalize()
    print(fixed_case)
    if len(paramsobject) == 0:
        emps = db.list_category_entries(fixed_case)
    else:
        emps = db.list_search_query_entries(fixed_case, paramsobject)
    return jsonify(emps)


# this function returns the list of categories
@app.route('/api/search')
def list_categories():
    db = Database()
    emps = db.list_categories()
    return jsonify(emps)


# this is for the flask team to test new functionality easily by calling the /api/test endpoint
# this function will only test whatever code is inside test(). you are welcome to erase the definition to test your own
@app.route('/api/test')
def test():
    db = Database()
    paramsobject = request.args
    emps = db.list_all_category_entries(paramsobject)
    return jsonify(emps)


# app run
app.run(debug=True)
