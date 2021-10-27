import React, { Component } from "react";
import { connect } from "react-redux";
import { get_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { GET_CATEGORIES } from "../../../actions/actions";

import Header1 from "../../Layout/Header1";
import Footer1 from "../../Layout/Footer1";

class HomePage1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      showAddressModal: false,
      id: "",
    };
  }

  static propTypes = {
    get_request: PropTypes.func.isRequired,
    productReducer: PropTypes.object.isRequired,
  };
  componentDidMount() {
    // console.log(this.props);
    if (this.props.productReducer.categories.length === 0) {
      this.get_categories();
    }
    this.setState({
      id: uuidv4(),
    });
  }
  async get_categories() {
    await this.props.get_request("product_category/all", GET_CATEGORIES);
  }
  render() {
    return (
      <div>
        <Header1 />
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Coffee Twist</h1>
          </div>
        </header>
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* <!-- Replace with your content --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {this.props.productReducer.categories.length > 0 ? (
                this.props.productReducer.categories.map((c, indx) => {
                  return <GridTile category={c} key={indx} />;
                })
              ) : (
                <div>None yet</div>
              )}
            </div>
            {/* <!-- /End replace --> */}
          </div>
        </main>
        <Footer1 className="footer" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  productReducer: state.productReducer,
});

export default connect(mapStateToProps, { get_request })(HomePage1);

const GridTile = ({ category }) => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
        <a href={`/order1/${category.name}`}>
          <img
            className="rounded-t-lg"
            src="https://flowbite.com/docs/images/blog/image-1.jpg"
            // src={`assets/images/${c.image}`}
            alt=""
          />
        </a>
        <div className="p-5">
          <a href={`/order1/${category.name}`}>
            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
              {category.name}
            </h5>
          </a>
          <p className="font-normal text-gray-700 mb-3">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};
