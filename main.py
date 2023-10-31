from flask import Flask, render_template, request , Response
from datetime import datetime

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def hello_world():
    date = datetime.now()
    day = date.strftime("%A")
    return render_template("index.html", day=day)

@app.route("/login")
def login():
    response = Response(render_template("login.html"))
    return response

@app.route("/register")
def register():
    response = Response(render_template("register.html"))
    return response
