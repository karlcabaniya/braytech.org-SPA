import React from 'react';

import { t, BraytechText } from '../../../../../utils/i18n';
import Button from '../../../../UI/Button';
import Spinner from '../../../../UI/Spinner';

import './styles.css';

class ProposeChanges extends React.Component {
  state = {};

  static getDerivedStateFromProps(p, s) {
    if (!s.values) {
      return {
        expanded: false,
        loading: false,
        error: false,
        values: {
          ...p,
          description: '',
          issues: '',
          video: '',
          screenshots: [],
        },
        success: false,
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

  handler_expand = (e) => {
    if (this.mounted) {
      this.setState((p) => ({
        expanded: p.expanded ? false : true,
      }));
    }
  };

  handler_reset = (e) => {
    if (this.mounted) {
      this.setState({
        expanded: false,
        loading: false,
        error: false,
        values: {
          ...this.props,
          description: '',
          issues: '',
          video: '',
          screenshots: [],
        },
        success: false,
      });
    }
  };

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

    const { description, issues, video, screenshots, ...rest } = this.state.values;

    if (description === '' && issues === '' && video === '' && !screenshots.length) {
      return;
    }

    this.post_proposal();
  };

  post_proposal = async () => {
    if (this.mounted) {
      this.setState({
        loading: true,
        error: false,
      });
    }

    const { screenshots, name, ...rest } = this.state.values;

    try {
      const uploaded = await this.post_screenshots();

      if (screenshots.length && !uploaded?.length) {
        throw new Error();
      }

      const request = await fetch('https://directus.upliftnaturereserve.com/bt03/items/maps_changes', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer braytech',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rest,
          friendlyName: name,
          screenshots: uploaded.map((post) => ({
            directus_files_id: { id: post.data.id },
          })),
        }),
      });

      const parent = await request.json();

      // console.log(screenshots, parent?.data?.id);

      if (this.mounted) {
        this.setState({
          loading: false,
          error: false,
          success: true,
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
    if (this.state.values.screenshots?.length < 1) return [];

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

      return false;
    } catch (e) {
      return false;
    }
  };

  render() {
    const { expanded, loading, error, values, success } = this.state;

    if (!expanded) {
      return (
        <div className='propose-changes'>
          <Button text={t('Propose changes')} action={this.handler_expand} />
        </div>
      );
    }

    if (success) {
      return (
        <div className='propose-changes success'>
          <h4>{t('Propose changes')}</h4>
          <BraytechText className='text' source={`Data received`} />
          <Button text='🤙🏼' action={this.handler_reset} />
        </div>
      );
    }

    const screenshots = Array.from(this.state.values.screenshots);

    return (
      <div className='propose-changes expanded'>
        <h4>{t('Propose changes')}</h4>
        <BraytechText className='text' source={t('Maps.ProposeChanges.Description')} />
        <form onSubmit={this.handler_onSubmit}>
          <div className='form'>
            <h5>{t('Description')}</h5>
            <div className='field'>
              <textarea name='description' placeholder={this.props.description || t('Maps.ProposeChanges.Form.Description.Placeholder')} value={values.description} onChange={this.handler_onChange} rows='3' />
            </div>
            <h5>{t('Issues')}</h5>
            <div className='field'>
              <textarea name='issues' placeholder={t('Maps.ProposeChanges.Form.Issues.Placeholder')} value={values.issues} onChange={this.handler_onChange} rows='3' />
            </div>
            <h5>{t('Video')}</h5>
            <div className='field'>
              <input type='text' name='video' placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ' value={values.video} onChange={this.handler_onChange} />
            </div>
            <h5>{t('Screenshots')}</h5>
            <div className='selected-screenshots'>
              <BraytechText className='text' source={t('Maps.ProposeChanges.Form.Screenshots')} />
              <div className='input'>
                <input type='file' name='screenshots' accept='image/png' multiple onChange={this.handler_onChange} id='selected-screenshots' />
                <label className='button' htmlFor='selected-screenshots'>
                  <div className='text'>{t('Select screenshots')}</div>
                </label>
                <div className='value'>
                  <ul>
                    {screenshots.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='actions'>
            <div>
              <Button text={t('Cancel')} action={this.handler_reset} />
              <Button text={t('Submit')} action={this.handler_onSubmit} type='submit' disabled={loading || (values.description === '' && values.issues === '' && values.video === '' && !screenshots.length)} />
            </div>
            <div>{loading ? <Spinner mini /> : null}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default ProposeChanges;
