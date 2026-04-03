const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createAdmin() {
    await mongoose.connect('mongodb://localhost/petstore');
    console.log("Connecté à MongoDB.");

    const email = 'admin@pets.com';
    const password = 'password123';

    const db = mongoose.connection.db;
    const users = db.collection('users');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await users.updateOne(
        { email },
        {
            $set: {
                email,
                passwordHash,
                firstName: 'Admin',
                lastName: 'System',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        },
        { upsert: true }
    );

    console.log("Compte administrateur créé / mis à jour avec succès !");
    console.log("Email :", email);
    console.log("Mot de passe :", password);

    mongoose.disconnect();
}

createAdmin().catch(console.error);
