import { Modal, Form, Input, Row, Col, Select, message, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { PlusCircleOutlined, MinusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { handleCreateOrder, handleFetchAllProd, handleFindAllShipper, handleFindOneProd } from '../../service/api';
import * as uuid from 'uuid'
import CalendarOrder from '../../pages/CheckoutPage/CalendarOrder';


const ModalCreateOrder = (props) => {
    const [form] = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const { isModalOpen, setIsModalOpen, getAllOrders } = props
    const [dataShipperSelect, setDataShipperSelect] = useState([])
    const [dataProductSelect, setDataProductSelect] = useState([])
    const [valueStatusSelect, setValueStatusSelect] = useState(null)
    const [valueDeliverySelect, setValueDeliverySelect] = useState(null)
    const [valueCalendar, setValueCalendar] = useState(null);
    const [valueSelectTime, setValueSelectTime] = useState(null);
    const [orderCode, setOrderCode] = useState(null)

    const [dataItemOrder, setDataItemOrder] = useState([{
        uid: uuid.v4(),
        name: "",
        thumbnail: "",
        quantity: 1,
        price: ""
    }])

    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });


    const generateRandomCodeOrder = () => {
        let listNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        let codeRandom = ""
        listNumber.forEach(item => {
            codeRandom += listNumber[Math.floor(Math.random() * 10)]
        })

        return codeRandom
    }

    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        if (valueDeliverySelect == "calendar") {
            if (!valueCalendar || !valueSelectTime) {
                message.error("Vui lòng chọn thời gian giao hàng !")
                ref.current.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth',
                    inline: 'start'
                });
                return
            }
        }
        const { name, email, phoneNumber, address, totalPrice, status, person, payments } = values
        let prefixEmail = email.concat("@gmail.com")

        setIsLoading(true)
        let res = await handleCreateOrder(name, prefixEmail, phoneNumber, address, totalPrice, status, person, dataItemOrder, payments, `#${orderCode}`, undefined, valueDeliverySelect == "now" ? "Giao Ngay" : `${valueCalendar} - ${valueSelectTime}`)
        setIsLoading(false)
        if (res && res.data) {
            message.success('Tạo mới đơn hàng thành công !')
            await getAllOrders(1, 6)
            setIsModalOpen(false)
            form.resetFields()
        } else {
            message.error(res.message)
        }
    };

    const getAllShipperSelect = async () => {
        let res = await handleFindAllShipper()
        if (res && res?.data) {
            let arrayShipper = res?.data?.listUser.map((item, index) => {
                return {
                    value: item._id,
                    label: `${item?.name} - ${item?.phoneNumber}`
                }
            })
            setDataShipperSelect(arrayShipper)
        }


    }

    const getAllProductSelect = async () => {
        let res = await handleFetchAllProd()
        if (res && res?.data) {
            let arrayProduct = res?.data?.listProduct.map((item, index) => {
                return {
                    value: item?._id,

                    label: `${item?.mainText} - ${formatter.format(item?.price - (item?.price * (item?.percentSale / 100)))}đ`
                }
            })
            setDataProductSelect(arrayProduct)
        }


    }

    const handleSelect = async (value, item, index) => {
        let res = await handleFindOneProd(value)
        let newItem = {
            ...item,
            uid: item.uid,
            name: res.data?.product.mainText,
            price: res.data?.product?.price - (res.data?.product?.price * (res.data?.product?.percentSale / 100)),
            thumbnail: res.data?.product?.thumbnail
        }

        let newArray = dataItemOrder.map(item => item)
        newArray.splice(index, 1, newItem)
        setDataItemOrder(newArray)



    }

    const handleChangeInput = (value, item, index) => {

        let newItem = {
            ...item,
            uid: item.uid,
            quantity: value
        }

        let newArray = dataItemOrder.map(item => item)
        newArray.splice(index, 1, newItem)
        setDataItemOrder(newArray)

    }

    const handleAddItem = (item, index) => {
        let newItem = {
            uid: uuid.v4(),
            name: "",
            thumbnail: "",
            quantity: 1,
            price: ""
        }
        setDataItemOrder([...dataItemOrder, newItem])
    }

    const handleRemoveItem = (item, index) => {
        let newArray = dataItemOrder.filter(element => {
            return element.uid != item.uid
        })
        setDataItemOrder(newArray)
    }

    const handleChangeSelectStatus = (value) => {
        setValueStatusSelect(value)
    }
    const handleChangeSelectDelivery = (value) => {
        setValueDeliverySelect(value)
    }

    useEffect(() => {
        getAllShipperSelect()
        getAllProductSelect()
        let stringCodeRandom = generateRandomCodeOrder()
        setOrderCode(stringCodeRandom)
        form.setFieldsValue({
            status: "Chờ xác nhận"
        })
    }, [])





    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'60%'} title="Tạo mới đơn hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {isLoading ? <LoadingOutlined style={{ color: '#fff', fontSize: 25 }} /> : <Form
                    name="from-create-order"
                    style={{ marginTop: 50 }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item
                                label="Họ Tên"
                                labelCol={{ span: 24 }}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên ',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số Điện Thoại"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập sđt ',
                                    },
                                ]}
                            >
                                <Input type='number' addonAfter="(10 số)" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email ',
                                    },
                                ]}
                            >
                                <Input addonAfter="@gmail.com" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="Địa Chỉ"
                                labelCol={{ span: 24 }}
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập địa chỉ',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item
                                label="Tiền Thu"
                                labelCol={{ span: 24 }}
                                name="totalPrice"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số tiền ',
                                    },
                                ]}
                            >
                                <Input type='number' addonAfter={'VND'} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Trạng Thái"
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trạng thái ',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={handleChangeSelectStatus}
                                    style={{ textAlign: 'center' }}
                                    options={[
                                        {
                                            value: 'Chờ xác nhận',
                                            label: 'Chờ xác nhận',
                                        },
                                        {
                                            value: 'Xác nhận thành công',
                                            label: 'Xác nhận thành công',
                                        },
                                        {
                                            value: 'Đang giao',
                                            label: 'Đang giao',
                                        }

                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="PTTT"
                                name="payments"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trạng thái ',
                                    },
                                ]}
                            >
                                <Select

                                    style={{ textAlign: 'center' }}
                                    options={[
                                        {
                                            value: 'cash',
                                            label: 'cash',
                                        },
                                        {
                                            value: 'banking',
                                            label: 'banking (ship không cần thu tiền)',
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thời Gian Giao Hàng"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trạng thái ',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={handleChangeSelectDelivery}
                                    style={{ textAlign: 'center' }}
                                    options={[
                                        {
                                            value: 'now',
                                            label: 'Giao Ngay',
                                        },
                                        {
                                            value: 'calendar',
                                            label: 'Đặt lịch',
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        {valueDeliverySelect == "calendar" ?
                            <Col span={12} style={{ marginTop: 20 }}>
                                <CalendarOrder setValueCalendar={setValueCalendar} setValueSelectTime={setValueSelectTime} />

                            </Col > : <></>}

                        {valueStatusSelect == "Đang giao" ?
                            <Col span={6}>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Người Giao"
                                    name="person"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn người giao ',
                                        },
                                    ]}
                                >
                                    <Select

                                        style={{ textAlign: 'center' }}
                                        options={dataShipperSelect}
                                    />
                                </Form.Item>
                            </Col> : <></>}

                    </Row>

                    <Row gutter={20} style={{ marginTop: 10 }}>
                        <Col span={16} style={{ marginLeft: 5 }}>
                            Chọn Sản Phẩm
                        </Col>
                        <Col span={4} >
                            Số lượng
                        </Col>
                    </Row>

                    {dataItemOrder?.map((item, index) => {
                        return (
                            <Row gutter={20} style={{ marginTop: 10 }}>
                                <Col span={16}>
                                    <Form.Item

                                        name={"select" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn sản phẩm ',
                                            },
                                        ]}
                                    >
                                        <Select
                                            onChange={(value) => handleSelect(value, item, index)}
                                            style={{ textAlign: 'center', width: '100%' }}
                                            options={dataProductSelect}
                                        />
                                    </Form.Item>


                                </Col>
                                <Col span={4} >
                                    <Input type='number' onChange={(e) => handleChangeInput(e.target.value, item, index)} defaultValue={1} style={{ textAlign: 'center' }} />

                                </Col>
                                <Col span={3} style={{ marginLeft: 'auto' }}>
                                    <Space >
                                        <PlusCircleOutlined onClick={() => handleAddItem(item, index)} style={{ fontSize: 27, color: 'green', cursor: 'pointer' }} />
                                        {dataItemOrder && dataItemOrder.length > 1 ?
                                            <MinusCircleOutlined onClick={() => handleRemoveItem(item, index)} style={{ fontSize: 27, color: 'red', cursor: 'pointer' }} /> :
                                            <></>}

                                    </Space>
                                </Col>
                            </Row>
                        )
                    })}






                </Form>}
            </Modal>

        </>
    )
}

export default ModalCreateOrder