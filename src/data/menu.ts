export type Size = 'S' | 'M' | 'L' | 'XL' | 'Family' | 'Glass' | 'Can' | 'Bottle' | 'Small Bottle' | 'Large Bottle' | '6 Pack' | '12 Pack';

export interface SizePrice {
  size: Size;
  price: number;
  quantity: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  requiredIngredients?: string[];
  optionalIngredients?: string[];
  isOnSale: boolean;
  salePrice?: number;
  availableSizes?: SizePrice[];
  drinkTypes?: string[];
}

export const menuItems: MenuItem[] = [
  // Pizzas
  {
    id: 1,
    name: "Pepperoni Pizza",
    description: "Classic hand-tossed pizza topped with zesty pepperoni, rich tomato sauce, and melted mozzarella cheese.",
    price: 10,
    category: "Pizza",
    image: "/assets/menu/img/pizza.jpg",
    requiredIngredients: ["Dough", "Tomato Sauce", "Mozzarella Cheese"],
    optionalIngredients: ["Pepperoni", "Oregano", "Chili Flakes"],
    isOnSale: false,
    availableSizes: [
      { size: 'S', price: 8.99, quantity: 1 },
      { size: 'M', price: 10.99, quantity: 1 },
      { size: 'L', price: 12.99, quantity: 1 },
      { size: 'XL', price: 14.99, quantity: 1 },
      { size: 'Family', price: 24.99, quantity: 1 }
    ]
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Authentic Neapolitan-style pizza with fresh tomatoes, creamy mozzarella, and fresh basil.",
    price: 9,
    category: "Pizza",
    image: "/assets/menu/img/margherita.jpg",
    requiredIngredients: ["Dough", "Tomato Sauce", "Mozzarella Cheese"],
    optionalIngredients: ["Fresh Basil", "Olive Oil"],
    isOnSale: true,
    salePrice: 7.99,
    availableSizes: [
      { size: 'S', price: 7, quantity: 1 },
      { size: 'M', price: 9, quantity: 1 },
      { size: 'L', price: 11, quantity: 1 },
      { size: 'XL', price: 13, quantity: 1 },
      { size: 'Family', price: 17, quantity: 1 }
    ]
  },
  {
    id: 3,
    name: "Hawaiian Pizza",
    description: "Sweet and savory combination of ham, pineapple, and mozzarella cheese on a tomato sauce base.",
    price: 11,
    category: "Pizza",
    image: "/assets/menu/img/hawaiian.jpg",
    requiredIngredients: ["Dough", "Tomato Sauce", "Mozzarella Cheese"],
    optionalIngredients: ["Ham", "Pineapple", "Bacon"],
    isOnSale: false,
    availableSizes: [
      { size: 'S', price: 9, quantity: 1 },
      { size: 'M', price: 11, quantity: 1 },
      { size: 'L', price: 13, quantity: 1 },
      { size: 'XL', price: 15, quantity: 1 },
      { size: 'Family', price: 19, quantity: 1 }
    ]
  },
  {
    id: 4,
    name: "BBQ Chicken Pizza",
    description: "Tender chicken pieces, red onions, and mozzarella cheese on a BBQ sauce base.",
    price: 12,
    category: "Pizza",
    image: "/assets/menu/img/bbqchicken.jpg",
    requiredIngredients: ["Dough", "BBQ Sauce", "Mozzarella Cheese"],
    optionalIngredients: ["Chicken", "Red Onion", "Cilantro"],
    isOnSale: false,
    availableSizes: [
      { size: 'S', price: 10, quantity: 1 },
      { size: 'M', price: 12, quantity: 1 },
      { size: 'L', price: 14, quantity: 1 },
      { size: 'XL', price: 16, quantity: 1 },
      { size: 'Family', price: 20, quantity: 1 }
    ]
  },

  // Burgers
  {
    id: 5,
    name: "Classic Burger",
    description: "Juicy grilled beef patty with fresh lettuce, tomatoes, onions, pickles, and our special house sauce.",
    price: 8,
    category: "Burgers",
    image: "/assets/menu/img/classicburger.jpg",
    requiredIngredients: ["Beef Patty", "Bun"],
    optionalIngredients: ["Lettuce", "Tomato", "Onion", "Pickles", "Special Sauce"],
    isOnSale: false
  },
  {
    id: 6,
    name: "Cheeseburger",
    description: "Classic burger topped with melted cheddar cheese, lettuce, tomato, and our special sauce.",
    price: 9,
    category: "Burgers",
    image: "/assets/menu/img/cheeseburger.jpg",
    requiredIngredients: ["Beef Patty", "Bun", "Cheddar Cheese"],
    optionalIngredients: ["Lettuce", "Tomato", "Onion", "Pickles", "Special Sauce"],
    isOnSale: false
  },
  {
    id: 7,
    name: "Bacon Burger",
    description: "Premium beef patty with crispy bacon, cheddar cheese, and our signature BBQ sauce.",
    price: 10,
    category: "Burgers",
    image: "/assets/menu/img/baconburger.jpg",
    requiredIngredients: ["Beef Patty", "Bun", "Bacon"],
    optionalIngredients: ["Cheddar Cheese", "Lettuce", "Tomato", "BBQ Sauce"],
    isOnSale: false
  },

  // Appetizers
  {
    id: 8,
    name: "Chicken Wings",
    description: "Golden-fried chicken wings served with your choice of buffalo, BBQ, or garlic parmesan sauce.",
    price: 12,
    category: "Appetizers",
    image: "/assets/menu/img/wings.jpg",
    requiredIngredients: ["Chicken Wings"],
    optionalIngredients: ["Buffalo Sauce", "BBQ Sauce", "Garlic Parmesan"],
    isOnSale: false
  },
  {
    id: 9,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella sticks served with marinara sauce.",
    price: 7,
    category: "Appetizers",
    image: "/assets/menu/img/mozzarellasticks.jpg",
    requiredIngredients: ["Mozzarella Cheese", "Bread Crumbs"],
    optionalIngredients: ["Marinara Sauce", "Parmesan"],
    isOnSale: false
  },
  {
    id: 10,
    name: "Garlic Bread",
    description: "Freshly baked bread topped with garlic butter and herbs.",
    price: 5,
    category: "Appetizers",
    image: "/assets/menu/img/garlicbread.jpg",
    requiredIngredients: ["Bread", "Garlic Butter"],
    optionalIngredients: ["Parmesan", "Parsley"],
    isOnSale: false
  },

  // Sides
  {
    id: 11,
    name: "French Fries",
    description: "Crispy golden potato fries seasoned with sea salt.",
    price: 4,
    category: "Sides",
    image: "/assets/menu/img/fries.jpg",
    requiredIngredients: ["Potatoes", "Oil"],
    optionalIngredients: ["Sea Salt", "Cheese Sauce", "Ketchup"],
    isOnSale: false,
    availableSizes: [
      { size: 'S', price: 3, quantity: 1 },
      { size: 'M', price: 4, quantity: 1 },
      { size: 'L', price: 5, quantity: 1 }
    ]
  },
  {
    id: 12,
    name: "Onion Rings",
    description: "Crispy battered onion rings served with BBQ sauce.",
    price: 5,
    category: "Sides",
    image: "/assets/menu/img/onionrings.jpg",
    requiredIngredients: ["Onions", "Batter"],
    optionalIngredients: ["BBQ Sauce", "Ketchup"],
    isOnSale: false
  },
  {
    id: 13,
    name: "Coleslaw",
    description: "Fresh cabbage and carrot slaw with our special dressing.",
    price: 3,
    category: "Sides",
    image: "/assets/menu/img/coleslaw.jpg",
    requiredIngredients: ["Cabbage", "Carrots", "Dressing"],
    optionalIngredients: ["Parsley"],
    isOnSale: false
  },

  // Drinks
  {
    id: 14,
    name: "Soft Drinks",
    description: "Choose your favorite soft drink and size.",
    price: 2,
    category: "Drinks",
    image: "/assets/menu/img/softdrinks.jpg",
    isOnSale: false,
    availableSizes: [
      { size: 'Glass', price: 2.00, quantity: 1 },
      { size: 'Can', price: 2.50, quantity: 1 },
    ],
    drinkTypes: [
      "Pepsi",
      "Diet Pepsi",
      "7UP",
      "Miranda",
      "Coca-Cola",
      "Diet Coke",
      "Sprite",
      "Fanta",
      "Mountain Dew"
    ]
  },
  {
    id: 15,
    name: "Bottled Water",
    description: "Pure spring water.",
    price: 1,
    category: "Drinks",
    image: "/assets/menu/img/water.jpg",
    isOnSale: false,
    availableSizes: [
      { size: 'Small Bottle', price: 1.50, quantity: 1 },
      { size: 'Large Bottle', price: 2.50, quantity: 1 },
    ]
  },
  {
    id: 16,
    name: "Iced Tea",
    description: "Refreshing iced tea with lemon.",
    price: 2.5,
    category: "Drinks",
    image: "/assets/menu/img/icedtea.jpg",
    isOnSale: false,
    availableSizes: [
      { size: 'Glass', price: 2, quantity: 1 },
      { size: 'Bottle', price: 3, quantity: 1 },
      { size: 'Glass', price: 10, quantity: 6 },
      { size: 'Bottle', price: 15, quantity: 6 },
      { size: 'Glass', price: 18, quantity: 12 },
      { size: 'Bottle', price: 28, quantity: 12 }
    ]
  }
];

export const categories = [
  "Pizza",
  "Burgers",
  "Appetizers",
  "Sides",
  "Pasta",
  "Salads",
  "Desserts",
  "Drinks",
];
