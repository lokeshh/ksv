import re
import os

def clean_commentary(text):
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        if '%' in line:
            line = line.split('%')[0]
        cleaned_lines.append(line.rstrip())
    text = '\n'.join(cleaned_lines)
    
    text = text.replace(r'\emd', '—')
    text = re.sub(r'\\textbf\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\eng\{([^}]+)\}', r'\1', text)
    text = text.replace(r'\begin{center}', '')
    text = text.replace(r'\end{center}', '')
    text = text.replace(r'\hrulefill', '')
    
    # Convert forced line breaks '\\' to newlines
    text = text.replace(r'\\', '\n')
    
    # Clean up horizontal spacing on each line but preserve the newlines
    lines = text.split('\n')
    final_lines = []
    for line in lines:
        clean_line = re.sub(r'[ \t]+', ' ', line).strip()
        final_lines.append(clean_line)
    text = '\n'.join(final_lines)
    
    # Collapse multiple consecutive blank lines down to a single blank line
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def main():
    # Resolve paths relative to the script location so it works anywhere
    script_dir = os.path.dirname(os.path.abspath(__file__))
    latex_path = os.path.join(script_dir, 'laghu.tex')
    yaml_path = os.path.join(script_dir, '..', 'src', 'data', 'katantra-data.yaml')
    
    if not os.path.exists(latex_path):
        print(f"Error: LaTeX file not found at {latex_path}")
        return

    with open(latex_path, 'r', encoding='utf-8') as f:
        content = f.read().replace('\r\n', '\n')

    # Split by \section
    sections_raw = re.split(r'\\section\{([^}]+)\}', content)
    prakaranas = []

    sec_idx = 0
    for i in range(1, len(sections_raw), 2):
        sec_name = sections_raw[i].strip()
        sec_body = sections_raw[i+1]
        
        sec_idx += 1
        prakarana_id = "sandhi" if "सन्धि" in sec_name else "nama"
        prakarana_name = "सन्धि-प्रकरणम्" if "सन्धि" in sec_name else "नाम-प्रकरणम्"
        
        padas = []
        subsections_raw = re.split(r'\\subsection\{([^}]+)\}', sec_body)
        
        pada_count = 0
        for j in range(1, len(subsections_raw), 2):
            sub_name = subsections_raw[j].strip()
            sub_body = subsections_raw[j+1]
            
            # Parse sutras
            sutra_matches = list(re.finditer(r'\\sutra\{([^}]+)\}\s*(?:\{([^}]+)\})?', sub_body))
            if len(sutra_matches) == 0:
                # Skip empty padas (like '2' and 'युष्मत्पादः')
                continue
                
            pada_count += 1
            pada_id = f"{sec_idx}-{pada_count}"
            pada_no = f"{sec_idx}.{pada_count}"
            
            sutras = []
            for s_idx, m in enumerate(sutra_matches, 1):
                sutra_text = m.group(1).strip()
                
                # Extract commentary text
                start_pos = m.end()
                end_pos = sutra_matches[s_idx].start() if s_idx < len(sutra_matches) else len(sub_body)
                raw_commentary = sub_body[start_pos:end_pos]
                commentary_text = clean_commentary(raw_commentary)
                
                sutra_no = f"{pada_no}.{s_idx}"
                
                sutras.append({
                    "sutraNo": sutra_no,
                    "textDevanagari": sutra_text,
                    "commentaries": [
                        {
                            "nameDevanagari": "लघुवृत्तिः",
                            "authorDevanagari": "छुच्छुकभट्टः",
                            "textDevanagari": commentary_text
                        }
                    ]
                })
                
            padas.append({
                "padaId": pada_id,
                "padaNo": pada_no,
                "padaNameDevanagari": sub_name,
                "sutras": sutras
            })
            
        prakaranas.append({
            "prakaranaId": prakarana_id,
            "prakaranaNameDevanagari": prakarana_name,
            "padas": padas
        })
        
    # Write to YAML
    os.makedirs(os.path.dirname(yaml_path), exist_ok=True)
    with open(yaml_path, 'w', encoding='utf-8') as f:
        for p in prakaranas:
            f.write(f"- prakaranaId: \"{p['prakaranaId']}\"\n")
            f.write(f"  prakaranaNameDevanagari: \"{p['prakaranaNameDevanagari']}\"\n")
            f.write(f"  padas:\n")
            for pd in p['padas']:
                f.write(f"    - padaId: \"{pd['padaId']}\"\n")
                f.write(f"      padaNo: \"{pd['padaNo']}\"\n")
                f.write(f"      padaNameDevanagari: \"{pd['padaNameDevanagari']}\"\n")
                f.write(f"      sutras:\n")
                for s in pd['sutras']:
                    f.write(f"        - sutraNo: \"{s['sutraNo']}\"\n")
                    f.write(f"          textDevanagari: \"{s['textDevanagari'].replace('\\', '\\\\').replace('\"', '\\\"').replace('\n', '\\n')}\"\n")
                    f.write(f"          translation: \"\"\n")
                    f.write(f"          commentaries:\n")
                    for c in s['commentaries']:
                        clean_text = c['textDevanagari'].replace('\\', '\\\\').replace('\"', '\\\"').replace('\n', '\\n')
                        f.write(f"            - nameDevanagari: \"{c['nameDevanagari']}\"\n")
                        f.write(f"              authorDevanagari: \"{c['authorDevanagari']}\"\n")
                        f.write(f"              textDevanagari: \"{clean_text}\"\n")

    print(f"Successfully generated {yaml_path} with {sum(len(pd['sutras']) for p in prakaranas for pd in p['padas'])} sutras!")

if __name__ == "__main__":
    main()
