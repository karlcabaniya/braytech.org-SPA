import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import Button from '../../UI/Button';
import { bookCovers } from '../../../utils/destinyEnums';
import { checklists, lookup } from '../../../utils/checklists';
import nodes from '../../../data/lowlines/maps/nodes';

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
    const item = checklist && checklist.items && checklist.items.length && checklist.items[0];

    const extras = nodes && nodes.find(d => d[type.key] === item[type.key]);
    const screenshot = extras && extras.screenshot;
    const description = extras && extras.description;

    const locatedActivityName = item.activityHash && manifest.DestinyActivityDefinition[item.activityHash] && manifest.DestinyActivityDefinition[item.activityHash].displayProperties && manifest.DestinyActivityDefinition[item.activityHash].displayProperties.name;

    console.log(checklist, item);

    return (
      <div className='control inspector acrylic'>
        <div className='header'>
          <div>
            {item.formatted.name}
            {item.formatted.suffix ? ` ${item.formatted.suffix}` : null}
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
