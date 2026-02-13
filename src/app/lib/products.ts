export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

export const PRODUCTS: Product[] = [
    {
        id: 'p-1',
        name: 'Quantum Sneakers',
        description: 'Levitation technology built-in for the urban explorer.',
        category: 'Footwear',
        price: 199.99,
        image: '👟',
    },
    {
        id: 'p-2',
        name: 'Neon Jacket',
        description: 'Glows in the dark. Perfect for night runners and ravers.',
        category: 'Apparel',
        price: 129.50,
        image: '🧥',
    },
    {
        id: 'p-3',
        name: 'Holo-Watch',
        description: 'Projects time and notifications in mid-air holographic display.',
        category: 'Accessories',
        price: 299.00,
        image: '⌚',
    },
    {
        id: 'p-4',
        name: 'Smart Shades',
        description: 'Augmented reality sunglasses with navigation and stats.',
        category: 'Accessories',
        price: 159.99,
        image: '🕶️',
    },
    {
        id: 'p-5',
        name: 'Zero-G Backpack',
        description: 'Anti-gravity suspension makes heavy loads feel weightless.',
        category: 'Accessories',
        price: 89.95,
        image: '🎒',
    },
    {
        id: 'p-6',
        name: 'Sonic Headphones',
        description: 'Pure silence or pure sound. You choose with neural canceling.',
        category: 'Electronics',
        price: 349.99,
        image: '🎧',
    },
    {
        id: 'p-7',
        name: 'Cyber Deck',
        description: 'Portable workstation for the netrunner on the go.',
        category: 'Electronics',
        price: 1299.00,
        image: '💻',
    },
    {
        id: 'p-8',
        name: 'Plasma Lamp',
        description: 'Old school physics, new school aesthetic.',
        category: 'Home',
        price: 45.00,
        image: '💡',
    },
];
