const mongoose = require('mongoose');
const Restaurant = require('../src/models/Restaurant');
require('dotenv').config();

const fullProjectData = [
    {
        name: "Buffalo Burger",
        cuisine: "Burgers",
        location: "Heliopolis",
        contact: { phone: "19001", email: "orders@buffaloburger.com" },
        isOpen: true,
        menu: [
            { itemName: "Old School", price: 180, category: "Main", available: true },
            { itemName: "Animal Fries", price: 95, category: "Sides", available: true },
            { itemName: "Coca Cola", price: 40, category: "Drinks", available: false }
        ]
    },
    {
        name: "Mori Sushi",
        cuisine: "Japanese",
        location: "Zamalek",
        contact: { phone: "19666", email: "info@mori.com" },
        isOpen: true,
        menu: [
            { itemName: "California Roll", price: 250, category: "Sushi", available: true },
            { itemName: "Miso Soup", price: 80, category: "Appetizers", available: true }
        ]
    }
];

const startFresh = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Restaurant.deleteMany({}); // السطر ده بيمسح كل القديم اللخبطك
        await Restaurant.insertMany(fullProjectData); // بيضيف الداتا الجديدة الكاملة
        console.log("✅ DONE: Database is now full and connected!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
startFresh();