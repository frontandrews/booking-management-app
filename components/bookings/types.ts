export interface Booking {
  id: number;
  propertyId: number;
  name: string;
  startDate: string;
  endDate: string;
  pricePerDay: string;
}

export type Day = Date;

export interface BookingViewProps {
  bookings?: Booking[];
}

export interface Property {
  id?: number;
  name: string;
  location: string;
}
