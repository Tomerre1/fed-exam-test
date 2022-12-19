import React from 'react';
import { Ticket } from '../api';

const TicketPreview = ({
  ticket,
  onHide,
  hideTicketsIds,
}: {
  ticket: Ticket;
  onHide: Function;
  hideTicketsIds: string[];
}) => {
  const style = hideTicketsIds.includes(ticket.id)
    ? { display: 'none' }
    : { display: 'block' };
  return (
    <li key={ticket.id} className='ticket' style={style}>
      <h5 className='title'>{ticket.title}</h5>
      <button className='hide-ticket' onClick={() => onHide(ticket.id)}>
        Hide
      </button>
      <p>{ticket.content}</p>
      <footer>
        <div className='meta-data'>
          By {ticket.userEmail} |{' '}
          {new Date(ticket.creationTime).toLocaleString()}
        </div>
      </footer>
    </li>
  );
};

export default TicketPreview;
