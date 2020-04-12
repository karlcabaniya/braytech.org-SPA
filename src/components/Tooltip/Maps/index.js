import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import { bookCovers } from '../../../utils/destinyEnums';
import { checklists, lookup } from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';

import './styles.css';

function foundInText(type, activityName) {
  if (type === 'lost-sector') {
    return t('Found within Lost Sector: {{activityName}}', { activityName });
  } else if (type === 'strike') {
    return t('Found within Strike: {{activityName}}', { activityName });
  } else if (type === 'story') {
    return t('Found within Story: {{activityName}}', { activityName });
  } else {
    return t('Found within activity');
  }
}

class Checklist extends React.Component {
  render() {
    const checklistEntry = lookup({ key: 'checklistHash', value: this.props.hash });

    const checklist = checklistEntry?.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'checklistHash', array: [checklistEntry.checklistHash] } });
    const checklistItem = checklist?.items?.[0];

    if (!checklistEntry || !checklistItem) {
      console.warn('Hash not found');

      return null;
    }

    const node = cartographer({ key: 'checklistHash', value: checklistItem.checklistHash });

    const definitionActivity = manifest.DestinyActivityDefinition[checklistItem.activityHash];
    const definitionDestination = manifest.DestinyDestinationDefinition[checklistItem.destinationHash];
    const definitionBubble = definitionDestination?.bubbles?.find((bubble) => bubble.hash === checklistItem.bubbleHash);

    console.log(node, definitionDestination, definitionBubble)

    const locatedActivityName = definitionActivity?.displayProperties.name || definitionBubble?.displayProperties.name;

    return (
      <>
        <div className='acrylic' />
        <div className='frame map checklist'>
          <div className='header'>
            <div className='icon'>{checklist.checklistIcon}</div>
            <div className='text'>
              <div className='name'>
                {checklistItem.formatted.name}
                {checklistItem.formatted.suffix ? ` ${checklistItem.formatted.suffix}` : null}
              </div>
              <div>
                <div className='kind'>{checklist.checklistItemName}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            {node.screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={node.screenshot} />
              </div>
            ) : null}
            {checklistItem.map.in ? <div className='inside-location'>{foundInText(checklistItem.map.in, locatedActivityName)}</div> : null}
            <div className='description'>
              <div className='destination'>{checklistItem.formatted.location}</div>
              {node.description ? <BungieText className='text' source={node.description} /> : null}
            </div>
            {checklistItem.completed ? <div className='completed'>{t('Discovered_singular')}</div> : null}
          </div>
        </div>
      </>
    );
  }
}

class Record extends React.Component {
  render() {
    const checklistEntry = lookup({ key: 'recordHash', value: this.props.hash });

    const checklist = checklistEntry?.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'recordHash', array: [checklistEntry.recordHash] } });
    const checklistItem = checklist?.items?.[0];

    if (!checklistEntry || !checklistItem) {
      console.warn('Hash not found');

      return null;
    }

    const definitionRecord = manifest.DestinyRecordDefinition[checklistItem.recordHash];
    const definitionParentNode = definitionRecord && manifest.DestinyPresentationNodeDefinition[definitionRecord.parentNodeHashes[0]];

    const node = cartographer({ key: 'recordHash', value: checklistItem.recordHash });

    const definitionActivity = manifest.DestinyActivityDefinition[checklistItem.activityHash];
    const definitionDestination = manifest.DestinyDestinationDefinition[checklistItem.destinationHash];
    const definitionBubble = definitionDestination?.bubbles?.find((bubble) => bubble.hash === checklistItem.bubbleHash);

    const locatedActivityName = definitionActivity?.displayProperties.name || definitionBubble?.displayProperties.name;

    return (
      <>
        <div className='acrylic' />
        <div className='frame map record lore'>
          <div className='header'>
            <div className='icon'>{checklist.checklistIcon}</div>
            <div className='text'>
              <div className='name'>
                {checklistItem.formatted.name}
                {checklistItem.formatted.suffix ? ` ${checklistItem.formatted.suffix}` : null}
              </div>
              <div>
                <div className='kind'>{t('Record')}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            {definitionParentNode ? (
              <div className='book'>
                <div className='cover'>
                  <ObservedImage className='image' src={`/static/images/extracts/books/${bookCovers[definitionParentNode.hash]}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionParentNode.displayProperties.name}</div>
                  <div className='kind'>{t('Book')}</div>
                </div>
              </div>
            ) : null}
            {node.screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={node.screenshot} />
              </div>
            ) : null}
            {checklistItem.map.in ? <div className='inside-location'>{foundInText(checklistItem.map.in, locatedActivityName)}</div> : null}
            <div className='description'>
              <div className='destination'>{checklistItem.formatted.location}</div>
              {node.description ? <BungieText className='text' source={node.description} /> : null}
            </div>
            {checklistItem.completed ? <div className='completed'>{t('Discovered_singular')}</div> : null}
          </div>
        </div>
      </>
    );
  }
}

class Node extends React.Component {
  render() {
    const node = cartographer({ key: 'nodeHash', value: this.props.hash }, this.props.member);

    if (!node) {
      console.warn('Hash not found');

      return null;
    }

    const definitionDestination = manifest.DestinyDestinationDefinition[node.destinationHash];
    const definitionPlace = manifest.DestinyPlaceDefinition[definitionDestination?.placeHash];
    const definitionBubble = definitionDestination?.bubbles?.find((b) => b.hash === node.bubbleHash);

    const destinationName = definitionDestination?.displayProperties?.name;
    const placeName = definitionPlace?.displayProperties?.name && definitionPlace.displayProperties.name !== destinationName && definitionPlace.displayProperties.name;
    const bubbleName = definitionBubble?.displayProperties?.name;

    const destination = [bubbleName, destinationName, placeName].filter((string) => string).join(', ');

    const locatedActivityName = node.map?.in && manifest.DestinyActivityDefinition[node.activityHash]?.displayProperties?.name;

    const completed = node.related?.objectives?.filter((o) => !o.complete).length < 1;

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'map', node.type.hash)}>
          <div className='header'>
            <div className='icon'>{node.icon || null}</div>
            <div className='text'>
              <div className='name'>{node.displayProperties.name}</div>
              <div>
                <div className='kind'>{node.type.name}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            {node.screenshot ? (
              <div className='screenshot'>
                <ObservedImage src={node.screenshot} />
              </div>
            ) : null}
            {node.map?.in ? <div className='inside-location'>{foundInText(node.within.id, locatedActivityName)}</div> : null}
            <div className='description'>
              <div className='destination'>{destination}</div>
              {node.displayProperties.description ? <BungieText className='text' source={node.displayProperties.description} /> : null}
            </div>
            {node.availability?.type === 'cycle' ? (
              <div className='highlight'>
                {t('Available')}: {t('every {{numberWeeks}} weeks', { numberWeeks: node.availability.cycleLength })}
              </div>
            ) : null}
            {node.activityLightLevel ? (
              <div className='highlight recommended-light'>
                {t('Recommended light')}: <span>{node.activityLightLevel}</span>
              </div>
            ) : null}
            {completed ? <div className='completed'>{t('Completed')}</div> : null}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips,
  };
}

Checklist = connect(mapStateToProps)(Checklist);

Record = connect(mapStateToProps)(Record);

Node = connect(mapStateToProps)(Node);

export { Checklist, Record, Node };
