export interface VillaAmenities {
  generalComfort?: string[];
  outdoorRecreation?: string[];
  kitchenDining?: string[];
  technologyEntertainment?: string[];
  specialFeatures?: string[];
}

export interface HouseRules {
  checkInTime: string;
  checkOutTime: string;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  commercialPhotographyAllowed: boolean;
  smokingAllowed: boolean;
  quietHours?: string;
  poolRules?: string;
  cleaningFee?: string;
}

export interface CustomPricing {
  date: string;
  price: number;
  label?: string;
}

export interface VillaPricing {
  weekday: number;
  weekend: number;
  halfDay: number;
}