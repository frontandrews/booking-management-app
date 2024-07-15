import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BookingForm from './booking-form';
import { Plus } from 'lucide-react';

interface BookingDialogProps {
  bookingId?: number;
  buttonClassName?: string;
  children?: ReactNode;
}

export function BookingDialog({
  bookingId,
  buttonClassName,
  children,
}: BookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          <div className={buttonClassName} onClick={() => setIsOpen(true)}>
            {children}
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className={`ml-2 ${buttonClassName}`}
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Reservation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] pb-6">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle>
            {bookingId ? 'Edit Reservation' : 'New Reservation'}
          </DialogTitle>
        </DialogHeader>
        <BookingForm bookingId={bookingId} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
