import { Avatar, Badge, Col, Descriptions, Divider, Drawer, Row } from 'antd';


const DrawerViewOrder = (props) => {
    const { open, setOpen, dataClick } = props
    // const [imageBookDetail, setImageBookDetail] = useState([])
    const onClose = () => {
        setOpen(false);
    };

    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });

    const baseURL = import.meta.env.VITE_URL_BACKEND


    return (
        <>
            <Drawer width={'50%'} title={`Đơn hàng của ${dataClick?.name} `} placement="right" onClose={onClose} open={open}>
                <Descriptions bordered>
                    <Descriptions.Item span={3} label="Mã Đơn Hàng">{dataClick?.orderCode}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Hình Thức Thanh Toán">{dataClick?.payments}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Họ Tên">{dataClick?.name}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Số Điện Thoại">{dataClick?.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item span={1} label="Email">{dataClick?.email}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Địa Chỉ">{dataClick?.address}</Descriptions.Item>

                    <Descriptions.Item label="Status" span={2}>
                        <Badge status="processing" text={dataClick?.status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số Tiền" span={1}>
                        {formatter.format(dataClick?.totalPrice)}
                    </Descriptions.Item>
                    {dataClick?.reasonReject ? <Descriptions.Item label="Lý do từ chối" span={3}>
                        <Badge status="processing" text={dataClick?.reasonReject} />
                    </Descriptions.Item> : <></>}

                    <Descriptions.Item label="Người Giao" span={3}>
                        {dataClick?.shipper?.name ? `${dataClick?.shipper?.name} - ${dataClick?.shipper?.phoneNumber}` : "Chưa có"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At" span={3}>
                        {new Date().toISOString(dataClick?.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At" span={3}>
                        {new Date().toISOString(dataClick?.updatedAt)}
                    </Descriptions.Item>


                </Descriptions>

                <Row style={{ marginTop: 40 }}>
                    <Col span={24}>
                        {dataClick?.item?.map(order => {
                            return (
                                <>
                                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                                        <Col xs={7} sm={7} md={5} lg={5} xl={4} xxl={4} >
                                            <Avatar size={80} shape='square' src={`${baseURL}/images/${order?.thumbnail}`} />
                                        </Col>
                                        <Col xs={12} sm={13} md={13} lg={13} xl={14} xxl={14} >
                                            {order.name}
                                        </Col>
                                        <Col span={1} style={{ marginLeft: 20 }}>
                                            x{order.quantity}
                                        </Col>
                                        <Col xs={0} sm={0} md={3} lg={3} xl={3} xxl={3} style={{ marginLeft: 'auto', fontSize: 16, color: '#1677ff' }}>
                                            {formatter.format(order.price)} đ
                                        </Col>
                                    </Row>
                                    <Divider />
                                </>
                            )
                        })}
                    </Col>
                </Row>

            </Drawer>
        </>
    )
}

export default DrawerViewOrder