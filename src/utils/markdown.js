import React from 'react';
import { Link } from 'react-router-dom';

import i18n, { Energy } from './i18n';

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
  if (Energy.Solar.indexOf(string.toLowerCase()) > -1) {
    return 'solar';
  }

  if (Energy.Arc.indexOf(string.toLowerCase()) > -1) {
    return 'arc';
  }

  if (Energy.Void.indexOf(string.toLowerCase()) > -1) {
    return 'void';
  }

  return false;
}

export function wrapEnergy(props) {
  const fragments = props.children.split(/\b(\s)/);

  return fragments.map((fragment, f) => {
    const affinity = energyAffinity(fragment);

    const arco = ['it', 'es', 'es-mx', 'pt-br'];
    const damage = ['daño', 'dano'];
    const weapon = ['arma'];
    const supers = ['súper'];
    const grenade = ['granada'];
    const melee = ['cuerpo'];
    const damageCheck = affinity === 'arc' && arco.indexOf(i18n.language) > -1 ? damage.indexOf(fragments[f - 4]) > -1 || weapon.indexOf(fragments[f - 1]) > -1 || supers.indexOf(fragments[f - 4]) > -1 || grenade.indexOf(fragments[f - 4]) > -1 || melee.indexOf(fragments[f - 4]) > -1 : true;

    if (affinity && damageCheck) {
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
