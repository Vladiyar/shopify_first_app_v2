import {
    Page,
    Layout,
    Card, DisplayText
} from "@shopify/polaris";
import {useEffect} from "react";

export const HomePage = ({ productCount, publishedProductCount, draftProductCount,
                           getProductCount, getPublishedProductCount, getDraftProductCount }) => {
    useEffect(() => {
        getProductCount();
        getPublishedProductCount();
        getDraftProductCount();
    }, [])

    return (
        <Page fullWidth>
            <Layout>
                <Layout.Section oneThird>
                    <Card title="All Products">
                        <Card.Section />
                        <Card.Section>
                            <Layout>
                                <DisplayText element={"h2"} size="extraLarge">{productCount}</DisplayText>
                            </Layout>
                        </Card.Section>
                    </Card>
                </Layout.Section>
                <Layout.Section oneThird>
                    <Card title="Published Products">
                        <Card.Section />
                        <Card.Section>
                            <Layout>
                                <DisplayText element={"h2"} size="extraLarge">{publishedProductCount}</DisplayText>
                            </Layout>
                        </Card.Section>
                    </Card>
                </Layout.Section>
                <Layout.Section oneThird>
                    <Card title="Unpublished products">
                        <Card.Section />
                        <Card.Section>
                            <Layout>
                                <DisplayText element={"h2"} size="extraLarge">{draftProductCount}</DisplayText>
                            </Layout>
                        </Card.Section>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}