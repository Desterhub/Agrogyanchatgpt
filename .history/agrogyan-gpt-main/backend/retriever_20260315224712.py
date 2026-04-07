from difflib import SequenceMatcher

class Retriever:

    def __init__(self, documents):
        self.documents = documents

    def similarity(self, a, b):
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()

    def answer(self, question):

        if not question.strip():
            return {
                "answer": "No answer found",
                "confidence": 0.0
            }

        best_score = 0
        best_answer = "No answer found"

        for doc in self.documents:

            score = self.similarity(question, doc["question"])

            if score > best_score:
                best_score = score
                best_answer = doc["answer"]

        # threshold
        if best_score < 0.35:
            return {
                "answer": "No answer found",
                "confidence": 0.0
            }

        return {
            "answer": best_answer,
            "confidence": round(best_score, 2)
        }