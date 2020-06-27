import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import './styles.css';

import Item from './Item';
import Activity from './Activity';
import Vendor from './Vendor';
import { Checklist, Record, Node } from './Maps';
import CollectionsBadge from './CollectionsBadge';
import UI from './UI';

class Tooltip extends React.Component {
  state = {
    hash: false,
    table: undefined,
    type: undefined,
    data: {},
  };

  ref_tooltip = React.createRef();

  touchPosition = {
    x: 0,
    y: 0,
  };

  mousePosition = {
    x: 0,
    y: 0,
  };

  rAF = null;
  currentTarget = null;

  doSetState = (e) => {
    this.currentTarget = e.currentTarget;

    this.setState({
      hash: e.currentTarget.dataset.hash,
      table: e.currentTarget.dataset.table,
      type: e.currentTarget.dataset.type,
      data: {
        ...e.currentTarget.dataset,
      },
    });
  };

  resetState = () => {
    this.setState({
      hash: false,
      table: undefined,
      type: undefined,
      data: {},
    });

    this.target = null;

    this.touchPosition = {
      x: 0,
      y: 0,
    };

    this.mousePosition = {
      x: 0,
      y: 0,
    };
  };

  helper_tooltipPositionUpdate = () => {
    if (this.ref_tooltip.current && this.state.hash) {
      this.ref_tooltip.current.style.transform = `translate(${this.mousePosition.x}px, ${this.mousePosition.y}px)`;
    }

    window.requestAnimationFrame(this.helper_tooltipPositionUpdate);
  };

  helper_checkIfTargetExists = () => {
    if (document.body.contains(this.currentTarget)) {
      return true;
    }

    return false;
  };

  helper_windowMouseMove = (e) => {
    if (!this.helper_checkIfTargetExists()) {
      this.resetState();
    }

    const offset = 0;
    const tooltipWidth = 440;
    const tooltipHeight = this.state.hash ? this.ref_tooltip.current.clientHeight : 0;
    const scrollbarAllowance = 24;
    
    let x = e.clientX;
    let y = e.clientY - (tooltipHeight >= 320 ? 140 : 0);

    if (x + tooltipWidth + scrollbarAllowance > (window.innerWidth / 3) * 2 + tooltipWidth) {
      x = x - tooltipWidth - scrollbarAllowance - offset;
    } else {
      x = x + scrollbarAllowance + offset;
    }

    if (y + tooltipHeight + scrollbarAllowance > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - scrollbarAllowance;
    }
    y = y < scrollbarAllowance ? scrollbarAllowance : y;

    this.mousePosition = {
      x,
      y,
    };
  };

  helper_targetPointerUp = (e) => {
    console.log('pointer up', e.pointerType, e);

    // skip tooltip and follow a link maybe
    if (e.currentTarget.dataset.tooltip === 'mouse' && e.pointerType === 'touch') {
      return false;
    }

    if (e.currentTarget.dataset.hash) {
      this.doSetState(e);

      this.helper_windowMouseMove(e);
    }
  };

  helper_targetPointerOver = (e) => {
    // this handler is for mice only
    if (e.pointerType === 'touch') {
      return;
    }

    console.log('pointer over', e.pointerType, e);

    if (e.currentTarget.dataset.hash) {
      this.doSetState(e);

      this.helper_windowMouseMove(e);
    }
  };

  helper_targetPointerOut = (e) => {
    // this handler is for mice only
    if (e.pointerType === 'touch') {
      return;
    }

    console.log('pointer out', e.pointerType, e);

    window.cancelAnimationFrame(this.rAF);

    this.resetState();
  };

  bind_TooltipItem = (reset) => {
    if (reset || !this.helper_checkIfTargetExists()) {
      this.resetState();
    }

    const targets = document.querySelectorAll('.tooltip, [data-tooltip]');

    targets.forEach((target) => {
      // touch
      target.addEventListener('pointerup', this.helper_targetPointerUp);
      // mice
      target.addEventListener('pointerover', this.helper_targetPointerOver);
      target.addEventListener('pointerout', this.helper_targetPointerOut);
    });
  };

  helper_tooltipPointerUp = (e) => {
    console.log('pointer up (tooltip)', e.pointerType, e);

    this.resetState();
  };

  bind_Tooltip = () => {
    this.ref_tooltip.current.addEventListener('pointerup', this.helper_tooltipPointerUp);
  };

  componentDidUpdate(p) {
    if (this.props.tooltips.bindTime !== p.tooltips.bindTime) {
      this.bind_TooltipItem();
    }

    if (this.props.location && p.location.pathname !== this.props.location.pathname) {
      this.bind_TooltipItem(true);
    }

    if (this.props.member.updated !== p.member.updated) {
      this.bind_TooltipItem();
    }

    if (this.state.hash) {
      this.bind_Tooltip();
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.helper_windowMouseMove);
    this.rAF = window.requestAnimationFrame(this.helper_tooltipPositionUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.helper_windowMouseMove);
    window.cancelAnimationFrame(this.rAF);
  }

  render() {
    let Tooltip = Item;

    if (this.state.hash && this.currentTarget) {
      if (this.state.type === 'maps') Tooltip = Node;
      if (this.state.type === 'activity') Tooltip = Activity;
      if (this.state.type === 'checklist') Tooltip = Checklist;
      if (this.state.type === 'record') Tooltip = Record;
      if (this.state.type === 'vendor') Tooltip = Vendor;
      if (this.state.type === 'collections-badge') Tooltip = CollectionsBadge;
      if (['braytech', 'ui', 'modifier', 'stat'].includes(this.state.type)) Tooltip = UI;
    }

    return (
      <div ref={this.ref_tooltip} id='tooltip' className={cx({ visible: this.state.hash, toggle: this.state.data.toggle })}>
        {this.state.hash ? (
          <TooltipErrorBoundary>
            <Tooltip {...this.state.data} />
          </TooltipErrorBoundary>
        ) : null}
      </div>
    );
  }
}

class TooltipErrorBoundary extends React.Component {
  state = { error: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <UI hash='tooltip-error' type='braytech' />;
    }

    return this.props.children;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    tooltips: state.tooltips,
  };
}

export default connect(mapStateToProps)(Tooltip);
