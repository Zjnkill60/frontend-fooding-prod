import { useSelector } from "react-redux"
import PageNotLogin from "./PageNotLogin"
import Page403 from "./Page403"

const ProtectedRoute = (props) => {
    const dataUser = useSelector(state => state.account)

    if (dataUser.isAuthenticated == false) {
        return <PageNotLogin />
    } else {
        if (dataUser?.info?.role == "ADMIN") {
            return props.children
        } else {
            return <Page403 />

        }
    }

}

export default ProtectedRoute