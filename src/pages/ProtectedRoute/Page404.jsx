import React from 'react';
import { Button, Col, Result, Row } from 'antd';

const Page404 = () => (
    <Row style={{ height: '100vh' }}>
        <Col span={18} style={{ margin: 'auto' }}>
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, có vẻ trang bạn tìm không tồn tại !"
                extra={<Button type="primary">Back Home</Button>}
            />
        </Col>
    </Row>
);

export default Page404;