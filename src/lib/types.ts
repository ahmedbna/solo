export interface Location {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  images: string[];
  latitude?: number;
  longitude?: number;
}

export interface Trip {
  _id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  images: string[];
  capacity: number;
  pricePerPerson: number;
  locations: Location[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
  createdAt?: number;
  updatedAt?: number;
}
