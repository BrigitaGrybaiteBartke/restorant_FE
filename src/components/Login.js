import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Login = () => {

	const auth = useContext(AuthContext);

	const url = `http://localhost:8000/api/login`;
	const hs = {
		Accept: "application/json", "Content-Type": "application/json",
		Authorization: `Bearer ${auth.getToken()}`
	};
	const [creds, setCreds] = useState({ email: "", password: "" });
	const [err, setErr] = useState(null);
	const navigate = useNavigate();


	const login = (e) => {
		e.preventDefault();
		fetch(url, { method: "POST", headers: hs, body: JSON.stringify(creds) })
			.then(
				(res) => {
					if (res.status === 200) return res.json();
					else if (res.status === 422) setErr({ message: res.statusText });
				},
				(err) => console.log(err)
			)
			.then((res) => {
				auth.login(res.user, res.token);
				navigate("/");
			});
	};

	return (
		<div className="d-flex aligns-items-center justify-content-center">
			<div className="card w-50">
				<div className="card-header">Login</div>
				<div className="card-body">
					<div className="text-danger">{err?.message}</div>
					<form onSubmit={(e) => login(e)}>
						<div className="my-2 text-danger"></div>
						<div className="form-group d-grid gap-2">
							<label className="form-label mt-2 mb-0">Email</label>
							<input
								className="form-control"
								type="email"
								name="email"
								onChange={(e) => setCreds({ ...creds, email: e.target.value })}
							/>
							<label className="form-label mt-2 mb-0">Password</label>
							<input
								className="form-control"
								type="password"
								name="password"
								onChange={(e) => setCreds({ ...creds, password: e.target.value })}
							/>
							<input className="btn btn-primary mt-4" type="submit" value="Submit" />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
