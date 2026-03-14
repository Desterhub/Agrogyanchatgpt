import csv

def load_documents(csv_path):
    qa_pairs = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        reader.fieldnames = [h.strip().lower() for h in reader.fieldnames]

        for row in reader:
            question = row.get("question", "").strip()
            answer = row.get("answer", "").strip()

            if question and answer:
                qa_pairs.append({
                    "question": question,
                    "answer": answer
                })

    print(f"Loaded {len(qa_pairs)} verified documents")
    return qa_pairs
