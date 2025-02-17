import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/index';
import NewCustomer from './pages/NewCustomer/index';
import CustomerListNew from './pages/CustomerListNew/index';
import AdminAddAgent from './pages/AdminAddAgent/index';
import AgentList from './pages/AgentList/index';
import RepresentativeList from './pages/RepresentativeList/index';
import AgentCustomers from './pages/AgentCustomers/index';
import MyCustomers from './pages/MyCustomers/index';
import { useAuthStore } from './store/authStore';
function PrivateRoute({ children, adminOnly = false }) {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (adminOnly && user.role !== 'admin') {
        return _jsx(Navigate, { to: "/new-customer", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function App() {
    return (_jsxs(BrowserRouter, { children: [_jsx(Toaster, { position: "top-right" }), _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/add-customer", element: _jsx(Navigate, { to: "/new-customer", replace: true }) }), _jsx(Route, { path: "/new-customer", element: _jsx(PrivateRoute, { children: _jsx(NewCustomer, {}) }) }), _jsx(Route, { path: "/customers", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(CustomerListNew, {}) }) }), _jsx(Route, { path: "/customers/new", element: _jsx(PrivateRoute, { children: _jsx(NewCustomer, {}) }) }), _jsx(Route, { path: "/agents", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(AgentList, {}) }) }), _jsx(Route, { path: "/representatives", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(RepresentativeList, {}) }) }), _jsx(Route, { path: "/representatives/add", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(AdminAddAgent, {}) }) }), _jsx(Route, { path: "/admin/add-agent", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(AdminAddAgent, {}) }) }), _jsx(Route, { path: "/agent-customers", element: _jsx(PrivateRoute, { children: _jsx(AgentCustomers, {}) }) }), _jsx(Route, { path: "/agent-customers/:agentId", element: _jsx(PrivateRoute, { adminOnly: true, children: _jsx(AgentCustomers, {}) }) }), _jsx(Route, { path: "/my-customers", element: _jsx(PrivateRoute, { children: _jsx(MyCustomers, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] })] }));
}
export default App;
