---
name: pdf-extract
description: Use when the user wants to extract text, tables, or metadata from a PDF file.
license: Apache-2.0
author: OpenGriffin
---

# PDF extraction

`pymupdf` (PyMuPDF) is the most reliable. Falls back to `pdfplumber` for tables.

## Install

```bash
pip install pymupdf pdfplumber
```

## Extract text

```python
import fitz  # pymupdf
doc = fitz.open("doc.pdf")
text = "\n".join(page.get_text() for page in doc)
```

## Extract tables

```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    for page in pdf.pages:
        for table in page.extract_tables():
            print(table)  # list of rows
```

## Metadata

```python
print(doc.metadata)   # title, author, creation_date
print(len(doc))       # page count
```

## OCR (scanned PDFs)

If `get_text()` returns empty, the PDF is image-only. Use Tesseract:
```python
from pdf2image import convert_from_path
import pytesseract
images = convert_from_path("doc.pdf")
text = "\n".join(pytesseract.image_to_string(img) for img in images)
```

## Anti-patterns

- Trusting `pdfminer.six` for tables (it doesn't reconstruct layout well).
- Using OCR when text extraction would have worked — much slower and lossier.
