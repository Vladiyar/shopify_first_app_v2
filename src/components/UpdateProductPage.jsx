import {
    Page,
    Layout,
    Button,
    Card, TextField,
} from "@shopify/polaris";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";

const UpdateProductPage = () => {
    const SET_PRODUCTS = gql`
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              title
              description
            }
            userErrors {
              field
              message
            }
          }
        }
    `;

    const [mutateData, {loading}] = useMutation(SET_PRODUCTS);
    // const [getData, {loadingQuery}] = useLazyQuery(SET_PRODUCTS);
    const [searchParams, setSearchParams] = useSearchParams({titleValue: '', descriptionValue: ''});
    const [titleInputField, setTitleInputField] = useState('');
    const [descriptionInputField, setDescriptionInputField] = useState('');
    const handleTitleFieldChange = useCallback((value) => setTitleInputField(value),[]);
    const handleDescriptionFieldChange = useCallback((value) => setDescriptionInputField(value),[]);
    const navigate = useNavigate();
    const location = useLocation();
    const {state} = location;

    console.log(state)
    useEffect(() => {
        setTitleInputField(state.title)
        setDescriptionInputField(state.description)
    }, [state])

    // const createMemo = () => {
    //     state ? setSearchParams({titleValue: state.title, descriptionValue: state.description}): null
    //     return Object.fromEntries(searchParams)
    // }

    // const memoParams = useMemo(() => createMemo(), [titleInputField, descriptionInputField])
    //

    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const inputFieldSubmit = () => {
        let descriptionData = descriptionInputField;
        if (descriptionInputField.length > 1) {
            descriptionData = 'Product description'
        }

        mutateData({
            variables: {
                "input": {
                    "id": state.id,
                        "title": titleInputField,
                        "descriptionHtml": descriptionData
                }
            }
        });
    }


    const cancelAction = () => {
        navigate('/products', { state: state})
    }

    if (loading) {
        navigate('/products', { state: state})
    }

    return (
        <Page>
            <Card
                title="Input product data"
                secondaryFooterActions={[{content: 'Cancel', destructive: true, onAction(){cancelAction()
                    }
                }]}
                primaryFooterAction={{
                    content: 'Save',
                    disabled: (titleInputField === state.title || titleInputField < 1) && (descriptionInputField === state.description),
                    onAction(){inputFieldSubmit()
                    }
                }}
            >
                <Card.Section>
                    <TextField
                        label="Product title"
                        value={titleInputField}
                        onChange={handleTitleFieldChange}
                        maxLength={20}
                        autoComplete="off"
                        showCharacterCount
                    />
                    <TextField
                        label="Product description"
                        multiline={true}
                        maxHeight={300}
                        value={descriptionInputField}
                        onChange={handleDescriptionFieldChange}
                        maxLength={80}
                        autoComplete="off"
                        showCharacterCount
                    />
                </Card.Section>
            </Card>
        </Page>
    );
};

export default UpdateProductPage;
