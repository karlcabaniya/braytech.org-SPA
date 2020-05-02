import React from 'react';
import { Link } from 'react-router-dom';

function goToTop() {
  window.scrollTo(0, 0);
}

export function linkHelper(props) {
  const url = new URL(props.href);

  if (url.hostname === window.location.hostname) {
    return (
      <Link className='hyperlink' to={url.pathname} onClick={goToTop}>
        {props.children}
      </Link>
    );
  } else {
    return (
      <a className='hyperlink' href={props.href} target='_blank' rel='noopener noreferrer'>
        {props.children}
      </a>
    );
  }
}

function energyAffinity(string) {
  const Solar = ['solar'];
  const Arc = ['arc'];
  const Void = ['void'];

  if (Solar.indexOf(string.toLowerCase()) > -1) {
    return 'solar';
  }

  if (Arc.indexOf(string.toLowerCase()) > -1) {
    return 'arc';
  }

  if (Void.indexOf(string.toLowerCase()) > -1) {
    return 'void';
  }

  return false;
}

export function wrapEnergy(props) {
  return props.children.split(/\b(\s)/).map((fragment, f) => {
    const affinity = energyAffinity(fragment);

    if (affinity) {
      return (
        <React.Fragment key={f}>
          <span className={`highlight energy-${affinity}`}>{fragment}</span>
        </React.Fragment>
      );
    }

    return <React.Fragment key={f}>{fragment}</React.Fragment>;
  });
}

export const noParagraphs = ['paragraph'];
