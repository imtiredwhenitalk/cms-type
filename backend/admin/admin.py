from pyclbr import Class
from flask import Flask
from flask_admin import Admin 
from .models import User, Role
from flask_admin.contrib.sqla import ModelView
import relationships
import models
import db
import app
import admin

app = Flask(__name__)
admin = Admin(app, name='Admin Panel', template_mode='bootstrap3')

admin.add_view(ModelView(User, db.session))
    
class UserAdmin(admin.ModelView):
    column_list = ('id', 'username', 'email', 'role')
    form_columns = ('username', 'email', 'password', 'role')
    admin = True

class RoleAdmin(admin.ModelView):
    column_list = ('id', 'name')
    form_columns = ('name', 'email', 'password') 

class UserAdmin(ModelView):
    column_list = ('id', 'username', 'email', 'role')
    form_columns = ('username', 'email', 'password', 'role')
    admin = True

def create_admin():
    admin.add_view(UserAdmin(User, db.session))

def create_role():
    admin.add_view(RoleAdmin(Role, db.session))

def init_admin():
    create_admin()
    create_role()

def init_app(app):
    init_admin(port=5000)

