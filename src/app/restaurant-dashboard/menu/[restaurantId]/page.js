"use client"
import axios from "axios"
import { useEffect, useState, use } from "react"

const MenuManagementPage = ({ params }) => {
    const { restaurantId } = use(params);  // Unwrap the Promise
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    // form state
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")

    // fetch menu (owner endpoint - shows ALL items including disabled)
    const fetchMenu = async () => {
        try {
            setLoading(true);
            // Use owner-specific endpoint to get ALL items (available + disabled)
            const res = await axios.get(`http://localhost:5000/api/menu/my-restaurant/${restaurantId}`, { withCredentials: true })
            setMenuItems(res.data.items || [])
        } catch (error) {
            setError("Failed to load menu")
        } finally {
            setLoading(false)
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchMenu();
    }, [])

    // add menu Item
    const handleAddItem = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !price) {
            setError("Name and price are required")
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/menu/restaurant/${restaurantId}`, { name, price, description }, { withCredentials: true })

            // reset form
            setName("");
            setPrice("");
            setDescription("")

            // refresh Menu
            fetchMenu();
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to add menu Item")
        }
    }

    // Toggle availability
    const toggleAvailability = async (itemId) => {
        try {
            await axios.patch(`http://localhost:5000/api/menu/${itemId}/toggleAvailability`, {}, { withCredentials: true })
            fetchMenu();
        } catch (error) {
            alert("failed to update item status")
        }
    }

    if (loading) {
        return <p className="p-6">Loading Menu....</p>
    }

    return (
        <>
            <div className="mx-auto max-w-5xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-bold">Menu Management</h1>

                {/* Add Item Form */}
                <div className="mb-8 rounded-lg border bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold">Add Menu Item</h2>
                    {error && (<p className="mb-4 text-sm text-red-600">{error}</p>)}
                    <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleAddItem}>
                        <input type="text" placeholder="Item Name" value={name} onChange={(e) => { setName(e.target.value) }}></input>
                        <input type="number" placeholder="Price" value={price} onChange={(e) => { setPrice(e.target.value) }} className="rounded border px-3 py-2"></input>
                        <input type="text" placeholder="Descripition (optional)" value={description} onChange={(e) => { setDescription(e.target.value) }} className="rounded border px-3 py-2"></input>
                        <button type="submit" className="col-span-full rounded bg-green-600 py-2 text-white hover:bg-screen-700">Add Item</button>
                    </form>
                </div>


                {/* MENU LIST */}
                <div className="space-y-4">
                    {menuItems.length === 0 ? (<p>No menu Items Added Yet</p>) : (menuItems.map((item) => (<div key={item._id} className={`flex items-center justify-between rounded-lg border p-4 ${!item.isAvailable ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{item.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {item.isAvailable ? 'Available' : 'Disabled'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">Rs{item.price}</p>
                            {item.description && (<p className="text-xs text-gray-500">{item.description}</p>)}
                        </div>
                        <button onClick={() => { toggleAvailability(item._id) }} className={`rounded px-4 py-1 text-sm text-white ${item.isAvailable ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>{item.isAvailable ? "Disable" : "Enable"}</button>
                    </div>)))}
                </div>
            </div>
        </>
    )
}

export default MenuManagementPage