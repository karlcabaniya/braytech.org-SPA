import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { t, BungieText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import { DestinyKey } from '../../components/UI/Button';
import { enumerateRecordState, bookCovers } from '../../utils/destinyEnums';

import './styles.css';

class Read extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: this.props.location.state && this.props.location.state.from ? this.props.location.state.from : false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.kind !== prevProps.match.params.kind) {
      window.scrollTo(0, 0);
    }
  }

  recordState = hash => {
    if (!this.props.member.data) {
      return 0;
    }

    const characterRecords = this.props.member.data.profile.characterRecords.data;
    const profileRecords = this.props.member.data.profile.profileRecords.data.records;
    const characterId = this.props.member.characterId;

    if (profileRecords[hash]) {
      return profileRecords[hash] ? profileRecords[hash].state : 0;
    } else if (characterRecords[characterId].records[hash]) {
      return characterRecords[characterId].records[hash] ? characterRecords[characterId].records[hash].state : 0;
    } else {
      return 0;
    }
  };

  render() {
    const { kind, hash } = this.props.match.params;

    const definitionParent = kind === 'book' ? manifest.DestinyPresentationNodeDefinition[hash] : manifest.DestinyPresentationNodeDefinition[manifest.DestinyRecordDefinition[hash].parentNodeHashes[0]];
    const definitionRecord = manifest.DestinyRecordDefinition[hash];
    const definitionLore = definitionRecord?.loreHash && manifest.DestinyLoreDefinition[definitionRecord.loreHash];

    return (
      <>
        <div className={cx('view', 'dark', kind)} id='read'>
          <div className='bg' />
          <div className='wrap'>
            <div className='flair left' />
            <div className='flair right' />
            <div className={cx('page-name', { null: !definitionLore?.displayProperties.name })}>
              <span className='quote-l' />
              <span>{definitionLore?.displayProperties.name}</span>
              <span className='quote-r' />
            </div>
            <div className='pair'>
              <div className='nav'>
                <div className='sticky'>
                  <div className={cx('display', kind)}>
                    <div className='cover'>
                      <ObservedImage src={`/static/images/extracts/books/${bookCovers[definitionParent?.hash]}`} />
                    </div>
                    <div className='ui'>
                      <div className='book-name'>{definitionParent?.displayProperties.name}</div>
                      <ul className={cx('list', { 'is-root': kind === 'book' })}>
                        <li className='linked'>
                          <div className='text'>{t('All pages')}</div>
                          <Link to={`/read/book/${definitionParent?.hash}`} />
                        </li>
                        <li className='linked'>
                          <span className='destiny-ishtar' />
                          <div className='text'>Ishtar Collective</div>
                          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                          <a href={`https://www.ishtar-collective.net/entries/${definitionRecord ? definitionRecord.loreHash : ''}`} target='_blank' rel='noopener noreferrer' />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='dots' />
                </div>
              </div>
              <div className='content'>
                {kind === 'book' ? (
                  <ul className={cx('list')}>
                    {definitionParent.children.records.map((record, r) => {
                      const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];

                      if (!definitionRecord?.loreHash) {
                        return null;
                      }

                      const state = enumerateRecordState(this.recordState(record.recordHash));

                      return (
                        <li key={r} className={cx('linked')}>
                          <Link to={`/read/record/${record.recordHash}`}>{!state.recordRedeemed ? '???' : definitionRecord.displayProperties.name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : kind === 'record' ? (
                  <BungieText className='text' value={definitionLore.displayProperties.description} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {kind === 'record' || this.state.from ? (
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                {kind === 'record' ? (
                  <li>
                    <Link className='button' to={`/read/book/${definitionParent?.hash}`}>
                      <DestinyKey type='more' />
                      {t('All pages')}
                    </Link>
                  </li>
                ) : null}
                {this.state.from ? (
                  <li>
                    <Link className='button' to={this.state.from}>
                      <DestinyKey type='dismiss' />
                      {t('Dismiss')}
                    </Link>
                  </li>
                ) : null}
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
    theme: state.theme,
    member: state.member
  };
}

export default connect(mapStateToProps)(Read);
