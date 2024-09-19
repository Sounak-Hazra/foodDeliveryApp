// import React from 'react';
// import Nav from '../components/Nav';
// import NachosCard from '../components/Card';

// const FoodMenuPage = () => {
//   const items = [
//     {
//       id: 1,
//       title: 'Mexican Appetizer',
//       price: 15.0,
//       rating: 5.0,
//       image: 'link-to-mexican-appetizer-image', // Replace with actual image URL
//       description: 'Tortilla Chips With Toppings',
//     },
//     {
//       id: 2,
//       title: 'Pork Skewer',
//       price: 12.99,
//       rating: 4.0,
//       image: 'link-to-pork-skewer-image', // Replace with actual image URL
//       description:
//         'Marinated in a rich blend of herbs and spices, grilled to perfection, served with a side of zesty dipping sauce.',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-yellow-50">
//       {/* Header */}
//       <Nav />

//       <NachosCard />
//     </div>
//   );
// };

// export default FoodMenuPage;


// (!orderstate === "successfull" || deleveryboy === "all") ? (
                                //     (!orderstate === "cancled" || deleveryboy === "all") ? (
                                        <div key={index} className="card bg-white shadow-xl rounded-lg p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                                            <h2 className="text-xl font-bold text-gray-700 mb-2">Name: {order.name}</h2>
                                            <h2 className="text-base text-gray-600">ID: {order._id}</h2>
                                            <p className="text-gray-600"><strong>Full Address:</strong> {order.address}</p>
                                            <p className="text-gray-600"><strong>City:</strong> {order.city}</p>
                                            <p className="text-gray-600"><strong>Landmark:</strong> {order.landmark}</p>
                                            <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                            <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                            <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                            <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                            <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                            <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>

                                            {order.successfull === "placed" && (
                                                <button className="mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" onClick={() => accapet(order)}>
                                                    Accept Order
                                                </button>
                                            )}

                                            {order.successfull === "accapted" && (
                                                <div className="flex flex-col items-start mt-3 space-y-3">
                                                    <label className="text-lg font-semibold text-gray-700">Select Delivery Boy:</label>
                                                    <select
                                                        onChange={(e) => changeselectvalue(e.target.value)}
                                                        className="w-48 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
                                                    >
                                                        <option value="" disabled>--Select--</option>
                                                        {deliveryboys.map((boy) => (
                                                            <option key={boy.name} value={boy.username}>{boy.username}</option>
                                                        ))}
                                                    </select>

                                                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" onClick={() => handleSelectChange(selectboy, order)}>
                                                        Assign Delivery Boy
                                                    </button>

                                                    {selectedDeliveryBoy && (
                                                        <p className="mt-2 text-blue-600 font-medium">Selected Delivery Boy: {selectedDeliveryBoy}</p>
                                                    )}
                                                </div>
                                            )}

                                            {order.successfull === "created" || order.successfull === "placed" && (
                                                <button className="mt-3 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700" onClick={() => cancleorder(order)}>
                                                    Cancel Order
                                                </button>
                                            )}

                                            {order.successfull === "assigned" && (
                                                <p className="text-gray-600 mt-3"><strong>Delivery By:</strong> {order.deleveryboy}</p>
                                            )}

                                            {/* Display Items */}
                                            <div className="mt-3 h-28 overflow-y-auto">
                                                <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {order.product.map((item, i) => (
                                                        <li key={i}>
                                                            <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                //     ) : null
                                // ) : null