from flask import Blueprint, jsonify

from app.api.chat import chat

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/chat", methods=["POST"])
def chat_endpoint():
    return chat()
