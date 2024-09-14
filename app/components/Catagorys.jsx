import React from 'react'

const Catagorys = () => {
    return (
        <div className="bg-yellow-300/50 py-3 px-4">
            <div className="flex justify-around">
                {['Snacks', 'Meal', 'Vegan', 'Dessert', 'Drinks'].map((category) => (
                    <div key={category} className="flex flex-col items-center">
                        <div className="bg-orange-400 p-2 rounded-full">
                            <img
                                src={`link-to-${category.toLowerCase()}-icon`}
                                alt={category}
                                className="w-6 h-6"
                            />
                        </div>
                        <span className="text-xs font-bold mt-1">{category}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Catagorys