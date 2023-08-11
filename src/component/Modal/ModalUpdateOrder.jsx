import { Button, Modal, Form, Input, Row, Col, Select, message, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { PlusCircleOutlined, MinusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { handleFetchAllProd, handleFindAllShipper, handleFindOneProd, handleUpdateOrder } from '../../service/api';
import * as uuid from 'uuid'
const baseURL = import.meta.env.VITE_URL_BACKEND


const ModalUpdateOrder = (props) => {
    const [form] = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const { isModalOpen, setIsModalOpen, getAllOrders, dataClick, setCurrent } = props
    const [dataShipperSelect, setDataShipperSelect] = useState([])
    const [dataProductSelect, setDataProductSelect] = useState([])

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


    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {

        const { name, email, phoneNumber, address, totalPrice, status, person } = values
        let shipper = person?.value ? person.value : person
        let prefixEmail = email.concat("@gmail.com")

        setIsLoading(true)
        let res = await handleUpdateOrder(dataClick?._id, name, prefixEmail, phoneNumber, address, totalPrice, status, shipper, dataItemOrder)
        setIsLoading(false)
        if (res && res.data) {
            message.success('Cập nhật đơn hàng thành công !')
            await getAllOrders(1, 6)
            setIsModalOpen(false)
            setCurrent(1)
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

    useEffect(() => {
        let newEmail = dataClick?.email?.substring(0, (dataClick?.email.indexOf("@")))
        getAllShipperSelect()
        getAllProductSelect()
        setDataItemOrder(dataClick?.item)
        form.setFieldsValue({
            status: "Xác nhận thành công",
            name: dataClick?.name,
            email: newEmail,
            address: dataClick?.address,
            phoneNumber: dataClick?.phoneNumber,
            totalPrice: dataClick?.totalPrice,
            person: dataClick?.shipper ? {
                value: dataClick?.shipper?._id ? dataClick?.shipper?._id : undefined,
                label: dataClick?.shipper?.name ? `${dataClick?.shipper?.name} - ${dataClick?.shipper?.phoneNumber}` : undefined
            } : undefined
        })
        dataClick?.item?.forEach((element, index) => {
            form.setFieldsValue({
                ["select" + index]: `${element?.name} - ${formatter.format(element?.price)}đ`,
                ["input" + index]: `${element?.quantity} `
            })
        });
    }, [dataClick])





    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'60%'} title="Cập nhật đơn hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {isLoading ? <LoadingOutlined style={{ color: '#fff', fontSize: 25 }} /> : <Form
                    name="from-update-order"
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
                                            value: 'Từ chối',
                                            label: 'Từ chối',
                                        },


                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>

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
                        </Col>
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
                                    <Form.Item

                                        name={"input" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số lượng',
                                            },
                                        ]}
                                    >
                                        <Input type='text' onChange={(e) => handleChangeInput(e.target.value, item, index)} defaultValue={1} style={{ textAlign: 'center' }} />

                                    </Form.Item>

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

export default ModalUpdateOrder