import React from 'react';
import { Ticket } from '../api';

export const Labels = ({ ticket }: { ticket: Ticket }) => {
  return (
    <div className='labels'>
      {ticket.labels &&
        ticket.labels.map((label, index) => (
          <label key={label + index} className='label'>
            {label}
          </label>
        ))}
    </div>
  );
};
