import React, { Component } from "react";
import { Form } from "react-bootstrap";
import "../../css/Pages/orderpage.css";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PropTypes from "prop-types";
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
  Grid,
  Button,
  Paper,
  IconButton,
  Divider,
} from "@material-ui/core";
import { showInfoSnackbar } from "../../actions/snackbar";

class OrderItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      quantity: 1,
      comment: "",
      extraPrice: 0,
      item: {},
      extra_ingredients: [""],
      loaded: false,
      item_available_ingredients: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  static propTypes = {
    ingredients: PropTypes.array.isRequired,
  };

  componentDidMount() {
    if (this.props.update) {
      // console.log(this.props);
      this.setState({
        options: this.props.updateItem.options,
        quantity: this.props.updateItem.quantity,
        comment: this.props.updateItem.comment,
        extra_ingredients: this.props.updateItem.extra_ingredients,
        extraPrice:
          this.props.updateItem.totalPrice / this.props.updateItem.quantity -
          this.props.updateItem.item.price,
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      loaded: false,
    });
  }

  handleToggle = (ingredient) => {
    const currentIndex = this.state.extra_ingredients.indexOf(ingredient.name);
    const newChecked = [...this.state.extra_ingredients];
    let newPrice = this.state.extraPrice;

    // console.log(ingredient.name);
    if (currentIndex === -1) {
      newChecked.push(ingredient.name);
      newPrice += ingredient.price;
    } else {
      newChecked.splice(currentIndex, 1);
      newPrice -= ingredient.price;
    }

    this.setState({
      extra_ingredients: newChecked,
      extraPrice: newPrice,
    });
  };

  onSubmit(e) {
    e.preventDefault();
  }

  onAdd(e) {
    e.preventDefault();
    let optionAnswers = [];
    if (this.state.options.length > 0) {
      for (var i in this.state.options) {
        // console.log(i);
        optionAnswers.push(this.state.options[i].choice);
      }
    }
    const item = {
      item: this.props.item,
      options: this.state.options,
      comment: this.state.comment,
      extraPrice: this.state.extraPrice,
      optionAnswers: optionAnswers,
      extra_ingredients: this.state.extra_ingredients.slice(1),
    };
    if (this.props.update) {
      item.extra_ingredients = this.state.extra_ingredients;
    }
    // Chcek if needed options are answered
    let found = false;
    item.item.choices.forEach((c) => {
      if (c.required) {
        item.options.forEach((o) => {
          if (c.name === o.name) {
            found = true;
          }
        });
        if (found === false) {
          alert(`Διαλέχτε μια επιλογή για την κατηγορία: ${c.name}`);
        }
      }
    });
    if (found) {
      if (this.props.update) {
        this.props.onUpdate &&
          this.props.onUpdate(item, this.state.quantity, this.props.index);
      } else {
        this.props.onAdd && this.props.onAdd(item, this.state.quantity);
      }
      this.props.onClose && this.props.onClose(e);
      this.setState({
        options: {},
        quantity: 1,
        comment: "",
        extraPrice: 0,
        extraIngredients: [""],
      });
    }
  }

  onChangeChoice = (choiceName, selectedOption) => {
    var currentOptions = this.state.options;
    let oldPrice = 0;
    let found = false;
    let exists = false;
    // Check if choice has already changed once
    for (var id in currentOptions) {
      let old_option = currentOptions[id];
      if (old_option.name === choiceName) {
        if (old_option.choice === selectedOption.name) {
          exists = true;
        }
        oldPrice = old_option.price;
        old_option.choice = selectedOption.name;
        old_option.price = selectedOption.price;
        // old_option.ID = selectedOption.ID;
        found = true;
      }
    }
    // Else it adds the option
    if (found === false && exists === false) {
      let newOption = {
        name: choiceName,
        choice: selectedOption.name,
        price: selectedOption.price,
      };
      currentOptions.push(newOption);
    }

    if (exists === false) {
      var newPrice = this.state.extraPrice + selectedOption.price - oldPrice;
      this.setState({
        options: currentOptions,
        extraPrice: newPrice,
      });
    }
    // console.log(currentOptions);
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);
    if (
      props.item.custom === true &&
      props.item.ngredients !== undefined &&
      state.loaded === false
    ) {
      let grouped_ingredients = [];
      let grouped;
      var _ = require("lodash");
      grouped = _.groupBy(props.item.extra_ingredients, "category");
      for (var i in grouped) {
        grouped_ingredients.push(grouped[i]);
      }
      // console.log(grouped_ingredients);
      return {
        loaded: true,
        item_available_ingredients: grouped_ingredients,
      };
    }
    return null;
  }

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      options: {},
      quantity: 1,
      comment: "",
      extraPrice: 0,
    });
  };

  changeQuantity = (bool) => {
    if (bool) {
      this.setState({ quantity: this.state.quantity + 1 });
    } else if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render() {
    console.log(this.props.item);
    let text = "";
    if (this.props.update) {
      // console.log("here to update");
      text = "Ενημέρωση";
    } else {
      // console.log("here to add");
      text = "Προσθήκη";
    }
    const product = this.props.update
      ? this.props.updateItem.item
      : this.props.item;
    return (
      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${
          this.props.show ? "" : "hidden"
        }`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`flex  justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ${
            this.props.show ? "" : "hidden"
          }`}
        >
          {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
          <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
              this.props.show
                ? "ease-out duration-300 opacity-100"
                : "ease-in duration-200 opacity-0 hidden"
            }`}
            onClick={(e) => {
              this.onClose(false);
            }}
            aria-hidden="true"
          ></div>

          {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
          <span
            className="hidden inline-block align-middle h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* <!--
      Modal panel, show/hide based on modal state.

      
      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
          <div
            className={`inline-block  align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:w-full md:w-8/12 lg:w-8/12 ${
              this.props.show
                ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
                : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            }`}
          >
            <div className="flex text-center">
              <span className=" flex-1 w-8/10">{product.name}</span>
              <span className=" flex-none w-1/10 mx-2">
                {(this.state.extraPrice + product.price).toFixed(2)} €
              </span>
              <button
                type="submit"
                className="flex-none  w-1/10   py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={(e) => {
                  this.onClose(false);
                }}
              >
                X
              </button>
            </div>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-center">
              <ChoicesList
                choices={product.choices}
                updateItem={this.props.update ? this.props.updateItem : null}
                onChangeChoice={(name, option) =>
                  this.onChangeChoice(name, option)
                }
                options={this.state.options}
              />
              {product.custom === true ? (
                <IngredientsList
                  ingredients={this.state.item_available_ingredients}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) =>
  // console.log(state.productReducer.ingredients),
  ({
    ingredients: state.productReducer.ingredients,
    choices: state.productReducer.choices,
  });

export default connect(mapStateToProps, { showInfoSnackbar })(OrderItemModal);

const ChoicesList = ({ choices, updateItem, onChangeChoice, options }) => {
  return (
    <div className="flex ">
      <div className="flex-none bg:w-1/6 md:w-1/6 sm:hidden"></div>
      {choices.map((choice, indx) => (
        <div key={indx} className="flex-grow">
          <span className="text-center">
            {choice.name}
            {choice.required && "*"}
          </span>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 bg:grid-cols-2">
            {choice.options ? (
              choice.options.map((option, index) => {
                let show = false;
                let update = updateItem !== null;
                if (update) {
                  for (var i in updateItem.options) {
                    let update_option = updateItem.options[i];
                    if (
                      update_option.name === choice.name &&
                      update_option.choice === option.name
                    ) {
                      show = true;
                    }
                  }
                }
                let checked = options.some((o) => o.choice === option.name);
                if (update && show) {
                  return (
                    <div key={index}>
                      <label
                        class="inline-flex items-center"
                        onClick={() => onChangeChoice(choice.name, option)}
                      >
                        <input
                          type="radio"
                          class="form-radio"
                          name={`${choice.name}`}
                          value={`${option.name}`}
                          id={`${option.name}${index}`}
                          checked={checked}
                        />
                        <span class="ml-2">{option.name}</span>
                        <span class="ml-2">{option.price} €</span>
                      </label>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="shadow-md py-1 "
                      onClick={() => onChangeChoice(choice.name, option)}
                      key={index}
                    >
                      <label class="inline-flex items-center">
                        <input
                          type="radio"
                          class="form-radio"
                          name={`${choice.name}`}
                          value={`${option.name}`}
                          id={`${option.name}${index}`}
                          checked={checked}
                        />
                        <span class="ml-2">{option.name}</span>
                        <span class="ml-2">{option.price} €</span>
                      </label>
                    </div>
                  );
                }
              })
            ) : (
              <span></span>
            )}
          </div>
        </div>
      ))}
      <div className="flex-none bg:w-1/6 md:w-1/6 sm:hidden"></div>
    </div>
  );
};

const IngredientsList = ({ ingredients, handleToggle }) => {
  console.log(ingredients);
  return (
    <div className="flex ">
      <div className="flex-none bg:w-1/6 md:w-1/6 sm:hidden"></div>
      {ingredients.map((ic, index) => (
        <div className="flex-grow">
          <span className="text-center">{ic[0].category}</span>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 bg:grid-cols-2">
            {ic.map((ingredient, index) => {
              let checked = ic.some((o) => o.choice === ingredient.name);
              return (
                <div
                  className="shadow-md py-1 "
                  onClick={() => handleToggle(ingredient)}
                  key={index}
                >
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      class="form-radio"
                      name={`${ingredient.name}`}
                      value={`${ingredient.name}`}
                      id={`${ingredient.name}${index}`}
                      checked={checked}
                    />
                    <span class="ml-2">{ingredient.name}</span>
                    <span class="ml-2">{ingredient.price} €</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex-none bg:w-1/6 md:w-1/6 sm:hidden"></div>
    </div>
  );
};
