import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker('pt_BR')
NUM_REGISTROS = 3000

TIPOS = [
    "Incêndio em Edifício", "Incêndio Florestal", "Acidente Veicular", 
    "Resgate em Altura", "APH - Mal Súbito", "Salvamento Aquático", "Vazamento de Gás"
]
REGIOES = ["Centro", "Zona Norte", "Zona Sul", "Zona Oeste", "Região Metropolitana"]
PRIORIDADES = ["Baixa", "Média", "Alta"]
STATUS = ["Concluído", "Em Andamento", "Cancelado"]

def gerar_dados():
    data_list = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    print(f"Gerando {NUM_REGISTROS} ocorrências simuladas...")

    for i in range(NUM_REGISTROS):
        data_ocorr = start_date + timedelta(days=random.randint(0, 365))
        tipo = random.choice(TIPOS)
        regiao = random.choice(REGIOES)
        
        # Lógica de Prioridade
        if tipo in ["Incêndio em Edifício", "Acidente Veicular"]:
            prioridade = np.random.choice(PRIORIDADES, p=[0.1, 0.3, 0.6])
        else:
            prioridade = np.random.choice(PRIORIDADES, p=[0.5, 0.4, 0.1])
            
        # Tempo de Resposta (Simulado para Boxplot)
        if prioridade == "Alta":
            tempo_resposta = int(np.random.normal(10, 2)) # Média 10min
        else:
            tempo_resposta = int(np.random.normal(25, 10)) # Média 25min
        
        # Idade da Vítima (Simulado para Histograma)
        if tipo == "APH - Mal Súbito":
            idade = int(np.random.normal(65, 15)) # Mais idosos
        else:
            idade = int(np.random.normal(35, 15)) # Adultos jovens
        idade = max(1, min(100, idade))

        data_list.append({
            "id": i + 1,
            "data": data_ocorr.strftime("%Y-%m-%d %H:%M:%S"),
            "mes": data_ocorr.strftime("%b"),
            "hora": data_ocorr.hour,
            "tipo_ocorrencia": tipo,
            "regiao": regiao,
            "prioridade": prioridade,
            "tempo_resposta_min": max(1, tempo_resposta),
            "idade_vitima": idade,
            "status": np.random.choice(STATUS, p=[0.85, 0.10, 0.05])
        })

    df = pd.DataFrame(data_list)
    df.to_csv("dados_historicos.csv", index=False)
    print("Dados atualizados com sucesso!")

if __name__ == "__main__":
    gerar_dados()