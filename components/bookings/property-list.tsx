import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PropertyDialog } from '@/components/bookings/property-dialog';
import { setSelectedPropertyId } from '@/redux/features/property/slice';
import { fetchBookings } from '@/redux/features/booking/slice';
import { RootState, AppDispatch } from '@/redux/store';
import { cn } from '@/utils';
import { Input } from '../ui/input';

export default function PropertyList() {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector(
    (state: RootState) => state.property.properties,
  );

  const selectedPropertyId = useSelector(
    (state: RootState) => state.property.selectedPropertyId,
  );

  const [searchTerm, setSearchTerm] = useState('');

  const handlePropertyClick = (propertyId: number) => {
    dispatch(setSelectedPropertyId(propertyId));
    dispatch(fetchBookings(propertyId));
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="border p-6">
      <div className="flex justify-between items-center flex-row">
        <h1 className="flex items-center gap-2 text-2xl leading-[0.9] font-semibold leading-6 py-3 lg:py-6">
          Properties{' '}
          <span className="text-sm leading-[0.9] text-gray-500">
            ({filteredProperties.length}/{properties.length})
          </span>
        </h1>
        <div className="pb-3 pt-3 pr-0 lg:pr-4">
          <PropertyDialog />
        </div>
      </div>

      <div className="pb-6 pr-0 lg:pr-4">
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <ul className="h-[200px] lg:h-[390px] overflow-y-auto pr-1.5 lg:pr-2 custom-scroll">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <li
                key={property.id}
                onClick={() => property.id && handlePropertyClick(property.id)}
                className={cn(
                  `flex border justify-between items-center mb-4 p-4 shadow rounded cursor-pointer`,
                  selectedPropertyId === property.id
                    ? 'bg-gray-100 border-'
                    : 'bg-white hover:bg-gray-50',
                )}
              >
                <div>
                  <h2 className="text-xl font-bold">{property.name}</h2>
                  <p>{property.location}</p>
                </div>
                <div className="flex space-x-4">
                  <PropertyDialog propertyId={property.id} />
                </div>
              </li>
            ))
          ) : (
            <p>No results found for the search criteria.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
