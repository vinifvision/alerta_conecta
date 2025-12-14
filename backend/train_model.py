import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier # Algoritmo pedido
from sklearn.preprocessing import LabelEncoder

def treinar():
    print("Carregando dados...")
    df = pd.read_csv("dados_historicos.csv")

    # Features: Tipo, Região, Hora, Idade
    X = df[['tipo_ocorrencia', 'regiao', 'hora', 'idade_vitima']].copy()
    y = df['prioridade']

    # Encoders
    le_tipo = LabelEncoder()
    le_regiao = LabelEncoder()
    le_prioridade = LabelEncoder()

    X['tipo_ocorrencia'] = le_tipo.fit_transform(X['tipo_ocorrencia'])
    X['regiao'] = le_regiao.fit_transform(X['regiao'])
    y_encoded = le_prioridade.fit_transform(y)

    # Treino XGBoost
    print("Treinando XGBoost...")
    model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
    model.fit(X, y_encoded)

    # Extrair Importância das Features (Fatores de Influência)
    feature_names = ['Tipo', 'Região', 'Hora', 'Idade']
    importances = model.feature_importances_
    fator_influencia = [
        {"feature": name, "importancia": float(score)} 
        for name, score in zip(feature_names, importances)
    ]
    
    # Salvar
    artifacts = {
        "model": model,
        "le_tipo": le_tipo,
        "le_regiao": le_regiao,
        "le_prioridade": le_prioridade,
        "fator_influencia": fator_influencia # Salvamos para exibir no dashboard
    }
    joblib.dump(artifacts, "modelo_ocorrencias.joblib")
    print("Modelo XGBoost treinado e salvo!")

if __name__ == "__main__":
    treinar()