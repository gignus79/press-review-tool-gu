# 📘 GUIDA GIORGIO - Press Review Tool

**Guida Completa per Testare e Deployare l'Applicazione**

---

## 🎯 Cos'è Questa App?

Press Review Tool è un'applicazione web per analizzare recensioni musicali usando l'AI. Permette di:
- 🔍 Cercare articoli e recensioni musicali
- 🤖 Analizzare automaticamente il sentiment e la rilevanza
- 📊 Visualizzare metriche e statistiche
- 📤 Esportare risultati in PDF, CSV o JSON
- 🔗 Condividere ricerche con link pubblici
- 📱 Funziona su desktop e mobile

---

## 📋 PREREQUISITI

Prima di iniziare, assicurati di avere:

1. **Node.js 18+** installato
   - Verifica: `node --version`
   - Scarica da: [nodejs.org](https://nodejs.org)

2. **Account Supabase** (gratuito)
   - Registrati su: [supabase.com](https://supabase.com)

3. **Account GitHub** (per il deploy su Vercel)
   - Registrati su: [github.com](https://github.com)

4. **Account Vercel** (gratuito)
   - Registrati su: [vercel.com](https://vercel.com)

---

## 🚀 PARTE 1: SETUP LOCALE E TEST

### Step 1: Installare le Dipendenze

Apri il terminale nella cartella del progetto e esegui:

```bash
npm install --legacy-peer-deps
```

**Nota**: `--legacy-peer-deps` è necessario per risolvere conflitti di versioni.

### Step 2: Configurare Supabase

#### 2.1 Crea un Progetto Supabase

1. Vai su [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clicca **"New Project"**
3. Compila:
   - **Name**: `press-review-tool` (o nome a tua scelta)
   - **Database Password**: scegli una password forte (salvala!)
   - **Region**: scegli la più vicina (es. `West Europe`)
4. Clicca **"Create new project"**
5. Attendi 2-3 minuti per il setup

#### 2.2 Configura il Database

1. Nel dashboard Supabase, vai su **SQL Editor** (icona a sinistra)
2. Clicca **"New Query"**
3. Apri il file `lib/supabase/schema.sql` nel progetto
4. Copia **TUTTO** il contenuto
5. Incolla nel SQL Editor di Supabase
6. Clicca **"Run"** (in basso a destra)
7. Dovresti vedere: "Success. No rows returned" ✅

#### 2.3 Ottieni le Credenziali

1. Nel dashboard Supabase, vai su **Settings** → **API**
2. Trova la sezione **"Project API keys"**
3. Copia questi due valori:
   - **Project URL** (es: `https://xxxxx.supabase.co`)
   - **anon public** key (una stringa lunga)

### Step 3: Configurare le Variabili d'Ambiente

1. Nella cartella del progetto, crea un file chiamato `.env.local`
2. Aggiungi queste righe (sostituisci con i tuoi valori):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANTE**: 
- Non committare mai questo file su GitHub!
- Il file `.env.local` è già nel `.gitignore`

### Step 4: Avviare l'Applicazione

Nel terminale, esegui:

```bash
npm run dev
```

Dovresti vedere:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

Apri il browser e vai su: **http://localhost:3000**

---

## 🧪 PARTE 2: TESTARE L'APPLICAZIONE

### Test 1: Registrazione e Login ✅

1. **Registrazione**:
   - Vai su `http://localhost:3000`
   - Dovresti essere reindirizzato a `/login`
   - Clicca **"Sign up"** o vai su `/signup`
   - Inserisci:
     - Email: `test@example.com`
     - Password: `password123` (minimo 6 caratteri)
     - Conferma password
   - Clicca **"Create Account"**
   - ✅ Dovresti essere reindirizzato al dashboard

2. **Login**:
   - Fai logout (clicca "Sign Out" nella sidebar)
   - Vai su `/login`
   - Inserisci email e password
   - Clicca **"Sign In"**
   - ✅ Dovresti accedere al dashboard

### Test 2: Creare una Ricerca 🔍

1. Nel dashboard, clicca **"New Search"** (in alto a destra)
2. Compila il form:
   - **Artist or Topic**: `Taylor Swift` (o qualsiasi artista)
   - **Date Range**: seleziona un preset (es. "Last 3 months")
   - **Content Types**: seleziona "All Types" o specifici
   - **Maximum Results**: `50`
3. Clicca **"Start Search"**
4. ✅ Dovresti vedere:
   - Un messaggio "Searching..."
   - Poi i risultati appaiono
   - L'analisi AI inizia automaticamente
   - La barra di progresso mostra l'avanzamento

### Test 3: Filtrare i Risultati 🎯

1. Dopo che i risultati sono caricati, prova i filtri:
   - **Sentiment Filter**: seleziona "Positive", "Negative", ecc.
   - **Content Type Filter**: seleziona un tipo specifico
2. ✅ I risultati dovrebbero filtrare in tempo reale

### Test 4: Selezionare ed Esportare 📤

1. Seleziona alcuni risultati (checkbox a sinistra)
2. Clicca il menu **"Export"** (in alto nella toolbar)
3. Scegli un formato:
   - **JSON**: per dati completi
   - **CSV**: per Excel/spreadsheet
   - **PDF**: per report formattati
4. ✅ Il file dovrebbe scaricarsi automaticamente

### Test 5: Visualizzare la Cronologia 📚

1. Clicca **"History"** (icona orologio in alto)
2. ✅ Dovresti vedere tutte le ricerche precedenti
3. Clicca su una ricerca per ricaricarla
4. Prova i pulsanti:
   - **Share**: genera un link condivisibile
   - **Delete**: elimina una ricerca

### Test 6: Condividere una Ricerca 🔗

1. Dalla cronologia, clicca **"Share"** su una ricerca
2. ✅ Dovresti vedere un messaggio: "Share link copied to clipboard!"
3. Il link sarà nel formato: `http://localhost:3000/shared/[token]`
4. Apri il link in una finestra anonima/incognito
5. ✅ Dovresti vedere i risultati senza dover fare login

### Test 7: Visualizzare i Limiti d'Uso 📊

1. In alto nel dashboard, dovresti vedere:
   - **Searches: X/100** (ricerche usate/massime)
   - **Exports: X/50** (export usati/massimi)
2. ✅ Questi numeri si aggiornano dopo ogni ricerca/export

### Test 8: Tema Scuro/Chiaro 🌓

1. Clicca l'icona luna/sole in alto a destra
2. ✅ Il tema dovrebbe cambiare istantaneamente
3. Ricarica la pagina
4. ✅ Il tema dovrebbe persistere

### Test 9: Validazione Input ⚠️

1. Clicca **"New Search"**
2. Prova a inviare senza inserire nulla
3. ✅ Dovresti vedere un errore: "Query is required"
4. Inserisci una query molto lunga (>500 caratteri)
5. ✅ Dovresti vedere un errore di validazione

### Test 10: Gestione Errori 🛡️

1. Disconnetti internet temporaneamente
2. Prova a fare una ricerca
3. ✅ Dovresti vedere un messaggio di errore chiaro
4. Riconnetti internet e riprova
5. ✅ Dovrebbe funzionare normalmente

---

## 🚀 PARTE 3: DEPLOY SU VERCEL

### Preparazione: Push su GitHub

Prima di deployare, devi mettere il codice su GitHub:

1. **Crea un Repository GitHub**:
   - Vai su [github.com/new](https://github.com/new)
   - Nome: `press-review-tool` (o a tua scelta)
   - Scegli **Private** o **Public**
   - **NON** inizializzare con README (il progetto ha già file)

2. **Push del Codice**:
   ```bash
   # Se non hai ancora inizializzato git
   git init
   git add .
   git commit -m "Initial commit - Press Review Tool"
   
   # Aggiungi il remote (sostituisci con il tuo URL)
   git remote add origin https://github.com/TUO_USERNAME/press-review-tool.git
   git branch -M main
   git push -u origin main
   ```

### Step 1: Collegare Vercel a GitHub

1. Vai su [vercel.com](https://vercel.com)
2. Clicca **"Sign Up"** (se non hai account)
3. Scegli **"Continue with GitHub"**
4. Autorizza Vercel ad accedere ai tuoi repository

### Step 2: Importare il Progetto

1. Nel dashboard Vercel, clicca **"Add New..."** → **"Project"**
2. Trova il repository `press-review-tool`
3. Clicca **"Import"**

### Step 3: Configurare il Build

Vercel dovrebbe auto-rilevare le impostazioni, ma verifica:

- **Framework Preset**: `Next.js`
- **Root Directory**: `./` (lasciare vuoto)
- **Build Command**: `npm run build` (auto-rilevato)
- **Output Directory**: `.next` (auto-rilevato)
- **Install Command**: `npm install --legacy-peer-deps`

**⚠️ IMPORTANTE**: Modifica l'Install Command:
1. Clicca **"Override"** accanto a Install Command
2. Inserisci: `npm install --legacy-peer-deps`
3. Clicca **"Save"**

### Step 4: Configurare le Variabili d'Ambiente

**PRIMA** di cliccare "Deploy", configura le variabili:

1. Nella sezione **"Environment Variables"**, clicca **"Add"**
2. Aggiungi queste variabili (una alla volta):

   **Variabile 1**:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co` (il tuo URL Supabase)
   - Environment: seleziona **Production**, **Preview**, **Development**

   **Variabile 2**:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (la tua anon key)
   - Environment: seleziona **Production**, **Preview**, **Development**

   **Variabile 3** (opzionale):
   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: `https://press-review-tool.vercel.app` (o il tuo dominio)
   - Environment: seleziona **Production**, **Preview**, **Development**

3. Clicca **"Save"** per ogni variabile

### Step 5: Deploy!

1. Clicca **"Deploy"** (in basso)
2. Attendi 2-3 minuti per il build
3. ✅ Dovresti vedere: "Congratulations! Your project has been deployed"

### Step 6: Verificare il Deploy

1. Clicca sul link del progetto (es: `press-review-tool.vercel.app`)
2. ✅ L'app dovrebbe essere online!
3. Testa tutte le funzionalità come fatto in locale

---

## 🔧 TROUBLESHOOTING

### Problema: "Cannot find module"

**Soluzione**:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problema: "Missing environment variables"

**Soluzione**:
- Verifica che `.env.local` esista nella root del progetto
- Verifica che le variabili in Vercel siano corrette
- Assicurati che inizino con `NEXT_PUBLIC_` per quelle client-side

### Problema: "Supabase connection error"

**Soluzione**:
- Verifica che l'URL Supabase non abbia trailing slash (`/`)
- Controlla che la anon key sia corretta
- Verifica che il database sia configurato (schema.sql eseguito)

### Problema: "Build failed on Vercel"

**Soluzione**:
1. Controlla i log di build in Vercel
2. Verifica che `package.json` abbia gli script corretti
3. Assicurati che l'Install Command sia: `npm install --legacy-peer-deps`

### Problema: "Authentication not working"

**Soluzione**:
- Verifica che le tabelle del database esistano
- Controlla che RLS (Row Level Security) sia abilitato
- Verifica che i trigger siano creati (vedi schema.sql)

---

## 📝 CHECKLIST FINALE

Prima di considerare il deploy completo, verifica:

- [ ] ✅ Tutti i test locali passano
- [ ] ✅ Le variabili d'ambiente sono configurate in Vercel
- [ ] ✅ Il database Supabase è configurato correttamente
- [ ] ✅ Il codice è su GitHub
- [ ] ✅ Il build su Vercel è riuscito
- [ ] ✅ L'app funziona online
- [ ] ✅ Login/Signup funzionano
- [ ] ✅ Le ricerche funzionano
- [ ] ✅ Gli export funzionano
- [ ] ✅ La condivisione funziona

---

## 🎉 CONGRATULAZIONI!

Se hai completato tutti i passaggi, la tua app è online e funzionante!

### Prossimi Passi (Opzionali)

1. **Dominio Personalizzato**:
   - In Vercel: Settings → Domains
   - Aggiungi il tuo dominio
   - Configura DNS come indicato

2. **Monitoraggio**:
   - Abilita Vercel Analytics
   - Configura error tracking (es. Sentry)

3. **Backup Database**:
   - In Supabase: Settings → Database
   - Configura backup automatici

4. **CI/CD**:
   - Ogni push su GitHub deploya automaticamente
   - Configura branch per preview deployments

---

## 📞 SUPPORTO

Se hai problemi:

1. Controlla i log in Vercel (Deployments → View Function Logs)
2. Controlla i log in Supabase (Logs → Postgres Logs)
3. Apri la console del browser (F12) per errori client-side
4. Verifica che tutte le dipendenze siano installate

---

## 📚 RISORSE UTILI

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Buona fortuna con il tuo deploy! 🚀**

*Guida creata per Giorgio - Press Review Tool*

