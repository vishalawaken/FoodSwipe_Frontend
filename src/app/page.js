import RestaurantCard from "@/components/RestaurantCard";
import axios from "axios"
const Homepage = async () => {
  let restaurants = []
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, { withCredentials: true })
    restaurants = res.data.restaurants || [];
  } catch (error) {
    console.error("Error fetching restaurants", error)
  }
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8 ">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Restaurants Near You</h1>
        {restaurants.length === 0 ? (<p className="text-gray-500">No Restaurants Available Right Now</p>) : (<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (<RestaurantCard key={restaurant._id} restaurant={restaurant}></RestaurantCard>))}
        </div>)}
      </div>
    </>
  )
}

export default Homepage