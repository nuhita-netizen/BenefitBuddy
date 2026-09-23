#download  scheme whole folder:
from huggingface_hub import snapshot_download

path = snapshot_download(repo_id="shrijayan/gov_myscheme", repo_type="dataset")
print(path)

#extract text form pdf
# Run `pip install pdfplumber pandas huggingface_hub` in your terminal to install dependencies.

import os, pdfplumber, pandas as pd
pdf_dir = os.path.join(path,"text_data")
rows = []
for fname in os.listdir(pdf_dir):
    if fname.endswith(".pdf"):
        with pdfplumber.open(os.path.join(pdf_dir, fname)) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        rows.append({"filename": fname, "raw_text": text})

df = pd.DataFrame(rows)
df.to_csv("myscheme_raw.csv", index=False)
print(df.shape)