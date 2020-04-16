import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { debounce } from 'lodash';
import cx from 'classnames';

import { t, BraytechText } from '../../../../../utils/i18n';
import * as voluspa from '../../../../../utils/voluspa';
import Button from '../../../../UI/Button';
import Spinner from '../../../../UI/Spinner';

import './styles.css';

class ProposeChanges extends React.Component {
  state = {};

  static getDerivedStateFromProps(p, s) {
    if (!s.values) {
      return {
        loading: false,
        error: false,
        values: {
          ...p,
          comments: '',
          screenshots: [],
        },
      };
    }

    return null;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_onChange = (e) => {
    const { name, value, files } = e.target;

    if (this.mounted) {
      this.setState((p) => ({
        ...p,
        values: {
          ...p.values,
          [name]: files || value,
        },
      }));
    }
  };

  handler_onSubmit = (e) => {
    e.preventDefault();

    this.post_proposal();
  };

  post_proposal = async () => {
    if (this.mounted) {
      this.setState({
        loading: true,
        error: false,
      });
    }

    const { screenshots, ...rest } = this.state.values;

    try {
      const request = await fetch('https://directus.upliftnaturereserve.com/bt03/items/maps_changes', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer braytech',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...rest }),
      });

      const parent = await request.json();

      console.log(screenshots, parent?.data?.id);

      if (parent.data.id && screenshots) {
        const uploaded = await this.post_screenshots();

        const request = await fetch(`https://directus.upliftnaturereserve.com/bt03/items/maps_changes/${parent.data.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer braytech',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            screenshots: uploaded.map((post) => ({
              directus_files_id: { id: post.data.id },
            })),
          }),
        });

        const response = await request.json();
      }

      if (this.mounted) {
        this.setState({
          loading: false,
          error: false,
        });
      }
    } catch (e) {
      if (this.mounted) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    }
  };

  post_screenshots = async () => {
    const screenshots = Array.from(this.state.values.screenshots);

    try {
      async function postScreenshot(file) {
        const formData = new FormData();
        formData.append('data', file);

        const request = await fetch('https://directus.upliftnaturereserve.com/bt03/files', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer braytech',
          },
          body: formData,
        });

        const response = await request.json();

        if (response) {
          return response;
        } else {
          return false;
        }
      }

      const responses = await Promise.all(screenshots.map((file) => postScreenshot(file)));

      if (responses) return responses;
    } catch (e) {
      if (this.mounted) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    }
  };

  render() {
    const { loading, error, values } = this.state;

    console.log(values);

    return (
      <div className='bungie-auth'>
        <h4>{t('Patreon association')}</h4>
        <div className='patreon'>
          <BraytechText className='text' source={`Some Patreon tiers include rewards in the form of _flair_ which is displayed at the side of your player name.\nEnable display of relevant flair by entering the email associated with your Patreon account.`} />
          <form onSubmit={this.handler_onSubmit}>
            <div className='form'>
              <div className='field'>
                <textarea name='comments' value={values.comments} onChange={this.handler_onChange} />
              </div>
              <input type='file' name='screenshots' accept='image/png' multiple onChange={this.handler_onChange} />
            </div>
            <div className='actions'>
              <div>
                <Button text={t('Cancel')} action={this.props.handler} />
                <Button text={t('Set')} action={this.handler_onSubmit} type='submit' disabled={loading} />
              </div>
              <div>{loading ? <Spinner mini /> : null}</div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProposeChanges;
