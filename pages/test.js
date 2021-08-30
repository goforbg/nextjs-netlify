import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Title, RichText, Button, Grid, Wrapper, Input, Icon, Flex } from '@marketing-toolkit/components';
import { useDebounce, useAsyncFn } from 'react-use';
import { useField, Formik, Field, Form, FormikHelpers } from 'formik';
import { FormattedMessage } from 'react-intl';
import { getFormState } from '../../Form/utils';
import { object as objectValidator, string as stringValidator } from 'yup';
import Select from 'react-select';
import { ProductId, Debtor } from '../../../types';
import { isEmpty, is } from 'ramda';
import { camelizeKeys, decamelizeKeys } from 'humps';
// import { useTheme } from '@marketing-toolkit/hooks';

type ContentWithFormProps = {
  name: string;
  max?: number;
  fieldGroupName: string;
  title: string;
  subtitle: string;
  content: string;
  formEndpoint: string;
  formSubtitle: string;
  formTitle: string;
  productId: ProductId;
};

const initialValues = {
  yourName: '',
  email: '',
  phone: '',
  complaint: '',
  submit_product:'',
  companySearch:''
};

const validationSchema = objectValidator().shape({
  yourName: stringValidator().required(),
  email: stringValidator().email().required(),
  phone: stringValidator().required(),
  companySearch: stringValidator().required(),
});

const ContentWithForm: FC<ContentWithFormProps> = ({
  name="name",
  max = 3,
  title,
  subtitle,
  content,
  formTitle,
  formEndpoint,
  formSubtitle,
  productId,
}) => {

  
// const [field, meta, helpers] = useField({ name });  // Error Comes here
// const { value } = field;
const [formState, setFormState] = useState(getFormState());
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
    
  
  // const suggestStatus = {
  //   max: Boolean(value.length >= max),
  //   idle: Boolean(value.length < max && term.length < 3),
  //   loading: Boolean(value.length < max && suggestState.loading && term.length >= 3),
  //   success: Boolean(value.length < max && !suggestState.loading && term.length >= 3 && !isEmpty(suggest)),
  //   empty: Boolean(
  //     value.length < max && !suggestState.loading && !suggestState.error && term.length >= 3 && isEmpty(suggest),
  //   ),
  //   error: Boolean(value.length < max && !suggestState.loading && term.length >= 3 && suggestState.error),
  // };

  const handleSubmit = async <T extends typeof initialValues>(values: T, helpers: FormikHelpers<T>) => {

    setFormState(getFormState('loading'));
    try {
      console.warn(values);
      setFormState(getFormState('success'));
      helpers.resetForm();
    } catch {
      setFormState(getFormState('error'));
    }
  };
  const handleInputChange = ({ target }) => setTerm(target.value);
  // const handleWindowClick = () => setIsFocus(false);
  const handleInputFocus = () => setIsFocus(true);
  const stopPropagation = (event) => event.stopPropagation();
  
  useEffect(() => {
    setSuggest(term.length >= 3 ? suggestState.value || [] : []);
  }, [suggestState.value]);

  useDebounce(
    () => {
      if (term.length < 3) return setSuggest([]);
      getSuggest({ term });
    },
    200,
    [term],
  );
    console.log(suggestState.value);

  return (
    <Box as="section" py="4xl" px="m">
      <Wrapper size="l">
        <Title as="h3" mb="5xs">
          {title}
        </Title>
        <Title as="h3" fontWeight="normal" mb="3xs" align-items="start">
          {subtitle}
        </Title>
        <Flex as="div" py="4xl" className="form-wrapper">
          <Flex.Item pr="4xl" mb={{ _: 'xl', m: '0' }} className="left-text-wrapper">
            <Grid>
              <RichText html={content} />
            </Grid>
          </Flex.Item>
          <Flex.Item className="form-group-main">
            <Grid>
              <Title as="h5" mb="5xs" className="title">
                {formTitle}
              </Title>
              <Title as="h5" fontWeight="normal" mb="3xs" className="subtitle">
                {formSubtitle}
              </Title>
              <Formik initialValues={{ yourName:'',email:'',phone:'',complaint:'',companySearch:'',submit_product:productId}} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {formik => (
                <Form>
                  <Box mb="m" className="form-group-inner">
                    <TextFields
                      component={Input}
                      type="text"
                      name="yourName"
                      placeholder={<FormattedMessage id="field.name.label" />}
                    />
                  </Box>
                  <Box mb="m" className="form-group-inner">
                    <Fields component={Input}
                      type="email"
                      name="email"
                      placeholder={<FormattedMessage id="field.email.label"  />
                    <Field
                     />}
                    />
                  </Box>
                  <Box mb="m" className="form-group-inner">
                  <Field
                      component={Input}
                      type="text"
                      value={term}
                      name="companySearch"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onClick={stopPropagation}
                      placeholder={<FormattedMessage id="field.company_name.label" />}
                    />
                    
                    {/* <Select  onChange={setSelectedOption} name="select1" options={map} className="select-container" /> */}
                  </Box>
                  {/* <Box mb="m" className="form-group-inner">
                    <Select label="Single select" id="select-two" name="select2" options={map} className="select-container" />
                  </Box> */}
                  <Box mb="m" className="form-group-inner">
                    <Field
                      component={Input}
                      type="text"
                      name="phone"
                      placeholder={<FormattedMessage id="field.phone.label" />}
                    />
                  </Box>
                  <Box mb="m" className="form-group-inner w-100">
                    <Field
                      component={Input}
                      type="textarea"
                      name="complaint"
                      placeholder={<FormattedMessage id="field.complaint.label" />}
                    />
                  </Box>
                  <Field type="hidden" className="form-control" name="submit_product" value={productId} /> 
                  <Button type="submit"  flag>
                    {formState.isLoading && <Icon icon="loader" mr="2xs" isLoading />}
                    <FormattedMessage id="form.submit" />
                  </Button>
                  <input type="hidden" id="dum" name="hiddden" value="ones" />
                  {formState.isError && <Box>Error</Box>}
                  {formState.isSuccess && <Box>Success</Box>}
                </Form>
              </Formik>
            </Grid>
          </Flex.Item>
        </Flex>
      </Wrapper>
    </Box>
  );
};

export default ContentWithForm;
