import {
    Page,
    Layout,
    Button,
    Card, TextField,
} from "@shopify/polaris";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";

const CreateProductPage = () => {
    const SET_PRODUCTS = gql`
        mutation createProduct($input: ProductInput!){
          productCreate(input: $input) {
            product{
              title
              description
            }
          }
        }
    `;

    const [mutateData, {loading}] = useMutation(SET_PRODUCTS);
    const [titleInputField, setTitleInputField] = useState(['']);
    const [descriptionInputField, setDescriptionInputField] = useState(['']);
    const handleTitleFieldChange = useCallback((value) => {
        setTitleInputField(value);
    },[]);
    const handleDescriptionFieldChange = useCallback((value) => {
        setDescriptionInputField(value);
    },[]);
    const navigate = useNavigate();
    const location = useLocation();
    const {state} = location;

    // useEffect(() => {
    //     if (searchParams.get('titleValue')) {
    //         setTitleInputField(searchParams.get('titleValue'))
    //     }
    //     if (searchParams.get('descriptionValue')) {
    //         setDescriptionInputField(searchParams.get('descriptionValue'))
    //     }
    // },[searchParams])

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
                        "title": titleInputField,
                        "descriptionHtml": descriptionData
                    }
                }
            });
        }

     const cancelAction = () => {
         navigate('/products', { replace: true })
     }

    if (loading) {
        navigate('/products', { replace: true })
    }

    return (
        <Page>
            <Card
                title="Input product data"
                secondaryFooterActions={[{content: 'Cancel', destructive: true, onAction(){cancelAction()
                    }
                }]}
                primaryFooterAction={{content: 'Save', disabled: titleInputField < 1, onAction(){inputFieldSubmit()
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

export default CreateProductPage;