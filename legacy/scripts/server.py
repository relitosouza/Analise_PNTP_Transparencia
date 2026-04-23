from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app) # Ativa CORS para permitir chamadas do navegador

DATA_FILE = "relatorio_pntp_manual.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"manual_updates": {}}

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route("/api/update", methods=["POST"])
def update_status():
    req_data = request.json
    item_id = req_data.get("id")
    status = req_data.get("status")
    url = req_data.get("url", "")
    obs = req_data.get("obs", "")
    
    if not item_id or not status:
        return jsonify({"error": "ID e status são obrigatórios"}), 400
        
    data = load_data()
    data["manual_updates"][item_id] = {
        "status": status,
        "url": url,
        "obs": obs,
        "updated_at": "manual"
    }
    save_data(data)
    
    return jsonify({"message": "Item atualizado com sucesso"})

@app.route("/api/get_updates", methods=["GET"])
def get_updates():
    return jsonify(load_data())

if __name__ == "__main__":
    # Força o host 0.0.0.0 para garantir acessibilidade
    app.run(host="0.0.0.0", port=5000, debug=True)
