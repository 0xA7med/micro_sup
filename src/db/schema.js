import { db } from './database';
// Initialize database with default admin user if not exists
db.users.count().then(count => {
    if (count === 0) {
        db.users.add({
            username: 'admin',
            password: 'admin123',
            fullName: 'مدير النظام',
            role: 'admin',
            createdAt: new Date()
        });
    }
});
export default db;
