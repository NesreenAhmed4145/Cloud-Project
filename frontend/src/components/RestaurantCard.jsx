import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <div className="card">
      <img src={restaurant.image} alt={restaurant.name} />

      <h3>{restaurant.name}</h3>

      <Link to={`/menu/${restaurant.id}`}>
        <button>View Menu</button>
      </Link>
    </div>
  );
}

export default RestaurantCard;