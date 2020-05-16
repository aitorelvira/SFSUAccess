from flask import Blueprint, request, jsonify, Response

from db_credentials import cur, connection

messages_bp = Blueprint('messages_bp', import_name=__name__)


# proper response: response code, content locations, thumbnails, etc
# TODO proper response codes

# /messages/ will give you a list of all conversations in the inbox, user_id required
# /messages/1/ will give you the thread with corresponding thread id
@messages_bp.route("/messages", methods=['POST'], defaults={'message_thread_id': None})
@messages_bp.route("/messages/<int:message_thread_id>/", methods=['GET'])
def view_inbox_conversations(message_thread_id):
    if message_thread_id != None:
        sql = "update messages set read_status=1 where message_thread_id=%s"
        cur.execute(sql,message_thread_id)
        sql = "update message_threads set read_status=1 where id=%s"
        cur.execute(sql,message_thread_id)
        connection.commit()
        sql = "select * from messages WHERE message_thread_id=%s"
        cur.execute(sql, (message_thread_id))
        data = cur.fetchall()
        return jsonify(data), 200
    else:
        request_content = request.get_json()
        inbox_user_id = request_content["user_id"]
        print(inbox_user_id)
        sql = "select message_threads.*, registered_users.first_name from message_threads inner join registered_users ON message_threads.buyer_id=registered_users.id WHERE buyer_id=%s OR seller_id=%s;"
        cur.execute(sql, (inbox_user_id, inbox_user_id))
        data = cur.fetchall()
        return jsonify(data), 200

# CREATE Sending a message about a product to a seller for the first time
@messages_bp.route("/messages/new", methods=['POST'])
def reply_to_post():
    form = request.get_json()
    sender_user_id = form["sender_user_id"]
    recipient_user_id = form["recipient_user_id"]
    message_contents = form["message_contents"]
    product_id = form["product_id"]
    sql = "insert into message_threads(buyer_id,seller_id,product_id,last_message,read_status) values (%s,%s,%s,%s,0)"
    cur.execute(sql, (sender_user_id, recipient_user_id, product_id,message_contents))
    connection.commit()
    message_thread_id = cur.lastrowid
    sql = "insert into messages(sender_user_id,recipient_user_id,message_thread_id,date_time_sent,message_contents,read_status) values (%s,%s,%s,NOW(),%s,0)"
    cur.execute(sql, (sender_user_id, recipient_user_id, message_thread_id, message_contents))
    connection.commit()
    status_code = Response(status=200)
    return status_code

#replying to an existing conversation
@messages_bp.route('/messages/<int:message_thread_id>/reply/', methods=['POST'])
def reply_to_thread(message_thread_id):
    form = request.get_json()
    sender_user_id = form["sender_user_id"]
    recipient_user_id = form["recipient_user_id"]
    message_contents = form["message_contents"]
    sql = "insert into messages(sender_user_id,recipient_user_id,message_thread_id,date_time_sent,message_contents,read_status) values (%s,%s,%s,NOW(),%s,0)"
    cur.execute(sql, (sender_user_id, recipient_user_id, message_thread_id, message_contents))
    connection.commit()
    sql = "update message_threads set last_message=%s and read_status=0 where id = %s"
    cur.execute(sql,(message_contents,message_thread_id))
    connection.commit()
    status_code = Response(status=200)
    return status_code

# DELETE THE WHOLE THREAD
@messages_bp.route('/messages/<int:message_thread_id>', methods=['DELETE'])
def delete_message_thread(message_thread_id):
    # message_thread_id = request.form["message_thread_id"]
    sql = "delete from messages where message_thread_id=%s"
    cur.execute(sql, message_thread_id)
    connection.commit()
    sql = "delete from message_threads where id=%s"
    cur.execute(sql, message_thread_id)
    connection.commit()
    status_code = Response(status=204)
    return status_code
