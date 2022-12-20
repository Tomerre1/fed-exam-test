import React from 'react';

export const ShowMoreOrLess = ({
  isMoreThan3Lines,
  toggleShow,
  setToggleShow,
}: {
  isMoreThan3Lines: Boolean;
  toggleShow: Boolean;
  setToggleShow: Function;
}) => {
  return isMoreThan3Lines ? (
    <span onClick={() => setToggleShow(!toggleShow)}>
      {toggleShow ? 'Show Less' : 'Show More'}
    </span>
  ) : (
    <></>
  );
};
