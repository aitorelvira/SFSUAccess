from flask import Flask, jsonify, request, send_file, Response
import pymysql

#TODO for back end team, check all to dos in file... add response status codes to any that are missing

# Connect to the database
connection = pymysql.connect(host='csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com',
                             user='admin',
                             password='rdsmysql',
                             db='t3',
                             cursorclass=pymysql.cursors.DictCursor)
cur = connection.cursor()
app = Flask(__name__)

#products / categories / searches
@app.route('/api/search',methods=['GET','POST'])
def get_categories():
    if request.method=='GET':
        cur.execute("SELECT product_category_name FROM product_categories LIMIT 50")
        results = cur.fetchall()
        return jsonify(results)
    if request.method=='POST':
        product_fields = ["product_name", "product_category", "product_author", "product_description"]
        search_query = request.get_json()
        sql = "SELECT DISTINCT * FROM products WHERE ("
        for fields in product_fields:
            sql += "{0} LIKE '%".format(fields) + search_query['product_name'] + "%'"
            if product_fields.index(fields) + 1 != len(product_fields):
                sql += " OR "
            else:
                sql += ") AND product_status = 'ACTIVE'"
        print("Executing: " + sql)
        cur.execute(sql)
        results = cur.fetchall()
        return jsonify(results)

#TODO front end needs to adapt for GET and POST
#POST REQUEST USING JSON DATA
@app.route('/api/search/<category>',methods=['GET','POST'])
def get_category_items(category):
    if request.method=='GET':
        if category.lower() == "all":
            print("xxxx")
            sql = "SELECT * FROM products WHERE product_status = 'ACTIVE'"
            cur.execute(sql)
            results = cur.fetchall()
            return jsonify(results)
        else:
            print("yyyy")
            sql = "SELECT * FROM products WHERE product_category = '{0}'".format(category) + " AND product_status = 'ACTIVE'"
            cur.execute(sql)
            results = cur.fetchall()
            return jsonify(results)
    if request.method=='POST':
        product_fields = ["product_name", "product_category", "product_author", "product_description"]
        search_query = request.get_json()
        sql = "SELECT DISTINCT * FROM products WHERE {category}(".format(category="" if (category.lower() == "all") else "product_category = '{0}' AND ".format(category))
        for fields in product_fields:
            sql += "{0} LIKE '%".format(fields) + search_query['product_name'] + "%'"
            if product_fields.index(fields)+1 != len(product_fields):
                sql += " OR "
            else:
                sql += ") AND product_status = 'ACTIVE'"
        print("Executing: " + sql)
        cur.execute(sql)
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

#POST REQUEST USING JSON DATA
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


#all user listings, active or pending
#POST REQUEST USING JSON DATA
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

#this endpoint is for students/faculty, NOT admin
#POST REQUEST USING FORM-DATA
@app.route('/api/product',methods=['POST'])
def post_product():
    # create product post TODO FOR KEVIN still need to figure out file system
    product_name = request.form['product_name']
    product_category = request.form['product_category']
    product_author = request.form['product_author']
    product_description = request.form['product_description']
    product_user_id = request.form['user_id']
    product_license = request.form['product_license']
    sql = "INSERT INTO products(product_name,product_category,product_author,product_description,registered_user_id,product_license,date_time_added,product_status) VALUES (%s,%s,%s,%s,%s,%s,NOW(),'PENDING')"
    cur.execute(sql,(product_name,product_category,product_author,product_description,product_user_id,product_license))
    connection.commit()
    status_code = Response(status=201)
    return status_code

#admin approval on pending posts
#POST REQUEST USING FORM-DATA
@app.route('/api/admin/review',methods=['POST'])
def review_product():
    product_id = request.form['product_id']
    decision = request.form['decision']
    if(decision=="Approve"):
        sql = "UPDATE products SET product_status = 'ACTIVE' WHERE id = %s"
    if(decision=="Deny"):
        sql = "UPDATE products SET product_status = 'DENIED' WHERE id = %s"
    cur.execute(sql,product_id)
    connection.commit()
    status_code = Response(status=200)
    return status_code

# /api/product?user_id=13&status=active
#GET REQUEST USING HEADERS
@app.route('/api/product',methods=['GET'])
def get_products():
    user_id = request.args["user_id"]
    product_status = request.args["status"]
    if product_status == "active":
        sql = "SELECT * FROM products WHERE product_status ='ACTIVE' AND registered_user_id = %s"
    if product_status == "pending":
            sql = "SELECT * FROM products WHERE product_status ='PENDING' AND registered_user_id = %s"
    if product_status == "all":
            sql = "SELECT * FROM products WHERE registered_user_id = %s"
    cur.execute(sql,(user_id))
    results = cur.fetchall()
    return jsonify(results)

#PUT REQUEST USING FORM-DATA
@app.route('/api/product/<id>', methods=['GET','PUT','DELETE'])
def manage_product(id):
    if request.method=='GET':
        sql = "select products.*, registered_users.`email` FROM products inner join `registered_users` ON registered_users.id=products.`registered_user_id` WHERE products.id=%s"
        cur.execute(sql,(id))
        product_detail = cur.fetchall()
        return jsonify(product_detail)
    if request.method=='PUT':
        sql = "SELECT product_name FROM products WHERE id = %s"
        # Check if the product still exists
        if bool(cur.execute(sql,id)):
            sql = "UPDATE products SET product_name=%s,product_author=%s,product_category=%s,product_description=%s,product_license=%s WHERE id = %s"
            product_name = request.form['product_name']
            product_author = request.form['product_author']
            product_category = request.form['product_category']
            product_description = request.form['product_description']
            product_license = request.form['product_license']
            cur.execute(sql,(product_name,product_author,product_category,product_description,product_license,id))
            connection.commit()
            status_code = Response(status=200)
            return status_code
    if request.method=='DELETE':
        sql = "SELECT product_name FROM products WHERE id = %s"
        #Check if the product still exists
        if bool(cur.execute(sql,id)):
            # Delete product
            sql = "DELETE FROM products WHERE id = %s"
            cur.execute(sql,(id))
            connection.commit()
            status_code = Response(status=200)
            return status_code

# MESSAGES
# Initiate a new conversation with another user. Needs FROM USER ID, TO USER ID, MESSAGE CONTENT, PRODUCT ID
#POST WITH FORM DATA
@app.route('/api/messages/new',methods=['POST'])
def new_chatroom():
    from_user = request.form['from_user_id']
    to_user = request.form['to_user_id']
    message = request.form['message_content']
    product_id = request.form['product_id']
    sql = "INSERT INTO chat_rooms(user_1,user_2,product_id) VALUES (%s,%s,%s)"
    cur.execute(sql,(from_user,to_user,product_id))
    connection.commit()
    #get conversation ID
    sql = "SELECT chat_room_id FROM chat_rooms WHERE user_1 = %s AND user_2 = %s AND product_id = %s"
    cur.execute(sql,(from_user,to_user,product_id))
    chat_row = cur.fetchall()
    chatroom_id = chat_row[0]['chat_room_id']
    #to do, add relevant status code here
    sql = "INSERT INTO messages(from_user_id,to_user_id,chat_room_id,message,sent_at) VALUES (%s,%s,%s,%s,NOW())"
    cur.execute(sql,(from_user,to_user,chatroom_id, message))
    connection.commit()
    status_code = Response(status=200)
    return status_code

#GET USER CONVERSATIONS
@app.route('/api/messages',methods=['GET'])
def get_chatrooms():
    user_id = request.args["user_id"]
    sql = "SELECT * from chat_rooms WHERE user_1=%s OR user_2=%s"
    cur.execute(sql,(user_id,user_id))
    data = cur.fetchall()
    return jsonify(data),200

#TODO, add code for checking if request is from authorized user
@app.route('/api/messages/<chatroom_id>',methods =['GET'])
def get_chatroom_messages_by_id(chatroom_id):
    sql = "SELECT * from messages WHERE chat_room_id=%s"
    cur.execute(sql,chatroom_id)
    data = cur.fetchall()
    return jsonify(data),200


#call this when a conversation is opened. this one doesn't return conversation contents, only marks conversation as read.
@app.route('/api/messages/read/<chatroom_id>',methods =['POST'])
def read_chatroom_messages_by_id(chatroom_id):
    user_id = request.form['user_id']
    sql = "UPDATE messages SET read_at=NOW() WHERE to_user_id=%s AND chat_room_id=%s"
    cur.execute(sql,(user_id,chatroom_id))
    connection.commit()
    status_code = Response(status=200)
    return status_code


if __name__ == "__main__":
    app.run(debug=True)
