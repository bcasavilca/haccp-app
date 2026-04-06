# HACCP Control - Installazione Locale

## 📱 Installazione su Android

### Metodo 1: File Manager (Consigliato)
1. Copia la cartella `haccp-app` sul telefono (USB, Bluetooth, o cloud)
2. Scarica un file manager come **"File Manager+"** o **"Solid Explorer"**
3. Naviga alla cartella `haccp-app`
4. Tocca `index.html` → "Apri con" → Chrome
5. Chrome chiederà di aggiungere alla schermata home: **ACCETTA**

### Metodo 2: Server Locale (Termux)
1. Installa **Termux** dal Play Store
2. Apri Termux e digita:
```bash
pkg install python
python -m http.server 8080
```
3. Sul PC, copia i file nella cartella di Termux
4. Sul telefono, apri Chrome → `http://localhost:8080`

## 🍎 Installazione su iPhone (iOS)

### Metodo 1: iCloud Drive
1. Copia la cartella `haccp-app` su iCloud Drive
2. Su iPhone, apri **Files** app
3. Naviga a iCloud Drive → `haccp-app`
4. Tocca `index.html` → "Condividi" → "Aggiungi a Home"

### Metodo 2: Server Locale (iSH)
1. Installa **iSH** dall'App Store
2. Apri iSH e digita:
```bash
apk add python3
python3 -m http.server 8080
```
3. Copia i file nella app iSH
4. Apri Safari → `http://localhost:8080`

## 💻 Installazione su PC (Windows/Linux/Mac)

### Metodo 1: Aprire direttamente
1. Vai nella cartella `haccp-app`
2. Doppio click su `index.html`
3. Si apre nel browser

### Metodo 2: Server Python
```bash
cd haccp-app
python -m http.server 8000
```
Poi apri: http://localhost:8000

## 🔧 Come Aggiornare

I dati sono salvati nel browser (LocalStorage).

Per aggiornare l'app:
1. Sostituisci i file con la nuova versione
2. Ricarica la pagina nel browser
3. I dati rimangono intatti!

## ⚠️ Note Importanti

- **Dati locali**: Tutto rimane sul dispositivo
- **Backup**: Esporta i dati periodicamente (in arrivo funzione export)
- **Offline**: L'app funziona senza internet
- **Privacy**: Nessun dato viene inviato a server esterni

## 🆘 Risoluzione Problemi

**La pagina non si apre?**
→ Usa un browser moderno (Chrome, Firefox, Safari)

**I dati si perdono?**
→ Non cancellare i dati del browser
→ Il localStorage persiste finché non cancelli manualmente

**Aggiunta a Home non funziona?**
→ Su iOS: usa Safari (non Chrome)
→ Su Android: usa Chrome