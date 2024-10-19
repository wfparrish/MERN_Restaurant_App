// FoodItem.js
function FoodItem({ img, title, price, text, onAddToOrder }) {
  return (
    <div className="food-item">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={onAddToOrder}>{text}</button>
    </div>
  );
}

export default FoodItem;
