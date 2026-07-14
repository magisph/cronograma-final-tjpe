import re
import json
import os

def parse_cronograma(md_path, json_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by DIA
    days = re.split(r'###\s+DIA\s+', content)
    
    parsed_days = []
    
    for day_chunk in days[1:]:
        # Parse the day header
        # Example: 1 — 14/07/2026 (Terça-feira) | 3h
        header_match = re.match(r'(\d+)\s*—\s*([\d/]+)\s*\((.*?)\)\s*\|\s*(.*?)\n', day_chunk)
        if not header_match:
            print("Failed to match header:", day_chunk.split('\n')[0])
            continue
            
        dia_num = int(header_match.group(1))
        data = header_match.group(2)
        dia_semana = header_match.group(3)
        tempo_total = header_match.group(4)
        
        disciplinas = []
        
        # Parse items
        # Example: **① Processo Civil (90min):** Apelação — Lei Seca...
        items = re.finditer(r'\*\*(.*?)\((.*?)\):\*\*\s*(.*)', day_chunk)
        for item in items:
            prefix = item.group(1).strip()
            minutos_str = item.group(2).strip()
            assunto = item.group(3).strip()
            
            # Extract minutes
            minutos = 0
            m = re.search(r'(\d+)', minutos_str)
            if m:
                minutos = int(m.group(1))
            
            # Clean prefix
            nome = prefix.replace('①', '').replace('②', '').replace('🔄', '').strip()
            
            disciplinas.append({
                "nome": nome,
                "minutos": minutos,
                "assunto": assunto
            })
            
        parsed_days.append({
            "dia": dia_num,
            "data": data,
            "dia_semana": dia_semana,
            "tempo_total": tempo_total,
            "disciplinas": disciplinas
        })
        
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(parsed_days, f, ensure_ascii=False, indent=2)
        
if __name__ == '__main__':
    md_file = r'C:\Users\Junior do Titico\.gemini\antigravity\brain\445afebd-1ad1-4471-b7d1-6a07cd5733c3\Cronograma_75_Dias.md'
    json_file = r'C:\Users\Junior do Titico\Desktop\Cronograma\pwa\src\data\cronograma.json'
    parse_cronograma(md_file, json_file)
    print(f"Parsed cronograma to {json_file}")
