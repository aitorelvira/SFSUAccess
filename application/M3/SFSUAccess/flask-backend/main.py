from flask import Flask, jsonify, request, send_file, Response
import pymysql

#TODO for back end team, check all to dos in file... add response status codes to any that are missing

# Connect to the database
connection = pymysql.connect(host='csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com',
                             user='admin',
                             password='rdsmysql',
                             db='fixedAGAIN',
                             cursorclass=pymysql.cursors.DictCursor)
cur = connection.cursor()
app = Flask(__name__)

#products / categories / searches
@app.route('/api/search')
def get_categories():
    cur.execute("SELECT product_category_name FROM product_categories LIMIT 50")
    results = cur.fetchall()
    return jsonify(results)

#TODO front end needs to adapt for GET and POST
@app.route('/api/search/<category>',methods=['GET','POST'])
def get_category_items(category):
    if request.method=='GET':
        sql = "SELECT * FROM products WHERE product_category = %s"
        cur.execute(sql,(category))
        results = cur.fetchall()
        return jsonify(results)
    if request.method=='POST':
        search_query = request.get_json()
        sql = "SELECT * FROM products WHERE product_category = %s AND product_name LIKE %s"
        cur.execute(sql,(category,str(search_query['search_query'])))
        results = cur.fetchall()
        return jsonify(results)

@app.route('/api/user_types')
def get_user_types():
    sql = "SELECT privelege_type FROM user_priveleges"
    cur.execute(sql)
    results = cur.fetchall()
    return jsonify(results)

@app.route('/api/product_license')
def get_product_licenses():
    sql = "SELECT license_type FROM licenses"
    cur.execute(sql)
    results = cur.fetchall()
    return jsonify(results)

@app.route('/api/register', methods=['POST'])
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

@app.route('/api/login', methods=['POST'])
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

#@app.route('/account')

#all user listings, active or pending
@app.route('/api/user_listings', methods=['POST'])
def user_listings():
    form = request.get_json()
    email = form['email']
    sql = "SELECT id FROM registered_users WHERE email = %s"
    #checking if this email exists
    if not bool(cur.execute(sql,(email))):
        #user does not exist
        status_code = Response(status=204)
        return status_code
    #else moving along
    user_row = cur.fetchall()
    user_id = user_row[0]['id']
    sql = "SELECT * FROM products WHERE registered_user_id = %s"
    if bool(cur.execute(sql,(user_id))):
        #user has items
        return jsonify(cur.fetchall()),302
    else:
        #users does not have items
        status_code = Response(status=204)
        return status_code

@app.route('/api/product',methods=['POST'])
def post_product():
    # create product post TODO FOR KEVIN still need to figure out file system
    product_name = request.form['product_name']
    product_category = request.form['product_category']
    product_author = request.form['product_author']
    product_description = request.form['product_description']
    product_user_id = request.form['user_id']
    product_license = request.form['product_license']
    sql = "INSERT INTO products(product_name,product_category,product_author,product_description,registered_user_id,product_license) VALUES (%s,%s,%s,%s,%s,%s)"
    cur.execute(sql,(product_name,product_category,product_author,product_description,product_user_id,product_license))
    connection.commit()
    status_code = Response(status=201)
    return status_code

@app.route('/api/product/<id>', methods=['PUT','DELETE'])
def manage_product(id):

    if request.method=='PUT':
        sql = "SELECT "
        #check if product id still exists, if so move along
        sql = "SELECT product_name FROM products WHERE id = %S"
        # Check if the product still exists
        if bool(sql):
            #Change product name
            #p_name = request.form['product_name']
            product_name = request.form['product_name']
            sql = "UPDATE products SET product_name = %s WHERE id = %s"
            cur.execute(sql,(product_name,id))
            # Change product category
            product_category = request.form['product_category']
            sql = "UPDATE products SET product_category = %s WHERE id = %s"
            cur.execute(sql,(product_category, id))
            #Change product description
            product_description = request.form['product_description']
            sql = "UPDATE products SET product_description = %s WHERE id = %s"
            cur.execute(sql,(product_description, id))
            connection.commit()
            # Change product license
            product_license = request.form['product_license']
            sql = "UPDATE products SET product_license = %s WHERE id = %s"
            cur.execute(sql,(product_license, id))
            connection.commit()
            status_code = Response(status=200)
            return status_code

    if request.method=='DELETE':
        sql = "SELECT product_name FROM products WHERE id = %S"
        #Check if the product still exists
        if bool(sql):
            # Delete product
            sql = "DELETE FROM products WHERE id = %s"
            cur.execute(sql,(id))
            connection.commit()
            status_code = Response(status=200)
            return status_code


if __name__ == "__main__":
    app.run(debug=True)
