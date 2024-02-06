import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Restaurants = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/api/restaurants")
            .then((res) => res.json())
            .then((res) => {
                setRestaurants(res);
                setIsLoaded(true);
            })
            .catch(error => {
                setError(error);
                setIsLoaded(true);
            })
    }, []);

    const deleteRestaurant = (id, e) => {
        fetch("http://localhost:8000/api/restaurants/" + id, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.getToken()}`
            },
        })
            .then(
                (res) => {
                    if (res.status === 200) {
                        const remaining = restaurants.filter((r) => id !== r.id);
                        setRestaurants(remaining);
                    }
                    else {
                        setError({ message: res.statusText });
                    }

                            // different error messages
                            //     else if (res.status === 401) {
                            //         setStatus({ message: res.statusText });
                            //       } else if (res.status === 422) {
                            //         setStatus({ message: res.statusText });
                },

                (err) => {
                    setError(err);
                    setIsLoaded(true);
                }
            );
    };


    const sortByTitle = () => {
        setRestaurants(
            restaurants.sort((r1, r2) => {
                return sortOrder ? r1.title.localeCompare(r2.title) : r1.title.localeCompare(r2.title) * -1
            })
        )
        setSortOrder(!sortOrder)
        setRestaurants([...restaurants])
    }

    if (!isLoaded) {
        return <div className='loading'>Loading...</div>;
    }
    else if (restaurants['length'] === 0) {
        return <div className="d-grid gap-2 col-6 mx-auto">
            <h4 className='text-center'>No data !</h4>
            <button
                onClick={(e) => navigate(`/rest/create`)}
                className="btn btn-outline-success btn-sm"
            >
                Add new restaurant
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
                            <th
                            onClick={() => sortByTitle()}
                            >
                                Title
                                <i className="mx-3 bi bi-arrow-down-up"></i>
                                 </th>

                            <th>City</th>
                            <th>Address</th>
                            <th>Working hours</th>
                            {auth.isLoggedin() ? (
                                <th>{/* <span className="float-end mx-1">Actions</span> */}Actions</th>
                            ) : ('')}
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td className="col-lg-3 overflow-hidden" style={{ minWidth: "20px", maxHeight: "5px" }}>
                                    {restaurant.id}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    {restaurant.title}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    {restaurant.city}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "200px", maxHeight: "5px" }}>
                                    {restaurant.address}
                                </td>
                                <td className="col-lg-7 overflow-hidden" style={{ minWidth: "400px", maxHeight: "5px" }}>
                                    {restaurant.workingTime}
                                </td>
                                {auth.isLoggedin() ? (
                                    <td className="col-lg-2" style={{ minWidth: "200px" }}>
                                        <button
                                            onClick={(e) => navigate(`/rest/${restaurant.id}`)}
                                            className="btn btn-warning mx-1"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={(e) => deleteRestaurant(restaurant.id, e)}
                                            className="btn btn-danger mx-1"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                ) : ('')}
                            </tr>
                        ))}
                    </tbody>
                    {auth.isLoggedin() ? (
                        <tfoot>
                            <tr>
                                <td colSpan="6" className="border border-3 border-start-0 border-bottom-0 border-end-0">
                                    <button
                                        onClick={(e) => navigate(`/rest/create`)}
                                        className="btn btn-success float-end mx-1"
                                    >
                                        Add new restaurant
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    ) : ('')}
                </table>
            </>
        )
    }
};

export default Restaurants;
