export const CAR_BRANDS = [
  "Audi", "BMW", "Bentley", "Bugatti", "Cadillac", "Chevrolet",
  "Ferrari", "Ford", "GMC", "Honda", "Hyundai", "Infiniti",
  "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus",
  "Lincoln", "Maserati", "Mazda", "McLaren", "Mercedes-Benz",
  "Mitsubishi", "Nissan", "Porsche", "RAM", "Range Rover",
  "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

export const CAR_MODELS: Record<string, string[]> = {
  "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "M2", "M3", "M4", "M5", "M8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "iX", "i4", "i7"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "G-Class", "EQS", "EQE"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "RS3", "RS4", "RS5", "RS6", "RS7", "R8", "TT", "e-tron"],
  "Porsche": ["911", "911 Turbo", "911 Turbo S", "Cayenne", "Macan", "Panamera", "Taycan", "718 Boxster", "718 Cayman"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "Land Cruiser 200", "Land Cruiser 300", "Prado", "RAV4", "Hilux", "Fortuner", "Sequoia", "Tundra", "4Runner"],
  "Nissan": ["Altima", "Armada", "GT-R", "Maxima", "Murano", "Patrol", "Pathfinder", "Rogue", "Sentra", "Titan", "370Z", "400Z"],
  "Lexus": ["ES", "GS", "GX", "IS", "LC", "LS", "LX", "NX", "RX", "UX", "LFA"],
  "Ferrari": ["296 GTB", "296 GTS", "488", "812", "F8", "Roma", "SF90", "Portofino", "Purosangue"],
  "Lamborghini": ["Aventador", "Huracan", "Urus", "Revuelto"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Silver Shadow", "Spectre", "Wraith"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne"],
  "Jeep": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wrangler"],
  "GMC": ["Acadia", "Canyon", "Envoy", "Sierra", "Terrain", "Yukon"],
  "Chevrolet": ["Blazer", "Camaro", "Colorado", "Corvette", "Equinox", "Silverado", "Suburban", "Tahoe", "Traverse"],
  "Ford": ["Bronco", "Edge", "Escape", "Expedition", "Explorer", "F-150", "Mustang", "Ranger"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
  "Maserati": ["Ghibli", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"],
  "McLaren": ["570S", "600LT", "720S", "765LT", "Artura", "GT"],
};

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];

export const COUNTRY_SPECS = ["GCC", "Euro", "US", "Japan", "Canada", "Australia", "UK", "Middle East"];

export const VARIANTS: Record<string, string[]> = {
  "BMW": ["Base", "xDrive", "sDrive", "M Sport", "M Package", "Competition"],
  "Mercedes-Benz": ["Base", "AMG Line", "AMG", "4MATIC", "Night Package"],
  "Porsche": ["Base", "S", "GTS", "Turbo", "Turbo S", "4S"],
  "default": ["Base", "Sport", "Luxury", "Premium", "SE", "LE", "XLE", "Limited", "Platinum"],
};

export function getModelsForBrand(brand: string): string[] {
  return CAR_MODELS[brand] || [];
}

export function getVariantsForBrand(brand: string): string[] {
  return VARIANTS[brand] || VARIANTS["default"];
}

export function generateYears(from: number = 1995): number[] {
  const currentYear = new Date().getFullYear() + 1;
  const years: number[] = [];
  for (let y = currentYear; y >= from; y--) {
    years.push(y);
  }
  return years;
}
