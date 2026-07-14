# -*- coding: utf-8 -*-
import re
import json
import os
import sys

def parse_cronograma(md_path, json_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by DIA
    days = re.split(r'###\s+DIA\s+', content)
    
    parsed_days = []
    
    for day_chunk in days[1:]:
        # Parse the day header
        # Example: 1 \u2014 14/07/2026 (Terça-feira) | 3h
        header_match = re.match(r'(\d+)\s*\u2014\s*([\d/]+)\s*\((.*?)\)\s*\|\s*(.*?)\n', day_chunk)
        if not header_match:
            raise ValueError("Failed to match header: " + day_chunk.split('\n')[0])
            
        dia_num = int(header_match.group(1))
        data = header_match.group(2)
        dia_semana = header_match.group(3)
        tempo_total = header_match.group(4)
        
        disciplinas = []
        
        # Parse items
        # Example: **\u2460 Processo Civil (90min):** Apelação \u2014 Lei Seca...
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
            
            # Clean prefix using regex to remove bullet numbers/icons
            nome = re.sub(r'^[^\w]+', '', prefix).strip()
            
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
        
    os.makedirs(os.path.dirname(os.path.abspath(json_path)), exist_ok=True)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(parsed_days, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_file = sys.argv[1] if len(sys.argv) > 1 else os.path.join(base_dir, '..', 'Cronograma_75_Dias.md')
    json_file = sys.argv[2] if len(sys.argv) > 2 else os.path.join(base_dir, 'src', 'data', 'cronograma.json')
    
    parse_cronograma(md_file, json_file)
    print(f"Parsed cronograma from {md_file} to {json_file}")
