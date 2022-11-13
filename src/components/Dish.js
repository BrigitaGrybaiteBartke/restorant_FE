import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Dish = () => {

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    let { id } = useParams();

    const url = `http://localhost:8000/api/dishes`;
    const hs = {
        Accept: "application/json", "Content-Type": "application/json",
        Authorization: `Bearer ${auth.getToken()}`,
    };
    const [dish, setDish] = useState([]); // single dish
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);

    const [restaurants, setRestaurants] = useState([]);
    // const [ratings, setRatings] = useState([]);

    // show all Restaurants
    useEffect(() => {
        fetch("http://localhost:8000/api/restaurants")
            .then((res) => res.json())
            .then((res) => {
                setRestaurants(res);
                setIsLoaded(true);
                // console.log(res)
            })
            .catch(error => {
                // console.log(error);
                setError(error);
                setIsLoaded(true);
            })
    }, []);


    //  jei esame update page => rastas id
    useEffect(() => {
        if (id)
            fetch(`${url}/${id}`)
                .then((res) => res.json())
                .then((res) => {
                    setDish(res);
                    setIsLoaded(true);
                },
                    (err) => {
                        setError(err);
                        setIsLoaded(true);
                    }
                );
        else setIsLoaded(true);
    }, [id, url]);


    const createItem = (e) => {
        e.preventDefault();
        fetch(url, { method: "POST", headers: hs, body: JSON.stringify(dish) })
            .then(
                (res) => {
                    console.log(res)
                    if (res.status === 200 || res.status === 201) {
                        setStatus({ message: res.statusText });
                        navigate("/dishes");
                    }
                    else {
                        // console.log(res.statusText)
                        setError({ message: "Input fields are empty" });
                    }
                }
            )
            .catch(err => {
                console.log(err);
                setError(err);
                setIsLoaded(true);
            })

    }

    const updateItem = (e) => {
        console.log(e.target)
        e.preventDefault();
        fetch(`${url}/${id}`, { method: "PUT", headers: hs, body: JSON.stringify(dish) })
            .then(
                (res) => {
                    if (res.status === 200 && dish.title !== '') {
                        setStatus({ message: res.statusText });
                        navigate("/dishes");
                    }
                    else {
                        setError({ message: "Input fields are empty" });
                        // navigate("/rest");
                    }
                }
            )
    };


    // PAGE VIEW
    if (!isLoaded) {
        return <div className='loading'>Loading...</div>
    }
    else {
        return (
            <>
                {/* returns errors */}
                {(error) ? <div>Error: {error.message}</div> : ''}

                <div>{status === null ? "" : status.message}</div>


                {/* form */}
                <div className="d-flex aligns-items-center justify-content-center">
                    <div className="card w-50">

                        <h5 className="card-header"
                        >
                            {id ? `Update dish, id: ${id}` : `Create a new Dish`}
                        </h5>

                        <div className="card-body">
                            <form
                                onSubmit={(e) => (id ? updateItem(e) : createItem(e))}
                            >
                                <div className="mb-3">
                                    <label className="form-label">
                                        Title
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setDish({ ...dish, title: e.target.value })}
                                        onFocus={() => dish.title ?? setDish({ ...dish, title: "" })}
                                        value={dish.title ?? "Enter title"}
                                    />
                                    <label className="form-label">
                                        Price
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setDish({ ...dish, price: e.target.value })}
                                        onFocus={() => dish.price ?? setDish({ ...dish, price: "" })}
                                        value={dish.price ?? "Enter price"}
                                    />
                                    <label className="form-label">
                                        Image
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setDish({ ...dish, image: e.target.value })}
                                        onFocus={() => dish.image ?? setDish({ ...dish, image: "" })}
                                        value={dish.image ?? "Enter title"}
                                    />

                                    {/* choose */}
                                    <label className="form-label">
                                        Choose Restaurant
                                    </label>
                                    <select
                                        onChange={(e) => setDish({ ...dish, restaurants_id: e.target.value })}
                                        value={dish.restaurants_id}
                                    >
                                        <option value={""}>Choose Restaurant</option>
                                        {restaurants.map((restaurant) => (
                                            <option
                                                key={restaurant.id}
                                                value={restaurant.id}>
                                                {restaurant.title}
                                            </option>
                                        ))}
                                    </select>
                                    <input className="btn btn-primary" type="submit" value="Submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>

        )
    }
};


export default Dish;





