import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider, TitleBar, useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import {AppLink, NavigationMenu, Redirect} from "@shopify/app-bridge/actions";
import translations from "@shopify/polaris/locales/en.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@shopify/polaris/build/esm/styles.css";
import HomePage from "./components/HomePage";
import ProductsPage from "./components/ProductsPage.jsx";
import CreateProductPage from "./components/CreateProductPage.jsx";
import UpdateProductPage from "./components/UpdateProductPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import Navigation from "./components/Navigation.jsx";

export default function App() {
  return (
      <BrowserRouter>
        <PolarisProvider i18n={translations}>
          <AppBridgeProvider
              config={{
                apiKey: process.env.SHOPIFY_API_KEY,
                host: new URL(location).searchParams.get("host"),
                forceRedirect: true,
              }}
          >
            <MyProvider>
              <Navigation/>
              <TitleBar
                  title="Home"
                  primaryAction={null}
              />
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/products' element={<ProductsPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/create' element={<CreateProductPage />} />
                <Route path='/update' element={<UpdateProductPage />} />
                <Route path='*' element={<HomePage />} />
              </Routes>
            </MyProvider>
          </AppBridgeProvider>
        </PolarisProvider>
      </BrowserRouter>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
