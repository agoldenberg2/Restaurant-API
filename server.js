// Import packages, initialize an express app, and define the port you will use

const express = require("express");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;

app.use(express.json());

// Logging Middleware
const logger = (req, res, next) => {
  console.log("----- Incoming Request -----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Time:", new Date().toISOString());

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Body:", req.body);
  }

  console.log("----------------------------");
  next();
};

app.use(logger);

// Validation Middleware
const validateMenuItem = [
  body("name").isString().isLength({ min: 3 }),
  body("description").isString().isLength({ min: 10 }),
  body("price").isFloat({ gt: 0 }),
  body("category").isIn(["appetizer", "entree", "dessert", "beverage"]),
  body("ingredients").isArray({ min: 1 }),
  body("available").optional().isBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Define routes and implement middleware here

app.get("/api/menu", (req, res) => {
  res.status(200).json(menuItems);
});

// GET /api/menu/:id - Retrieve a specific menu item by ID
app.get("/api/menu/:id", (req, res) => {
  const item = menuItems.find(
    menuItem => menuItem.id === parseInt(req.params.id)
  );

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.status(200).json(item);
});

// POST /api/menu - Add a new menu item
app.post("/api/menu", validateMenuItem, (req, res) => {
  const newItem = {
    id: menuItems.length + 1,
    ...req.body,
    available: req.body.available ?? true
  };

  menuItems.push(newItem);

  res.status(201).json(newItem);
});

// PUT /api/menu/:id - Update an existing menu item by ID
app.put("/api/menu/:id", validateMenuItem, (req, res) => {
  const index = menuItems.findIndex(
    menuItem => menuItem.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  menuItems[index] = {
    id: parseInt(req.params.id),
    ...req.body
  };

  res.status(200).json(menuItems[index]);
});

// DELETE /api/menu/:id - Remove a menu item by ID
app.delete("/api/menu/:id", (req, res) => {
  const index = menuItems.findIndex(
    menuItem => menuItem.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  menuItems.splice(index, 1);

  res.status(200).json({ message: "Menu item deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
