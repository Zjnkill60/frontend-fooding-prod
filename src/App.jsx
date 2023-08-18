import * as React from "react";
import * as ReactDOM from "react-dom/client";
import './index.scss'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import Home from "./pages/HomePage/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import { handleFetchAccount } from "./service/api";
import { useDispatch, useSelector } from "react-redux";
import { handleDispatchLogin, handleDispatchLogout } from "./redux/account/accountSlice";
import Account from "./pages/AccountPage/Account";
import LayoutAdmin from "./pages/AdminPage/LayoutAdmin";
import DashBoard from "./pages/AdminPage/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import Page404 from "./pages/ProtectedRoute/Page404";
import ManageUser from "./pages/AdminPage/ManageUser/ManageUser";
import ManageOrder from "./pages/AdminPage/ManageOrder/ManageOrder";
import ManageProduct from "./pages/AdminPage/ManageProduct/ManageProduct";
import ProtectedShipper from "./pages/ProtectedRoute/ProtectedShipper";
import Shipper from "./pages/ShipperPage/Shipper";
import ManageFlashSale from "./pages/AdminPage/ManageFlashSale/ManageFlashSale";
import DetailProd from "./pages/DetailPage/DetailProd";
import OrderIndex from "./pages/OrderPage/OrderIndex";
import ManageCodeSeller from "./pages/AdminPage/ManageCodeSeller/ManageCodeSeller";
import Checkout from "./pages/CheckoutPage/Checkout";
import History from "./pages/HistoryPage/History";
import { Col, message, Row } from "antd";
import SiderAccount from "./pages/AccountPage/SiderAccount";
import ListAddress from "./pages/AccountPage/ListAddress";
import DealHotPage from "./pages/DealHotPage/DealHotPage";



const LayoutHomePage = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

const LayoutAdminPage = (props) => {
  const { dataUser } = props

  return (
    <>
      {dataUser?.info?.role == "ADMIN" ?
        <LayoutAdmin dataUser={dataUser} >
          <Outlet />
        </LayoutAdmin> :
        <Outlet />}

    </>
  )
}

const LayoutAccount = () => {

  return (
    <>
      <Header />
      <Row style={{ backgroundColor: '#ededed', minHeight: '50vh' }}>
        <Col className="account-container" style={{ maxWidth: 1260, margin: '0 auto', marginTop: 10 }} span={24} >
          <Row className="account-content" >
            <Col xs={0} sm={0} md={0} lg={5} xl={5} xxl={5} >
              <SiderAccount />
            </Col>
            <Col style={{ marginLeft: 'auto' }} xs={24} sm={24} md={24} lg={18} xl={18} xxl={18} >
              <Outlet />
            </Col>
            <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0} >
              <SiderAccount />
            </Col>
          </Row>

        </Col>
      </Row>
      <Footer />
    </>
  )
}



function App() {
  const distpach = useDispatch()
  const user = useSelector(state => state.account)

  const handleFetchProfile = async () => {
    if (window.location.pathname.includes("auth")) {
      return
    }
    let res = await handleFetchAccount()
    if (res && res.data) {
      distpach(handleDispatchLogin(res.data?.user))
    } else {
      distpach(handleDispatchLogout())
    }

  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutHomePage />,
      errorElement: <Page404 />,
      children: [{
        index: true,
        element: <Home />
      },
      {
        path: 'auth',
        element: <AuthPage />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'account',
        element: <Account />
      },
      {
        path: 'cart',
        element: <OrderIndex />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'product/:slug',
        element: <DetailProd />
      },
      {
        path: 'xu-huong-mua-sam',
        element: <DealHotPage />
      }
      ]
    },
    {
      path: "/admin",
      errorElement: <Page404 />,
      element: <LayoutAdminPage dataUser={user} />,
      children: [{
        index: true,
        element: <ProtectedRoute><DashBoard /></ProtectedRoute>
      },
      {
        path: 'manage-users',
        element: <ManageUser />
      },
      {
        path: 'manage-products',
        element: <ManageProduct />
      },
      {
        path: 'manage-orders',
        element: <ManageOrder />
      },
      {
        path: 'manage-flashsale',
        element: <ManageFlashSale />
      },
      {
        path: 'manage-discount',
        element: <ManageCodeSeller />
      }

      ]
    },
    {
      path: "/shipper",
      errorElement: <Page404 />,
      element: <ProtectedShipper>
        <Header />
        <Shipper user={user} />
      </ProtectedShipper>

    },
    {
      path: 'account',
      errorElement: <Page404 />,
      element: <LayoutAccount />,
      children: [{
        index: true,
        element: <Account />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'address',
        element: <ListAddress />
      }
      ]
    }
  ]);


  React.useEffect(() => {
    handleFetchProfile()
  }, [])
  return <RouterProvider router={router} />
}

export default App
