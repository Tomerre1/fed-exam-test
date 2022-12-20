import React, { useRef, useEffect, useState } from 'react';
import { Ticket } from '../api';
import { Footer } from './Footer';
import { Labels } from './Labels';
import { ShowMoreOrLess } from './ShowMoreOrLess';

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
      <p ref={ref} className={`content ${toggleShow && 'show-less'}`}>
        {ticket.content}
      </p>
      <ShowMoreOrLess
        setToggleShow={setToggleShow}
        toggleShow={toggleShow}
        isMoreThan3Lines={isMoreThan3Lines}
      />
      <Labels ticket={ticket} />
      <Footer ticket={ticket} />
    </li>
  );
};

export default TicketPreview;
