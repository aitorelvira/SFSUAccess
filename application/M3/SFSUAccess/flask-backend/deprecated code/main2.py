import json
import os
from pathlib import Path

from flask import Flask, jsonify, request, send_file
import pymysql

app = Flask(__name__)


class Database:
    def __init__(self):
        host = "csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com"
        user = "admin"
        password = "rdsmysql"
        db = "fixedAGAIN"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor, autocommit=True)
        self.cur = self.con.cursor()

    def list_categories(self):
        self.cur.execute("SELECT product_category_name FROM product_categories LIMIT 50")
        result = self.cur.fetchall()
        return result

    def get_category_id(self, category_name):
        self.cur.execute("SELECT id FROM product_categories WHERE product_category_name LIKE '" + category_name + "'")
        fetch = self.cur.fetchall()
        print(fetch[0]['id'])
        return str(fetch[0]['id'])

    def get_category_products(self, category_id):
        self.cur.execute("SELECT * FROM products WHERE product_category_id = " + category_id)
        return self.cur.fetchall()

    def get_category_results(self, id, search_query):
        self.cur.execute(
            "SELECT * FROM products WHERE product_category_id = " + id + " AND product_name LIKE '%" + search_query + "%' LIMIT 50")
        return self.cur.fetchall()

    def check_is_unregistered(self, email):
        query = "SELECT email FROM registered_users WHERE email ='" + email + "'"
        return not bool(self.cur.execute(query))

    def check_is_registered(self, email):
        query = "SELECT email FROM registered_users WHERE email ='" + email + "'"
        return bool(self.cur.execute(query))

    def authenticate_login(self, content):
        query = "SELECT email,first_name,last_name,id,privelege_type FROM registered_users WHERE email ='" + content[
            'email'] + "' AND password ='" + content['password'] + "'"
        if bool(self.cur.execute(query)):
            return self.cur.fetchall()

    def register_user(self, registration_info):
        query = "INSERT INTO registered_users(id,email,password,first_name,last_name,privelege_type) VALUES (0,'" + \
                registration_info[
                    'email'] + "','" + registration_info['password'] + "','" + registration_info['first_name'] + "','" + \
                registration_info['last_name'] + "',2)"
        print(query)
        print(self.cur.execute(query))

    def post_item(self, item_info):
        name = item_info['product_name']
        category = item_info['product_category']
        author = item_info['product_author']
        dlink = item_info['download_link']
        description = item_info['product_description']
        user = item_info['registered_user_email']
        query = "SELECT id FROM registered_users WHERE email ='" + user + "'"
        self.cur.execute(query)
        user_id = self.cur.fetchall()
        id = self.get_category_id(category)
        query = "INSERT INTO products(id,product_category_id,product_name,product_author,product_description,registered_user_id," \
                "download_link) VALUES (0,'" + id + "','" + name + "','" + author + "','" + description + "','" + str(
            user_id[0]['id']) + "','" + dlink + "')"
        self.cur.execute(query)


@app.route('/api/search/<category>')
def categorical(category):
    db = Database()
    id = db.get_category_id(category)
    if len(request.args) == 0:
        return jsonify(db.get_category_products(id))
    else:
        return jsonify(db.get_category_results(id, request.args["search_query"]))


@app.route('/api/search')
def list_categories():
    db = Database()
    emps = db.list_categories()
    return jsonify(emps)


@app.route('/api/register', methods=['POST'])
def registerNewUser():
    db = Database()
    content = request.get_json()
    if db.check_is_unregistered(content['email']):
        db.register_user(content)
        return content['email'] + " has been registered"
    else:
        return content['email'] + " is already registered,check email and try again"


@app.route('/api/login', methods=['POST'])
def loginUser():
    db = Database()
    content = request.get_json()
    if db.check_is_registered(content['email']):
        return jsonify(db.authenticate_login(content))


@app.route('/api/get-item/<product_id>')
def getFileDownload(product_id):
    filepath = str(Path.home()) + "/Desktop/" + product_id + ".mp3"
    return send_file(filepath, as_attachment=True)


@app.route('/api/postitem', methods=['POST'])
def postItem():
    db = Database()
    content = request.get_json()
    db.post_item(content)
    return "posted!"


app.run(debug=True)
