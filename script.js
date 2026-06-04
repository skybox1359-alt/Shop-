// Three.js Scene Setup
let scene, camera, renderer;
let iphone;

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x0071e3, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00d4ff, 0.5);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);
    
    // Create iPhone 17
    createIphone();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Animation loop
    animate();
}

function createIphone() {
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.RoundedBoxGeometry(1, 2, 0.15, 16, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.8,
        roughness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Screen
    const screenGeometry = new THREE.RoundedBoxGeometry(0.95, 1.95, 0.01, 12, 8);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        emissive: 0x0071e3,
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.05
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.08;
    screen.castShadow = true;
    group.add(screen);
    
    // Camera bump
    const cameraGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 32);
    const cameraMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.05
    });
    const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
    camera.position.set(0.3, 0.7, 0.15);
    camera.castShadow = true;
    group.add(camera);
    
    // Camera lens
    const lensGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.7,
        roughness: 0.2
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.set(0.3, 0.7, 0.2);
    group.add(lens);
    
    // Speaker grilles
    for (let i = 0; i < 3; i++) {
        const grilleGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.05);
        const grilleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.set(-0.2, -0.9 + i * 0.05, 0.1);
        group.add(grille);
    }
    
    // Add glow effect
    const glowGeometry = new THREE.RoundedBoxGeometry(1.05, 2.05, 0.2, 16, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x0071e3,
        transparent: true,
        opacity: 0.1
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.1;
    group.add(glow);
    
    scene.add(group);
    iphone = group;
}

function animate() {
    requestAnimationFrame(animate);
    
    if (iphone) {
        iphone.rotation.x += 0.003;
        iphone.rotation.y += 0.005;
        iphone.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Shopping Cart Logic
let cart = [];

const products = {
    'iPhone 17': 799,
    'iPhone 17 Pro': 999,
    'iPhone 17 Pro Max': 1199
};

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${productName} added to cart!`);
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotal = document.getElementById('subtotal');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');
    
    // Update cart count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
    
    // Clear cart items display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        subtotal.textContent = '$0';
        tax.textContent = '$0';
        total.textContent = '$0';
        return;
    }
    
    // Display cart items
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price} × ${item.quantity}</p>
            </div>
            <div class="item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Calculate totals
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * 0.1;
    const totalAmount = subtotalAmount + taxAmount;
    
    subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    tax.textContent = `$${taxAmount.toFixed(2)}`;
    total.textContent = `$${totalAmount.toFixed(2)}`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0071e3;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = e.target.getAttribute('data-product');
            const price = parseFloat(e.target.getAttribute('data-price'));
            addToCart(productName, price);
        });
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification(`Order placed! Total: $${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1).toFixed(2)}`);
        cart = [];
        updateCart();
    });
    
    // CTA button
    document.querySelector('.cta-btn').addEventListener('click', () => {
        document.querySelector('.models-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Handle window resize for Three.js
window.addEventListener('resize', onWindowResize);
