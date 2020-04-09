import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../../utils/i18n';
import manifest from '../../../../utils/manifest';
import ObservedImage from '../../../ObservedImage';
import Button from '../../../UI/Button';
import { bookCovers } from '../../../../utils/destinyEnums';
import { checklists, lookup } from '../../../../utils/checklists';
import nodes from '../../../../data/maps/nodes';

function findNodeType(checklistHash, recordHash) {
  if (checklistHash) {
    return {
      key: 'checklistHash',
      name: t('Checklist item')
    };
  } else if (recordHash) {
    return {
      key: 'recordHash',
      name: t('Record')
    };
  }
}

function locatedText(type, activityName) {
  if (type === 'lost-sector') {
    return t('Located inside Lost Sector: {{activityName}}', { activityName });
  } else if (type === 'strike') {
    return t('Located inside Strike: {{activityName}}', { activityName });
  } else {
    return t('Located inside activity');
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
    const { checklistId, checklistHash, recordHash } = this.props;
    const type = findNodeType(checklistHash, recordHash);

    const checklist = checklistId && checklists[checklistId]({ requested: { key: type.key, array: [checklistHash || recordHash] } });
    const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

    const extras = nodes && nodes.find(d => d[type.key] === checklistItem[type.key]);
    const screenshot = extras && extras.screenshot;
    const description = extras && extras.description;

    const locatedActivityName = (checklistItem.activityHash && manifest.DestinyActivityDefinition[checklistItem.activityHash]?.displayProperties?.name) || checklistItem.sorts.bubble;

    console.log(checklist, checklistItem);

    return (
      <div className='control inspector acrylic'>
        <div className='header'>
          <div className='text'>
            {checklistItem.formatted.name}
            {checklistItem.formatted.suffix ? ` ${checklistItem.formatted.suffix}` : null}
            <span>{checklist.checklistItemName_plural}</span>
          </div>
          <div>
            <Button className='close' action={this.props.handler}>
              <i className='segoe-uniE8BB' />
            </Button>
          </div>
        </div>
        {screenshot ? (
          <div className='screenshot'>
            <ObservedImage src={screenshot} />
          </div>
        ) : null}
        {checklistItem.extended.located ? <div className='inside-location'>{locatedText(checklistItem.extended.located, locatedActivityName)}</div> : null}
        <div className='location'>{checklistItem.formatted.locationExt}</div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    viewport: state.viewport,
    settings: state.maps
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspect);
