# Implementation Roadmap

### Step 1: Credentials & Vault

* [ ] Setup NextAuth Credentials provider.
* [ ] Build the MongoDB "Vault" schema and a UI to edit it.

### Step 2: The Label Matcher (AI)

* [ ] Implement Tesseract.js to get `hOCR` or `blocks`.
* [ ] **The Prompt:** "Given these labels from a form, identify which ones are prompts for user information. Map them to these database keys."

### Step 3: The Stamping Logic (Manual/Deterministic)

* [ ] Write a utility function `getFillCoordinates(labelText, ocrData)`:
* Search `ocrData` for the string.
* Extract the `x` (right edge) and `y` (baseline).


* [ ] Pass these calculated coordinates to **Sharp** for the SVG overlay.

### Step 4: Final Compositing

* [ ] Test Sharp with different image resolutions to ensure the 20px offset remains consistent.
* [ ] Implement the "Save & Download" flow.