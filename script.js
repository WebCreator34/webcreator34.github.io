let trades = JSON.parse(localStorage.getItem('trades')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadTrades();
    updateSummary();
});

document.getElementById('tradeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const trade = {
        id: Date.now(), // Unique ID for deletion
        date: document.getElementById('tradeDate').value,
        asset: document.getElementById('asset').value.toUpperCase(),
        type: document.getElementById('tradeType').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseFloat(document.getElementById('quantity').value)
    };

    trades.push(trade);
    saveTrades();
    addTradeToTable(trade);
    updateSummary();
    this.reset();
});

function loadTrades() {
    trades.forEach(trade => addTradeToTable(trade));
}

function addTradeToTable(trade) {
    const tbody = document.getElementById('tradeList');
    const row = document.createElement('tr');
    row.setAttribute('data-id', trade.id);
    row.innerHTML = `
        <td>${trade.date}</td>
        <td>${trade.asset}</td>
        <td>${trade.type}</td>
        <td>$${trade.price.toFixed(2)}</td>
        <td>${trade.quantity}</td>
        <td><button class="delete" onclick="deleteTrade(${trade.id})">Delete</button></td>
    `;
    tbody.appendChild(row);
}

function saveTrades() {
    localStorage.setItem('trades', JSON.stringify(trades));
}

function deleteTrade(id) {
    trades = trades.filter(trade => trade.id !== id);
    saveTrades();
    refreshTable();
    updateSummary();
}

function refreshTable() {
    const tbody = document.getElementById('tradeList');
    tbody.innerHTML = '';
    loadTrades();
}

function updateSummary() {
    let totalPL = 0;
    const assets = {};

    trades.forEach(trade => {
        const cost = trade.price * trade.quantity;
        if (!assets[trade.asset]) {
            assets[trade.asset] = { buy: 0, sell: 0, buyQty: 0, sellQty: 0 };
        }
        if (trade.type === 'buy') {
            assets[trade.asset].buy += cost;
            assets[trade.asset].buyQty += trade.quantity;
        } else {
            assets[trade.asset].sell += cost;
            assets[trade.asset].sellQty += trade.quantity;
        }
    });

    for (const asset in assets) {
        const { buy, sell } = assets[asset];
        totalPL += sell - buy; // Simplified; assumes all buys are sold
    }

    document.getElementById('totalPL').textContent = `$${totalPL.toFixed(2)}`;
}
