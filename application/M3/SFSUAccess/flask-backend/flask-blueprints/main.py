from flask import Flask
from AdminAPI import admin_api
from ProductsAPI import products_api
from BrowseAPI import browse_api
from UserFilesAPI import userfiles_api
from AccountAPI import account_api


app = Flask(name)
app.register_blueprint(admin_api)
app.register_blueprint(products_api)
app.register_blueprint(messages_api)
app.register_blueprint(browse_api)
app.register_blueprint(userfiles_api)
app.register_blueprint(account_api)
if name == "main":
    app.run()