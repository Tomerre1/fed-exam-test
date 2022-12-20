import React from 'react';
import { Ticket } from '../api';
export const Footer = ({ ticket }: { ticket: Ticket }) => {
  return (
    <footer>
      <div className='meta-data'>
        By {ticket.userEmail} |{new Date(ticket.creationTime).toLocaleString()}
      </div>
    </footer>
  );
};
