import { useSelector } from "react-redux"
import PageNotLogin from "./PageNotLogin"
import Page403 from "./Page403"

const ProtectedShipper = (props) => {
    const dataUser = useSelector(state => state.account)

    if (dataUser.isAuthenticated == false) {
        return <PageNotLogin />
    } else {
        if (dataUser?.info?.role == "SHIPPER") {
            return props.children
        } else {
            return <Page403 />
        }
    }

}

export default ProtectedShipper