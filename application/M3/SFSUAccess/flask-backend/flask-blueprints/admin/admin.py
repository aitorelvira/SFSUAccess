from flask import Blueprint, request, Response, jsonify

from db_credentials import cur, connection

admin_bp = Blueprint('admin_bp', import_name=__name__)

@admin_bp.route('/admin/review',methods=['POST'])
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

@admin_bp.route('/admin/pending',methods=['GET'])
def review_pending():
    sql = "SELECT * from products WHERE product_status = 'PENDING'"
    cur.execute(sql)
    return jsonify(cur.fetchall())