export interface Label {
  logo: string;
  name: string;
  establishmentYear: string;
  description: string;
  shortDescription: string;
  category: CATEGORIES;
  subCategory: string;
  country: string;
  keywords: string;
  mainColor: string;
  shape: string;
  conformityAssesment: string;
  managingOrganization: string;
  website: string;
  ranking: string;
};

export type COLOR = (
  'Brown' 
  | 'Black' 
  | 'White' 
  | 'Green' 
  | 'Blue' 
  | 'Red' 
  | 'Purple' 
  | 'Turquoise' 
  | 'Yellow' 
  | 'Orange' 
  | 'Gold' 
  | 'Grey' 
  | undefined
);

export const ColorList: string[] = [
  'Brown' 
  ,'Black' 
  ,'White' 
  ,'Green' 
  ,'Blue' 
  ,'Red' 
  ,'Purple' 
  ,'Turquoise' 
  ,'Yellow' 
  ,'Orange' 
  ,'Gold' 
  ,'Grey'
];

export type CATEGORIES = (
  'Food'
  | 'Electronics'
  | 'All sectors'
  | 'Building products'
  | 'Energy'
  | 'Health care & services'
  | 'Machinery & Equipment'
  | 'Professional, scientific and technical services'
  | 'Tourism'
  | 'Transportation'
  | 'Cleaning products'
  | 'Cosmetics / Personal care'
  | 'Buildings'
  | 'Furniture'
  | 'Waste management & Recycling'
  | 'Forest products / Paper'
  | 'Appliances'
  | 'Packaging'
  | 'Textiles'
  | 'Commodities'
  | 'Carbon'
  | 'Financial services'
  | 'Carbon offsets'
  | 'Other'
  | 'Fish / Fisheries'
  | 'Drinks'
  | 'Feedstocks'
  | 'Non-food products'
  | 'Unknown'
  | 'Water'
  | 'Technical Services'
  | undefined
);