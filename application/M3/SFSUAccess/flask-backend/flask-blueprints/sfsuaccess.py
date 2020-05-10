from flask import Flask

from admin.admin import admin_bp
from files.files_bp import files_bp
from messages.messages_bp import messages_bp
from search.search_bp import search_bp
from products.products_bp import products_bp
from auth.auth_bp import auth_bp
from account.account_bp import account_bp

app = Flask(__name__)
app.register_blueprint(messages_bp, url_prefix="/api")
app.register_blueprint(search_bp, url_prefix="/api")
app.register_blueprint(products_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(account_bp, url_prefix="/api")
app.register_blueprint(files_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

debug_mode = True

if debug_mode:
    UPLOAD_FOLDER = '/uploads'
    THUMBNAILS_FOLDER = '/uploads/thumbnails'
    if UPLOAD_FOLDER == '' and THUMBNAILS_FOLDER == '':
        print ("sfsuaccess.py file error, please refer to debug mode if statement inside sfsuaccess.py for instructions listed below")
        print ("ALSO MAKE SURE TO RUN pip install -r requirements.txt , the requirements file is inside flask-blueprints")
        print ("Please insert a complete path to your testing file system. Create a folder called uploads, " \
              "and a folder inside of uploads called thumbnails ")
        exit()
    # EXAMPLE "/Users/kev/PycharmProjects/blueprints/file-system/uploads"
    # EXAMPLE "/Users/kev/PycharmProjects/blueprints/file-system/uploads/thumbnails"
else:
    UPLOAD_FOLDER = '/home/ubuntu/sfsu-access/uploads'
    THUMBNAILS_FOLDER = '/home/ubuntu/sfsu-access/uploads'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if __name__ == '__main__':
    app.run(debug=True)
