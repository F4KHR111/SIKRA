import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Kendaraan from "../pages/kendaraan/Kendaraan";
import User from "../pages/user/User";
import Pemeriksaan from "../pages/pemeriksaan/Pemeriksaan";
import Item from "../pages/item/Item";
import Laporan from "../pages/laporan/Laporan";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Halaman setelah login */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/kendaraan"
                        element={<Kendaraan />}
                    />

                    <Route
                        path="/user"
                        element={
                            <AdminRoute>
                                <User />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/item"
                        element={
                            <AdminRoute>
                                <Item />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/pemeriksaan"
                        element={<Pemeriksaan />}
                    />

                    <Route
                        path="/laporan"
                        element={<Laporan />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;