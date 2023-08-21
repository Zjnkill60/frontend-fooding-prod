import React, { useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { CheckOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { handleFetchOrderForShipper, handleFetchOrderLengthForShipper } from '../../service/api';
import ModalShipper from '../../component/Modal/ModalShipper';



const formatter = new Intl.NumberFormat({
    style: 'currency',

});

const Shipper = (props) => {
    const { user } = props
    const [listOrder, setListOrder] = useState(null)
    const [orderStatusLength, setOrderStatusLength] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataClick, setDataClick] = useState({})


    const showModalShipper = (text) => {
        setDataClick(text)
        setIsModalOpen(true);
    };

    const findOrderForShipper = async (id, status) => {
        let res = await handleFetchOrderForShipper(id, status)
        console.log('data : ', res)
        if (res && res.data) {
            setListOrder(res.data?.listOrder)
        }
    }

    const fetchLengthOrerStatus = async () => {
        let res = await handleFetchOrderLengthForShipper(user?.info?._id)
        console.log("length : ", res)
        if (res && res.data) {
            setOrderStatusLength(res.data?.lengthOrder)
        }
    }

    const onChange = async (key) => {
        console.log(key);
        findOrderForShipper(user?.info?._id, key)
    };

    const items = [
        {
            key: 'Đang giao',
            label: `Cần giao (${orderStatusLength?.lengthRunning})`,
            children: <>
                {listOrder && listOrder?.length > 0 ? listOrder.map((item, index) => {
                    return <Row onClick={() => showModalShipper(item)} style={{ marginBottom: 20 }}>
                        <Col span={24} style={{ backgroundColor: '#f2f1bb', display: 'flex', alignItems: 'center', padding: '5px' }}>
                            <CheckOutlined style={{ fontSize: 27, color: 'green', marginRight: 10 }} />
                            <span style={{ fontSize: 15, color: 'green', fontWeight: 600 }}>Đơn mới</span>
                            {item?.payments == "banking" ? <span style={{ marginLeft: 10 }}>(ĐÃ CHUYỂN KHOẢN)</span> : <></>}
                        </Col>
                        <Col span={24} style={{ padding: 10, backgroundColor: '#fff' }}>
                            <Row>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Họ Tên : </span>
                                    <span>{item?.name}</span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>SĐT : </span>
                                    <span><a onClick={(e) => e.stopPropagation()} href="tel:+0984831947">{item?.phoneNumber} (Click)</a></span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Địa Chỉ :  </span>
                                    <span>{item?.address}</span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Số tiền cần thu :  </span>
                                    <span>{formatter.format(item?.totalPrice)}đ</span>
                                </Col>
                                <Col span={24}>
                                    <Row>
                                        <Col span={24}>
                                            <span style={{ color: 'red', fontWeight: 600 }}>Đồ Giao :  </span>
                                        </Col>
                                        <Col span={24}>
                                            <ul style={{ padding: '0 25px' }}>
                                                {item?.item.map((elm => {
                                                    return <li style={{ fontSize: 13 }}>{elm.name} - <span style={{ fontWeight: 700 }}>x{elm.quantity}</span></li>
                                                }))}
                                            </ul>
                                        </Col>
                                    </Row>


                                </Col>
                            </Row>

                        </Col>

                    </Row>

                }) : <>Tạm thời chưa có đơn hàng nào</>}

            </>,
        },
        {
            key: 'Hoàn tất',
            label: `Giao Xong (${orderStatusLength?.lengthDone})`,
            children: <>
                {listOrder && listOrder?.length > 0 ? listOrder.map((item, index) => {
                    return <Row style={{ marginBottom: 20 }}>
                        <Col span={24} style={{ backgroundColor: '#f2f1bb', display: 'flex', alignItems: 'center', padding: '5px' }}>
                            <CheckCircleOutlined style={{ fontSize: 27, color: 'orange', marginRight: 10 }} />
                            <span style={{ fontSize: 15, color: 'orange', fontWeight: 600 }}>
                                Đơn giao xong
                            </span>
                            <span style={{ fontSize: 12, marginLeft: 'auto' }}>
                                ({item?.isPayment && item?.isPayment == "YES" ? "Đã thanh toán" : "Chưa thanh toán"})
                            </span>
                        </Col>
                        <Col span={24} style={{ padding: 10, backgroundColor: '#fff' }}>
                            <Row>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Họ Tên : </span>
                                    <span>{item?.name}</span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>SĐT : </span>
                                    <span><a href="tel:+0984831947">{item?.phoneNumber} (Click)</a></span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Địa Chỉ :  </span>
                                    <span>{item?.address}</span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Số tiền đã thu :  </span>
                                    <span>{item?.cash ? `${formatter.format(item?.cash)}k` : "Chưa thu"}</span>
                                </Col>
                                <Col span={24}>
                                    <Row>
                                        <Col span={24}>
                                            <span style={{ color: 'red', fontWeight: 600 }}>Đồ Giao :  </span>
                                        </Col>
                                        <Col span={24}>
                                            <ul style={{ padding: '0 25px' }}>
                                                {item?.item.map((elm => {
                                                    return <li style={{ fontSize: 13 }}>{elm.name} - <span style={{ fontWeight: 700 }}>x{elm.quantity}</span></li>
                                                }))}
                                            </ul>
                                        </Col>
                                    </Row>


                                </Col>
                            </Row>

                        </Col>

                    </Row>

                }) : <>Tạm thời chưa có đơn hàng nào</>}

            </>,
        },
        {
            key: 'Từ chối',
            label: `Đơn Huỷ(${orderStatusLength?.lengthReject})`,
            children: <>
                {listOrder ? listOrder.map((item, index) => {
                    return <Row style={{ marginBottom: 20 }}>
                        <Col span={24} style={{ backgroundColor: '#f2f1bb', display: 'flex', alignItems: 'center', padding: '5px' }}>
                            <CloseCircleOutlined style={{ fontSize: 27, color: 'red', marginRight: 10 }} />
                            <span style={{ fontSize: 15, color: 'red', fontWeight: 600 }}>Bị Từ Chối</span>
                        </Col>
                        <Col span={24} style={{ padding: 10, backgroundColor: '#fff' }}>
                            <Row>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Họ Tên : </span>
                                    <span>{item?.name}</span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>SĐT : </span>
                                    <span><a href="tel:+0984831947">{item?.phoneNumber} (Click)</a></span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Địa Chỉ :  </span>
                                    <span>{item?.address}</span>
                                </Col>
                                <Col span={24}>
                                    <span style={{ color: 'red', fontWeight: 600 }}>Lí do từ chối :  </span>
                                    <span>{item?.reasonReject}</span>
                                </Col>
                                <Col span={24}>
                                    <Row>
                                        <Col span={24}>
                                            <span style={{ color: 'red', fontWeight: 600 }}>Đồ Giao :  </span>
                                        </Col>
                                        <Col span={24}>
                                            <ul style={{ padding: '0 25px' }}>
                                                {item?.item.map((elm => {
                                                    return <li style={{ fontSize: 13 }}>{elm.name} - <span style={{ fontWeight: 700 }}>x{elm.quantity}</span></li>
                                                }))}
                                            </ul>
                                        </Col>
                                    </Row>


                                </Col>
                            </Row>

                        </Col>

                    </Row>

                }) : <>Tạm thời chưa có đơn hàng nào</>}

            </>,
        },
    ];



    useEffect(() => {
        findOrderForShipper(user?.info?._id, "Đang giao")
        fetchLengthOrerStatus()
    }, [])

    return (
        <div style={{ padding: '10px', backgroundColor: '#ededed', minHeight: '100vh' }}>
            <ModalShipper user={user} findOrderForShipper={findOrderForShipper} fetchLengthOrerStatus={fetchLengthOrerStatus}
                isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} dataClick={dataClick} />
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

        </div>
    )
}

export default Shipper
