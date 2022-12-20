import React, { useRef, useEffect, useState } from 'react';
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
  const ref = useRef<HTMLParagraphElement>(null);
  const [isMoreThan3Lines, setIsMoreThan3Lines] = useState(false);
  const [toggleShow, setToggleShow] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.clientHeight < ref.current.scrollHeight) {
      setIsMoreThan3Lines(true);
    }
  }, [ref]);

  const style = hideTicketsIds.includes(ticket.id)
    ? { display: 'none' }
    : { display: 'block' };

  return (
    <li key={ticket.id} className='ticket' style={style}>
      <h5 className='title'>{ticket.title}</h5>
      <button className='hide-ticket' onClick={() => onHide(ticket.id)}>
        Hide
      </button>
      <p
        ref={ref}
        className={`content ${toggleShow ? 'show-less' : 'show-more'}`}
      >
        {ticket.content}
      </p>
      {isMoreThan3Lines && (
        <span onClick={() => setToggleShow(!toggleShow)}>
          {toggleShow ? 'Show Less' : 'Show More'}
        </span>
      )}
      {ticket?.labels && (
        <div className='labels'>
          {ticket?.labels.map((label, index) => (
            <label key={index} className='label'>
              {label}
            </label>
          ))}
        </div>
      )}
      <footer>
        <div className='meta-data'>
          By {ticket.userEmail} |
          {new Date(ticket.creationTime).toLocaleString()}
        </div>
      </footer>
    </li>
  );
};

export default TicketPreview;
