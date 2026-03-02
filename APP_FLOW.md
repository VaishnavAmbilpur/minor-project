# Application Flow & Logic

### 1. Data Entry

* User logs in and populates "The Vault" with their personal details.

### 2. The Analysis Pipeline

* **Upload:** Form image is sent to `/api/process`.
* **OCR Layer:** Tesseract returns a JSON map of every word and its bounding box.
* **AI Layer:** The AI receives the list of labels. It identifies which labels are "Input Prompts" and matches them to Vault keys (e.g., "Mailing Address" $\rightarrow$ `address`).
* **Coordinate Layer:** The system takes the `x_max` of the matched label and adds a fixed offset to find the "White Space" for stamping.

### 3. User Verification

* **Mantine Modal:** Displays the matched data.
* **Input:** If the AI finds a label not in the Vault, the user types it in. This "New Data" is saved to the Vault automatically.

### 4. High-Res Export

* Sharp merges the text at the calculated coordinates and provides a download link.