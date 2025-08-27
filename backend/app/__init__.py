from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object("config.Config")

    # Permitir /api/* desde el frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    from .routes import bp
    app.register_blueprint(bp)
    return app
