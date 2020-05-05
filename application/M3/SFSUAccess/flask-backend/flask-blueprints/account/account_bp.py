from flask import Blueprint, request, jsonify, Response

from db_credentials import cur, connection

account_bp = Blueprint('account_bp', import_name=__name__)


# all user listings, active or pending
# POST REQUEST USING JSON DATA
@account_bp.route('/account/listings', methods=['POST'])
def user_listings():
    form = request.get_json()
    email = form['email']
    sql = "SELECT id FROM registered_users WHERE email = %s"
    # checking if this email exists
    if not bool(cur.execute(sql, (email))):
        # user does not exist
        status_code = Response(status=204)
        return status_code
    # else moving along
    user_row = cur.fetchall()
    user_id = user_row[0]['id']
    sql = "SELECT * FROM products WHERE registered_user_id = %s"
    if bool(cur.execute(sql, (user_id))):
        # user has items
        return jsonify(cur.fetchall()), 302
    else:
        # users does not have items
        status_code = Response(status=204)
        return status_code
