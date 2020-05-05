from flask import Blueprint, request, jsonify

from db_credentials import cur, connection

search_bp = Blueprint('search_bp', import_name=__name__)


# proper response: response code, content locations, thumbnails, etc
# TODO proper response codes

@search_bp.route('/search',methods=['GET','POST'])
def get_categories():
    if request.method=='GET':
        sql = "SELECT product_category_name FROM product_categories LIMIT 50"
        print("Executing: " + sql)
        cur.execute(sql)
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
                sql += ") AND product_status = 'ACTIVE' ORDER BY date_time_added DESC"
        print("Executing: " + sql)
        cur.execute(sql)
        results = cur.fetchall()
        return jsonify(results)

@search_bp.route('/search/<category>',methods=['GET','POST'])
def get_category_items(category):
    search_query = request.get_json()
    if request.method=='GET':
        if category.lower() == "all":
            sql = "SELECT * FROM products WHERE product_status = 'ACTIVE' ORDER BY date_time_added DESC"
            print("Executing: " + sql)
            cur.execute(sql)
            results = cur.fetchall()
            return jsonify(results)
        else:
            sql = "SELECT * FROM products WHERE product_category = '{0}'".format(category) + " AND product_status = 'ACTIVE' ORDER BY date_time_added DESC"
            print("Executing: " + sql)
            cur.execute(sql)
            results = cur.fetchall()
            return jsonify(results)
    if request.method=='POST':
        product_fields = ["product_name", "product_category", "product_author", "product_description"]
        search_query = request.get_json()
        sql = "SELECT DISTINCT * FROM products WHERE {category}".format(category="" if (category.lower() == "all") else "product_category = '{0}' AND ".format(category))
        if search_query['product_name'] != '':
            sql += '('
            for fields in product_fields:
                sql += "{0} LIKE '%".format(fields) + search_query['product_name'] + "%'"
                if product_fields.index(fields) + 1 != len(product_fields):
                    sql += " OR "
                else:
                    sql += ") AND "
        if search_query['license_name'] != 'Any license':
            sql += "product_license = '" + search_query['license_name'] + "' AND "
        sql += "product_status = 'ACTIVE' ORDER BY date_time_added DESC"
        print("Executing: " + sql)
        cur.execute(sql)
        results = cur.fetchall()
        return jsonify(results)
