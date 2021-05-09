import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid } from "@material-ui/core";
import InnerSidebarCatalog from "./InnerSidebarCatalog";
import ProductCatalog from "./ProductCatalog";
import IngredientsCatalog from "./IngredientsCatalog";
import CommentsCatalog from "./CommentsCatalog";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    // height: "100%",
    width: "100%",
    flexWrap: "wrap",
    // flexFlow: "column",
    maxHeight: "110vh",

    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      height: "100%",
    },
    paperSection: {
      backgroundColor: "black",
    },
  },
  GridItem: {
    width: "100%",
  },
}));

export default function RightContainer(props) {
  const classes = useStyles();
  let selectedCat = "";
  let selectedIngreCat = "";
  if (props.categories.length > 0) {
    selectedCat = props.categories[0].name;
  }
  // console.log(props.ingredientCategories);
  if (props.ingredientCategories.length > 0) {
    selectedIngreCat = 0;
  }
  const [selectedCategory, changeCategory] = useState(selectedCat);
  const [selectedIngredientCategory, changeIngredientCategory] = useState(
    selectedIngreCat
  );
  return (
    <Paper className={classes.root} elevation={3}>
      {props.selectedTab === "Προϊόντα" ? (
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper elevation={3}>Κατηγορίες</Paper>
            <InnerSidebarCatalog
              categories={props.categories}
              selectedCategory={selectedCategory}
              type="products"
              onCategoryChange={(category) => changeCategory(category)}
            />
          </Grid>

          <Grid item xs={9}>
            <ProductCatalog
              products={props.products}
              selectedCategory={selectedCategory}
            />
          </Grid>
        </Grid>
      ) : props.selectedTab === "Υλικά" ? (
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper elevation={3}>Κατηγορίες</Paper>
            <InnerSidebarCatalog
              categories={props.ingredientCategories}
              type="ingredients"
              selectedCategory={selectedIngredientCategory}
              onCategoryChange={(category) =>
                changeIngredientCategory(category)
              }
            />
          </Grid>
          <Grid item xs={9}>
            <IngredientsCatalog
              ingredients={props.ingredients[selectedIngredientCategory]}
              selectedCategory={selectedIngredientCategory}
            />
          </Grid>
        </Grid>
      ) : props.selectedTab === "Σχόλια" ? (
        <Grid container spacing={2}>
          <Grid item className={classes.GridItem}>
            <CommentsCatalog comments={props.comments} />
          </Grid>
        </Grid>
      ) : null}
    </Paper>
  );
}
