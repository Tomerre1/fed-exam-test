import React from 'react';
import { Ticket } from '../api';
import TicketPreview from './ticketPreview';

export const TicketsList = ({
  tickets,
  onHide,
  hideTicketsIds,
}: {
  tickets: Ticket[];
  onHide: Function;
  hideTicketsIds: string[];
}) => {
  return (
    <ul className='tickets'>
      {tickets.map((ticket: Ticket) => (
        <TicketPreview
          key={ticket.id}
          ticket={ticket}
          onHide={onHide}
          hideTicketsIds={hideTicketsIds}
        />
      ))}
    </ul>
  );
};
