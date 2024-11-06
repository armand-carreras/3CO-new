export interface Product {
    creatorID: string;
    name: string;
    image: string; //base64 string
    shopName: string;
    shopLocation: string;
    categories: 'Electronics' | 'Cosmetics' | 'Industry' | 'Building' | 'Matresses' | 'Global' | 'Food' | 'Chemicals' | 'Energy';
    description: string;
    rating: number;
    reviews?: string[];
}

