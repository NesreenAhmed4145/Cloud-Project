function CartItem({ item, removeFromCart }) {
    return (
      <div className="cart-item">
        <h4>{item.name}</h4>
  
        <p>Price: ${item.price}</p>
  
        <p>Quantity: {item.quantity}</p>
  
        <button onClick={() => removeFromCart(item.id)}>
          Remove
        </button>
      </div>
    );
  }
  
  export default CartItem;