const mongoose = require('mongoose');

async function makeAllAdmin() {
    await mongoose.connect('mongodb://localhost/petstore');
    const db = mongoose.connection;

    const result = await db.collection('users').updateMany(
        {},
        { $set: { role: 'admin' } }
    );

    console.log(`Successfully updated ${result.modifiedCount} users to admin role.`);
    process.exit(0);
}

makeAllAdmin().catch(console.error);
