import bcrypt from 'bcryptjs';
const API_URL = 'http://localhost:3001/api';
export async function initAdmin() {
    try {
        // Check if admin exists
        const response = await fetch(`${API_URL}/auth/check-admin`);
        if (!response.ok) {
            throw new Error('Failed to check admin');
        }
        const data = await response.json();
        if (!data.exists) {
            // Create admin if doesn't exist
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const createResponse = await fetch(`${API_URL}/auth/create-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'admin',
                    password: hashedPassword,
                    fullName: 'مدير النظام',
                    role: 'admin',
                }),
            });
            if (!createResponse.ok) {
                throw new Error('Failed to create admin');
            }
        }
    }
    catch (error) {
        console.error('Error checking admin:', error);
    }
}
