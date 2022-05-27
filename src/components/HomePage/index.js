import {connect} from "react-redux";
import {productCount, publishedProductCount, draftProductCount} from "../../reducers/selectors"
import {getDraftProductCount, getPublishedProductCount, getProductCount} from "../../reducers/actions";
import {createStructuredSelector} from "reselect";
import {HomePage} from "./HomePage";

const mapStateToProp = createStructuredSelector({
    productCount,
    publishedProductCount,
    draftProductCount
})

const mapDispatchToProps = {
    getProductCount,
    getPublishedProductCount,
    getDraftProductCount
}

export default connect(mapStateToProp, mapDispatchToProps)(HomePage);