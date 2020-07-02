import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { groupBy } from 'lodash';

import { t, BungieText } from '../../../../utils/i18n';
import manifest from '../../../../utils/manifest';
import getVendor from '../../../../utils/getVendor';
import { rebind } from '../../../../store/actions/tooltips';
import { cartographer, findNodeType, locationStrings } from '../../../../utils/maps';
import Items from '../../../Items';
import ObservedImage from '../../../ObservedImage';
import Spinner from '../../../UI/Spinner';
import { Tooltips } from '../../../../svg';

function Vendor(props) {
  const member = useSelector((state) => state.member);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [data, setData] = useState({ loading: false, error: false, response: null });

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setData({ loading: true });
    }

    return () => {
      mounted = false;
    };
  }, [props.vendorHash]);

  useEffect(() => {
    let mounted = true;

    async function request() {
      const response = await getVendor(member.membershipType, member.membershipId, member.characterId, props.vendorHash);

      if (mounted && response?.ErrorCode === 1) {
        setData({ loading: false, error: false, response: response.Response });
      } else if (mounted && response?.ErrorCode) {
        setData({ loading: false, error: response.Message });
      } else {
        setData({ loading: false, error: true });
      }
    }

    if (auth && auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
      request();
    } else {
      setData({ loading: false, error: 'auth' });
    }

    return () => {
      mounted = false;
    };
  }, [member, auth, props.vendorHash]);

  useEffect(() => {
    dispatch(rebind());
  }, [dispatch, data.loading]);

  console.log(member, auth, data);

  const type = findNodeType(props);
  const node = cartographer(type);

  const { destinationString, withinString } = locationStrings(node);

  const definitionVendor = manifest.DestinyVendorDefinition[props.vendorHash];

  const name = definitionVendor.displayProperties?.name || t('Unknown');
  const subTitle = definitionVendor.displayProperties?.subtitle;
  const description = definitionVendor.displayProperties?.description;

  const groupedSales = groupBy(
    data.response
      ? Object.keys(data.response.sales.data)
          .filter((key) => {
            const sale = data.response.sales.data[key];

            // if it's one of those nonsense categories such as redeeming tokens, omit
            if (definitionVendor.displayCategories?.[definitionVendor.itemList?.[sale.vendorItemIndex]?.displayCategoryIndex]?.displayCategoryHash === 3960628832) return false;

            // displayCategoryIndex < 0 ? nah
            if (definitionVendor.itemList?.[sale.vendorItemIndex]?.displayCategoryIndex < 0) return false;

            return true;
          })
          .map((key) => {
            const sale = data.response.sales.data[key];

            return {
              vendorHash: definitionVendor.hash,
              ...sale,
              ...((sale.vendorItemIndex !== undefined && definitionVendor.itemList?.[sale.vendorItemIndex]) || {}),
            };
          })
      : [],
    (sale) => sale.displayCategoryIndex
  );

  return (
    <div className='wrapper'>
      {node.screenshot ? (
        <div className='screenshot'>
          <ObservedImage src={node.screenshot} />
        </div>
      ) : null}
      <div className='header'>
        <div className='icon'>
          <Tooltips.Vendor />
        </div>
        <div className='type'>{subTitle}</div>
        <div className='name'>{name}</div>
        {description ? <BungieText className='description' value={description} /> : null}
      </div>
      {withinString ? <div className='within'>{withinString}</div> : null}
      {destinationString ? <div className='destination'>{destinationString}</div> : null}
      <div className='buffer'>
        {data.loading ? (
          <div className='waiting'>
            <Spinner />
          </div>
        ) : data.response ? (
          definitionVendor.displayCategories.map((category, c) => {
            if (groupedSales[category.index]) {
              return (
                <React.Fragment key={c}>
                  <h4>{category.displayProperties.name}</h4>
                  <ul className='list inventory-items'>
                    <Items items={groupedSales[category.index]} />
                  </ul>
                </React.Fragment>
              );
            } else {
              return null;
            }
          })
        ) : data.error && typeof data.error === 'string' ? (
          <div className='info'>{data.error === 'auth' ? t('Auth.Suggestion.Subtle') : data.error}</div>
        ) : null}
      </div>
    </div>
  );
}

export default Vendor;
