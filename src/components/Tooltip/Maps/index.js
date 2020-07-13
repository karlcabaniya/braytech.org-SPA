import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t, BungieText, unavailableString } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import { bookCovers } from '../../../utils/destinyEnums';
import { checklists, checkup } from '../../../utils/checklists';
import { cartographer, locationStrings } from '../../../utils/maps';

import './styles.css';

class Checklist extends React.Component {
  render() {
    const checklistEntry = checkup({ key: 'checklistHash', value: this.props.hash });

    const checklist = checklistEntry?.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'checklistHash', array: [checklistEntry.checklistHash] } });
    const checklistItem = checklist?.items?.[0];

    if (!checklistEntry || !checklistItem) {
      console.warn('Hash not found');

      return null;
    }

    const node = cartographer({ key: 'checklistHash', value: checklistItem.checklistHash, bubbleHash: this.props.bubblehash && +this.props.bubblehash });

    const { destinationString, withinString } = locationStrings(node);

    return (
      <>
        <div className='acrylic' />
        <div className='frame map checklist'>
          <div className='header'>
            <div className='icon'>{checklist.checklistIcon}</div>
            <div className='text'>
              <div className='name'>
                {checklistItem.displayProperties.name}
                {checklistItem.displayProperties.suffix ? ` ${checklistItem.displayProperties.suffix}` : null}
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
            {node.extended?.unavailable ? <div className='highlight major'>{unavailableString(node.extended.unavailable)}</div> : null}
            {checklistItem.completed ? <div className='completed'>{t('Discovered_singular')}</div> : null}
            {withinString ? <div className='within'>{withinString}</div> : null}
            <div className='description'>
              <div className='destination'>{destinationString}</div>
              {node.displayProperties?.description ? <BungieText className='text' source={node.displayProperties.description} /> : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}

class Record extends React.Component {
  render() {
    const checklistEntry = checkup({ key: 'recordHash', value: this.props.hash });

    const checklist = checklistEntry?.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'recordHash', array: [checklistEntry.recordHash] } });
    const checklistItem = checklist?.items?.[0];

    if (!checklistEntry || !checklistItem) {
      console.warn('Hash not found');

      return null;
    }

    const definitionRecord = manifest.DestinyRecordDefinition[checklistItem.recordHash];
    const definitionParentNode = definitionRecord && manifest.DestinyPresentationNodeDefinition[definitionRecord.parentNodeHashes[0]];

    const node = cartographer({ key: 'recordHash', value: checklistItem.recordHash });
    const { destinationString, withinString } = locationStrings(node);

    return (
      <>
        <div className='acrylic' />
        <div className='frame map record lore'>
          <div className='header'>
            <div className='icon'>{checklist.checklistIcon}</div>
            <div className='text'>
              <div className='name'>
                {checklistItem.displayProperties.name}
                {checklistItem.displayProperties.suffix ? ` ${checklistItem.displayProperties.suffix}` : null}
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
            {node.extended?.unavailable ? <div className='highlight major'>{unavailableString(node.extended.unavailable)}</div> : null}
            {checklistItem.completed ? <div className='completed'>{t('Discovered_singular')}</div> : null}
            {withinString ? <div className='within'>{withinString}</div> : null}
            <div className='description'>
              <div className='destination'>{destinationString}</div>
              {node.displayProperties?.description ? <BungieText className='text' source={node.displayProperties.description} /> : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}

class Node extends React.Component {
  render() {
    const node = cartographer({ key: 'nodeHash', value: this.props.hash });

    if (!node) {
      console.warn('Hash not found');

      return null;
    }

    const { destinationString, withinString } = locationStrings(node);

    const completed = node.related?.objectives?.filter((o) => !o.complete).length < 1;

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'map', node.nodeType)}>
          <div className='header'>
            <div className='icon'>{node.icon || null}</div>
            <div className='text'>
              <div className='name'>{node.displayProperties?.name}</div>
              <div>
                <div className='kind'>{node.type?.name}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            {node.screenshot ? (
              <div className='screenshot'>
                <ObservedImage src={node.screenshot} />
              </div>
            ) : null}
            {node.extended?.unavailable ? <div className='highlight major'>{unavailableString(node.extended.unavailable)}</div> : null}
            {completed ? <div className='completed'>{t('Completed')}</div> : null}
            {withinString ? <div className='within'>{withinString}</div> : null}
            <div className='description'>
              <div className='destination'>{destinationString}</div>
              {node.displayProperties?.description ? <BungieText className='text' source={node.displayProperties.description} /> : null}
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
