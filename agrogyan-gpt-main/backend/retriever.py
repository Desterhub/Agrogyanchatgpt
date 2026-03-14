import difflib
import re


class Retriever:
    def __init__(self, documents):
        self.documents = documents

    def _normalize(self, text: str) -> str:
        return re.sub(r"[^a-z0-9 ]", "", text.lower()).strip()

    def answer(self, question):
        question = question or ""
        normalized = self._normalize(question)

        if not normalized:
            return {"answer": "No answer found", "confidence": 0.0}

        best_score = 0.0
        best_answer = None

        for doc in self.documents:
            doc_text = self._normalize(doc.get("question", "") + " " + doc.get("answer", ""))
            score = difflib.SequenceMatcher(None, normalized, doc_text).ratio()

            if score > best_score:
                best_score = score
                best_answer = doc.get("answer")

        # Return some answer if it matches reasonably; otherwise fall back.
        if best_score < 0.15 or not best_answer:
            return {"answer": "No answer found", "confidence": 0.0}

        return {"answer": best_answer, "confidence": round(best_score, 2)}
