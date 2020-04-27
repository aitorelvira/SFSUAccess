from flask import Blueprint
messages_api = Blueprint('messages_api', name)

@messages_api.route('/api/messages/new',methods=['POST'])
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

@messages_api.route('/api/messages',methods=['GET'])
def get_chatrooms():
    user_id = request.args["user_id"]
    sql = "SELECT * from chat_rooms WHERE user_1=%s OR user_2=%s"
    cur.execute(sql,(user_id,user_id))
    data = cur.fetchall()
    return jsonify(data),200

#TODO, add code for checking if request is from authorized user
@messages_api.route('/api/messages/<chatroom_id>',methods =['GET'])
def get_chatroom_messages_by_id(chatroom_id):
    sql = "SELECT * from messages WHERE chat_room_id=%s"
    cur.execute(sql,chatroom_id)
    data = cur.fetchall()
    return jsonify(data),200


#call this when a conversation is opened. this one doesn't return conversation contents, only marks conversation as read.
@messages_api.route('/api/messages/read/<chatroom_id>',methods =['POST'])
def read_chatroom_messages_by_id(chatroom_id):
    user_id = request.form['user_id']
    sql = "UPDATE messages SET read_at=NOW() WHERE to_user_id=%s AND chat_room_id=%s"
    cur.execute(sql,(user_id,chatroom_id))
    connection.commit()
    status_code = Response(status=200)
    return status_code