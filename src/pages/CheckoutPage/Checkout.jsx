import { Avatar, Badge, Button, Col, Divider, Form, Input, Radio, Result, Row, Space, Spin, message } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeftOutlined, CopyOutlined, LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons'
import './checkout.scss'
import { useForm } from "antd/es/form/Form"
import { useDispatch, useSelector } from "react-redux"
import { handleCreateOrder, handleFindOneShipper } from "../../service/api"
import { doOrderSuccess } from "../../redux/order/orderSlice"
import ModalUpdateListAddress from "../../component/Modal/ModalUpdateListAddress"


const baseURL = import.meta.env.VITE_URL_BACKEND

const formatter = new Intl.NumberFormat({
    style: 'currency',

});


const onFinishFailed = (errorInfo) => {
    message.error("Vui lòng điền thông tin giao hàng !")
    window.scroll({ top: 0, behavior: 'smooth' })
};

const Checkout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [value, setValue] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const [isFinish, setIsFinish] = useState(false)
    const [data, setData] = useState(null)
    const [addressOrder, setAddressOrder] = useState(null)

    const totalPrice = useSelector(state => state.order?.totalPrice)
    const dataCart = useSelector(state => state.order?.items)
    const dataAccount = useSelector(state => state.account)
    const [formBanking, setFormBanking] = useState(["TP Bank", "NGUYEN DUC ANH", totalPrice])
    const navigate = useNavigate()
    const [form] = useForm()
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        console.log(values)
        const { name, phoneNumber, email, address } = values
        let payments = value == 1 ? 'cash' : 'banking'
        let item = dataCart.map(prod => {
            return {
                name: prod?.mainText,
                price: prod?.price,
                quantity: prod?.quantity,
                thumbnail: prod?.thumbnail,

            }
        })
        setIsLoading(true)

        let res = await handleCreateOrder(name, email, phoneNumber, address, totalPrice, "Chờ xác nhận", undefined, item, payments, `#${formBanking[3]}`, dataAccount?.info?._id)

        setIsLoading(false)
        console.log(res)
        if (res && res.data) {
            message.success("Tạo đơn hàng thành công")
            dispatch(doOrderSuccess())
            setIsFinish(true)
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } else {
            message.error(res.message)
        }
    };

    const onChange = (e) => {

        setValue(e.target.value);
    };

    const onChangeAddress = (e) => {
        console.log(e.target.value)
        setAddressOrder(e.target.value);
    };

    const generateRandomCodeOrder = () => {
        let listNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        let codeRandom = ""
        listNumber.forEach(item => {
            codeRandom += listNumber[Math.floor(Math.random() * 10)]
        })

        return codeRandom
    }

    const handleClickButtonCopyValue = (item, index) => {
        if (index == 3) {
            navigator.clipboard.writeText(`Thanh toan FAHASA ${item}`)
        } else {
            navigator.clipboard.writeText(item)
        }

        message.success("Copy thành công !")
    }

    const fetchDataAccountUser = async () => {
        let res = await handleFindOneShipper(dataAccount?.info?._id)
        console.log(res)
        if (res && res.data) {
            setData(res?.data?.user)
        }
    }

    const handleSubmitOrder = async () => {
        if (dataAccount?.isAuthenticated) {
            if (addressOrder) {
                const { name, phoneNumber, email, address } = addressOrder
                let payments = value == 1 ? 'cash' : 'banking'
                let item = dataCart.map(prod => {
                    return {
                        name: prod?.mainText,
                        price: prod?.price,
                        quantity: prod?.quantity,
                        thumbnail: prod?.thumbnail,

                    }
                })
                setIsLoading(true)
                let res = await handleCreateOrder(name, email, phoneNumber, address, totalPrice, "Chờ xác nhận", undefined, item, payments, `#${formBanking[3]}`)

                setIsLoading(false)
                console.log(res)
                if (res && res.data) {
                    message.success("Tạo đơn hàng thành công")
                    dispatch(doOrderSuccess())
                    setIsFinish(true)
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                } else {
                    message.error(res.message)
                }
            } else {
                message.error("Vui lòng chọn địa chỉ giao hàng")
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } else {
            form.submit()
        }
    }


    useEffect(() => {
        document.title = "Tiến Hành Thanh Toán | FAHASA.COM"
        let stringCodeRandom = generateRandomCodeOrder()
        setFormBanking(formBanking => [...formBanking, stringCodeRandom])
        fetchDataAccountUser()
        window.scrollTo({ top: 0 })
    }, [])




    return (
        <Row style={{ minHeight: '60vh', backgroundColor: '#ededed' }}>
            <ModalUpdateListAddress fetchDataAccountUser={fetchDataAccountUser} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

            {isFinish ?
                <Col span={24} className="checkout-container" style={{ maxWidth: 1260, margin: '0 auto', backgroundColor: '#fff', marginTop: 20 }} >
                    <Result
                        status="success"
                        title="Đặt hàng thành công !"
                        subTitle={`Mã đơn hàng : #${formBanking[3]} , Cảm ơn bạn đã đặt hàng tại Fahasa ,đơn hàng của bạn sẽ được xác nhận sau 1-5 phút.`}
                        extra={dataAccount?.isAuthenticated ?
                            [
                                <Button onClick={() => navigate('/')} type="primary" key="console">
                                    Về trang chủ
                                </Button>,
                                <Button onClick={() => navigate('/account/history')} key="buy">Lịch sử mua hàng</Button>
                            ] : <>
                                <Button onClick={() => navigate('/')} type="primary" key="console">
                                    Về trang chủ
                                </Button>
                            </>}
                    />
                </Col>
                :
                <>
                    <Col span={24}>
                        <Row className="checkout-container" style={{ maxWidth: 1260, margin: '0 auto', marginTop: 20 }}>
                            {dataAccount?.isAuthenticated == false ?
                                <Col span={24} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
                                    <div style={{ backgroundColor: '#f39801', width: 70, padding: '15px 0px', textAlign: 'center' }}>
                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_warning_white.svg?q=102434" />
                                    </div>
                                    <p style={{ fontSize: 15, margin: '0 10px', color: '#555666' }}>Bạn đã là thành viên ? </p>
                                    <Link state={{ number: 1 }} style={{ color: '#f39801', fontSize: 15, textDecoration: 'underline' }} to="/auth">Đăng nhập ngay</Link>

                                </Col> :
                                <></>}

                            <Col span={24} style={{ backgroundColor: '#fff', padding: '10px 20px', marginTop: 15 }}>
                                <Row>
                                    <Col span={24} style={{ fontSize: 16, fontWeight: 500, color: '#333s' }}>
                                        <span>ĐỊA CHỈ GIAO HÀNG</span>
                                        {/* <span style={{ color: '#555', fontWeight: 400, fontSize: 14, marginLeft: 10 }}>( Điền thông tin chính xác để nhận thông báo mới nhất )</span> */}
                                    </Col>
                                    <Divider style={{ margin: '15px 0' }} />
                                    <Col span={24}>
                                        {dataAccount?.isAuthenticated ?
                                            <>
                                                <Radio.Group onChange={onChangeAddress}>
                                                    <Space direction="vertical">
                                                        {data?.address?.map((item, index) => {
                                                            return <Radio value={item} >
                                                                <div style={{ padding: '0 10px' }}>
                                                                    <span style={{ color: '#333333' }}>{item?.name} | </span>
                                                                    <span style={{ color: '#333333' }}>{item?.phoneNumber} | </span>
                                                                    <span style={{ color: '#333333' }}>{item?.email} | </span>
                                                                    <span style={{ color: '#333333' }}>{item?.address}  </span>
                                                                </div>

                                                            </Radio>
                                                        })}

                                                        <Row onClick={() => setIsModalOpen(true)} style={{ color: '#c92127', marginTop: 5, cursor: 'pointer' }}>
                                                            <PlusCircleOutlined style={{ fontSize: 20 }} />
                                                            <span style={{ marginLeft: 15 }}>Thêm địa chỉ mới</span>
                                                        </Row>
                                                    </Space>
                                                </Radio.Group>
                                            </> :
                                            <Form
                                                form={form}
                                                name="basic"
                                                onFinish={onFinish}
                                                onFinishFailed={onFinishFailed}

                                            >
                                                <Form.Item
                                                    label={<span style={{ fontSize: 15, color: '#333' }}>Họ và tên </span>}
                                                    name="name"
                                                    labelCol={{ span: 24 }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng điền trường này !',
                                                        },
                                                    ]}
                                                >
                                                    <Input size='large' placeholder='Nhập họ và tên' className='input-auth' />
                                                </Form.Item>
                                                <Form.Item
                                                    label={<span style={{ fontSize: 15, color: '#333' }}>Số điện thoại </span>}
                                                    name="phoneNumber"
                                                    labelCol={{ span: 24 }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng điền trường này !',
                                                        },
                                                    ]}
                                                >
                                                    <Input size='large' placeholder='Nhập số điện thoại (0971234xxx - 10 kí tự số)' className='input-auth' />
                                                </Form.Item>

                                                <Form.Item
                                                    label={<span style={{ fontSize: 15, color: '#333' }}>Email</span>}

                                                    name="email"
                                                    labelCol={{ span: 24 }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng điền email !',
                                                        },
                                                    ]}
                                                >
                                                    <Input size='large' placeholder='Nhập email (zkm@gmail.com)' className='input-auth' />
                                                </Form.Item>

                                                <Form.Item
                                                    label={<span style={{ fontSize: 15, color: '#333' }}>Địa Chỉ</span>}

                                                    name="address"
                                                    labelCol={{ span: 24 }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng điền địa chỉ !',
                                                        },
                                                    ]}
                                                >
                                                    <Input size='large' placeholder='Nhập số nhà - tên chung cư ' className='input-auth' />
                                                </Form.Item>



                                            </Form>
                                        }
                                    </Col>
                                    {dataAccount?.isAuthenticated ? <></> : <Col span={24} style={{ fontSize: 13, color: '#c92127', textAlign: 'center', opacity: 0.8, marginTop: 10 }}>
                                        --- Vui lòng điền thông tin chính xác để nhận thông báo về đơn hàng mới nhất ---
                                    </Col>}
                                </Row>

                            </Col>

                            <Col span={24} style={{ backgroundColor: '#fff', padding: '10px 20px', marginTop: 20 }}>
                                <Row>
                                    <Col span={24} style={{ fontSize: 16, fontWeight: 500, color: '#333s' }}>
                                        <span>PHƯƠNG THỨC THANH TOÁN</span>
                                    </Col>
                                    <Divider style={{ margin: '15px 0' }} />
                                    <Col>
                                        <Radio.Group onChange={onChange} value={value}>
                                            <Space direction="vertical">
                                                <Radio value={1} >
                                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 3, marginLeft: 10 }}>
                                                        <img src="https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_cashondelivery.svg?q=102434" />
                                                        <span style={{ marginLeft: 14, color: '#333333' }}>Thanh toán bằng tiền mặt</span>
                                                    </div>

                                                </Radio>
                                                <Radio value={2}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 3, marginLeft: 10 }}>
                                                        <img src="https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_zalopayatm.svg?q=102434" />
                                                        <span style={{ marginLeft: 14, color: '#333333' }}>Chuyển khoản ngân hàng / QR Code
                                                            <span style={{ color: '#c92127', marginLeft: 5, fontSize: 13 }}> (Khuyên dùng)</span>
                                                        </span>
                                                    </div>
                                                </Radio>


                                            </Space>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                            </Col>

                            {value == 2 ? <Col span={24} style={{ backgroundColor: '#fff', padding: '10px 10px', marginTop: 20 }}>
                                <Row>
                                    <Col span={24} style={{ fontSize: 16, fontWeight: 500, color: '#333s' }}>
                                        <span>THÔNG TIN CHUYỂN KHOẢN</span>
                                    </Col>
                                    <Divider style={{ margin: '15px 0' }} />
                                    <Col span={24}>
                                        <Row >
                                            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                                <img style={{ width: '100%' }} src={`https://img.vietqr.io/image/tpbank-03757289001-compact.jpg?amount=${totalPrice}&addInfo=Thanh%20toán%20FAHASA%20${formBanking[3]}&accountName=NguyenDucAnh`} />

                                            </Col>
                                            <Col className="info-banking-mobile" xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ marginTop: 100 }}>
                                                <Row gutter={[0, 20]}>
                                                    {formBanking.map((item, index) => {
                                                        return (
                                                            <Col key={index} span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                                                <Input disabled style={{ width: '80%', backgroundColor: '#fafafa', color: '#333' }} defaultValue={index == 3 ? `Thanh toan FAHASA ${item}` : item} />
                                                                <Button onClick={() => handleClickButtonCopyValue(item, index)}><CopyOutlined /></Button>
                                                            </Col>
                                                        )
                                                    })}


                                                </Row>

                                            </Col>
                                            <Col span={24} style={{ padding: '10px 5px', color: '#c92127', fontSize: 13, textAlign: 'center', marginTop: 14 }}>
                                                * Chỉ xác nhận thanh toán sau khi chuyển khoản thành công
                                            </Col>

                                        </Row>
                                    </Col>

                                </Row>

                            </Col> : <></>}

                            <Col span={24} style={{ backgroundColor: '#fff', padding: '10px 20px', marginTop: 20 }}>
                                <Row>
                                    <Col span={24} style={{ fontSize: 16, fontWeight: 500, color: '#333s' }}>
                                        <span>KIỂM LẠI ĐƠN HÀNG</span>
                                    </Col>
                                    <Divider style={{ margin: '15px 0' }} />
                                    <Col span={24}>
                                        {dataCart?.length > 0 ? dataCart.map((item, index) => {
                                            return (
                                                <>
                                                    <Row key={index} gutter={20}>
                                                        <Col span={6}>
                                                            <Badge count={item?.quantity}>
                                                                <Avatar shape="square" size={80} src={`${baseURL}/images/${item?.thumbnail}`} />
                                                            </Badge>

                                                        </Col>
                                                        <Col span={18}>
                                                            <Row gutter={[0, 5]} style={{ padding: '0 10px' }}>
                                                                <Col span={24}>
                                                                    {item?.mainText} x   {item?.quantity}
                                                                </Col>

                                                                <Col span={24} style={{ marginLeft: 'auto', color: '#f39801', fontSize: 15 }}>
                                                                    {formatter.format(item?.price)}đ
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Divider />
                                                </>
                                            )
                                        }) : <></>}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24} style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', height: 110, backgroundColor: '#fff', zIndex: 10, borderTop: '1px solid #ededed' }}>
                        <Row className="checkout-container" style={{ maxWidth: 1260, margin: '0 auto' }}>
                            <Col span={24}>
                                <Row style={{ padding: '10px 10px', height: '100%' }}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                                            Tổng Số Tiền :
                                        </div>
                                        <span style={{ fontSize: 20, color: '#f39801', fontWeight: 600 }}>
                                            {formatter.format(totalPrice)}đ
                                        </span>
                                    </Col>

                                    <Divider style={{ margin: '10px 0' }} />
                                    <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div onClick={() => navigate("/cart")} className="hide-sm" style={{ color: '#555555', display: 'flex', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
                                            <ArrowLeftOutlined style={{ fontSize: 20 }} />
                                            <span style={{ marginLeft: 10, fontSize: 15 }}>Quay về giỏ hàng</span>
                                        </div>
                                        <Row className="btn-checkout-sm" style={{ height: 50, width: 300 }}>
                                            <Col span={24}>
                                                <Button onClick={() => handleSubmitOrder()} type="primary" style={{
                                                    backgroundColor: '#c92127', width: '100%',
                                                    height: '100%', fontSize: 18, fontWeight: 700
                                                }}>{isLoading ? <LoadingOutlined style={{ color: '#fff', fontSize: 25 }} /> : 'XÁC NHẬN THANH TOÁN'}</Button>

                                            </Col>


                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                </>}


        </Row>
    )
}

export default Checkout