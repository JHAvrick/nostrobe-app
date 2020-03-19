import React, {useState, useEffect} from 'react';
import './categories.css';
import { Link } from "react-router-dom";

function Categories(props) {

  const [selected, setSelected] = useState(null);
  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected])

  const handleCategoryClicked = (category) => props.onSelected(category);


  return (
    <ul className="categories">
      {React.Children.toArray(props.children).map((child) => 
        React.cloneElement(child, { onSelected: handleCategoryClicked, selected: child.props.name === selected })
      )}
    </ul>
  );
}

function Category (props){
  const handleClick = () => props.onSelected(props.name);
  return (
    <li onClick={handleClick} className={props.selected ? "categories__li--selected" : "categories__li"} >
      {props.name}
      {/* <Link to={"/designs/" + props.name}> {props.name} </Link> */}
    </li>
  )
}

Category.defaultProps = {
  onSelected: function(){}
}

export { Categories, Category };
