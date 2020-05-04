from flask import Blueprint, request, jsonify, Response

from db_credentials import cur, connection

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


@products_bp.route('/api/product/<id>', methods=['GET', 'PUT', 'DELETE'])
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
            status_code = Response(status=200)
            return status_code
