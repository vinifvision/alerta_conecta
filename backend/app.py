from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib
import os
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)
DB_FILE = "dados_historicos.csv"

# Carregar Modelo
try:
    modelo_data = joblib.load("modelo_ocorrencias.joblib")
    model = modelo_data["model"]
    le_tipo = modelo_data["le_tipo"]
    le_regiao = modelo_data["le_regiao"]
    le_prioridade = modelo_data["le_prioridade"]
    fator_influencia = modelo_data.get("fator_influencia", [])
except:
    model = None
    fator_influencia = []

def ler_dados():
    if os.path.exists(DB_FILE):
        return pd.read_csv(DB_FILE)
    return pd.DataFrame()

# Rota 1: Dashboard (Agregados)
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    df = ler_dados()
    if df.empty: return jsonify({"error": "Sem dados"}), 200

    kpis = {
        "total": len(df),
        "concluidas": len(df[df['status'] == 'Concluído']),
        "ativas": len(df[df['status'] == 'Em Andamento']),
        "eficiencia": f"{int((len(df[df['status']=='Concluído'])/len(df))*100)}%"
    }

    meses_ordem = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    grafico_temporal = df['mes'].value_counts().to_dict()
    line_data = [{"name": m, "ocorrencias": grafico_temporal.get(m, 0)} for m in meses_ordem]

    pie_data = [{"name": k, "value": int(v)} for k, v in df['tipo_ocorrencia'].value_counts().items()]
    spatial_data = [{"regiao": k, "ocorrencias": int(v)} for k, v in df['regiao'].value_counts().items()]
    
    bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    labels = ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "90+"]
    df['faixa_etaria'] = pd.cut(df['idade_vitima'], bins=bins, labels=labels)
    hist_counts = df['faixa_etaria'].value_counts().sort_index()
    histogram_data = [{"faixa": k, "quantidade": v} for k, v in hist_counts.items()]

    response_data = df.groupby('tipo_ocorrencia')['tempo_resposta_min'].mean().reset_index()
    boxplot_data = [{"tipo": row['tipo_ocorrencia'], "tempo_medio": row['tempo_resposta_min']} for _, row in response_data.iterrows()]

    return jsonify({
        "kpis": kpis,
        "lineData": line_data,
        "pieData": pie_data,
        "histogramData": histogram_data,
        "spatialData": spatial_data,
        "boxplotData": boxplot_data,
        "featureImportance": fator_influencia
    })

# Rota 2: Predição (IA)
@app.route('/api/predict-priority', methods=['POST'])
def predict_priority():
    data = request.json
    if not model: return jsonify({"error": "IA não carregada"}), 500
    try:
        tipo_code = le_tipo.transform([data['tipo']])[0]
        regiao_code = le_regiao.transform([data['regiao']])[0]
        hora = data.get('hora', 12)
        idade = data.get('idade', 30)
        
        prediction = model.predict([[tipo_code, regiao_code, hora, idade]])[0]
        resultado = le_prioridade.inverse_transform([prediction])[0]
        return jsonify({"prioridade_sugerida": resultado})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Rota 3: Criar Ocorrência (POST)
@app.route('/api/occurrences', methods=['POST'])
def create_occurrence():
    data = request.json
    df = ler_dados()
    novo_id = int(df['id'].max()) + 1 if not df.empty else 1
    
    nova_linha = {
        "id": novo_id,
        "data": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "mes": datetime.now().strftime("%b"),
        "hora": datetime.now().hour,
        "tipo_ocorrencia": data['tipo'],
        "regiao": data['regiao'],
        "prioridade": data['prioridade'],
        "idade_vitima": data.get('idade_vitima', 30),
        "tempo_resposta_min": 0,
        "status": "Em Andamento"
    }
    
    df_novo = pd.DataFrame([nova_linha])
    df_novo.to_csv(DB_FILE, mode='a', header=not os.path.exists(DB_FILE), index=False)
    return jsonify({"message": "OK", "id": novo_id}), 201

# Rota 4: Listar Ocorrências (GET)
@app.route('/api/occurrences', methods=['GET'])
def list_occurrences():
    df = ler_dados()
    if df.empty: return jsonify([]), 200
    df_sorted = df.sort_values(by='id', ascending=False).head(100)
    return jsonify(df_sorted.to_dict(orient='records')), 200

# --- ESTAS SÃO AS ROTAS QUE FALTAVAM ---

# Rota 5: Buscar Ocorrência por ID (GET)
@app.route('/api/occurrences/<int:id>', methods=['GET'])
def get_occurrence(id):
    df = ler_dados()
    if df.empty: return jsonify({"error": "Ocorrência não encontrada"}), 404
    
    ocorrencia = df[df['id'] == id]
    if ocorrencia.empty:
        return jsonify({"error": "Ocorrência não encontrada"}), 404
    
    # Converte o registro para dicionário
    return jsonify(ocorrencia.iloc[0].to_dict()), 200

# Rota 6: Atualizar Status (PATCH)
@app.route('/api/occurrences/<int:id>/status', methods=['PATCH'])
def update_status(id):
    data = request.json
    novo_status = data.get('status')
    
    df = ler_dados()
    if id not in df['id'].values:
        return jsonify({"error": "ID não encontrado"}), 404
    
    df.loc[df['id'] == id, 'status'] = novo_status
    df.to_csv(DB_FILE, index=False)
    
    return jsonify({"message": f"Status atualizado para {novo_status}"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)