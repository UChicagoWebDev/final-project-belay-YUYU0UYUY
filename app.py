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
    
    try:
        query = "insert into users (name, password, api_key) values (?, ?, ?)"
        parameters = (userName, password, api_key)
        success = query_db(query, parameters)

        user_key = {"login": True, "authKey": api_key, "userName": userName ,"message": "New users created successfully"}
        return jsonify(user_key, 200)
    except:
        return jsonify({"login": False, "message": "Cannot create new users in db"}), 500


@app.route('/api/login', methods = ['POST'])
def login():
    if not request.json:
        return jsonify({"error": "No contents"}), 400
    user_name = request.json.get('userName')
    password = request.json.get('password')

    try:
        print("success")
        query = "select * from users where name = ? and password = ?"
        parameters = (user_name, password)
        user_info = query_db(query, parameters, one=True)
        print(user_info)
        if user_info:
            user_json = {
                "login": True,
                "user_id": user_info["id"],
                "user_name": user_info["name"],
                "authKey": user_info["api_key"]
            }
            return jsonify(user_json), 200
        return jsonify({"login": False, "error": "Failed to login"}), 400
    except:
        return jsonify({"login": False, "message": "Cannot get user in db"}), 500

# -------------------------------- Helper ----------------------------------
def generateUid():
    return "chengyux" + str(uuid1)

##启动运行
if __name__ == '__main__':
    app.run(debug=True)
