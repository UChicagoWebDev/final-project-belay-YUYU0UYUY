##测试成功
import string
from uuid import uuid1
from datetime import datetime
from flask import *
from functools import wraps
import sqlite3


app = Flask(__name__)

# -------------------------------- Database operation ----------------------------------
def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect('./belay/db/belay.db')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    db = get_db()
    cursor = db.execute(query, args)
    rows = cursor.fetchall()
    db.commit()
    cursor.close()
    if rows:
        if one: 
            return rows[0]
        return rows
    return None


# -------------------------------- Routes ----------------------------------


@app.route('/')
@app.route('/register')
@app.route('/login')
@app.route('/profile')


@app.route('/',methods=['GET','POST'])
def home():
    response = {
        ##这里面填写和后台交互的代码
        'msg': 'Hello, Python1 !'
    }
    return jsonify(response)

# -------------------------------- SIGN UP ----------------------------------
@app.route('/api/signup', methods = ['POST'])
def signup():
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    userName = request.json.get('userName')
    password = request.json.get('password')
    api_key = generateUid()
    

    query = "insert into users (name, password, api_key) values (?, ?, ?) returning name, id, api_key"
    parameters = (userName, password, api_key)
    user_info = query_db(query, parameters, one=True) 
    if user_info:
        user_json = {
            "login": True,
            "user_id": user_info["id"],
            "userName": user_info["name"],
            "authKey": api_key
        }
        return jsonify(user_json), 200
    return jsonify({"login": False, "message": "Cannot create new users in db"}), 500


@app.route('/api/login', methods = ['POST'])
def login():
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    user_name = request.json.get('userName')
    password = request.json.get('password')

    try:
        query = "select * from users where name = ? and password = ?"
        parameters = (user_name, password)
        user_info = query_db(query, parameters, one=True)
        print(user_info)
        if user_info:
            print("Login successfully")
            user_json = {
                "login": True,
                "user_id": user_info["id"],
                "userName": user_info["name"],
                "authKey": user_info["api_key"]
            }
            return jsonify(user_json), 200
        return jsonify({"login": False, "error": "Failed to login"}), 400
    except:
        return jsonify({"login": False, "message": "Cannot get user in db"}), 500
    
    
    # -------------------------------- updateUserName ----------------------------------

@app.route('/api/updateUserName', methods = ['POST'])
def updateUserName():
    print("userName fetch")
    # Check API Key
    key = request.headers.get('API-Key')
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    

    # Update
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    newName = request.json.get('userName')
    api_key = request.json.get('api_key')
    print(newName)
    
    updateQuery = "update users set name = ? where api_key = ?"
    parameters = (newName, api_key)
    query_db(updateQuery, parameters, one=True)
    if res:
        print("Update username Successfully")
        user_json = {
            "update": True,
        }
        return jsonify(user_json), 200
    print("Something wrong")
    return jsonify({"update": False, "error": "Failed to update, please check the username and password"}), 500    

# -------------------------------- updatePassword ----------------------------------

@app.route('/api/updatePassword', methods = ['POST'])
def updatePassword():
    print("enter")
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    

    # Update
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    newPassword = request.json.get('password')
    api_key = request.json.get('api_key')
    
    updateQuery = "update users set password = ? where api_key = ?"
    parameters = (newPassword, api_key)
    query_db(updateQuery, parameters, one=True)
    if res:
        print("Password update successfully")
        user_json = {
            "update": True,
        }
        return jsonify(user_json), 200
    print("Something wrong")
    return jsonify({"update": False, "error": "Failed to update, please check the username and password"}), 500   

# -------------------------------- createRooms ----------------------------------

@app.route('/api/channels/create', methods = ['POST'])
def createRoom():
    print("Create Room")
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    

    # Insert a new Room
    room = query_db('insert into channels (name) values (?) returning id, name', ["room"], one=True)
    print(room["id"])
    query = "update channels set name = ? where id = ?"
    roomName = "Channel" + str(room["id"])
    parameters = (roomName, room["id"])
    query_db(query, parameters, one=True)
    if query:
        print("Create Channel succesfully")
        room_create = {
            "create": True,
            "room_id": room["id"],
            "room_name": roomName
        }
        return jsonify(room_create), 200
    print("Something wrong")
    return jsonify({"create": False, "error": "Failed to update, please check the username and password"}), 500     


@app.route('/api/channels', methods=['GET'])
def getRooms():
    channels = query_db('select * from channels')
    if channels:
        print("Get all channels")
        channelList = []
        for channel in channels:
            channelList.append({"room_id": channel["id"], "room_name": channel["name"]})
        return jsonify(channelList), 200
    else:
        return jsonify([]), 200
    
    
# -------------------------------- ChannelRoom ----------------------------------
    
@app.route('/api/channel/<int:room_id>/channelInfo', methods = ['GET'])
def showRoom(room_id):
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    

    # GetRoomsList
    room = query_db('select * from channels where id = ?', [room_id], one=True)
    
    if room:
        room_info = {"success": True, "room_id": room["id"], "room_name": room["name"]}

        return jsonify(room_info), 200
    print("Something wrong")
    return jsonify({"error": "Failed to get rooms"}), 500    

# POST to change the name of a room
@app.route('/api/channel/<int:room_id>/changeRoomName', methods=['POST'])
def change_room_name(room_id):
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    
    
    print("change name")
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    
    print(request.json)
    newRoomName = request.json.get('name')
    query = 'UPDATE channels SET name = ? where id = ?'
    parameters = (newRoomName, room_id)
    query_db(query, parameters)
    return jsonify({"success": True, "message": "Room name changed successfully"}), 201


# POST a new message to a room
@app.route('/api/channel/<int:room_id>/postMessage', methods=['POST'])
def post_messages(room_id):
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    
    
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    
    print(request.json)
    content = request.json.get('body')
    user_id = request.json.get('user_id')

    query = "insert into messages (body, room_id, user_id) values (?, ?, ?) returning id"
    parameters = (content, room_id, user_id)
    room = query_db(query, parameters)
    if room:
        return jsonify({"message": "Message posted successfully"}), 201
    return jsonify({"error": "Failed to post messages"}), 500    


# Show all messages in the room get
@app.route('/api/channel/<int:room_id>/messages', methods = ['GET'])
def getMessages(room_id):
    # Check API Key
    key = request.headers.get('API-Key')
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    
    
    messages = query_db('select users.name, messages.body, messages.id,  users.id from messages join users on messages.user_id = users.id where messages.room_id  = ? order by messages.id asc', [room_id])
    message_in_room = []
    if not messages:
        return jsonify({'success': False}), 200
    for message in messages:
        m_info = {"m_id": message[2], "user_name": message[0], "m_body": message[1], "user_id": message[3]}
        message_in_room.append(m_info)

    print(message_in_room)
    return jsonify({'success':True, 'messages': message_in_room}), 200



# -------------------------------- UNREAD MESSAGES ----------------------------------

@app.route('/api/channel/<int:room_id>/messages/last_seen', methods=['POST'])
def mark_message_as_seen(room_id):
    # Check API Key
    key = request.headers.get('API-Key')
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401  
    
    
    message_id = request.json.get('last_id')
    user_id = request.json.get('user_id')
    
    try:
        # Check if the user has seen the message
        seen_message = query_db('SELECT * FROM last_messages_seen WHERE user_id = ? AND room_id = ?',
                                [user_id, room_id], one=True)

        if seen_message:
            # Update the existing seen message record
            query_db('UPDATE last_messages_seen SET last_message_id = ?, time_seen = CURRENT_TIMESTAMP WHERE user_id = ? AND room_id = ?',
                     [message_id, user_id, room_id])
        else:
            # Insert a new seen message record
            query_db('INSERT INTO last_messages_seen (user_id, room_id, last_message_id) VALUES (?, ?, ?)',
                     [user_id, room_id, message_id])

        return jsonify({'success': True, 'message': 'Last read message updated'}), 200

    except sqlite3.Error as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/users/<int:user_id>/messages_count', methods=['GET'])
def get_unread_message_counts(user_id):
    print(user_id)
    if user_id == -1:
        return jsonify({"success": False, "message": "Not login"}), 500
    query = """
    SELECT 
        c.id as channel_id, 
        c.name as channel_name, 
        COALESCE(SUM(CASE WHEN m.id > IFNULL(sm.last_message_id, 0) THEN 1 ELSE 0 END), 0) as unread_message_count
    FROM channels c
    LEFT JOIN messages m ON c.id = m.room_id
    LEFT JOIN (
        SELECT 
            last_message_id, 
            room_id 
        FROM last_messages_seen
        WHERE user_id = ?
    ) sm ON sm.room_id = c.id
    GROUP BY c.id;

    """
    try:
        # print("before query")
        print("user_id" + str(user_id))
        if not user_id:
            return jsonify({"success": False, "message": "not a user"})
        unread_message_counts = query_db(query, [user_id])
        # print("unread_message_counts", unread_message_counts)
        unread_counts = [{
            "channel_id": row['channel_id'],
            "channel_name": row['channel_name'],
            "unread_message_count": row['unread_message_count']
        } for row in unread_message_counts]
        print(unread_counts)
        # print("unread_counts: ", unread_counts)
        return jsonify({"success": True, "unread_message_counts": unread_counts})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
    
# -------------------------------- Emoji ----------------------------------
    
    # Send a emoji to the message
@app.route('/api/message/<int:message_id>/postEmoji', methods=['POST'])
def post_emoji(message_id):
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    
    
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    
    print(request.json)
    emoji = request.json.get('emoji_type')
    user_id = request.json.get('user_id')
    message_id = request.json.get('message_id')
    
    try:
        exist_emoji = query_db('SELECT * FROM emoji WHERE emoji.message_id = ? and emoji.content = ? and emoji.user_id = ?',
                                [message_id, emoji, user_id], one=True)
        print(exist_emoji)
        if exist_emoji:
            # DELETE
            query_db('delete FROM emoji WHERE emoji.message_id = ? and emoji.content = ? and emoji.user_id = ? ',
                     [message_id, emoji, user_id])
            return jsonify({"success": True, "message": "Emoji posted successfully"}), 201
        else:
            # Insert a new emoji record
            print(emoji)
            query = "insert into emoji (content, message_id, user_id) values (?, ?, ?) returning id"
            parameters = (emoji, message_id, user_id)
            emoji = query_db(query, parameters)
            if emoji:
                return jsonify({"success": True, "message": "Emoji posted successfully"}), 201
    
    except:
        return jsonify({"error": "Failed to post emoji"}), 500    


    # Get the count of a emoji given a message
@app.route('/api/message/<int:message_id>/getEmoji/<emoji>', methods=['GET'])
def get_emoji(message_id, emoji):
    # Check API Key
    key = request.headers.get('API-Key')
    print(key)
    apiQuery = 'select * from users where api_key = ?'
    res = query_db(apiQuery, (key,), one = True)
    if not key or not res:
        return jsonify({"message": "Not valid API key."}), 401    

    query = " SELECT emoji.id FROM emoji WHERE emoji.message_id = ? and emoji.content = ?"
    parameters = (message_id, emoji)
    all_emoji = query_db(query, parameters, one=False)
    print("all_emoji" + str(all_emoji))
    count = 0
    if all_emoji:
        count = len(all_emoji)
    
    return jsonify({"success": True, "count": count}), 201   

# -------------------------------- Helper ----------------------------------
def generateUid():
    return "chengyux" + str(uuid1)

##启动运行
if __name__ == '__main__':
    app.run(debug=True)
