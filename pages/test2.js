import React, {useEffect, useState} from 'react';
import { useField, Field } from 'formik';
import { useDebounce, useAsyncFn } from 'react-use';
import { isEmpty, is } from 'ramda';
import { camelizeKeys, decamelizeKeys } from 'humps';
import axios from 'axios';
import { Label, Input, Loader, Panel, Link, Icon } from '@marketing/toolkit';
import { ProductId, Debtor } from '../types';
import { FormattedMessage } from 'react-intl';

const SelectField = ({label, max=3, ...props}) => {

    const [field ,meta, helpers] = useField(props)
    
    const { value } = field;
    const [term, setTerm] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [suggestState, getSuggest] = useAsyncFn( async ({term}) => {
        
    const response = await axios.get(`https://api.finqle.dev/factor-scan/company-search?filter[company_name]=${term}`);
        return is(Error, response)
        ? response.statusText
        : camelizeKeys(
            response.data.data.companySearch.map(({ name, registrationNumber }) => ({
            name:name,
            companyNumber: registrationNumber,
            })),
            );
    });
    const [suggest, setSuggest] = useState<Debtor[]>([]);
    const handleInputChange = ({ target }) => setTerm(target.value);
    const handleInputFocus = () => setIsFocus(true);
    const stopPropagation = (event) => event.stopPropagation();
    const handleWindowClick = () => setIsFocus(false);
    const createHandleSuggestItemClick = (company) => () => {
        console.log(value);
        
        const isSelected = value.find((c) => c === company);
        if (!isSelected) {
          setTerm('');
          setIsFocus(false);
          helpers.setValue([...value, company]);
        }
      };
      const createHandleCompanyDelete = (company) => () => {
        const newValue = value.filter((c) => c !== company);
        helpers.setValue(newValue);
      };

    useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
    }, []);
    
    useEffect(() => {
        setSuggest(term.length >= 3 ? suggestState.value || [] : []);
    }, [suggestState.value]);

    useDebounce(
        () => {
        if (value.length >= max || term.length < 3) return setSuggest([]);
        getSuggest({ term });
        },
        200,
        [term],
    );
    const suggestStatus = {
        max: Boolean(value.length >= max),
        idle: Boolean(value.length < max && term.length < 3),
        loading: Boolean(value.length < max && suggestState.loading && term.length >= 3),
        success: Boolean(!suggestState.loading && term.length >= 3 && !isEmpty(suggest)),
        empty: Boolean(value.length < max && !suggestState.loading && !suggestState.error && term.length >= 3 && isEmpty(suggest),
        ),
        error: Boolean(value.length < max && !suggestState.loading && term.length >= 3 && suggestState.error),
    };    
    console.log(isFocus);
    

    return (
        <div>
        {/* {!isEmpty(value) && (
            <ul className="company-select-list">
            {value.map((company, index) => (
                <li key={`${company}-${index}`} >
                <article >
                    <span>{company.name}</span>
                    <Link color="gray-l" onClick={createHandleCompanyDelete(company)}>
                    <Icon icon="close" />
                    </Link>
                </article>
                </li>
            ))}
            </ul>
        )} */}
        <Field {...field} {...props} onChange={handleInputChange} onFocus={handleInputFocus} onClick={stopPropagation} value={term} />
            <Panel size="s" color="white" onClick={stopPropagation} >
              {suggestStatus.idle && (
                <p className="fs-s">
                  <FormattedMessage id="fs.companySearch.suggest.instruction" />
                </p>
              )}
              {suggestStatus.loading && (
                <div className="ta-center">
                  <Loader />
                </div>
              )}
              {suggestStatus.success && (
                <ul className="company-suggest-list">
                  {suggest.map((company, index) => (
                    <li key={`${company.name}-${index}`}>
                      <Link
                        component="button"
                        type="button"
                        onClick={createHandleSuggestItemClick(company)}
                      >
                        {company.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {suggestStatus.empty && (
                <p className="fs-s">
                  <FormattedMessage id="fs.companySearch.suggest.empty" />
                </p>
              )}
              {suggestStatus.error && (
                <p className="fs-s c-error">
                  <FormattedMessage id="fs.companySearch.suggest.error" />
                </p>
              )}
            </Panel>
          </div>
    )
}

export default SelectField;