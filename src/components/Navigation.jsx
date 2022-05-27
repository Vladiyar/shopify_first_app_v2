import React, {useMemo} from 'react';
import {NavigationMenu, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate} from "react-router-dom";

const Navigation = () => {
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const home = useMemo(() => ({
        label: 'Home',
        destination: '/',
    }), []);
    const products = useMemo(() => ({
        label: 'Products',
        destination: '/products',
    }), []);
    const about = useMemo(() => ({
        label: 'Create product',
        destination: '/about',
    }), []);

    return <NavigationMenu
        navigationLinks={[home, products, about]}
    />;
}

export default Navigation;