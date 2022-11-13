import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Restaurant = () => {

    const auth = useContext(AuthContext);

    let { id } = useParams();

    const url = `http://localhost:8000/api/restaurants`;
    const hs = {
        Accept: "application/json", "Content-Type": "application/json",
        Authorization: `Bearer ${auth.getToken()}`
    };
    const [restaurant, setRestaurant] = useState([]); // single restaurant
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);

    const navigate = useNavigate();

    //  jei esame update page => rastas id
    useEffect(() => {
        if (id)
            fetch(`${url}/${id}`)
                .then((res) => res.json())
                .then((res) => {
                    setRestaurant(res);
                    setIsLoaded(true);
                },
                    (err) => {
                        // setInitialLoadError(err);
                        setError(err);
                        console.log(err)
                        setIsLoaded(true);
                    }
                );
        else setIsLoaded(true);
    }, [id, url]);


    const createItem = (e) => {
        e.preventDefault();
        fetch(url, { method: "POST", headers: hs, body: JSON.stringify(restaurant) })
            .then(
                (res) => {
                    console.log(res)
                    if (res.status === 200 || res.status === 201) {
                        setStatus({ message: res.statusText });
                        navigate("/rest");
                    }
                    else {
                        // console.log(res.statusText)
                        setError({ message: "Input fields are empty" });
                    }
                    //   for different errors
                    // else if (res.status === 401) { // unauthorized
                    //     setStatus({ message: res.statusText });
                    // }
                    // else if (res.status === 422) {
                    //     setStatus({ message: res.statusText });
                    // }
                }
            )
            .catch(err => {
                // console.log(err);
                setError(err);
                setIsLoaded(true);
            })

    }

    const updateItem = (e) => {
        e.preventDefault();
        fetch(`${url}/${id}`, { method: "PUT", headers: hs, body: JSON.stringify(restaurant) })
            .then(
                (res) => {
                    if (res.status === 200 && restaurant.title !== '') {
                        // setStatus({ message: res.statusText });
                        navigate("/rest");
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


                {/* form */}
                <div className="d-flex aligns-items-center justify-content-center">
                    <div className="card w-50">
                        <h5 className="card-header"
                        >
                            {id ? `Update restaurant, id: ${id}` : `Create a new Restaurant`}
                        </h5>
                        <div className="card-body">
                            <form
                                onSubmit={(e) => (id ? updateItem(e) : createItem(e))}
                            >
                                {/* status text
                                <p>{status === null ? "" : status.message}</p> */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Title
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setRestaurant({ ...restaurant, title: e.target.value })}
                                        onFocus={() => restaurant.title ?? setRestaurant({ ...restaurant, title: "" })}
                                        value={restaurant.title ?? "Enter title"}
                                    />
                                    <label className="form-label">
                                        City
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setRestaurant({ ...restaurant, city: e.target.value })}
                                        onFocus={() => restaurant.city ?? setRestaurant({ ...restaurant, city: "" })}
                                        value={restaurant.city ?? "Enter city"}
                                    />
                                    <label className="form-label">
                                        Address
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
                                        onFocus={() => restaurant.address ?? setRestaurant({ ...restaurant, address: "" })}
                                        value={restaurant.address ?? "Enter address"}
                                    />
                                    <label className="form-label">
                                        Working hours
                                    </label>
                                    <input
                                        className="form-control mb-3"
                                        onChange={(e) => setRestaurant({ ...restaurant, workingTime: e.target.value })}
                                        onFocus={() => restaurant.workingTime ?? setRestaurant({ ...restaurant, workingTime: "" })}
                                        value={restaurant.workingTime ?? "Enter working time"}
                                    />
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


export default Restaurant;