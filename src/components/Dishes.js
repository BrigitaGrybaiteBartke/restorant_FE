import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Dishes = () => {
    const auth = useContext(AuthContext);
    const [dishes, setDishes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);   //error.message
    const [restaurants, setRestaurants] = useState([])
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/api/restaurants")
            .then((res) => res.json())
            .then((res) => {
                setRestaurants(res);
                setIsLoaded(true);
            })
            .catch(error => {
                console.log(error);
                setError(error);
                setIsLoaded(true);
            })
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/api/dishes")
            .then((res) => res.json())
            .then((res) => {
                setDishes(res);
                setIsLoaded(true);
            })
            .catch(error => {
                setError(error);
                setIsLoaded(true);
            })
    }, []);

    const deleteDish = (id, e) => {
        fetch("http://localhost:8000/api/dishes/" + id, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.getToken()}`,
            },
        })
            .then(
                (res) => {
                    if (res.status === 200) {
                        const remaining = dishes.filter((d) => id !== d.id);
                        setDishes(remaining);
                    }
                    else {
                        setError({ message: res.statusText });
                    }
                },
                (err) => {
                    console.log(err);
                    setError(err);
                    setIsLoaded(true);
                }
            );
    };

    const sortByPrice = () => {
        setDishes(
            dishes.sort((a, b) => {
                return sortOrder ? b.price - a.price : a.price - b.price
            })
        )
        setSortOrder(!sortOrder)
        setDishes([...dishes])
    }

    if (!isLoaded) {
        return <div className='loading'>Loading...</div>;
    }
    else if (dishes['length'] === 0) {
        return <div className="d-grid gap-2 col-6 mx-auto">
            <h4 className='text-center'>No data !</h4>
            <button
                onClick={(e) => navigate(`/dishes/create`)}
                className="btn btn-outline-success btn-sm"
            >
                Add new Dish
            </button>
        </div>
    }
    else {
        return (
            <>
                {(error) ? <div>Error: {error.message}</div> : ''}
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th
                                onClick={() => sortByPrice()}
                            >
                                Price
                                <i className="mx-3 bi bi-arrow-down-up"></i>
                            </th>
                            <th>Image</th>
                            <th>Restaurant</th>
                            {auth.isLoggedin() ? (
                                <th>Actions</th>
                            ) : ('')}
                        </tr>
                    </thead>
                    <tbody>
                        {dishes.map((dish) => (
                            <tr key={dish.id}>
                                <td className="col-lg-3 overflow-hidden" style={{ minWidth: "20px", maxHeight: "5px" }}>
                                    {dish.id}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    {dish.title}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    {dish.price}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    <img src={dish.image} alt="" style={{ width: "100px", height: "100px" }} />
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    {restaurants.map((restaurant) => (
                                        <span
                                            key={restaurant.id}
                                            value={restaurant.id}>
                                            {dish.restaurants_id === restaurant.id ? restaurant.title : ''}
                                        </span>
                                    ))}
                                </td>
                                {auth.isLoggedin() ? (
                                        <td className="col-lg-2" style={{ minWidth: "200px" }}>
                                            <button
                                                onClick={(e) => navigate(`/dishes/${dish.id}`)}
                                                className="btn btn-warning mx-1"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={(e) => deleteDish(dish.id, e)}
                                                className="btn btn-danger mx-1"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    ) : ('')
                                }
                            </tr>
                        ))}
                    </tbody>
                    {auth.isLoggedin() ? (
                        <tfoot>
                            <tr>
                                <td colSpan="6" className="border border-3 border-start-0 border-bottom-0 border-end-0">
                                    <button
                                        onClick={(e) => navigate(`/dishes/create`)}
                                        className="btn btn-success float-end mx-1"
                                    >
                                        Add new Dish
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    ) : ('')}
                </table>
            </>
        );
    }
}

export default Dishes;
