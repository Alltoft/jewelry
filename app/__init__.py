from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'you-will-never-guess' 
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL") or \
    'mysql://root:rootroot@localhost/JewelryStore'



db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'


from .models import User
@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)

from app import models, routes, seller, costumer
