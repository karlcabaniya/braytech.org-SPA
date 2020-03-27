import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SuspenseRoute, slowImport } from '../App';
import PostmasterCapacity from '../components/Notifications/PostmasterCapacity';

import Archives from '../views/Archives';
import Eververse from '../views/Archives/Eververse';
import Manifest from '../views/Archives/Manifest';
import LastWish from '../views/Archives/LastWish';
import Grimoire from '../views/Archives/Grimoire';

// Lazy components
const Legend = React.lazy(() => slowImport(import('../views/Archives/Legend')));
const ChaliceRecipes = React.lazy(() => slowImport(import('../views/Archives/ChaliceRecipes')));
const ChaliceRecipesDebug = React.lazy(() => slowImport(import('../views/Archives/ChaliceRecipes/Debug')));

class ArchivesRoutes extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <>
        <PostmasterCapacity />
        <Switch>
          <SuspenseRoute path={`${match.url}/legend`} exact component={Legend} />
          <Route path={`${match.url}/eververse`} component={Eververse} />
          <Route path={`${match.url}/manifest`} component={Manifest} />
          <Route path={`${match.url}/last-wish`} component={LastWish} />
          <SuspenseRoute path={`${match.url}/chalice-of-opulence/debug`} exact component={ChaliceRecipesDebug} />
          <SuspenseRoute path={`${match.url}/chalice-of-opulence/:rune1?/:rune2?/:rune3?`} exact component={ChaliceRecipes} />
          <Route path={`${match.url}/grimoire/:cardId?`} exact component={Grimoire} />
          <Route path={`${match.url}`} component={Archives} />
        </Switch>
      </>
    );
  }
}

export default ArchivesRoutes;
