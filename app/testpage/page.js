import React from 'react';
import Nav from '../components/Nav';
import NachosCard from '../components/Card';

const FoodMenuPage = () => {
  const items = [
    {
      id: 1,
      title: 'Mexican Appetizer',
      price: 15.0,
      rating: 5.0,
      image: 'link-to-mexican-appetizer-image', // Replace with actual image URL
      description: 'Tortilla Chips With Toppings',
    },
    {
      id: 2,
      title: 'Pork Skewer',
      price: 12.99,
      rating: 4.0,
      image: 'link-to-pork-skewer-image', // Replace with actual image URL
      description:
        'Marinated in a rich blend of herbs and spices, grilled to perfection, served with a side of zesty dipping sauce.',
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <Nav />

      <NachosCard />
    </div>
  );
};

export default FoodMenuPage;
