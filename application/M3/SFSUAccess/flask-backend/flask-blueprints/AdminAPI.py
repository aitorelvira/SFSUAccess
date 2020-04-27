from flask import Blueprint
admin_api = Blueprint('admin_api', name)

@admin_api.route('/api/download', methods = ['GET'])
def download_file():
    # TODO check if file exists, and if user is allowed to download
    product_id = request.args['product_id']
    uri = uri_append+str(product_id)+'.*'
    for file in glob.glob(uri):
        #return send_file(file,as_attachment=True), 302
        return send_file(file), 302



@admin_api.route('/api/thumbnails', methods = ['GET'])
def download_thumbnail():
    # TODO check if file exists, and if user is allowed to download
    product_id = request.args['product_id']
    uri = 'thumbnails/'+str(product_id)+'.*'
    for file in glob.glob(uri):
        #return send_file(file,as_attachment=True), 302
        return send_file(file), 302


@admin_api.route('/api/admin/review',methods=['POST'])
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

@admin_api.route('/api/admin/pending',methods=['GET'])
def review_pending():
    sql = "SELECT * from products WHERE product_status = 'PENDING'"
    cur.execute(sql)
    return jsonify(cur.fetchall())

