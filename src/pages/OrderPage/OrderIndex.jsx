import { Avatar, Button, Col, Divider, Empty, Progress, Row, Skeleton } from "antd"
import { useDispatch, useSelector } from "react-redux"
import './order.scss'
import { MinusOutlined, PlusOutlined, DeleteOutlined, RightOutlined, ExclamationCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { handleChangeDiscount, handleChangeQuantityItem, handleMinusQuantityItem, handlePlusQuantityItem, handleRemoveDiscount, handleRemoveItemFromCart, handleSetCodeDiscount } from "../../redux/order/orderSlice"
import { useEffect, useState } from "react"
import { fetchAllDiscount } from "../../service/api"
import { useNavigate } from "react-router-dom"
const baseURL = import.meta.env.VITE_URL_BACKEND

const formatter = new Intl.NumberFormat({
    style: 'currency',

});

const OrderIndex = () => {
    const totalPrice = useSelector(state => state.order?.totalPrice)
    const dataCart = useSelector(state => state.order?.items)
    const currentDiscount = useSelector(state => state.order?.codeDiscount)
    const navigate = useNavigate()
    const [listDiscount, setListDiscount] = useState([])
    const dispatch = useDispatch()

    const handlePlusQuantity = (item) => {
        dispatch(handlePlusQuantityItem({ mainText: item?.mainText }))
    }

    const handleMinusQuantity = (item) => {
        dispatch(handleMinusQuantityItem({ mainText: item?.mainText }))
    }

    const handleChaneInputQuantity = (item, value) => {
        if (value <= 1) {
            value = 1
        }
        dispatch(handleChangeQuantityItem({ mainText: item?.mainText, quantity: value }))
    }

    const handleRemoveItem = (item) => {
        console.log(item.mainText)
        dispatch(handleRemoveItemFromCart({ mainText: item?.mainText }))
    }

    //code seller
    const getListCodeDiscount = async (current, pageSize, category) => {
        let res = await fetchAllDiscount(current, pageSize, category)
        console.log(res)
        if (res && res.data) {
            let array = res.data?.listDiscount.filter(item => {
                return item.category == "discount"
            })
            setListDiscount(array)
        }
    }

    const handleSetCodeSeller = (item) => {
        if (item.priceApplicable > totalPrice) {
            navigate('/')
            return
        }
        if (item.title == currentDiscount.title) {
            dispatch(handleRemoveDiscount(currentDiscount))

        } else {
            if (currentDiscount?.title == "") {
                dispatch(handleSetCodeDiscount(item))
            } else {
                dispatch(handleChangeDiscount({ item, discount: currentDiscount?.discount }))
            }
        }


    }

    useEffect(() => {
        getListCodeDiscount(1, 2, "discount")
        document.title = "Giỏ hàng - FAHASA.COM"
    }, [])
    return (
        <div style={{ backgroundColor: '#ededed', minHeight: '50vh' }}>
            <Row className="order-container" style={{ maxWidth: 1260, margin: '0 auto' }}>
                <Col span={24}>
                    <Row className="order-content" gutter={20}>
                        <Col className="order-item" xs={24} sm={24} md={24} lg={15} xl={15} xxl={15} style={{ marginTop: 15 }}>
                            {dataCart?.length > 0 ?
                                <Row>
                                    <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24} >
                                        <Row gutter={[0, 10]}>
                                            {dataCart && dataCart?.length > 0 ? dataCart.map((item, index) => {
                                                return (
                                                    <Col key={index} span={24} style={{ backgroundColor: '#fff', borderRadius: 5 }}>
                                                        <Row style={{ display: 'flex', alignItems: 'center', padding: '20px 10px' }}>
                                                            <Col span={4}>
                                                                <Avatar size={100} shape="square" src={`${baseURL}/images/${item?.thumbnail}`} />
                                                            </Col>
                                                            <Col span={9} style={{ color: '#333333', padding: '0px 10px' }}>
                                                                {item?.mainText}
                                                            </Col>
                                                            <Col span={6}>
                                                                <div style={{ padding: '10px 20px', border: '1px solid #ccc', height: 20, borderRadius: 5, width: 60 }}>
                                                                    <MinusOutlined onClick={() => handleMinusQuantity(item)} style={{ cursor: 'pointer', color: '#888888' }} />
                                                                    <input onChange={(e) => handleChaneInputQuantity(item, e.target.value)} value={item?.quantity}
                                                                        style={{ width: 30, height: 20, border: 'none', outline: 'none', textAlign: 'center', fontWeight: 600, color: '#333' }}
                                                                        type="number" />
                                                                    <PlusOutlined onClick={() => handlePlusQuantity(item)} style={{ cursor: 'pointer', color: '#888888' }} />
                                                                </div>
                                                            </Col>
                                                            <Col span={3} style={{ color: '#c92127', fontWeight: 700, fontSize: 15 }}>
                                                                {formatter.format(item?.price)} đ
                                                            </Col>
                                                            <Col span={1} style={{ marginLeft: 'auto', color: '#2489f4', cursor: 'pointer' }}>
                                                                <DeleteOutlined onClick={() => handleRemoveItem(item)} style={{ fontSize: 20 }} />
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                )
                                            }) : <></>}

                                        </Row>
                                    </Col>

                                    <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} >
                                        <Row gutter={[0, 10]}>
                                            {dataCart && dataCart?.length > 0 ? dataCart.map((item, index) => {
                                                return (
                                                    <Col key={index} span={24} style={{ backgroundColor: '#fff', borderRadius: 5 }}>
                                                        <Row style={{ padding: '18px 10px' }} >
                                                            <Col span={4} style={{ display: 'grid', placeItems: 'center' }}>
                                                                <Avatar size={80} shape="square" src={`${baseURL}/images/${item?.thumbnail}`} />
                                                            </Col>
                                                            <Col xs={18} sm={20} md={0} lg={0} xl={0} xxl={0} style={{ marginLeft: 'auto' }} >
                                                                <Row gutter={[0, 7]}>
                                                                    <Col span={24} style={{ color: '#333333', maxHeight: 35, overflow: 'hidden' }}>
                                                                        {item?.mainText}
                                                                    </Col>

                                                                    <Col span={24} style={{ color: '#c92127', fontWeight: 700, fontSize: 14 }}>
                                                                        {formatter.format(item?.price)} đ
                                                                    </Col>
                                                                    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ padding: '5px 10px', border: '1px solid #ccc', height: 20, borderRadius: 5, width: 90, textAlign: 'center' }}>
                                                                            <MinusOutlined onClick={() => handleMinusQuantity(item)} style={{ cursor: 'pointer', color: '#888888' }} />
                                                                            <input onChange={(e) => handleChaneInputQuantity(item, e.target.value)} value={item?.quantity}
                                                                                style={{ width: 30, height: 20, border: 'none', outline: 'none', textAlign: 'center', fontWeight: 600, color: '#333' }}
                                                                                type="number" />
                                                                            <PlusOutlined onClick={() => handlePlusQuantity(item)} style={{ cursor: 'pointer', color: '#888888' }} />
                                                                        </div>
                                                                        <div style={{ marginLeft: 'auto', color: '#c92127' }}>
                                                                            <DeleteOutlined onClick={() => handleRemoveItem(item)} style={{ fontSize: 20, cursor: 'pointer' }} />
                                                                        </div>

                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                )
                                            }) : <></>}

                                        </Row>
                                    </Col>
                                </Row> :
                                <Row style={{ backgroundColor: '#fff', height: '100%', padding: 20 }}>
                                    <Col span={24}>
                                        <Row gutter={[0, 20]}>
                                            <Col span={24}>
                                                <Empty description="Chưa có sản phẩm trong giỏ hàng của bạn" style={{ margin: '0 auto' }} />
                                            </Col>
                                            <Col span={24} style={{ display: 'grid', placeItems: 'center' }}>
                                                <Button onClick={() => navigate('/')} size="large" style={{
                                                    padding: '0px 20px', backgroundColor: '#c92127',
                                                    color: '#fff', fontSize: 15, width: 250
                                                }}>
                                                    MUA SẮM NGAY
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>}
                        </Col>

                        <Col className="order-item" xs={24} sm={24} md={24} lg={9} xl={9} xxl={9} style={{ marginTop: 15 }} >
                            <Row style={{ backgroundColor: '#fff' }}>

                                <Col span={24}  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px ' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src="https://cdn0.fahasa.com/skin//frontend/ma_vanese/fahasa/images/promotion/ico_coupon.svg" shape="square" />
                                            <span style={{ fontSize: 16, color: '#2489f4', marginLeft: 10 }}>KHUYẾN MÃI</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: 15, color: '#2489f4', marginRight: 5 }}> Xem thêm</span>
                                            <RightOutlined style={{ color: '#2489f4', fontSize: 14 }} />
                                        </div>
                                    </div>
                                    <div style={{ width: '90%', height: 1, backgroundColor: '#ededed', margin: '0 auto' }}></div>

                                </Col>


                                <Col span={24} style={{ padding: '10px 15px', marginTop: 10 }}>
                                    {listDiscount?.length > 0 ? listDiscount.map((discount, index) => {
                                        return (
                                            <>
                                                <Row gutter={[0, 8]} key={index}>
                                                    <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <h3 style={{ fontWeight: 500 }}>{discount?.title}</h3>
                                                        <span style={{ color: '#2489f4', textDecoration: 'underline', fontSize: 15 }}>Chi tiết</span>
                                                    </Col>
                                                    <Col span={24}>
                                                        <span style={{ color: '#666666' }}>
                                                            {discount?.description}
                                                        </span>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Row gutter={20} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Col xs={24} sm={24} md={15} lg={15} xl={15} xxl={15}>
                                                                <Progress percent={totalPrice <= discount?.priceApplicable ?
                                                                    Math.round(((totalPrice + currentDiscount?.discount) / discount?.priceApplicable) * 100)
                                                                    : 100} showInfo={false} />
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666666' }}>
                                                                    <span >{totalPrice + currentDiscount?.discount < discount?.priceApplicable ?
                                                                        `Cần mua thêm ${formatter.format(discount?.priceApplicable - totalPrice)}đ ` :
                                                                        'Đủ điều kiện'}</span>
                                                                    <span>{formatter.format(discount.priceApplicable)}đ</span>
                                                                </div>
                                                            </Col>
                                                            <Col className="button-mobile-code-seller">
                                                                <Button onClick={() => handleSetCodeSeller(discount)} className="button-item-code-seller" style={{ marginLeft: 'auto' }}
                                                                    type={totalPrice + currentDiscount?.discount >= discount?.priceApplicable ?
                                                                        currentDiscount?.title == discount?.title ? "default" : "primary"
                                                                        :
                                                                        'default'}
                                                                >

                                                                    {totalPrice + currentDiscount?.discount < discount?.priceApplicable ?
                                                                        'Mua Thêm'
                                                                        :
                                                                        currentDiscount?.title == discount?.title ? "Bỏ chọn" : "Áp dụng"}
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                </Row>
                                                <Divider /></>
                                        )
                                    }) :
                                        <Row gutter={[0, 10]} style={{ padding: '10px 15px', marginTop: 10 }}>
                                            <Col span={24}>
                                                <Skeleton active />
                                            </Col>
                                            <Divider />
                                            <Col span={24}>
                                                <Skeleton active />
                                            </Col>
                                            <Divider />
                                        </Row>}


                                    <Row style={{ display: 'flex', alignItems: 'center', fontWeight: 500, color: '#aaaaaa' }}>
                                        <span>{currentDiscount?.title != "" ? 'Chỉ có thể áp dụng 1 mã' : 'Chưa áp dụng mã giảm giá nào '}</span>
                                        <ExclamationCircleOutlined style={{ marginLeft: 10, fontSize: 18 }} />
                                    </Row>
                                </Col>

                            </Row>


                            <Row className="hide-md" style={{ padding: '15px ', backgroundColor: '#fff', marginTop: 15 }}>
                                <Col span={24}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 15, fontWeight: 300 }}>Thành tiền : </span>
                                        <span style={{ fontSize: 16, fontWeight: 300 }}>{formatter.format(totalPrice + currentDiscount?.discount)}đ</span>
                                    </div>
                                </Col>
                                <Divider />
                                {currentDiscount?.title ? <>
                                    <Col span={24}>
                                        <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Col span={16} style={{ fontSize: 15, fontWeight: 300 }}>Giảm giá ({currentDiscount?.title}-{currentDiscount?.description}) </Col>
                                            <Col style={{ fontSize: 16, fontWeight: 300 }}>-{formatter.format(currentDiscount?.discount)}đ</Col>
                                        </Row>
                                    </Col>
                                    <Divider /></> : <></>}
                                <Col span={24}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 16, fontWeight: 500 }}>Tổng Số Tiền : </span>
                                        <span style={{ fontSize: 21, color: '#c92127', fontWeight: 550 }}>{formatter.format(totalPrice)}đ</span>
                                    </div>
                                </Col>
                                <Col span={24} style={{ marginTop: 20 }}>
                                    <Button onClick={() => navigate('/checkout')} className={dataCart?.length > 0 ? "" : "btn-disabled"} disabled={dataCart?.length > 0 ? false : true} style={{ width: '100%', height: 50, borderRadius: 8, fontSize: 20, fontWeight: 700, backgroundColor: '#c92127', color: '#fff' }}>
                                        THANH TOÁN
                                    </Button>
                                    <div style={{ color: '#c92127', marginTop: 5, marginLeft: 3 }}>(Giảm giá trên web chỉ áp dụng bán lẻ)</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
                    <Row style={{
                        height: 50, backgroundColor: '#fff', width: '100%', position: 'fixed',
                        bottom: 0, left: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #efefef'
                    }}>
                        <Row gutter={[0, 5]} style={{ padding: '5px 10px' }}>
                            <Col span={24} style={{ color: '#5a5a5a', fontWeight: 400, fontSize: 15 }}>
                                Tổng cộng
                            </Col>
                            <Col span={24} style={{ fontSize: 17, fontWeight: 600, color: '#c92127' }}>
                                {formatter.format(totalPrice)}đ
                            </Col>
                        </Row>
                        <Row style={{ height: '100%' }}>
                            <Button onClick={() => navigate('/checkout')} className={dataCart?.length > 0 ? "" : "btn-disabled"} disabled={dataCart?.length > 0 ? false : true} style={{ height: '100%', backgroundColor: '#c92127', color: '#fff', fontSize: 16 }}>
                                Đến Thanh Toán
                                <ArrowRightOutlined />
                            </Button>
                        </Row>
                    </Row>
                </Col>

            </Row>


        </div>
    )
}

export default OrderIndex