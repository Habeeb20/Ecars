import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}`);
        const data = await res.json();
        setCar(data.data || data.car);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!car) return <p>Car not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600">← Back</button>
      <h1 className="text-4xl font-bold">{car.make} {car.model} {car.year}</h1>
      <p className="text-3xl text-emerald-600">₦{car.price?.toLocaleString()}</p>
      {/* Add images, description, seller info, etc. */}
    </div>
  );
};

export default CarDetail;