import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  return (
    <Link to={`/vehicles/${vehicle.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] border border-gray-200 dark:border-gray-700">
        <img
          src={vehicle.image || '/placeholder-car.jpg'}
          alt={vehicle.title}
          className="w-full h-56 object-cover group-hover:opacity-90 transition"
          loading="lazy"
        />

        <div className="p-5 space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600">
            {vehicle.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {vehicle.year} • {vehicle.mileage?.toLocaleString()} miles • {vehicle.location}
          </p>

          <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
            ₦{vehicle.price?.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-2">
            {vehicle.fuelType && <span className="tag">{vehicle.fuelType}</span>}
            {vehicle.transmission && <span className="tag">{vehicle.transmission}</span>}
          </div>

          <button className="w-full btn-primary">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;