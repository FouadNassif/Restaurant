export interface Offer {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  items: number[];
  isOnSale: boolean;
  salePrice?: number;
}

export const offers: Offer[] = [
  {
    id: 1,
    name: "Family Pizza Night",
    description: "Two large pizzas of your choice, garlic bread, and a 2L soft drink.",
    price: 35,
    image: "/assets/menu/img/familydeal.jpg",
    items: [1, 2, 3, 4, 10, 14],
    isOnSale: true,
    salePrice: 29.99
  },
  {
    id: 2,
    name: "Burger Combo",
    description: "Any burger, fries, and a soft drink.",
    price: 12,
    image: "/assets/menu/img/burgercombo.jpg",
    items: [5, 6, 7, 11, 14],
    isOnSale: false
  },
  {
    id: 3,
    name: "Appetizer Platter",
    description: "Chicken wings, mozzarella sticks, and onion rings with dipping sauces.",
    price: 20,
    image: "/assets/menu/img/appetizerplatter.jpg",
    items: [8, 9, 12],
    isOnSale: true,
    salePrice: 17.99
  },
  {
    id: 4,
    name: "Pizza & Wings Combo",
    description: "One large pizza of your choice and 12 chicken wings.",
    price: 25,
    image: "/assets/menu/img/pizzawings.jpg",
    items: [1, 2, 3, 4, 8],
    isOnSale: false
  },
  {
    id: 5,
    name: "Weekend Special",
    description: "Two burgers, two sides, and two soft drinks.",
    price: 28,
    image: "/assets/menu/img/weekendspecial.jpg",
    items: [5, 6, 7, 11, 12, 14],
    isOnSale: true,
    salePrice: 24.99
  },
  {
    id: 6,
    name: "Student Deal",
    description: "One pizza, one side, and one soft drink.",
    price: 15,
    image: "/assets/menu/img/studentdeal.jpg",
    items: [1, 2, 3, 4, 11, 12, 14],
    isOnSale: false
  }
];
