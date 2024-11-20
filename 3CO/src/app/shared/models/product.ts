export interface Product {
    id: string;
    creatorID: string;
    name: string;
    image: string; // base64 string
    shopName: string;
    shopLocation: string;
    categories: 'Electronics' | 'Cosmetics' | 'Industry' | 'Building' | 'Textile' | 'Mattresses' | 'Global' | 'Food' | 'Chemicals' | 'Energy';
    description: string;
    rating: number;
    reviews?: Review[];
}

export interface Review {
    id: string;
    creatorID: string;
    title: string;
    description: string;
    rating: number;
    image?: string; //base64 string
}
