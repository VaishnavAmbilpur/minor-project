# Product Requirements Document: AutoFill AI

## 🎯 Vision

A privacy-centric automation tool that maps form labels to user data using AI, while using deterministic geometric logic to calculate stamping coordinates on the server.

## 🛠️ Core Features

* **Custom Auth:** Internal Username/Email/Password system.
* **The Vault:** Encrypted MongoDB storage for user profile data (e.g., `fullName`, `ssn`).
* **Hybrid Extraction:** * **Tesseract:** Extracts raw text and bounding boxes ($x, y, w, h$).
* **LLM:** Matches extracted labels to "Vault" keys (Semantic Mapping).


* **Deterministic Stamping:** A backend script calculates the white space to the right of a label for pixel-perfect text placement.
* **Zero-Retention:** Images are purged from the server immediately after the session.

## 🚫 Out of Scope

* AI-calculated coordinates (Calculated via Script instead).
* Cloud image hosting.