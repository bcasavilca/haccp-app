// Dati dei prodotti dalla lista
const PRODUCTS = [
    { name: "Bombe", days: 1, emoji: "🥖" },
    { name: "Hamburguer", days: 1, emoji: "🍔" },
    { name: "Nuvola", days: 1, emoji: "🥯" },
    { name: "Pane", days: 1, emoji: "🍞" },
    { name: "Salsiccia", days: 1, emoji: "🌭" },
    { name: "Ventricina", days: 1, emoji: "🥓" },
    { name: "Cipolla", days: 2, emoji: "🧅" },
    { name: "Focacce", days: 2, emoji: "🍕" },
    { name: "Iceberg", days: 2, emoji: "🥬" },
    { name: "Cetriolo", days: 3, emoji: "🥒" },
    { name: "Chips", days: 3, emoji: "🍟" },
    { name: "Pollo Fondente", days: 3, emoji: "🍗" },
    { name: "Porcini", days: 3, emoji: "🍄" },
    { name: "Tonno", days: 3, emoji: "🐟" },
    { name: "Creme Pomodoro", days: 4, emoji: "🥫" },
    { name: "Mozzarela", days: 4, emoji: "🧀" },
    { name: "Panceta", days: 4, emoji: "🥓" },
    { name: "Crema/Pistacchio", days: 4, emoji: "🍨" },
    { name: "Minestra", days: 5, emoji: "🍲" },
    { name: "Prosciutto Cotto", days: 5, emoji: "🍖" },
    { name: "Prosciutto Crudo", days: 5, emoji: "🥩" },
    { name: "Zuppa", days: 5, emoji: "🥣" },
    { name: "Bat. Pomodoro", days: 6, emoji: "🍅" },
    { name: "Carciofe", days: 6, emoji: "🌿" },
    { name: "Mayonese", days: 6, emoji: "🥄" },
    { name: "Senapata", days: 6, emoji: "🌭" },
    { name: "Verza", days: 6, emoji: "🥬" },
    { name: "Ceci", days: 8, emoji: "🫘" },
    { name: "Fagiole", days: 8, emoji: "🫘" },
    { name: "Riso Nero", days: 8, emoji: "🍚" },
    { name: "BBQ", days: 10, emoji: "🍖" },
    { name: "Toast", days: 15, emoji: "🍞" }
];

// Database locale
let records = JSON.parse(localStorage.getItem('haccp_records')) || [];
let currentProduct = null;
let currentFilter = 'all';

// Inizializzazione
function init() {
    renderProducts();
    renderHistory();
    updateStats();
}

// Render prodotti
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const now = new Date();
    
    grid.innerHTML = PRODUCTS.map(product => {
        const openRecord = records.find(r => 
            r.product === product.name && 
            r.status === 'open' &&
            new Date(r.expiryDate) > now
        );
        
        let status = 'status-ok';
        let statusText = 'Disponibile';
        
        if (openRecord) {
            const daysLeft = Math.ceil((new Date(openRecord.expiryDate) - now) / (1000 * 60 * 60 * 24));
            
            if (daysLeft < 0) {
                status = 'status-danger';
                statusText = 'Scaduto';
            } else if (daysLeft <= 1) {
                status = 'status-warning';
                statusText = 'Scade oggi';
            } else {
                status = 'status-ok';
                statusText = `${daysLeft} gg rimasti`;
            }
        }
        
        return `
            <div class="product-card ${status}" onclick="showProductModal('${product.name}')">
                <div class="product-emoji">${product.emoji}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-days">${product.days} GG</div>
                <div class="product-status">${statusText}</div>
            </div>
        `;
    }).join('');
}

// Mostra modal prodotto
function showProductModal(productName) {
    currentProduct = PRODUCTS.find(p => p.name === productName);
    if (!currentProduct) return;
    
    document.getElementById('modalEmoji').textContent = currentProduct.emoji;
    document.getElementById('modalTitle').textContent = currentProduct.name;
    document.getElementById('modalSubtitle').textContent = `Validità: ${currentProduct.days} giorni`;
    
    document.getElementById('actionModal').classList.add('active');
}

// Chiudi modal
function closeModal() {
    document.getElementById('actionModal').classList.remove('active');
    currentProduct = null;
}

// Apri prodotto (nuovo lotto)
function openProduct() {
    if (!currentProduct) return;
    
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + currentProduct.days);
    
    const record = {
        id: Date.now(),
        product: currentProduct.name,
        emoji: currentProduct.emoji,
        openDate: now.toISOString(),
        expiryDate: expiryDate.toISOString(),
        daysValid: currentProduct.days,
        status: 'open',
        lot: generateLot()
    };
    
    // Chiudi eventuali lotti precedenti aperti dello stesso prodotto
    records.forEach(r => {
        if (r.product === currentProduct.name && r.status === 'open') {
            r.status = 'closed';
        }
    });
    
    records.push(record);
    saveRecords();
    
    closeModal();
    
    // Mostra conferma
    const formattedDate = expiryDate.toLocaleDateString('it-IT');
    document.getElementById('confirmSubtitle').textContent = 
        `Lotto: ${record.lot} | Scadenza: ${formattedDate}`;
    document.getElementById('confirmModal').classList.add('active');
    
    // Aggiorna UI
    renderProducts();
    renderHistory();
    updateStats();
}

// Genera codice lotto
function generateLot() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 5).replace(':', '');
    return `${date}-${time}`;
}

// Chiudi modal conferma
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

// Render storico
function renderHistory() {
    const list = document.getElementById('historyList');
    const now = new Date();
    
    let filtered = [...records].sort((a, b) => b.id - a.id);
    
    // Applica filtri
    if (currentFilter === 'open') {
        filtered = filtered.filter(r => r.status === 'open' && new Date(r.expiryDate) > now);
    } else if (currentFilter === 'expired') {
        filtered = filtered.filter(r => new Date(r.expiryDate) <= now);
    } else if (currentFilter === 'today') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(r => {
            const exp = new Date(r.expiryDate);
            return exp <= tomorrow && exp > now;
        });
    }
    
    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-emoji">📋</div>
                <p>Nessun record trovato</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = filtered.map(record => {
        const daysLeft = Math.ceil((new Date(record.expiryDate) - now) / (1000 * 60 * 60 * 24));
        let status = 'status-ok';
        let statusText = `${daysLeft} gg`;
        let statusClass = 'open';
        
        if (record.status === 'closed') {
            status = 'status-closed';
            statusText = 'Chiuso';
            statusClass = 'closed';
        } else if (daysLeft < 0) {
            status = 'status-danger';
            statusText = 'Scaduto';
        } else if (daysLeft <= 1) {
            status = 'status-warning';
            statusText = 'Scade oggi';
        }
        
        const openDate = new Date(record.openDate).toLocaleDateString('it-IT');
        const expDate = new Date(record.expiryDate).toLocaleDateString('it-IT');
        
        return `
            <div class="history-item ${status} ${statusClass}">
                <div class="history-info">
                    <h3>${record.emoji} ${record.product}</h3>
                    <p>Lotto: ${record.lot}</p>
                    <p>Aperto: ${openDate} | Scade: ${expDate}</p>
                </div>
                <div class="history-status">
                    <div class="history-badge">${statusText}</div>
                    <div class="history-date">${record.daysValid}GG</div>
                </div>
            </div>
        `;
    }).join('');
}

// Filtra storico
function filterHistory(filter) {
    currentFilter = filter;
    
    // Aggiorna bottoni filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderHistory();
}

// Aggiorna statistiche
function updateStats() {
    const now = new Date();
    
    const totalOpen = records.filter(r => 
        r.status === 'open' && new Date(r.expiryDate) > now
    ).length;
    
    const expired = records.filter(r => 
        new Date(r.expiryDate) <= now
    ).length;
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expiringToday = records.filter(r => {
        const exp = new Date(r.expiryDate);
        return r.status === 'open' && exp <= tomorrow && exp > now;
    }).length;
    
    document.getElementById('statTotal').textContent = totalOpen;
    document.getElementById('statExpired').textContent = expired;
    document.getElementById('statToday').textContent = expiringToday;
    
    // Mostra prodotti che scadono presto
    const expiringSoon = records
        .filter(r => r.status === 'open' && new Date(r.expiryDate) > now)
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .slice(0, 5);
    
    const soonDiv = document.getElementById('expiringSoon');
    if (expiringSoon.length > 0) {
        soonDiv.innerHTML = `
            <h3 style="margin: 20px 0 10px; font-size: 1rem; color: #ffcc00;">⚠️ Scadono presto:</h3>
            ${expiringSoon.map(r => {
                const daysLeft = Math.ceil((new Date(r.expiryDate) - now) / (1000 * 60 * 60 * 24));
                return `
                    <div style="background: #1e1e3f; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
                        ${r.emoji} ${r.product} - ${daysLeft} gg rimasti
                    </div>
                `;
            }).join('')}
        `;
    } else {
        soonDiv.innerHTML = '';
    }
}

// Cambia tab
function showTab(tabName) {
    // Aggiorna tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Aggiorna sezioni
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Aggiorna dati
    if (tabName === 'products') renderProducts();
    if (tabName === 'history') renderHistory();
    if (tabName === 'stats') updateStats();
}

// Salva records
function saveRecords() {
    localStorage.setItem('haccp_records', JSON.stringify(records));
}

// Inizializza all'avvio
init();

// Aggiorna ogni minuto
setInterval(() => {
    renderProducts();
    updateStats();
}, 60000);