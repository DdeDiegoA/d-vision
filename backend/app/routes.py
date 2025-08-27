from flask import Blueprint, jsonify

bp = Blueprint("api", __name__, url_prefix="/api")

# @bp.route("/chat",methods=["POST"])
# def chat():
#     return jsonify({"message": "pong"})


@bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Hola negro"})
