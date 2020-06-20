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
  }

  helper_windowMouseMove = (e) => {
    if (!this.helper_checkIfTargetExists()) {
      this.resetState();
    }

    if ((this.state.data.toggle && !e.currentTarget?.dataset?.hash)) {
      return;
    }

    const offset = 0;
    const tooltipWidth = 440;
    const tooltipHeight = this.state.hash ? this.ref_tooltip.current.clientHeight : 0;
    const scrollbarAllowance = 24;
    let x = 0;
    let y = 0;

    x = e.clientX;
    y = e.clientY - (tooltipHeight >= 320 ? 140 : 0);

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

  helper_targetMouseEnter = (e) => {
    if (e.currentTarget.dataset.hash) {
      this.doSetState(e);

      this.helper_windowMouseMove(e);
    }
  };

  helper_targetMouseLeave = (e) => {
    window.cancelAnimationFrame(this.rAF);

    this.resetState();
  };

  helper_targetTouchStart = (e) => {
    this.touchPosition = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  };

  helper_targetTouchMove = (e) => {};

  helper_targetTouchEnd = (e) => {
    const drag = e?.changedTouches?.length
      ? // there are changed touches so we'll do some math and check if there's movement
        !(e.changedTouches[0].clientX - this.touchPosition.x === 0 && e.changedTouches[0].clientY - this.touchPosition.y === 0)
      : // no changed touches -> proceed
        false;

    if (!drag) {
      if (e.currentTarget.dataset.hash) {
        this.doSetState(e);
      }
    }
  };

  helper_tooltipTouchStart = (e) => {
    this.touchPosition = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  };

  helper_tooltipTouchMove = (e) => {};

  helper_tooltipTouchEnd = (e) => {
    e.preventDefault();

    const drag = e?.changedTouches?.length
      ? // there are changed touches so we'll do some math and check if there's movement
        !(e.changedTouches[0].clientX - this.touchPosition.x === 0 && e.changedTouches[0].clientY - this.touchPosition.y === 0)
      : // no changed touches -> proceed
        false;

    if (!drag) {
      this.resetState();
    }
  };

  helper_targetMouseUp = (e) => {
    // code for if I ever decide to enable toggle tooltips on desktop again
    // if (e.currentTarget.dataset.hash) {
    //   this.doSetState(e);

    //   this.helper_windowMouseMove(e);
    // }
  };

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
  }

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

  bind_TooltipItem = (reset) => {
    if (reset || !this.helper_checkIfTargetExists()) {
      this.resetState();
    }

    const targets = document.querySelectorAll('.tooltip');

    targets.forEach((target) => {
      // code for if I ever decide to enable toggle tooltips on desktop again
      // if (target.dataset.toggle) {
      //   target.addEventListener('mouseup', this.helper_targetMouseUp);
      // } else {
      target.addEventListener('touchstart', this.helper_targetTouchStart);
      target.addEventListener('touchmove', this.helper_targetTouchMove);
      target.addEventListener('touchend', this.helper_targetTouchEnd);
      target.addEventListener('mouseenter', this.helper_targetMouseEnter);
      target.addEventListener('mouseleave', this.helper_targetMouseLeave);
    });
  };

  bind_Tooltip = () => {
    this.ref_tooltip.current.addEventListener('touchstart', this.helper_tooltipTouchStart);
    this.ref_tooltip.current.addEventListener('touchmove', this.helper_tooltipTouchMove);
    this.ref_tooltip.current.addEventListener('touchend', this.helper_tooltipTouchEnd);
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
      if (this.state.table === 'DestinyActivityDefinition') Tooltip = Activity;
      if (this.state.table === 'DestinyVendorDefinition') Tooltip = Vendor;
      if (this.state.table === 'DestinyChecklistDefinition') Tooltip = Checklist;
      if (this.state.table === 'DestinyRecordDefinition') Tooltip = Record;
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
