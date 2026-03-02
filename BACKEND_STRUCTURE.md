# Backend & Database Architecture

## 🗄️ Database Schema

* **User:** `username`, `email`, `password`, `vault (Map<string, string>)`.
* **Learning Log:** Stores pairs of `{ originalLabel, vaultKey }` to help the AI realize that "Home" usually means `address`.

## 🌐 API Logic (`/api/process`)

1. **OCR:** Get `words[]` with `bbox`.
2. **AI Match:**
* **Input:** `words.map(w => w.text)` + `Object.keys(user.vault)`.
* **Output:** `matches: { labelText: string, vaultKey: string }[]`.


3. **Coordinate Lookup:** * Loop through `matches`.
* Find the `word` object in the OCR results that matches `labelText`.
* **Calculate:** `stampingX = word.bbox.x1 + 20` (20px padding).
* **Calculate:** `stampingY = word.bbox.y1`.
