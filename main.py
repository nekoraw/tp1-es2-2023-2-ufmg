from flask import Flask, render_template, request , Response, url_for, abort
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
    if request.headers.get("HX-Request", False):
        response = Response()
        response.headers["HX-Redirect"] = url_for("login")
    else:
        response = Response(render_template("authentication/login.html"))
    return response

@app.route("/register")
def register():
    if request.headers.get("HX-Request", False):
        response = Response()
        response.headers["HX-Redirect"] = url_for("register")
    else:
        response = Response(render_template("authentication/register.html"))
    return response

@app.route("/username_field")
def get_username_field():
    return render_template("authentication/login-good-username.html")

@app.route("/password_field")
def get_password_field():
    return render_template("authentication/login-good-password.html")

@app.route("/verify_login", methods=["POST"])
def verify_login():
    if not request.headers.get("HX-Request", False):
        return abort(403)
    
    response = Response()
    response.set_data(render_template("authentication/login-bad-username.html"))
    username = request.form.get("username")
    if username == "admin":
        response.set_data(render_template("authentication/login-bad-password.html"))
        response.headers["HX-Retarget"] = ".password_field"
    
    
    return response

@app.route("/verify_register", methods=["POST"])
def verify_register():
    if not request.headers.get("HX-Request", False):
        return abort(403)
    response = Response()
    response.headers["HX-Redirect"] = url_for("login")
    return response
        
