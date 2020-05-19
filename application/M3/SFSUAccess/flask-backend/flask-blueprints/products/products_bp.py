from flask import Blueprint, request, jsonify, Response

from db_credentials import cur, connection
from files.files_bp import upload_file

products_bp = Blueprint('products_bp', import_name=__name__)


# proper response: response code, content locations, thumbnails, etc
# TODO proper response codes

@products_bp.route('/product/product_license')
def get_product_licenses():
    sql = "SELECT license_type FROM licenses"
    cur.execute(sql)
    results = cur.fetchall()
    return jsonify(results)


# not really sure what this is, have to change endpoint name TODO
@products_bp.route('/product', methods=['GET'])
def get_products():
    user_id = request.args["user_id"]
    product_status = request.args["status"]
    if product_status == "active":
        sql = "SELECT * FROM products WHERE product_status ='ACTIVE' AND registered_user_id = %s"
    if product_status == "pending":
        sql = "SELECT * FROM products WHERE product_status ='PENDING' AND registered_user_id = %s"
    if product_status == "all":
        sql = "SELECT * FROM products WHERE registered_user_id = %s"
    cur.execute(sql, (user_id))
    results = cur.fetchall()
    return jsonify(results)

@products_bp.route('/product',methods=['POST'])
def post_product():
    product_name = request.form['product_name']
    product_category = request.form['product_category']
    product_author = request.form['product_author']
    product_description = request.form['product_description']
    registered_user_id = request.form['user_id']
    product_license = request.form['product_license']
    product_price = request.form['product_price']
    file = request.files['file']
    sql = "INSERT INTO products(product_name,product_category,product_author,product_description,registered_user_id,product_license,date_time_added,product_status,price) VALUES (%s,%s,%s,%s,%s,%s,NOW(),'PENDING',%s)"
    cur.execute(sql, (
    product_name, product_category, product_author, product_description, registered_user_id, product_license, product_price))
    connection.commit()
    cur.fetchall()
    #get the new product id number to rename upload
    product_id = cur.lastrowid
    return upload_file(request,product_id)


@products_bp.route('/product/<id>', methods=['GET', 'PUT', 'DELETE'])
def manage_product(id):
    if request.method == 'GET':
        sql = "select products.*, registered_users.`email` FROM products inner join `registered_users` ON registered_users.id=products.`registered_user_id` WHERE products.id=%s"
        cur.execute(sql, (id))
        product_detail = cur.fetchall()
        return jsonify(product_detail)
    if request.method == 'PUT':
        sql = "SELECT product_name FROM products WHERE id = %s"
        # Check if the product still exists
        if bool(cur.execute(sql, id)):
            sql = "UPDATE products SET product_name=%s,product_author=%s,product_category=%s,product_description=%s,product_license=%s WHERE id = %s"
            product_name = request.form['product_name']
            product_author = request.form['product_author']
            product_category = request.form['product_category']
            product_description = request.form['product_description']
            product_license = request.form['product_license']
            cur.execute(sql, (product_name, product_author, product_category, product_description, product_license, id))
            connection.commit()
            status_code = Response(status=200)
            return status_code
    if request.method == 'DELETE':
        sql = "SELECT product_name FROM products WHERE id = %s"
        # Check if the product still exists
        if bool(cur.execute(sql, id)):
            # Delete product
            sql = "DELETE FROM products WHERE id = %s"
            cur.execute(sql, (id))
            connection.commit()
            sql = "DELETE messages, message_threads from messages inner join message_threads on messages.message_thread_id=message_threads.id WHERE message_threads.product_id=%s"
            cur.execute(sql,(id))
            connection.commit()
            status_code = Response(status=200)
            return status_code
