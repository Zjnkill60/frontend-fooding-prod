import { Col, Row } from "antd"
import './auth.scss'
import Login from "./Login/Login"
import Register from "./Register/Register"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"


const AuthPage = () => {
    const [indexActive, setIndexActive] = useState(1)
    const location = useLocation();


    useEffect(() => {
        setIndexActive(location?.state?.number)
    }, [location?.state?.number])

    return (
        <Row className="auth-container">
            <Col span={24} style={{ marginTop: 5 }}>
                <Row className="auth-content">
                    <Col span={24}>
                        <Row className="form-container">

                            <Col span={24}>
                                <Row style={{ padding: '0 30px' }}>
                                    <Col className={indexActive == 1 ? 'active' : 'title-auth'} onClick={() => setIndexActive(1)} span={12} style={{ textAlign: 'center' }}>
                                        Đăng nhập
                                    </Col>
                                    <Col className={indexActive == 2 ? 'active' : 'title-auth'} onClick={() => setIndexActive(2)} span={12} style={{ textAlign: 'center' }}>
                                        Đăng ký
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24}>
                                <Row style={{ marginTop: 40, padding: '0 30px' }}>
                                    <Col span={24} style={{ margin: '0 auto' }}>
                                        {indexActive == 1 ? <Login span={12} /> : <Register setIndexActive={setIndexActive} />}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default AuthPage