import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { t, formatTime, BraytechText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import Roster from '../../../components/Roster';
import ObservedImage from '../../../components/ObservedImage';
import ClanBanner from '../../../components/UI/ClanBanner';
import Spinner from '../../../components/UI/Spinner';
import ProgressBar from '../../../components/UI/ProgressBar';
import Checkbox from '../../../components/UI/Checkbox';

import './styles.css';

function BannerPerks(props) {
  const { level } = props;

  const definitionBanner = manifest.DestinyInventoryItemDefinition[684040281];
  const perks =
    definitionBanner &&
    definitionBanner.sockets.socketEntries
      .map((entry, i) => {
        if (definitionBanner.sockets.socketCategories.find(socketCategory => socketCategory.socketCategoryHash === 3898156960) && definitionBanner.sockets.socketCategories.find(socketCategory => socketCategory.socketCategoryHash === 3898156960).socketIndexes.includes(i)) {
          return entry;
        } else {
          return false;
        }
      })
      .filter(t => t);

  return (
    <ul className='banner-perks'>
      {perks.map((perk, i) => {
        const definitionPerk = manifest.DestinyInventoryItemDefinition[perk.singleInitialItemHash];

        return (
          <li key={i} className={cx({ active: level > i + 1 })}>
            <div className='icon'>
              <ObservedImage className='image' src={`https://www.bungie.net${definitionPerk.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{definitionPerk.displayProperties.name}</div>
              <div className='description'>{definitionPerk.displayProperties.description}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

class AboutView extends React.Component {
  state = {
    weeklyRewardState: false
  }

  async componentDidMount() {
    this.mounted = true;
    
    window.scrollTo(0, 0);

    const groupWeeklyRewardState = await bungie.GetClanWeeklyRewardState(this.props.member.data.groups.clan.groupId);

    if (this.mounted && groupWeeklyRewardState && groupWeeklyRewardState.ErrorCode === 1) {
      this.setState({ weeklyRewardState: groupWeeklyRewardState.Response });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { member, groupMembers } = this.props;
    const clan = member.data.groups.clan;

    const clanLevel = clan.clanInfo.d2ClanProgressions[584850370];

    const weeklyClanEngramsDefinition = manifest.DestinyMilestoneDefinition[4253138191].rewards[1064137897].rewardEntries;
    const weeklyRewardState = this.state.weeklyRewardState;

    const rewardState = weeklyRewardState?.rewards?.find(reward => reward.rewardCategoryHash === 1064137897).entries || [];

    return (
      <>
        <div className='module banner'>
          <ClanBanner bannerData={clan.clanInfo.clanBannerData} />
          <Link className='button cta customise' to={`/clan-banner-builder/${clan.clanInfo.clanBannerData.decalBackgroundColorId}/${clan.clanInfo.clanBannerData.decalColorId}/${clan.clanInfo.clanBannerData.decalId}/${clan.clanInfo.clanBannerData.gonfalonColorId}/${clan.clanInfo.clanBannerData.gonfalonDetailColorId}/${clan.clanInfo.clanBannerData.gonfalonDetailId}/${clan.clanInfo.clanBannerData.gonfalonId}/`}>
            <div className='text'>{t('Clan Banner Builder')}</div>
            <i className='segoe-mdl-arrow-right' />
          </Link>
        </div>
        <div className='module about'>
          <div className='name'>{clan.name}</div>
          <div className='members'>
            {t('Founded')} {formatTime(clan.creationDate, 'MMMM YYYY')} / {clan.memberCount} {t('Members')}
          </div>
          <BraytechText className={cx('bio', { 'includes-motto': clan.motto !== '' })} escapeHtml disallowedTypes={['image', 'imageReference']} value={clan.motto !== '' ? `_${clan.motto}_\n\n${clan.about}` : clan.about} escapeValue />
        </div>
        <div className='module progression'>
          <div className='sub-header'>
            <div>{t('Progression')}</div>
          </div>
          {clanLevel.level === clanLevel.levelCap ? <ProgressBar classNames='level-6' progress='1' completionValue='1' description={`${t('Level')} ${clanLevel.level}`} hideCheck hideFraction chunky /> : <ProgressBar progress={clanLevel.progressToNextLevel} completionValue={clanLevel.nextLevelAt} description={`${t('Level')} ${clanLevel.level}`} hideCheck chunky />}
          <h4>{t('Banner Perks')}</h4>
          <BannerPerks level={clanLevel.level} />
          <h4>{t('Engrams')}</h4>
          <ul className='clan-rewards'>
            {rewardState.length ? (
              rewardState.map(reward => (
                <li key={reward.rewardEntryHash}>
                  <Checkbox checked={reward.earned} text={weeklyClanEngramsDefinition[reward.rewardEntryHash].displayProperties.name} />
                </li>
              ))
            ) : (
              <Spinner mini />
            )}
          </ul>
        </div>
        <div className='module roster'>
          <div className='sub-header'>
            <div>{t('Leadership')}</div>
          </div>
          {groupMembers.loading ? <Spinner mini /> : null}
          {!groupMembers.loading && groupMembers.error && groupMembers.members.length < 1 ? <div className='info'>{t('There was a network error')}</div> : null}
          <Roster mini limit='10' filter='admins' />
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
    groupMembers: state.groupMembers,
    viewport: state.viewport
  };
}

export default connect(mapStateToProps)(AboutView);
