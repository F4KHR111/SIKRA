import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

    try {

        const token = localStorage.getItem("token");

        if (token) {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            if (payload.role === "Admin") {
                return children;
            }

        }

    } catch (err) {
        console.log(err);
    }

    // Bukan Admin, redirect ke dashboard
    return <Navigate to="/dashboard" replace />;

}

export default AdminRoute;
