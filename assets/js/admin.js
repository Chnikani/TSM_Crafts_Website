document.addEventListener('DOMContentLoaded', () => {
    const productListBody = document.querySelector('#products .product-list tbody');
    const messageListBody = document.querySelector('#messages .message-list tbody');
    const addProductForm = document.getElementById('addProductForm');

    const API_BASE_URL = 'http://localhost:3000/api';

    // Function to fetch and display products
    async function fetchProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const products = await response.json();
            productListBody.innerHTML = ''; // Clear existing rows
            products.forEach(product => {
                const row = productListBody.insertRow();
                row.innerHTML = `
                    <td>${product._id}</td>
                    <td>${product.name}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.category}</td>
                    <td>${product.isSoldOut ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="btn btn-warning" onclick="markProductSoldOut('${product._id}', ${product.isSoldOut})">${product.isSoldOut ? 'Mark Available' : 'Mark Sold Out'}</button>
                        <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Function to fetch and display messages
    async function fetchMessages() {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`);
            const messages = await response.json();
            messageListBody.innerHTML = ''; // Clear existing rows
            messages.forEach(message => {
                const row = messageListBody.insertRow();
                row.innerHTML = `
                    <td>${message._id}</td>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.subject}</td>
                    <td>${message.message}</td>
                    <td>${message.isRead ? 'Yes' : 'No'}</td>
                    <td>${message.replied ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="markMessageRead('${message._id}', ${message.isRead})">${message.isRead ? 'Mark Unread' : 'Mark Read'}</button>
                        <button class="btn btn-warning" onclick="markMessageReplied('${message._id}', ${message.replied})">${message.replied ? 'Mark Unreplied' : 'Mark Replied'}</button>
                        <button class="btn btn-danger" onclick="deleteMessage('${message._id}')">Delete</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    // Function to add a new product
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const productData = Object.fromEntries(formData.entries());
        productData.price = parseFloat(productData.price);

        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            if (response.ok) {
                alert('Product added successfully!');
                addProductForm.reset();
                fetchProducts(); // Refresh product list
                showSection('products'); // Go back to product list
            } else {
                const errorData = await response.json();
                alert(`Error adding product: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        }
    });

    // Global functions for actions (called from inline onclick for simplicity, can be refactored)
    window.markProductSoldOut = async (id, isSoldOut) => {
        const method = 'PATCH';
        const endpoint = isSoldOut ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products/${id}/soldout`;
        const body = isSoldOut ? JSON.stringify({ isSoldOut: false }) : null; // If marking available, send isSoldOut: false

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
            if (response.ok) {
                alert(`Product marked ${isSoldOut ? 'available' : 'sold out'} successfully!`);
                fetchProducts();
            } else {
                const errorData = await response.json();
                alert(`Error updating product: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An error occurred while updating the product.');
        }
    };

    window.deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Product deleted successfully!');
                fetchProducts();
            } else {
                const errorData = await response.json();
                alert(`Error deleting product: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product.');
        }
    };

    window.markMessageRead = async (id, isRead) => {
        const method = 'PATCH';
        const endpoint = isRead ? `${API_BASE_URL}/messages/${id}` : `${API_BASE_URL}/messages/${id}/read`;
        const body = isRead ? JSON.stringify({ isRead: false }) : null; // If marking unread, send isRead: false

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
            if (response.ok) {
                alert(`Message marked ${isRead ? 'unread' : 'read'} successfully!`);
                fetchMessages();
            } else {
                const errorData = await response.json();
                alert(`Error updating message: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating message:', error);
            alert('An error occurred while updating the message.');
        }
    };

    window.markMessageReplied = async (id, isReplied) => {
        const method = 'PATCH';
        const endpoint = isReplied ? `${API_BASE_URL}/messages/${id}` : `${API_BASE_URL}/messages/${id}/replied`;
        const body = isReplied ? JSON.stringify({ replied: false }) : null; // If marking unreplied, send replied: false

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
            if (response.ok) {
                alert(`Message marked ${isReplied ? 'unreplied' : 'replied'} successfully!`);
                fetchMessages();
            } else {
                const errorData = await response.json();
                alert(`Error updating message: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating message:', error);
            alert('An error occurred while updating the message.');
        }
    };

    window.deleteMessage = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Message deleted successfully!');
                fetchMessages();
            } else {
                const errorData = await response.json();
                alert(`Error deleting message: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('An error occurred while deleting the message.');
        }
    };

    // Initial data load
    fetchProducts();
    fetchMessages();
});

function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}
