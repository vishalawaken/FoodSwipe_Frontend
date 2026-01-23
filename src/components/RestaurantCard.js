import Link from "next/link"

const RestaurantCard = ({restaurant}) => {
  return (
    <>
   <Link href={`/restaurants/${restaurant._id}`} className="block rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
   <h2 className="mb-2 text-xl font-semibold text-gray-800">{restaurant.name}</h2>
   <p className="mb-3 text-sm text-gray-600">
    {restaurant.description || "Delicious Food Available"}
   </p>
   <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">Open</span>
   </Link> 
    </>
  )
}

export default RestaurantCard