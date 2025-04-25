'use client';

import { Button, Group, Modal } from '@mantine/core';
import { format } from 'date-fns';

type DeleteSlotModalProps = {
  opened: boolean;
  onClose: () => void;
  target: { start: Date; end: Date } | null;
  onConfirm: (data: { date: string; startTime: string; endTime: string }) => void;
};

export default function DeleteSlotModal({
  opened,
  onClose,
  target,
  onConfirm,
}: DeleteSlotModalProps) {
  const handleConfirm = () => {
    if (!target) return;
    const date = target.start.toISOString().split('T')[0];
    const startTime = format(target.start, 'h:mm a');
    const endTime = format(target.end, 'h:mm a');
    onConfirm({ date, startTime, endTime });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Delete Availability?" centered>
      <p>Are you sure you want to delete this slot?</p>
      <Group position="apart" mt="md">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={handleConfirm}>
          Yes, Delete
        </Button>
      </Group>
    </Modal>
  );
}
