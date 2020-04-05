import React from 'react';
import { Link } from 'react-router-dom';

function goToTop() {
  window.scrollTo(0, 0);
}

export const linkHelper = props => {
  const url = new URL(props.href);

  if (url.hostname === window.location.hostname) {
    return <Link className='hyperlink' to={url.pathname} onClick={goToTop}>{props.children}</Link>;
  } else {
    return <a className='hyperlink' href={props.href} target='_blank' rel='noopener noreferrer'>{props.children}</a>;
  }
};

export const noParagraphs = ['paragraph'];