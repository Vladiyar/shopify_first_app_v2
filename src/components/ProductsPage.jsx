import {useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    Card,
    Filters,
    Page,
    Pagination,
    ResourceItem,
    ResourceList,
    Stack,
    TextField,
    TextStyle,
    Thumbnail
} from "@shopify/polaris";
import {gql, useLazyQuery} from "@apollo/client";
import {Error} from "@shopify/app-bridge/actions";
import {useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";


const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams({sort: 'PUBLISHED_AT', reversed: false, query: '', taggedWith: '', sortSelected: 'Newest update', "firstProducts": 5, "lastProducts": '', directionBefore: '', directionAfter: ''});
    const [queryValue, setQueryValue] = useState('');
    const [taggedWithValue, setTaggedWithValue] = useState('');
    const handleQueryValueChange = useCallback((value) => setQueryValue(value), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleClearAll = useCallback(() => {handleQueryValueRemove(); handleTaggedWithRemove()}, [handleQueryValueRemove]);
    const location = useLocation();
    const navigate = useNavigate();

    const handleTaggedWithRemove = useCallback(() => setTaggedWithValue(''), []);
    const handleTaggedWithChange = useCallback((value) => setTaggedWithValue(value),[]);

    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const currentParams = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);


    const GET_PRODUCTS = gql`
        query getProducts($reversed: Boolean, $lastProducts: Int, $firstProducts: Int, $directionAfter: String, $directionBefore: String, $sort: ProductSortKeys, $query: String) {
          products(reverse: $reversed, sortKey: $sort, first: $firstProducts, last: $lastProducts, after: $directionAfter, before: $directionBefore, query: $query) {
            edges {
              cursor
              node {
                title
                createdAt
                productType
                vendor
                id
                description
              }
            }         
            pageInfo {
              hasPreviousPage
              hasNextPage
              startCursor
              endCursor
            }
          }
        }
    `;

    const [getData, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCTS, {
        fetchPolicy: 'no-cache',
    });
    const queryVariables = useMemo(() => {
        if (searchParams.get('firstProducts')) {
            return {
                firstProducts: 5,
                directionAfter: searchParams.get('directionAfter'),
                query: searchParams.get('query'),
                sort: searchParams.get('sort'),
                reversed: searchParams.get('reversed') === 'true' ? true : null
            }
        }

        if (searchParams.get('lastProducts')) {
            return {
                lastProducts: 5,
                directionBefore: searchParams.get('directionBefore') ,
                query: searchParams.get('query'),
                sort: searchParams.get('sort'),
                reversed: searchParams.get('reversed') === 'true' ? true : null
            }
        }
        // if (searchParams.get('last') && searchParams.get('before')) {
        //     return {
        //         first: null,
        //         last: 10,
        //         after: null,
        //         before: searchParams.get('before'),
        //         query: queryParams,
        //         sortKey: 'TITLE',
        //         reverse: isReverse,
        //     }
        // }
        // if (!(searchParams.get('first') && searchParams.get('after')) && !(searchParams.get('last') && searchParams.get('before'))) {
        //     return {
        //         first: 10,
        //         last: null,
        //         after: null,
        //         before: null,
        //         query: queryParams,
        //         sortKey: 'TITLE',
        //         reverse: isReverse,
        //     }
        // }
    }, [searchParams])
    useEffect(() => {
        if (!loading) {
            console.log(searchParams.get('firstProducts'))
            console.log(searchParams.get('lastProducts'))

            console.log(queryVariables)
            getData({
                variables: queryVariables
            })
            !queryValue.length ? setQueryValue(searchParams.get('query')) : null;
            console.log(queryValue)
            // console.log(currentParams.directionAfter)
            // console.log(currentParams.directionBefore)
            // getData({
            //     variables: {
            //         firstProducts: currentParams.firstProducts ? 5 : null,
            //         lastProducts: currentParams.lastProducts ? 5 : null,
            //         reversed: currentParams.reversed === 'true',
            //         query: currentParams.query,
            //         sort: currentParams.sort,
            //         taggedWith: currentParams.taggedWith,
            //         directionBefore: currentParams.directionBefore ? currentParams.directionBefore : null,
            //         directionAfter: currentParams.directionAfter ? currentParams.directionAfter : null
            //     }
            // });
            // setSearchParams({ ...currentParams,  directionAfter: data.products.pageInfo.endCursor})
        }
    }, [searchParams])

    const timerFunc = () => {
        setSearchParams({ ...currentParams, query: queryValue, taggedWith: taggedWithValue})
    }

    useEffect(() => {
        let timer1 = setTimeout(() => timerFunc(), 1500)
        return () => {
            clearTimeout(timer1)
        }
    }, [queryValue, taggedWithValue])

    const onClickAddProduct = () => {
        navigate('/create', { replace: true })
    }

    const onClickEditProduct = (id, title, description) => {
        const data = {
            id: id,
            title: title,
            description: description,
            sortValue: searchParams.get('sortValue'),
            reversed: searchParams.get('reversed'),
            cursor: searchParams.get('cursor'),
            query: searchParams.get('queryValue')
        }
        navigate('/update', {state: data})
    }

    const onClickNext = useCallback(() => {
        const cursorValue = data.products.pageInfo.endCursor;
        setSearchParams({ ...currentParams, cursor: cursorValue, directionBefore: '', directionAfter: cursorValue, firstProducts: 5, lastProducts: ''})
    },[data, getData]);

    const onClickPrevious = useCallback(() => {
        const cursorValue = data.products.pageInfo.startCursor;
        setSearchParams({ ...currentParams, cursor: cursorValue, directionAfter: '', directionBefore: cursorValue, firstProducts: '', lastProducts: 5})
    }, [data, getData]);

    const onChangeSort = (input) => {
        if (input === 'TITLE') {
            setSearchParams({ ...currentParams, sort: input, reversed: false, sortSelected: input})
            return;
        }
        if (input === 'REVERSED_TITLE') {
            setSearchParams({ ...currentParams, sort: 'TITLE', reversed: true, sortSelected: input})
            return;
        }
        if (input === 'PUBLISHED_AT') {
            setSearchParams({ ...currentParams, sort: input, reversed: false, sortSelected: input})
            return;
        }
        if (input === 'REVERSED_DATE') {
            setSearchParams({ ...currentParams, sort: "PUBLISHED_AT", reversed: true, sortSelected: input})
        }
    }

    if (error) {
        return <Error message={error.message}/>
    }

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'taggedWith3':
                return `Tagged with ${value}`;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }

    const appliedFilters = !isEmpty(searchParams.get('taggedWith'))
        ? [
            {
                key: 'taggedWith3',
                label: disambiguateLabel('taggedWith3', searchParams.get('taggedWith')),
                onRemove: handleTaggedWithRemove,
            },
        ]
        : [];

    const filters = [
        {
            key: 'taggedWith3',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    value={taggedWithValue}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
    ];
    const filterControl = (
        <Filters
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={handleQueryValueChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
        />
    );

    return (
        <Page>
            <Card>
                <Card.Section>
                <ResourceList
                    loading={loading}
                    resourceName={resourceName}
                    items={data ? data.products.edges : (previousData ? previousData.products.edges : [] )}
                    renderItem={renderItem}
                    sortOptions={[
                        {label: 'Newest update', value: 'PUBLISHED_AT'},
                        {label: 'Oldest update', value: 'REVERSED_DATE'},
                        {label: 'Alphabetically(A-z)', value: 'TITLE'},
                        {label: 'Alphabetically(Z-a)', value: 'REVERSED_TITLE'},

                    ]}
                    onSortChange={(selected) => {
                        onChangeSort(selected);
                    }}
                    sortValue={searchParams.get('sortSelected')}
                    filterControl={filterControl}
                />
                </Card.Section>
                <Card.Section>
                        <Stack>
                            <Stack.Item fill>
                                <Pagination
                                    hasPrevious={!loading ? (data ? data.products.pageInfo.hasPreviousPage : false) : false}
                                    onPrevious={onClickPrevious}
                                    hasNext={!loading ? (data ? data.products.pageInfo.hasNextPage : false) : false}
                                    onNext={onClickNext}
                                />
                            </Stack.Item>
                            <Stack.Item>
                                <Button primary onClick={() => {onClickAddProduct()}}>Add product</Button>
                            </Stack.Item>
                        </Stack>
                </Card.Section>
            </Card>
        </Page>
    );

    function renderItem(item) {
        const {node: {id, title, description, vendor, productType}} = item;
        const media = <Thumbnail
            source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
            size="large"
            alt="Black choker necklace"
        />
        // const shortcutActions = {content: 'Edit', url: () => {
        //         onClickEditProduct(id, title, description)
        //     }};

        return (
            <ResourceItem
                media={media}
                id={id}
                // shortcutActions={shortcutActions}
                persistActions
                onClick={() => onClickEditProduct(id, title, description)}
            >
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <div>{description}</div>
                <div>{productType}</div>
                <div>{vendor}</div>
            </ResourceItem>
        );
    }
}
export default ProductsPage;