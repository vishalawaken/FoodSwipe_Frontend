import MenuItemCard from "@/components/MenuItemCard";
import axios from "axios";

const RestaurantMenuPage = async ({ params }) => {
    const { id } = await params;
    let menuItems = [];

    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/menu/restaurant/${id}`,
            { withCredentials: true }
        );
        menuItems = res.data.items || [];
    } catch (error) {
        console.error("Error Fetching Menu", error);
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Menu</h1>

            {menuItems.length === 0 ? (
                <p className="text-gray-500">No Menu Items Available</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {menuItems.map((item) => (
                        <MenuItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantMenuPage;
