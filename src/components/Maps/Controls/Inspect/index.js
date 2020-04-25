import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { t, BungieText, withinString as makeWithinString } from '../../../../utils/i18n';
import manifest from '../../../../utils/manifest';
import ObservedImage from '../../../ObservedImage';
import Records from '../../../Records';
import Button from '../../../UI/Button';
import { bookCovers } from '../../../../utils/destinyEnums';
import { checklists, checkup } from '../../../../utils/checklists';
import { cartographer } from '../../../../utils/maps';

import ProposeChanges from './ProposeChanges';

import './styles.css';

function findNodeType({ checklistHash, recordHash, nodeHash, activityHash }) {
  if (checklistHash) {
    return {
      key: 'checklistHash',
      value: checklistHash,
    };
  } else if (recordHash) {
    return {
      key: 'recordHash',
      value: recordHash,
    };
  } else if (nodeHash) {
    return {
      key: 'nodeHash',
      value: nodeHash,
    };
  } else if (activityHash) {
    return {
      key: 'activityHash',
      value: activityHash,
    };
  }
}

function locationStrings({ activityHash, destinationHash, bubbleHash, map, extended }) {
  const definitionActivity = manifest.DestinyActivityDefinition[activityHash];
  const definitionDestination = manifest.DestinyDestinationDefinition[destinationHash];
  const definitionPlace = manifest.DestinyPlaceDefinition[definitionDestination?.placeHash];
  const definitionBubble = definitionDestination?.bubbles?.find((bubble) => bubble.hash === (extended?.bubbleHash || bubbleHash));

  const destinationName = definitionDestination?.displayProperties?.name;
  const placeName = definitionPlace?.displayProperties?.name && definitionPlace.displayProperties.name !== destinationName && definitionPlace.displayProperties.name;
  const bubbleName = definitionBubble?.displayProperties?.name;

  const destinationString = [bubbleName, destinationName, placeName].filter((string) => string).join(', ');

  const within = map?.in;
  const withinName = within === 'ascendant-challenge' ? bubbleName : (within && definitionActivity?.displayProperties?.name) || bubbleName;

  return {
    destinationString,
    withinString: within && makeWithinString(within, withinName),
  };
}

function unify(props) {
  const type = findNodeType(props);
  const node = cartographer(type);

  console.log(node);

  if (type.key === 'checklistHash' || type.key === 'recordHash') {
    const { destinationString, withinString } = locationStrings(node);
    const definitionActivity = manifest.DestinyActivityDefinition[node.activityHash];

    const checklistItem = node.checklist?.items?.[0];

    return {
      ...node,
      related: {
        ...node.related,
        records: [...(node.related?.records || []), { recordHash: checklistItem.recordHash }].filter((record) => record.recordHash),
      },
      displayProperties: {
        // from the cartographer
        ...node.displayProperties,
        // pre-prepared checklist name/suffix
        name: `${checklistItem?.displayProperties.name}${checklistItem?.displayProperties.suffix ? ` ${checklistItem.displayProperties.suffix}` : ``}`,
        // adventure name/description overrude from activity definition
        ...(node.checklist?.checklistId === 4178338182 ? definitionActivity?.originalDisplayProperties || definitionActivity?.displayProperties : {}),
      },
      type: {
        ...type,
        name: node.checklist?.presentationNodeHash ? t('Record') : node.checklist?.checklistItemName,
      },
      destinationString,
      withinString,
    };
  } else if (type.key === 'nodeHash') {
    const { destinationString, withinString } = locationStrings(node);

    return {
      ...node,
      destinationString,
      withinString,
    };
  } else if (type.key === 'activityHash') {
    const { destinationString, withinString } = locationStrings(node);
    const definitionActivity = manifest.DestinyActivityDefinition[type.value];

    return {
      ...node,
      related: {
        ...node.related,
        records: [...(node.related?.records || []), ...(node.checklist?.items?.filter((checklistItem) => checklistItem.recordHash).map((checklistItem) => ({ recordHash: checklistItem.recordHash })) || [])],
      },
      displayProperties: definitionActivity.originalDisplayProperties || definitionActivity.displayProperties,
      type: {
        ...type,
        name: manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash]?.displayProperties.name,
      },
      screenshot: `https://www.bungie.net${definitionActivity.pgcrImage}`,
      activityLightLevel: definitionActivity.activityLightLevel,
      destinationString,
      withinString,
    };
  } else {
    return {
      displayProperties: {},
      type: {
        ...type,
      },
    };
  }
}

class Inspect extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {}

  render() {
    const unified = unify(this.props);

    console.log(unified);

    return (
      <div className='control inspector acrylic'>
        <div className='close'>
          <Button action={this.props.handler}>
            <i className='segoe-uniE8BB' />
          </Button>
        </div>
        <div className='wrapper'>
          <div className='screenshot'>{unified.screenshot ? <ObservedImage src={unified.screenshot} /> : <div className='info'>{t('Screenshot unavailable')}</div>}</div>
          <div className='header'>
            {unified.checklist?.checklistIcon || unified.icon ? <div className='icon'>{unified.checklist?.checklistIcon || unified.icon}</div> : null}
            <div className='type'>{unified.type?.name}</div>
            <div className='name'>{unified.displayProperties?.name}</div>
            {unified.displayProperties?.description ? <BungieText className='description' source={unified.displayProperties.description} /> : null}
          </div>
          {unified.withinString ? <div className='within'>{unified.withinString}</div> : null}
          {unified.destinationString ? <div className='destination'>{unified.destinationString}</div> : null}
          {unified.extended?.video ? (
            <div className='video'>
              <div className='text'>{t('This node has an associated video')}</div>
              <a className='button' rel='noreferrer noopener' href={unified.extended.video} target='_blank'>
                <div className='text'>{t('View video')}</div>
              </a>
            </div>
          ) : null}
          <div className={cx({ buffer: unified.related?.records.length || unified.extended?.instructions })}>
            {unified.extended?.instructions ? (
              <>
                <h4>{t('Instructions')}</h4>
                <BungieText className='description instructions' source={unified.extended.instructions} />
              </>
            ) : null}
            {unified.related?.records.length ? (
              <>
                <h4>{t('Triumphs')}</h4>
                <ul className='list record-items'>
                  <Records selfLinkFrom={this.props.location.pathname} hashes={unified.related.records.map((record) => record.recordHash)} ordered />
                </ul>
              </>
            ) : null}
          </div>
          <ProposeChanges key={unified.nodeHash || unified.checklistHash || unified.recordHash} nodeHash={unified.nodeHash} checklistHash={unified.checklistHash} recordHash={unified.recordHash} description={unified.displayProperties?.description} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    viewport: state.viewport,
    settings: state.maps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: (value) => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    },
  };
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Inspect);
