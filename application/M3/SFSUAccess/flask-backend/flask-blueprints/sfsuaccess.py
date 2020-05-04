from flask import Flask

from messages.messages_bp import messages_bp
from search.search_bp import search_bp
from products.products_bp import products_bp
from auth.auth_bp import auth_bp
from account.account_bp import account_bp

app = Flask(__name__)
app.register_blueprint(messages_bp,url_prefix="/api")
app.register_blueprint(search_bp,url_prefix="/api")
app.register_blueprint(products_bp,url_prefix="/api")
app.register_blueprint(auth_bp,url_prefix="/api")
app.register_blueprint(account_bp,url_prefix="/api")


if __name__ == '__main__':
    app.run(debug=True)