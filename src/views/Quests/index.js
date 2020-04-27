import React from 'react';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t, duration, timestampToDuration, BungieText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import { itemComponents } from '../../utils/destinyItems/itemComponents';
import { ProfileLink, ProfileNavLink } from '../../components/ProfileLink';
import Items from '../../components/Items';
import ObservedImage from '../../components/ObservedImage';
import { NoAuth, DiffProfile } from '../../components/BungieAuth';
import QuestLine from '../../components/QuestLine';
import Spinner from '../../components/UI/Spinner';
import ProgressBar from '../../components/UI/ProgressBar';
import { DestinyKey } from '../../components/UI/Button';
import { Common, Views } from '../../svg';

import './styles.css';

const filterMap = {
  bounties: {
    displayProperties: {
      name: t('Bounties'),
      description: t('BOunties are boring omg bounty simulator'),
    },
  },
  all: {
    displayProperties: {
      name: t('Quests'),
      description: t('All quests'),
    },
  },
  seasonal: {
    displayProperties: {
      name: t('Seasonal'),
      description: t('Quests from the current season'),
      icon: '/static/images/extracts/ui/quests/01E3-06C0.png',
    },
  },
  expansion: {
    displayProperties: {
      name: t('Shadowkeep'),
      description: t('Quests from the latest expansion'),
      icon: '/static/images/extracts/ui/quests/01E3-06CA.png',
    },
  },
  playlists: {
    displayProperties: {
      name: t('Playlists'),
      description: t('Vanguard, Crucible, and Gambit quests'),
      icon: '/static/images/extracts/ui/quests/01E3-06D3.png',
    },
  },
  exotics: {
    displayProperties: {
      name: t('Exotics'),
      description: t('Exotic Gear and Catalyst quests'),
      icon: '/static/images/extracts/ui/quests/01E3-06C5.png',
    },
  },
  past: {
    displayProperties: {
      name: t('The Past'),
      description: t('Quests from past expansions'),
      icon: '/static/images/extracts/ui/quests/01E3-06BB.png',
    },
  },
};

function determineOrder({ filter = 'bounties', variable = 'rarity', order = 'asc' }) {
  if (filter === 'bounties') {
    if (variable === 'rarity') {
      return 'desc';
    } else {
      return order;
    }
  } else if (variable === 'rarity') {
    return 'desc';
  } else {
    return order;
  }
}

class Quests extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  componentDidUpdate(p, s) {
    if (p.hash !== this.props.hash) {
      window.scrollTo(0, 0);

      this.props.rebindTooltips();
    }
  }

  getItems = (items = []) => {
    const { member, viewport } = this.props;
    const filter = this.props.match.params.filter || 'bounties';

    const timestamp = new Date().getTime();

    return items.map((item, i) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
      const definitionBucket = manifest.DestinyInventoryBucketDefinition[item.bucketHash];

      item.itemComponents = itemComponents(item, member);

      const expirationDate = item.itemComponents?.item?.expirationDate;
      const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

      const bucketName = definitionBucket?.displayProperties?.name?.replace(' ', '-').toLowerCase();

      const vendorHash = definitionItem.sourceData?.vendorSources?.length && definitionItem.sourceData.vendorSources[0] && definitionItem.sourceData.vendorSources[0].vendorHash;

      const masterworked = enums.enumerateItemState(item.state).masterworked;
      const tracked = enums.enumerateItemState(item.state).tracked;
      const completed = item.itemComponents?.objectives && item.itemComponents?.objectives.filter((o) => !o.complete).length === 0;
      const expired = !completed && timestamp > timestampExpiry;
      const expiresSoon = !completed && timestamp + 7200 * 1000 > timestampExpiry;

      const objectives = definitionItem.objectives?.objectiveHashes?.map((hash, h) => {
        const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

        const instanceProgressObjective = item.itemComponents?.objectives?.length && item.itemComponents.objectives.find((o) => o.objectiveHash === hash);

        const playerProgress = {
          complete: false,
          progress: 0,
          objectiveHash: definitionObjective.hash,
          ...instanceProgressObjective,
        };

        return <ProgressBar key={h} objectiveHash={definitionObjective.hash} {...playerProgress} />;
      });

      const objectivesProgress =
        (!completed &&
          item.itemComponents?.objectives?.reduce((acc, curr) => {
            return acc + curr.progress;
          }, 0)) ||
        0;
      const objectivesCompletionValue =
        (!completed &&
          item.itemComponents?.objectives?.reduce((acc, curr) => {
            return acc + curr.completionValue;
          }, 0)) ||
        0;

      const element =
        definitionItem.traitIds?.indexOf('inventory_filtering.bounty') > -1 ? (
          viewport.width > 1023 ? (
            <li key={item.itemHash}>
              <ul>
                <li className='col bounty-item'>
                  <ul className='list inventory-items'>
                    <li
                      className={cx(
                        {
                          linked: true,
                          masterworked,
                          tracked,
                          tooltip: true,
                          exotic: definitionItem.inventory?.tierType === 6,
                        },
                        bucketName
                      )}
                      data-hash={item.itemHash}
                      data-instanceid={item.itemInstanceId}
                      data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
                    >
                      <div className='icon'>
                        <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                      </div>
                      {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory?.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
                      {completed ? <div className='completed' /> : null}
                      {expired || expiresSoon ? <div className='expired' /> : null}
                      {!completed ? <ProgressBar objectiveHash={item.itemComponents.objectives[0].objectiveHash} progress={objectivesProgress} completionValue={objectivesCompletionValue} hideCheck /> : null}
                    </li>
                  </ul>
                </li>
                <li className='col bounty-text'>
                  <div className='name'>{definitionItem.displayProperties?.name}</div>
                  <BungieText className='description' value={definitionItem.displayProperties?.description} />
                </li>
                <li className='col objectives'>{objectives}</li>
                <li className='col reward-items'>
                  <ul className='list inventory-items'>
                    <Items items={definitionItem.value?.itemValue?.filter((i) => i.itemHash !== 0)} noBorder hideQuantity />
                  </ul>
                </li>
                <li className='col expires'>
                  <div>{item.itemComponents?.objectives?.length && item.itemComponents.objectives.filter((o) => !o.complete).length > 0 && expirationDate ? timestampExpiry > timestamp ? <>{t('Expires in {{duration}}.', { duration: duration(timestampToDuration(expirationDate), { relative: true }) })}</> : <>{t('Expired.')}</> : null}</div>
                </li>
              </ul>
            </li>
          ) : (
            <li
              className={cx(
                {
                  linked: true,
                  masterworked,
                  tracked,
                  tooltip: true,
                  exotic: definitionItem.inventory?.tierType === 6,
                },
                bucketName
              )}
              data-hash={item.itemHash}
              data-instanceid={item.itemInstanceId}
              data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
            >
              <div className='icon'>
                <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
              </div>
              {tracked ? (
                <div className='track'>
                  <Common.Tracking />
                </div>
              ) : null}
              {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory?.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
              {completed ? <div className='completed' /> : null}
              {expired || expiresSoon ? <div className='expired' /> : null}
              {!completed ? <ProgressBar objectiveHash={item.itemComponents.objectives[0].objectiveHash} progress={objectivesProgress} completionValue={objectivesCompletionValue} hideCheck /> : null}
            </li>
          )
        ) : (
          <li key={item.itemHash} className={cx('linked', { tooltip: viewport.width > 600, exotic: definitionItem.inventory?.tierType === 6 })} data-hash={item.itemHash} data-instanceid={item.itemInstanceId} data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}>
            <ul className='list inventory-items'>
              <li
                key={item.itemHash}
                className={cx(
                  {
                    masterworked,
                    tracked,
                    completed,
                    expired: expired || expiresSoon,
                  },
                  bucketName
                )}
              >
                <div className='icon'>
                  <ObservedImage src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                </div>
                {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory && definitionItem.inventory.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
                {completed ? <div className='completed' /> : null}
                {expired || expiresSoon ? <div className='expired' /> : null}
              </li>
            </ul>
            <div className='text'>
              <div className='name'>{definitionItem.displayProperties.name}</div>
              <BungieText className='description' value={definitionItem.displayProperties.description} singleSentence trim='70' />
            </div>
            {!expired && item.itemComponents?.objectives?.length ? (
              <ProgressBar
                objectiveHash={item.itemComponents?.objectives[0].objectiveHash}
                progress={item.itemComponents?.objectives.reduce((acc, curr) => {
                  return acc + curr.progress;
                }, 0)}
                completionValue={item.itemComponents?.objectives.reduce((acc, curr) => {
                  return acc + curr.completionValue;
                }, 0)}
                hideCheck
                hideFraction
                hideDescription
              />
            ) : null}
            <ProfileLink to={`/quests/${filter}/${item.itemHash}`} />
          </li>
        );

      return {
        ...item,
        sorts: {
          name: definitionItem.displayProperties?.name,
          rarity: definitionItem.inventory?.tierType,
          vendorHash,
          objectives: objectivesProgress / objectivesCompletionValue,
          timestampExpiry: timestampExpiry || 10000 * 10000 * 10000 * 10000,
        },
        element,
      };
    });
  };

  render() {
    const { member, auth, viewport } = this.props;
    const filter = this.props.match.params.filter || 'bounties';
    const variable = this.props.match.params.variable || 'rarity';

    if (!member.data.profile.profileInventory?.data && !auth) {
      return <NoAuth />;
    }

    if (!member.data.profile.profileInventory?.data && auth && !auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
      return <DiffProfile />;
    }

    if (!member.data.profile.profileInventory?.data && auth && auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
      return (
        <div className='view' id='quests'>
          <Spinner />
        </div>
      );
    }

    const inventory = [...member.data.profile.profileInventory.data.items, ...member.data.profile.characterInventories.data[member.characterId].items].filter((item) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) return false;

      if (filter === 'bounties' && definitionItem.traitIds?.indexOf('inventory_filtering.bounty') > -1) {
        return true;
      } else if (filter === 'expansion' && definitionItem.inventory?.tierType && definitionItem.traitIds?.indexOf('quest.current_release') > -1) {
        return true;
      } else if (filter === 'seasonal' && definitionItem.inventory?.tierType && definitionItem.traitIds?.indexOf('quest.seasonal') > -1) {
        return true;
      } else if (filter === 'playlists' && definitionItem.inventory?.tierType && definitionItem.traitIds?.indexOf('quest.playlists') > -1) {
        return true;
      } else if (filter === 'exotics' && definitionItem.inventory?.tierType && definitionItem.traitIds?.indexOf('quest.exotic') > -1) {
        return true;
      } else if (filter === 'past' && definitionItem.inventory?.tierType && definitionItem.traitIds?.indexOf('quest.past') > -1) {
        return true;
      } else if (filter === 'all' && definitionItem.inventory?.tierType && definitionItem.traitIds?.indexOf('inventory_filtering.quest') > -1) {
        return true;
      }

      return false;
    });

    const order = determineOrder(this.props.match.params);

    const items = orderBy(this.getItems(inventory), [(item) => item.sorts[variable], (item) => item.sorts.timestampExpiry, (item) => item.sorts.name], [order, 'desc', 'asc']);

    const inspect = variable && filter !== 'bounties' && items.find((item) => item.itemHash === +variable);

    return (
      <>
        <div className={cx('view', filter, { inspect: inspect })} id='quests'>
          <div className='filter background' />
          <div className='module views'>
            <ul className='list'>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.Bounties />
                </div>
                <ProfileNavLink to='/quests' exact />
              </li>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.All />
                </div>
                <ProfileNavLink to='/quests/all' />
              </li>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.Seasonal />
                </div>
                <ProfileNavLink to='/quests/seasonal' />
              </li>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.Expansion />
                </div>
                <ProfileNavLink to='/quests/expansion' />
              </li>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.Playlists />
                </div>
                <ProfileNavLink to='/quests/playlists' />
              </li>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.Exotics />
                </div>
                <ProfileNavLink to='/quests/exotics' />
              </li>
              <li className='linked'>
                <div className='icon'>
                  <Views.Quests.Past />
                </div>
                <ProfileNavLink to='/quests/past' />
              </li>
            </ul>
          </div>
          {inspect ? <QuestLine item={inspect} /> : null}
          {!inspect ? (
            filter === 'bounties' ? (
              viewport.width > 1023 ? (
                <div className='module'>
                  <ul className='list bounties'>
                    <li className='header'>
                      <ul>
                        <li className={cx('col', 'bounty-item', 'no-sort')} />
                        <li className={cx('col', 'bounty-text', { sort: variable === 'name' })}>
                          <div className='full'>{t('Bounty')}</div>
                          <ProfileLink to={`/quests/bounties/name/${order === 'asc' ? 'desc' : 'asc'}`} />
                        </li>
                        <li className={cx('col', 'objectives', { sort: variable === 'objectives' })}>
                          <div className='full'>{t('Objectives')}</div>
                          <ProfileLink to={`/quests/bounties/objectives/${order === 'asc' ? 'desc' : 'asc'}`} />
                        </li>
                        <li className={cx('col', 'reward-items', 'no-sort')}>
                          <div className='full'>{t('Rewards')}</div>
                        </li>
                        <li className={cx('col', 'expires', { sort: variable === 'timestampExpiry' })}>
                          <div className='full'>{t('Expiry')}</div>
                          <ProfileLink to={`/quests/bounties/timestampExpiry/${order === 'asc' ? 'desc' : 'asc'}`} />
                        </li>
                      </ul>
                    </li>
                    {items.map((item) => item.element)}
                  </ul>
                </div>
              ) : (
                <div className='module'>
                  <ul className='list inventory-items'>{items.map((item) => item.element)}</ul>
                </div>
              )
            ) : (
              <div className='module quests'>
                {items.length ? (
                  <ul className='list quests'>{items.map((item) => item.element)}</ul>
                ) : (
                  <div className='info'>
                    <p>{t("No bounties. Go and see if there's anything you can do for Failsafe. If nothing else, keep her company...")}</p>
                  </div>
                )}
              </div>
            )
          ) : null}
          {!inspect && filter !== 'bounties' ? (
            <div className='module filter description'>
              <div className='icon'>
                <ObservedImage src={filterMap[filter].displayProperties.icon} />
              </div>
              <div className='text'>
                <div className='name'>{filterMap[filter].displayProperties.name}</div>
                <div className='description'>{filterMap[filter].displayProperties.description}</div>
              </div>
              <div className='corners large b' />
            </div>
          ) : null}
        </div>
        {inspect ? (
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <ProfileLink className='button' to={`/quests/${filter}`}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
    viewport: state.viewport,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: (value) => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Quests);
