import PyPDF2
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

reader = PyPDF2.PdfReader('Cartilha-PNTP-2026.pdf')
print(f'Total pages: {len(reader.pages)}')

with open('pdf_output.txt', 'w', encoding='utf-8', errors='replace') as f:
    for i in range(len(reader.pages)):
        text = reader.pages[i].extract_text()
        if text and text.strip():
            f.write(f'\n=== PAGE {i+1} ===\n')
            f.write(text)
            f.write('\n')
    print("Done! Output saved to pdf_output.txt")
