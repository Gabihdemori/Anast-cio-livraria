document.addEventListener('DOMContentLoaded', function() {
    // Dados dos livros
    const books = [
        {
            id: 1,
            title: "O Nome do Vento",
            author: "Patrick Rothfuss",
            price: 49.90,
            originalPrice: 59.90,
            category: "fantasia",
            subcategory: "alta fantasia",
            image: "https://via.placeholder.com/300x450?text=O+Nome+do+Vento",
            badge: "BESTSELLER",
            description: "A emocionante história de Kvothe, um homem de muitos talentos e o mago mais notório que o mundo já viu."
        },
        {
            id: 2,
            title: "1984",
            author: "George Orwell",
            price: 39.90,
            originalPrice: 45.90,
            category: "ficcao",
            subcategory: "distopia",
            image: "https://via.placeholder.com/300x450?text=1984",
            description: "Um clássico da literatura distópica que retrata os perigos do totalitarismo e da vigilância estatal."
        },
        {
            id: 3,
            title: "Orgulho e Preconceito",
            author: "Jane Austen",
            price: 34.90,
            category: "romance",
            subcategory: "classico",
            image: "https://via.placeholder.com/300x450?text=Orgulho+e+Preconceito",
            description: "A história de Elizabeth Bennet e Mr. Darcy é um dos romances mais amados da literatura inglesa."
        },
        {
            id: 4,
            title: "O Hobbit",
            author: "J.R.R. Tolkien",
            price: 54.90,
            category: "fantasia",
            subcategory: "aventura",
            image: "https://via.placeholder.com/300x450?text=O+Hobbit",
            badge: "LANÇAMENTO",
            description: "A aventura de Bilbo Bolseiro, um hobbit que se junta a um grupo de anões para recuperar um tesouro guardado por um dragão."
        },
        {
            id: 5,
            title: "Cem Anos de Solidão",
            author: "Gabriel García Márquez",
            price: 44.90,
            originalPrice: 49.90,
            category: "literatura",
            subcategory: "realismo magico",
            image: "https://via.placeholder.com/300x450?text=Cem+Anos+de+Solidao",
            description: "A saga da família Buendía em Macondo é uma das obras-primas da literatura latino-americana."
        },
        {
            id: 6,
            title: "O Pequeno Príncipe",
            author: "Antoine de Saint-Exupéry",
            price: 29.90,
            category: "infantil",
            subcategory: "classico",
            image: "https://via.placeholder.com/300x450?text=O+Pequeno+Principe",
            description: "Uma história poética e filosófica que encanta crianças e adultos há gerações."
        },
        {
            id: 7,
            title: "A Revolução dos Bichos",
            author: "George Orwell",
            price: 32.90,
            category: "ficcao",
            subcategory: "alegoria",
            image: "https://via.placeholder.com/300x450?text=A+Revolucao+dos+Bichos",
            description: "Uma sátira política sobre como o poder pode corromper até as melhores intenções."
        },
        {
            id: 8,
            title: "Harry Potter e a Pedra Filosofal",
            author: "J.K. Rowling",
            price: 47.90,
            originalPrice: 59.90,
            category: "fantasia",
            subcategory: "juvenil",
            image: "https://via.placeholder.com/300x450?text=Harry+Potter",
            badge: "PROMOÇÃO",
            description: "O primeiro livro da saga que acompanha Harry Potter em sua jornada na Escola de Magia e Bruxaria de Hogwarts."
        }
    ];

    // Estados
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentStep = 1;

    // Elementos DOM
    const booksContainer = document.getElementById('books-container');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const invoiceModal = document.getElementById('invoice-modal');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');

    // Inicialização
    renderBooks(books);
    updateCartCount();
    populateStates();

    // Event Listeners
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('close-checkout').addEventListener('click', closeCheckout);
    document.getElementById('cancel-checkout').addEventListener('click', closeCheckout);
    document.getElementById('finish-checkout').addEventListener('click', finishCheckout);
    document.getElementById('close-invoice').addEventListener('click', closeInvoice);
    document.getElementById('print-invoice').addEventListener('click', printInvoice);
    document.getElementById('download-invoice').addEventListener('click', downloadInvoice);
    
    // Navegação do checkout
    document.getElementById('next-step-1').addEventListener('click', () => navigateCheckout(2));
    document.getElementById('prev-step-2').addEventListener('click', () => navigateCheckout(1));
    document.getElementById('next-step-2').addEventListener('click', () => navigateCheckout(3));
    
    // Métodos de pagamento
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentMethod);
    });

    // Barra de pesquisa
    searchBtn.addEventListener('click', searchBooks);
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchBooks();
    });

    // Funções de renderização
    function renderBooks(booksToRender) {
        booksContainer.innerHTML = '';
        
        if (booksToRender.length === 0) {
            booksContainer.innerHTML = '<p class="no-results">Nenhum livro encontrado.</p>';
            return;
        }
        
        booksToRender.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-card';
            bookElement.innerHTML = `
                <div class="book-image">
                    <img src="${book.image}" alt="${book.title}">
                    ${book.badge ? `<span class="book-badge">${book.badge}</span>` : ''}
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-price">
                        <div>
                            <span class="price-current">R$ ${book.price.toFixed(2)}</span>
                            ${book.originalPrice ? `<span class="price-original">R$ ${book.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" data-id="${book.id}">Adicionar</button>
                    </div>
                </div>
            `;
            booksContainer.appendChild(bookElement);
        });

        // Adiciona event listeners aos botões de adicionar ao carrinho
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function renderCartItems() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio</p>';
            return;
        }
        
        cart.forEach(item => {
            const book = books.find(b => b.id === item.id);
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${book.image}" alt="${book.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${book.title}</h4>
                    <p class="cart-item-author">${book.author}</p>
                    <p class="cart-item-price">R$ ${book.price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-id="${book.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${book.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${book.id}">Remover</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });

        // Adiciona event listeners aos controles de quantidade
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });

        // Atualiza totais
        updateCartTotals();
    }

    function updateCartTotals() {
        const subtotal = cart.reduce((total, item) => {
            const book = books.find(b => b.id === item.id);
            return total + (book.price * item.quantity);
        }, 0);
        
        const shipping = subtotal > 100 ? 0 : 15;
        const total = subtotal + shipping;
        
        cartSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
        cartShipping.textContent = `R$ ${shipping.toFixed(2)}`;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        
        // Atualiza opções de parcelamento
        updateInstallmentOptions(total);
    }

    function updateInstallmentOptions(total) {
        const select = document.getElementById('card-installments');
        select.innerHTML = '';
        
        const maxInstallments = total >= 300 ? 12 : total >= 200 ? 6 : total >= 100 ? 3 : 1;
        
        for (let i = 1; i <= maxInstallments; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de R$ ${(total / i).toFixed(2)}`;
            select.appendChild(option);
        }
    }

    function populateStates() {
        const states = [
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
            "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
            "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ];
        
        const select = document.getElementById('state');
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            select.appendChild(option);
        });
    }

    function renderOrderSummary() {
        const subtotal = cart.reduce((total, item) => {
            const book = books.find(b => b.id === item.id);
            return total + (book.price * item.quantity);
        }, 0);
        
        const shipping = subtotal > 100 ? 0 : 15;
        const total = subtotal + shipping;
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        let paymentText = '';
        
        switch(paymentMethod) {
            case 'credit':
                paymentText = 'Cartão de Crédito';
                break;
            case 'debit':
                paymentText = 'Cartão de Débito';
                break;
            case 'pix':
                paymentText = 'PIX';
                break;
            case 'boleto':
                paymentText = 'Boleto Bancário';
                break;
        }
        
        const orderSummary = document.getElementById('order-summary-content');
        orderSummary.innerHTML = '';
        
        // Itens do pedido
        cart.forEach(item => {
            const book = books.find(b => b.id === item.id);
            const itemElement = document.createElement('div');
            itemElement.className = 'order-summary-item';
            itemElement.innerHTML = `
                <span>${book.title} (${item.quantity}x)</span>
                <span>R$ ${(book.price * item.quantity).toFixed(2)}</span>
            `;
            orderSummary.appendChild(itemElement);
        });
        
        // Totais
        const subtotalElement = document.createElement('div');
        subtotalElement.className = 'order-summary-item';
        subtotalElement.innerHTML = `
            <span>Subtotal</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        `;
        orderSummary.appendChild(subtotalElement);
        
        const shippingElement = document.createElement('div');
        shippingElement.className = 'order-summary-item';
        shippingElement.innerHTML = `
            <span>Frete</span>
            <span>R$ ${shipping.toFixed(2)}</span>
        `;
        orderSummary.appendChild(shippingElement);
        
        const totalElement = document.createElement('div');
        totalElement.className = 'order-summary-item';
        totalElement.innerHTML = `
            <span>Total</span>
            <span>R$ ${total.toFixed(2)}</span>
        `;
        orderSummary.appendChild(totalElement);
        
        // Método de pagamento
        const paymentElement = document.createElement('div');
        paymentElement.className = 'order-summary-item';
        paymentElement.innerHTML = `
            <span>Método de Pagamento</span>
            <span>${paymentText}</span>
        `;
        orderSummary.appendChild(paymentElement);
        
        // Endereço de entrega
        const addressElement = document.createElement('div');
        addressElement.className = 'order-summary-item';
        addressElement.style.flexDirection = 'column';
        addressElement.style.alignItems = 'flex-start';
        addressElement.style.gap = '5px';
        addressElement.innerHTML = `
            <span style="font-weight: bold;">Endereço de Entrega</span>
            <span>${document.getElementById('name').value}</span>
            <span>${document.getElementById('address').value}, ${document.getElementById('number').value}</span>
            <span>${document.getElementById('complement').value ? document.getElementById('complement').value + ' - ' : ''}${document.getElementById('neighborhood').value}</span>
            <span>${document.getElementById('city').value}/${document.getElementById('state').value}</span>
            <span>CEP: ${document.getElementById('cep').value}</span>
        `;
        orderSummary.appendChild(addressElement);
    }

    function generateInvoice() {
        const subtotal = cart.reduce((total, item) => {
            const book = books.find(b => b.id === item.id);
            return total + (book.price * item.quantity);
        }, 0);
        
        const shipping = subtotal > 100 ? 0 : 15;
        const total = subtotal + shipping;
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        let paymentText = '';
        
        switch(paymentMethod) {
            case 'credit':
                paymentText = 'Cartão de Crédito';
                break;
            case 'debit':
                paymentText = 'Cartão de Débito';
                break;
            case 'pix':
                paymentText = 'PIX';
                break;
            case 'boleto':
                paymentText = 'Boleto Bancário';
                break;
        }
        
        const now = new Date();
        const invoiceNumber = `NF${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        const invoiceContent = document.getElementById('invoice-content');
        invoiceContent.innerHTML = `
            <div class="invoice-header">
                <div>
                    <h2>Anastácio Livraria</h2>
                    <p>CNPJ: 12.345.678/0001-99</p>
                    <p>Rua dos Livros, 123 - Centro, São Paulo/SP</p>
                </div>
                <div class="invoice-info">
                    <h3>NOTA FISCAL</h3>
                    <p>Nº ${invoiceNumber}</p>
                    <p>Data: ${now.toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
            
            <div class="invoice-section">
                <h4>Dados do Cliente</h4>
                <p><strong>Nome:</strong> ${document.getElementById('name').value}</p>
                <p><strong>CPF/CNPJ:</strong> ${document.getElementById('cpf').value || 'Não informado'}</p>
                <p><strong>E-mail:</strong> ${document.getElementById('email').value}</p>
                <p><strong>Telefone:</strong> ${document.getElementById('phone').value}</p>
            </div>
            
            <div class="invoice-section">
                <h4>Endereço de Entrega</h4>
                <p>${document.getElementById('address').value}, ${document.getElementById('number').value}</p>
                <p>${document.getElementById('complement').value ? document.getElementById('complement').value + ' - ' : ''}${document.getElementById('neighborhood').value}</p>
                <p>${document.getElementById('city').value}/${document.getElementById('state').value}</p>
                <p>CEP: ${document.getElementById('cep').value}</p>
            </div>
            
            <div class="invoice-section">
                <h4>Itens</h4>
                <table class="invoice-items">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Descrição</th>
                            <th>Qtd</th>
                            <th>Valor Unit.</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map((item, index) => {
                            const book = books.find(b => b.id === item.id);
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${book.title} - ${book.author}</td>
                                    <td>${item.quantity}</td>
                                    <td>R$ ${book.price.toFixed(2)}</td>
                                    <td>R$ ${(book.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="invoice-totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Frete:</span>
                    <span>R$ ${shipping.toFixed(2)}</span>
                </div>
                <div class="total-row grand-total">
                    <span>Total:</span>
                    <span>R$ ${total.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Método de Pagamento:</span>
                    <span>${paymentText}</span>
                </div>
            </div>
            
            <div class="invoice-footer">
                <p>Anastácio Livraria - CNPJ: 12.345.678/0001-99</p>
                <p>Endereço: Rua dos Livros, 123 - Centro, São Paulo/SP - CEP: 01234-567</p>
                <p>Telefone: (11) 1234-5678 | E-mail: contato@anastaciolivraria.com.br</p>
            </div>
        `;
    }

    // Funções de manipulação do carrinho
    function addToCart(e) {
        const bookId = parseInt(e.target.getAttribute('data-id'));
        const existingItem = cart.find(item => item.id === bookId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: bookId, quantity: 1 });
        }
        
        saveCart();
        updateCartCount();
        
        // Feedback visual
        const button = e.target;
        button.textContent = 'Adicionado!';
        button.style.backgroundColor = '#5cb85c';
        
        setTimeout(() => {
            button.textContent = 'Adicionar';
            button.style.backgroundColor = '#8b5a2b';
        }, 1000);
    }

    function removeFromCart(e) {
        const bookId = parseInt(e.target.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== bookId);
        
        saveCart();
        renderCartItems();
        updateCartCount();
    }

    function increaseQuantity(e) {
        const bookId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === bookId);
        
        if (item) {
            item.quantity += 1;
            saveCart();
            renderCartItems();
        }
    }

    function decreaseQuantity(e) {
        const bookId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === bookId);
        
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(i => i.id !== bookId);
            }
            
            saveCart();
            renderCartItems();
            updateCartCount();
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Funções de navegação
    function openCart() {
        renderCartItems();
        cartOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function openCheckout() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        closeCart();
        checkoutOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        currentStep = 1;
        updateCheckoutSteps();
    }

    function closeCheckout() {
        checkoutOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function finishCheckout() {
        generateInvoice();
        closeCheckout();
        invoiceModal.style.display = 'flex';
        
        // Limpa o carrinho após finalizar a compra
        cart = [];
        saveCart();
        updateCartCount();
    }

    function closeInvoice() {
        invoiceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function navigateCheckout(step) {
        // Validação antes de avançar
        if (step > currentStep) {
            const currentForm = document.querySelector(`.step-content[data-step="${currentStep}"]`);
            const inputs = currentForm.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = '#d9534f';
                    isValid = false;
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
        }
        
        currentStep = step;
        updateCheckoutSteps();
        
        if (currentStep === 3) {
            renderOrderSummary();
        }
    }

    function updateCheckoutSteps() {
        document.querySelectorAll('.step').forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        document.querySelectorAll('.step-content').forEach(content => {
            const contentStep = parseInt(content.getAttribute('data-step'));
            
            if (contentStep === currentStep) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    function togglePaymentMethod() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        document.querySelectorAll('.payment-form').forEach(form => {
            form.style.display = 'none';
        });
        
        if (paymentMethod === 'credit') {
            document.getElementById('credit-card-form').style.display = 'block';
        }
    }

    function searchBooks() {
        const searchTerm = searchBar.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            renderBooks(books);
            return;
        }
        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            (book.subcategory && book.subcategory.toLowerCase().includes(searchTerm))
        );
        
        renderBooks(filteredBooks);
    }

    function printInvoice() {
        const printContent = document.getElementById('invoice-content').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        
        // Restaura o estado da página
        invoiceModal.style.display = 'flex';
    }

    function downloadInvoice() {
        alert('Funcionalidade de download será implementada em uma versão futura!');
    }
});