import Link from "next/link"

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link href={`/restaurants/${restaurant._id}`} className="group relative block h-full overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
            {restaurant.name || "Restaurant Name"}
          </h2>
          <div className="mt-1 h-0.5 w-12 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
          Open
        </span>
      </div>

      <p className="text-sm leading-relaxed text-gray-500 line-clamp-2 min-h-[2.5rem]">
        {restaurant.description || "Experience delicious food and great ambiance. Order now for a delightful meal."}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="text-sm font-medium text-gray-400 group-hover:text-orange-500 transition-colors">View Menu</span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-500 opacity-0 transform translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard