import React from 'react';

const BestSellerRibbon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      className="w-full h-auto"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Green ribbon shape */}
      <polygon points="0,0 170,0 200,25 170,50 0,50" fill="#28a745" />

      {/* White "Best Seller" text */}
      <text
        x="85"
        y="30"
        fontFamily="Poppins, Sans-serif"
        fontSize="25"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Best Seller
      </text>
    </svg>
  );
};

export default BestSellerRibbon;
