import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PropertyForm from './property-form';
import { EllipsisVertical, Plus } from 'lucide-react';

interface PropertyDialogProps {
  propertyId?: number;
}

export function PropertyDialog({ propertyId }: PropertyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {propertyId ? (
          <button className="p-2 border rounded hover:bg-gray-100">
            <EllipsisVertical className="w-4 h-4" />
          </button>
        ) : (
          <Button variant="default" size="sm" className="text-center">
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] pb-6">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle>
            {propertyId ? 'Edit Property' : 'Add Property'}
          </DialogTitle>
        </DialogHeader>
        <PropertyForm propertyId={propertyId} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
