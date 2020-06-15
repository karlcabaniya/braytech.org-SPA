import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

function BuildProfileLink(props) {
  const { to, className, children, component, member, onClick, isActive, exact } = props;
  const LinkComponent = component || Link;

  const pathname = typeof to === 'object' ? to.pathname : to;
  const state = typeof to === 'object' ? to.state : false;

  if (neverProfileLinks.filter((path) => pathname.indexOf(path) > -1).length) {
    return (
      <LinkComponent className={className} to={{ pathname, state: state || undefined }} onClick={onClick || null} {...(LinkComponent === NavLink ? { isActive, exact } : null)}>
        {children}
      </LinkComponent>
    );
  }

  const memberPrefix = member.characterId ? `/${member.membershipType}/${member.membershipId}/${member.characterId}` : '';

  return (
    <LinkComponent className={className} to={{ pathname: `${memberPrefix}${pathname}`, state: state || undefined }} onClick={onClick || null} {...(LinkComponent === NavLink ? { isActive, exact } : null)}>
      {children}
    </LinkComponent>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
  };
}

export const ProfileLink = connect(mapStateToProps)(BuildProfileLink);

function BuildProfileNavLink(props) {
  return <ProfileLink {...props} component={NavLink} />;
}

export const ProfileNavLink = BuildProfileNavLink;

// https://reacttraining.com/react-router/web/api/NavLink/isactive-func



// //.filter((v) => (perViewRouteVisibility[utils.pathSubDir(location)] ? (!v.hidden ? perViewRouteVisibility[utils.pathSubDir(location)].indexOf(v.path) > -1 : true) : true))

// const perViewRouteVisibility = {
//   maps: ['/checklists', '/maps', '/quests', '/settings'],
// };


export const neverProfileLinks = ['/maps', '/vaulted'];
