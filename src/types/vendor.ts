export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  isPopular?: boolean;
}

export interface WaitTimeReport {
  time: string;       // ISO string timestamp
  waitTime: number;   // wait time in minutes
  userId: string;     // anonymous user ID who reported
}

export interface VisitData {
  hour: number;       // 0-23 hour of day
  day: number;        // 0-6 day of week (0 = Sunday)
  count: number;      // number of visitors
}

export interface Vendor {
  id: number;
  name: string;
  description: string;
  type: string;
  rating: number;
  openHours: string;
  location: {
    lat: number;
    lng: number;
  };
  photos?: string[];
  menu?: MenuItem[];
  waitTimeReports?: WaitTimeReport[];
  visitData?: VisitData[];
  currentWaitTime?: number; // Current calculated wait time in minutes
} 