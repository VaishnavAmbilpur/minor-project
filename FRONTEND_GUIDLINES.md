# Frontend Design Guidelines

## 🎨 Layout

* **Dashboard:** Uses a `Mantine AppShell`.
* **The Vault:** Uses `Mantine Fieldsets` to group data (Identity, Contact, Financial).
* **Processing State:** A `Mantine Loader` with a "Scanning Labels..." description.

## 📍 UI Logic

* **Dynamic Form:** The modal must render inputs dynamically based on the `unmatchedLabels` array returned by the API.
* **Success Feedback:** Use `Mantine Notifications` to confirm when a new field is successfully "Learned" by the Vault.
