import { Button, Col, Result, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';


const PageNotLogin = () => {
    const navigate = useNavigate()
    return (
        <Row style={{ height: '100vh' }}>
            <Col span={18} style={{ margin: 'auto' }}>
                <Result
                    status="warning"
                    title="Vui lòng đăng nhập để sử dụng tính năng này"
                    extra={
                        <Button onClick={() => navigate('/auth', { state: { callback: '/admin' } })} type="primary" key="console">
                            Đăng nhập ngay
                        </Button>
                    }
                />
            </Col>
        </Row>
    )
}

export default PageNotLogin