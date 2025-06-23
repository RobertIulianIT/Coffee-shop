document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Espresso Intenso', price: 12.99, category: 'forti' },
        { id: 2, name: 'Caffè Arabica Classico', price: 10.50, category: 'medi' },
        { id: 3, name: 'Miscela Leggera Mattina', price: 9.75, category: 'leggeri' },
        { id: 4, name: 'Bio Decaffeinato', price: 14.00, category: 'bio' },
        { id: 5, name: 'Caffè Robusta Forte', price: 11.20, category: 'forti' },
        { id: 6, name: 'Miscela Equilibrata', price: 10.99, category: 'medi' },
        { id: 7, name: 'Dolce Aroma', price: 9.50, category: 'leggeri' },
        { id: 8, name: 'Bio Ethiopia Sidamo', price: 15.50, category: 'bio' },
        { id: 9, name: 'Caffè del Nonno', price: 13.50, category: 'forti' },
        { id: 10, name: 'Miscela Bar', price: 11.80, category: 'medi' },
        { id: 11, name: 'Caffè Cereali Bio', price: 12.00, category: 'bio' },
        { id: 12, name: 'Delicato Sensazioni', price: 9.20, category: 'leggeri' },
        { id: 13, name: 'Colombia Supremo', price: 14.80, category: 'forti' },
        { id: 14, name: 'Guatemala Huehuetenango', price: 13.00, category: 'medi' },
        { id: 15, name: 'Bio Sumatra Mandheling', price: 16.00, category: 'bio' }
    ];

    // Inizializza il carrello recuperandolo da localStorage o come array vuoto
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

    // Elementi DOM specifici per la pagina index.html
    const productsContainer = document.querySelector('.products-container');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalAmountSpan = document.getElementById('cart-total-amount');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    // Elementi DOM specifici per la pagina checkout.html
    const checkoutCartSummary = document.getElementById('checkout-cart-summary');
    const checkoutTotalAmountSpan = document.getElementById('checkout-total-amount');
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');

    // Funzione per salvare il carrello in localStorage
    function saveCart() {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
    }

    // Funzione per renderizzare i prodotti (usata solo su index.html)
    function renderProducts(filteredProducts) {
        if (!productsContainer) return;

        productsContainer.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            // Ho sostituito l'immagine con un div placeholder colorato
            productCard.innerHTML = `
                <div class="product-image-placeholder">${product.name}</div>
                <h3>${product.name}</h3>
                <p>Categoria: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <div class="price">${product.price.toFixed(2)} €</div>
                <button data-id="${product.id}">Aggiungi al Carrello</button>
            `;
            productsContainer.appendChild(productCard);
        });

        document.querySelectorAll('.product-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addProductToCart(productId);
            });
        });
    }

    // Funzione per aggiungere un prodotto al carrello
    function addProductToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart();
            updateCart();
        }
    }

    // Funzione per rimuovere un prodotto dal carrello
    function removeProductFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCart();
    }

    // Funzione per aggiornare la visualizzazione del carrello e il totale
    function updateCart() {
        if (!cartItemsContainer || !cartTotalAmountSpan) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <span>${item.name} <span class="item-quantity">x${item.quantity}</span></span>
                    <span class="item-price">${(item.price * item.quantity).toFixed(2)} €</span>
                    <button class="remove-item-btn" data-id="${item.id}">Rimuovi</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
        }

        cartTotalAmountSpan.textContent = total.toFixed(2);

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeProductFromCart(productId);
            });
        });
    }

    // Funzione per renderizzare il carrello sulla pagina di checkout
    function renderCheckoutSummary() {
        if (!checkoutCartSummary || !checkoutTotalAmountSpan) return;

        checkoutCartSummary.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            // Se il carrello è vuoto, mostra il messaggio e nascondi il totale
            const message = document.createElement('p');
            message.classList.add('empty-cart-message');
            message.textContent = 'Il carrello è vuoto. Torna al negozio per aggiungere prodotti.';
            checkoutCartSummary.appendChild(message);
            checkoutTotalAmountSpan.textContent = '0.00'; // Resetta il totale
        } else {
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <span>${item.name} <span class="item-quantity">x${item.quantity}</span></span>
                    <span class="item-price">${(item.price * item.quantity).toFixed(2)} €</span>
                `;
                checkoutCartSummary.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
            checkoutTotalAmountSpan.textContent = total.toFixed(2);
        }
    }

    // Logica per la pagina principale (index.html)
    if (productsContainer) {
        // Gestione dei filtri per categoria
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const category = e.target.dataset.category;
                let filteredProducts;
                if (category === 'all') {
                    filteredProducts = products;
                } else {
                    filteredProducts = products.filter(product => product.category === category);
                }
                renderProducts(filteredProducts);
            });
        });

        // Gestione del pulsante Checkout
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length > 0) {
                    window.location.href = 'checkout.html';
                } else {
                    alert('Il carrello è vuoto. Aggiungi qualche prodotto prima di procedere.');
                }
            });
        }

        // Inizializzazione: carica tutti i prodotti e il carrello al caricamento della pagina
        renderProducts(products);
        updateCart();
    }

    // Logica per la pagina di checkout (checkout.html)
    if (checkoutForm) {
        renderCheckoutSummary();

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (cart.length === 0) {
                    alert('Il carrello è vuoto. Torna al negozio per aggiungere prodotti prima di confermare l\'ordine.');
                    return;
                }
                alert(`Ordine confermato! Totale: ${checkoutTotalAmountSpan.textContent} €.\nRiceverai una email di conferma a breve.`);
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            });
        }
    }
});