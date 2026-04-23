import zipfile
import xml.etree.ElementTree as ET
import glob
import os

def read_docx(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
        tree = ET.XML(xml_content)
        word_schema = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        paragraphs = []
        for paragraph in tree.iter(word_schema + 'p'):
            texts = [node.text for node in paragraph.iter(word_schema + 't') if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

# Find file
files = glob.glob(r"C:\Users\ADmin\Downloads\*baocao_bigdata*.docx")
if files:
    latest_file = max(files, key=os.path.getmtime)
    print(f"--- ĐỌC FILE: {latest_file} ---\n")
    text = read_docx(latest_file)
    # in ra đoạn có chữ "Chương 4" hoặc "CHƯƠNG 4" và nội dung sau đó
    lines = text.split('\n')
    found = False
    output = []
    for line in lines:
        if "chương 4" in line.lower() or "chuong 4" in line.lower():
            found = True
        if found:
            output.append(line)
    
    if found:
        print('\n'.join(output[:50])) # in ra 50 dòng từ chương 4
    else:
        print("Không tìm thấy chữ 'Chương 4' trong file, in ra 50 dòng đầu tiên:")
        print('\n'.join(lines[:50]))
else:
    print("❌ Không tìm thấy file nào có tên chứa 'baocao_bigdata' đuôi .docx trong mục Downloads")
