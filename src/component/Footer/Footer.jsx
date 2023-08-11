import { Row, Col, Avatar, Space } from "antd"
import './footer.scss'

const Footer = () => {
    return <Row style={{ minHeight: 300, backgroundColor: '#ededed', borderRadius: '8px 8px 0 0' }}>

        <Col span={24} >
            <Row className="footer-container" style={{ maxWidth: 1260, margin: '0px auto 30px' }}>

                <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0} style={{ marginTop: 20, backgroundColor: '#fff', padding: 20, maxWidth: '100vw', overflow: 'hidden' }}>
                    <Space style={{ display: 'flex', justifyContent: "space-between" }}>
                        <Avatar className="item-brand" src="https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2022/cambridge.jpg" />

                        <Avatar className="item-brand" src="https://cdn0.fahasa.com/media/wysiwyg/NXB/logo-nxb/logo-home-page/cengage.jpg" />

                        <Avatar className="item-brand" src="https://cdn0.fahasa.com/media/wysiwyg/NXB/logo-nxb/logo-home-page/Harper-Collins.jpg" />

                        <Avatar className="item-brand" src="https://cdn0.fahasa.com/media/wysiwyg/NXB/logo-nxb/logo-home-page/hachette.jpg" />

                        <Avatar className="item-brand" src="https://cdn0.fahasa.com/media/wysiwyg/NXB/logo-nxb/logo-home-page/macmilan.jpg" />

                        <Avatar className="item-brand" src="https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2022/paragon.jpg" />


                    </Space>
                </Col>
                <Col span={24} style={{ marginTop: 60, backgroundColor: '#fff' }}>
                    <Row style={{ backgroundColor: '#646464', padding: 20, borderRadius: '5px 5px 0 0' }}>



                    </Row>

                    <Row style={{ padding: 20 }}>
                        <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
                            <Row >
                                <Col span={24} style={{ marginTop: 30 }}>
                                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/logo.png" />
                                </Col>
                                <Col span={24} style={{ fontSize: 13, color: '#333333', margin: '20px 0' }}>
                                    Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCMCông Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam

                                </Col>
                                <Col span={24} style={{ fontSize: 13, color: '#333333' }}>
                                    Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi.
                                    KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.
                                </Col>

                                <Col span={24} style={{ margin: '20px 0' }}>
                                    <img width={100} height={30} src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/logo-bo-cong-thuong-da-thong-bao1.png" />
                                </Col>

                                <Col span={24}>
                                    <Space>
                                        <Avatar size={40} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/footer/Facebook-on.png" />

                                        <Avatar size={40} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/Insta-on.png" />

                                        <Avatar size={40} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/Youtube-on.png" />

                                        <Avatar size={40} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/footer/Facebook-on.png" />

                                        <Avatar size={40} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/Insta-on.png" />

                                        <Avatar size={40} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/Youtube-on.png" />

                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={0} sm={0} md={0} lg={14} xl={14} xxl={14} style={{ borderLeft: '1px solid #333', marginTop: 30 }}>
                            <Row >
                                <Avatar shape="square" size={50} style={{ flex: '1 0 20%' }} src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/vnpost1.png" />
                                <Avatar shape="square" size={50} style={{ flex: '1 0 20%' }} src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/ahamove_logo3.png" />
                                <Avatar shape="square" size={50} style={{ flex: '1 0 20%' }} src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/icon_giao_hang_nhanh1.png" />
                                <Avatar shape="square" size={50} style={{ flex: '1 0 20%' }} src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/icon_snappy1.png" />
                                <Avatar shape="square" size={50} style={{ flex: '1 0 20%' }} src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/Logo_ninjavan.png" />
                            </Row>

                        </Col>

                    </Row>
                </Col>
            </Row>
        </Col>
    </Row>
}

export default Footer