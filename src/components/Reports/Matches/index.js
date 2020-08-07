import React from 'react';
import { connect } from 'react-redux';
import { orderBy, isEqual, flattenDepth } from 'lodash';

import { t } from '../../../utils/i18n';
import { GetActivityHistory } from '../../../utils/bungie';
import getPGCR from '../../../utils/getPGCR';

import Spinner from '../../UI/Spinner';
import Button from '../../UI/Button';
import TimeTilRefresh from '../../UI/TimeTilRefresh';

import PGCR from '../PGCR';

import './styles.css';

class Matches extends React.Component {
  state = {
    loading: false,
    cacheState: {},
    instances: [],
  };

  cacheMachine = async (mode, characterId) => {
    const { member, auth, pgcr, limit = 15, offset = 0 } = this.props;

    const charactersIds = characterId ? [characterId] : member.data.profile.characters.data.map((c) => c.characterId);

    const requests = charactersIds.map(async (c) => {
      const response = await GetActivityHistory({
        params: {
          membershipType: member.membershipType,
          membershipId: member.membershipId,
          characterId: c,
          count: limit,
          mode,
          page: offset,
        },
        withAuth: Boolean(auth?.destinyMemberships?.find((d) => d.membershipId === member.membershipId)),
      });

      if (response && response.ErrorCode === 1 && response.Response.activities) {
        return response.Response.activities;
      } else {
        throw Error('privacy');
      }
    });

    let activities = await Promise.all(requests);
    activities = flattenDepth(activities, 1);
    activities = orderBy(activities, [(pgcr) => pgcr.period], ['desc']);
    activities = activities.slice();

    if (this.mounted) {
      this.setState((state) => ({
        ...state,
        cacheState: {
          ...state.cacheState,
          [mode || 'all']: activities.length,
        },
        instances: activities.map((a) => a.activityDetails.instanceId),
      }));
    }

    const reports = activities.map(async (activity) => {
      if (pgcr[member.membershipId] && activity && !pgcr[member.membershipId].find((pgcr) => pgcr.activityDetails.instanceId === activity.activityDetails.instanceId)) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else if (!pgcr[member.membershipId] && activity) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else {
        return true;
      }
    });

    return await Promise.all(reports);
  };

  run = async (force) => {
    const { member, mode } = this.props;

    const run = force ? true : !this.state.loading;

    if (run) {
      // console.log('matches refresh start');
      this.running = true;

      if (this.mounted) this.setState({ loading: true });

      try {
        let ignition = mode
          ? await [mode].map((m) => {
              return this.cacheMachine(m, member.characterId);
            })
          : [await this.cacheMachine(false, member.characterId)];

        await Promise.all(ignition);
      } catch (e) {
        if (this.mounted && e.message === 'privacy') this.setState({ loading: false });
      }

      if (this.mounted) this.setState({ loading: false });
      this.running = false;

      // console.log('matches refresh end');
    } else {
      // console.log('matches refresh skipped');
    }
  };

  ref_matches = React.createRef();

  handler_scrollToMatches = (event) => {
    if (this.ref_matches.current) {
      this.ref_matches.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidMount() {
    this.mounted = true;
    this.running = false;

    this.run();
    this.startInterval();
  }

  componentWillUnmount() {
    this.mounted = false;

    this.clearInterval();
  }

  componentDidUpdate(prev) {
    const { member, mode, offset } = this.props;

    if (prev.member.characterId !== member.characterId) {
      this.run(true);
    }

    if (!isEqual(prev.mode, mode)) {
      this.run(true);
    }

    if (!isEqual(prev.offset, offset)) {
      this.run(true);
    }
  }

  startInterval() {
    this.refreshDataInterval = window.setInterval(this.run, 20000);
  }

  clearInterval() {
    window.clearInterval(this.refreshDataInterval);
  }

  render() {
    const { member, pgcr, mode, offset, limit = 15, root } = this.props;

    // get PGCRs for current membership
    let reports = pgcr[member.membershipId] || [];

    // filter available PGCRs and ensure uniqueness
    reports = reports
      .filter((r) => (mode && r.activityDetails.modes.indexOf(mode) > -1) || !mode)
      .filter((pgcr) => this.state.instances.includes(pgcr.activityDetails.instanceId))
      .filter((obj, pos, arr) => arr.map((mapObj) => mapObj.activityDetails.instanceId).indexOf(obj.activityDetails.instanceId) === pos);

    // ensure order
    reports = orderBy(reports, [(pgcr) => pgcr.period], ['desc']);

    return reports.length ? (
      <div ref={this.ref_matches} className='matches'>
        <div className='state'>
          <TimeTilRefresh isLoading={this.state.loading} duration='20s' />
          {this.state.loading ? <Spinner mini /> : null}
        </div>
        <ul className='list reports'>
          {reports.map((r) => (
            <PGCR key={r.activityDetails.instanceId} report={r} />
          ))}
        </ul>
        <div className='pages'>
          <Button classNames='previous' text={t('Previous page')} disabled={this.state.loading ? true : offset > 0 ? false : true} anchor to={`/${member.membershipType}/${member.membershipId}/${member.characterId}${root}/${mode ? mode : '-1'}/${offset - 1}`} action={this.handler_scrollToMatches} />
          <Button classNames='next' text={t('Next page')} disabled={this.state.loading || reports.length < limit} anchor to={`/${member.membershipType}/${member.membershipId}/${member.characterId}${root}/${mode ? mode : '-1'}/${offset + 1}`} action={this.handler_scrollToMatches} />
        </div>
      </div>
    ) : this.state.loading ? (
      <Spinner />
    ) : (
      <div className='matches'>
        <div className='info'>{t('No reports available')}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    member: state.member,
    auth: state.auth,
    pgcr: state.pgcr,
  };
}

export default connect(mapStateToProps)(Matches);
