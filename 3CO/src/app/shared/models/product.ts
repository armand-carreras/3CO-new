export interface Product {
    id: string;
    creatorUsername: string;
    name: string;
    image: string; // base64 string
    shopName: string;
    shopLocation: string;
    categories: ProductCategory[];
    description: string;
    rating: number;
    reviews?: Review[];
    shouldTranslate?: boolean;
}

export interface Review {
    id?: string;
    creatorUsername?: string;
    title: string;
    description: string;
    rating: number;
    image?: string; //base64 string
    shouldTranslate?: boolean;
}

export interface ProductPost {
    name: string;
    image: string; //base64    
    shopName: string;
    shopLocation: string;
    categories: ProductCategory[];
    description: string;
}
export type ProductCategory =
    'Electronics'
    | 'Cosmetics'
    | 'Industry'
    | 'Building'
    | 'Matresses'
    | 'Global'
    | 'Food'
    | 'Textile'
    | 'Chemicals'
    | 'Energy'
    | 'Other';