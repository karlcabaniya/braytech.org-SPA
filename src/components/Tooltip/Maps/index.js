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

function locatedText(type, activityName) {
  if (type === 'lost-sector') {
    return t('Located inside Lost Sector: {{activityName}}', { activityName });
  } else if (type === 'strike') {
    return t('Located inside Strike: {{activityName}}', { activityName });
  } else {
    return t('Located inside activity');
  }
}

class Checklist extends React.Component {
  render() {
    const checklistEntry = lookup({ key: 'checklistHash', value: this.props.hash });

    if (!checklistEntry) {
      console.warn('Hash not found');

      return null;
    }

    const checklist = checklistEntry.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'checklistHash', array: [checklistEntry.checklistHash] } });
    const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

    const extras = cartographer({ key: 'checklistHash', value: checklistItem.checklistHash });
    const screenshot = extras && extras.screenshot;
    const description = extras && extras.description;

    const locatedActivityName = (checklistItem.activityHash && manifest.DestinyActivityDefinition[checklistItem.activityHash]?.displayProperties?.name) || checklistItem.sorts.bubble;

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
            {screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={screenshot} />
              </div>
            ) : null}
            {checklistItem.extended.located ? <div className='inside-location'>{locatedText(checklistItem.extended.located, locatedActivityName)}</div> : null}
            <div className='description'>
              <div className='destination'>{checklistItem.formatted.location}</div>
              {description ? <BungieText className='text' source={description} /> : null}
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

    if (!checklistEntry) {
      console.warn('Hash not found');

      return null;
    }

    const checklist = checklistEntry.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'recordHash', array: [checklistEntry.recordHash] } });
    const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

    const definitionRecord = manifest.DestinyRecordDefinition[checklistItem.recordHash];
    const definitionParentNode = definitionRecord && manifest.DestinyPresentationNodeDefinition[definitionRecord.parentNodeHashes[0]];

    const extras = cartographer({ key: 'recordHash', value: checklistItem.recordHash });
    const screenshot = extras && extras.screenshot;
    const description = extras && extras.description;

    const locatedActivityName = (checklistItem.activityHash && manifest.DestinyActivityDefinition[checklistItem.activityHash]?.displayProperties?.name) || checklistItem.sorts.bubble;

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
            {screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={screenshot} />
              </div>
            ) : null}
            {checklistItem.extended.located ? <div className='inside-location'>{locatedText(checklistItem.extended.located, locatedActivityName)}</div> : null}
            <div className='description'>
              <div className='destination'>{checklistItem.formatted.location}</div>
              {description ? <BungieText className='text' source={description} /> : null}
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
    const node = cartographer({ key: 'nodeHash', value: this.props.hash })

    if (!node) {
      console.warn('Hash not found');

      return null;
    }

    console.log(node)

    const definitionDestination = manifest.DestinyDestinationDefinition[node.location?.destinationHash];
    const definitionPlace = manifest.DestinyPlaceDefinition[definitionDestination?.placeHash];
    const definitionBubble = definitionDestination?.bubbles?.find(b => b.hash === node.location.bubbleHash);

    const destinationName = definitionDestination?.displayProperties?.name;
    const placeName = definitionPlace?.displayProperties?.name && definitionPlace.displayProperties.name !== destinationName && definitionPlace.displayProperties.name;
    const bubbleName = definitionBubble?.displayProperties?.name;

    const locationString = [bubbleName, destinationName, placeName].filter(s => s).join(', ');

    const locatedActivityName = node.location?.within?.activityHash && manifest.DestinyActivityDefinition[node.location.within.activityHash]?.displayProperties?.name;

    const completed = node.related?.objectives?.filter(o => !o.complete).length < 1;

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
            {node.location?.within ? <div className='inside-location'>{locatedText(node.location.within.id, locatedActivityName)}</div> : null}
            <div className='description'>
              <div className='destination'>{locationString}</div>
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
    tooltips: state.tooltips
  };
}

Checklist = connect(mapStateToProps)(Checklist);

Record = connect(mapStateToProps)(Record);

Node = connect(mapStateToProps)(Node);

export { Checklist, Record, Node };
