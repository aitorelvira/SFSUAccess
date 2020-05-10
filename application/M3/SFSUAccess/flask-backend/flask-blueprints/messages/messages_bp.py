from flask import Blueprint, request, jsonify, Response

from db_credentials import cur, connection

messages_bp = Blueprint('messages_bp', import_name=__name__)


# proper response: response code, content locations, thumbnails, etc
# TODO proper response codes

# READ
@messages_bp.route("/messages/", methods=['GET'], defaults={'conversation_id': None})
@messages_bp.route("/messages/<int:message_thread_id>/", methods=['GET'])
def view_inbox_conversations(message_thread_id):
    # find out inbox user's id, maybe authentication
    # optional, get conversation id from url
    # each conversation should have a reference to the from user id, conversation id, product id, date and time
    # return a list of threads, or messages from a thread in order it was sent
    inbox_user_id = request.form["user_id"]
    if message_thread_id != None:
        sql = "select * from messages WHERE message_thread_id=%s"
        cur.execute(sql, (message_thread_id))
        data = cur.fetchall()
        return jsonify(data), 200
    else:
        sql = "select * from message_threads WHERE buyer_id=%s OR seller_id=%s"
        cur.execute(sql, (inbox_user_id, inbox_user_id))
        data = cur.fetchall()
        return jsonify(data), 200


# CREATE
@messages_bp.route("/messages/new", methods=['POST'])
def reply_to_post():
    sender_user_id = request.form["sender_user_id"]
    recipient_user_id = request.form["recipient_user_id"]
    message_contents = request.form["message_contents"]
    product_id = request.form["product_id"]
    sql = "insert into message_threads(buyer_id,seller_id,product_id) values (%s,%s,%s)"
    cur.execute(sql, (sender_user_id, recipient_user_id, product_id))
    connection.commit()
    message_thread_id = cur.lastrowid
    sql = "insert into messages(sender_user_id,recipient_user_id,message_thread_id,message_contents) values (%s,%s,%s,%s)"
    cur.execute(sql, (sender_user_id, recipient_user_id, message_thread_id, message_contents))
    connection.commit()
    return "contacting the seller for the first time using a new conversation"


@messages_bp.route('/messages/<int:message_thread_id>/reply/', methods=['POST'])
def reply_to_thread(message_thread_id):
    sender_user_id = request.form["sender_user_id"]
    recipient_user_id = request.form["recipient_user_id"]
    message_contents = request.form["message_contents"]
    sql = "insert into messages(sender_user_id,recipient_user_id,message_thread_id,message_contents) values (%s,%s,%s,%s)"
    cur.execute(sql, (sender_user_id, recipient_user_id, message_thread_id, message_contents))
    connection.commit()
    return "replied to a message thread"


# DELETE MESSAGES AND MESSAGE_THREAD
@messages_bp.route('/messages/<int:message_thread_id> ', methods=['DELETE'])
def delete_message_thread(message_thread_id):
    # message_thread_id = request.form["message_thread_id"]
    sql = "delete * from messages where message_thread_id values %s"
    cur.execute(sql, message_thread_id)
    connection.commit()

    sql = "delete * from messages_threads where id values %s"
    cur.execute(sql, message_thread_id)
    connection.commit()
    status_code = Response(status=204)
    return status_code
