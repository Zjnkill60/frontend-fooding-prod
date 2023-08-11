import { Col, Divider, Row } from "antd"
import './account.scss'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RightOutlined } from '@ant-design/icons'

const SiderAccount = () => {
    const [indexActive, setIndexActive] = useState('')
    const navigate = useNavigate()

    const changeActiveSider = (item) => {
        navigate(`/account/${item}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setIndexActive(item)
    }
    return (
        <Row>
            <Col span={24}>
                <Row style={{ padding: 10, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #88888' }}>
                    <Col xs={0} sm={0} md={0} lg={24} xl={24} xxl={24} style={{ fontSize: 20, fontWeight: 700, color: '#c92127', padding: '15px 20px 0' }}>
                        TÀI KHOẢN
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <Row style={{ color: '#646464', cursor: 'pointer', padding: '0 10px' }}>
                            <Col
                                onClick={() => changeActiveSider('')} className={indexActive == '' ? "active-account-control" : null} span={24}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>Thông tin tài khoản</span>
                                    <RightOutlined style={{ marginTop: 2, marginLeft: 'auto' }} />
                                </div>
                            </Col>
                            <Divider style={{ margin: '20px 0' }} />
                            <Col
                                onClick={() => changeActiveSider('address')} className={indexActive == 'address' ? "active-account-control" : null} span={24}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>   Sổ địa chỉ</span>
                                    <RightOutlined style={{ marginTop: 2, marginLeft: 'auto' }} />
                                </div>


                            </Col>
                            <Divider style={{ margin: '20px 0' }} />
                            <Col
                                onClick={() => changeActiveSider('history')} className={indexActive == 'history' ? "active-account-control" : null} span={24}>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>Lịch sử mua hàng</span>
                                    <RightOutlined style={{ marginTop: 2, marginLeft: 'auto' }} />
                                </div>

                            </Col>
                            <Divider style={{ margin: '20px 0' }} />
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default SiderAccount