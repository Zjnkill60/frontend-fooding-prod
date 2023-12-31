import { Button, Card, Col, Rate, Row, Skeleton, Space } from 'antd';
import './home.scss'
import { RightOutlined, LeftOutlined, StarOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchInfoFlashsale, handleFetchProductCategory, handleFetchProductPaginate } from '../../service/api';
import { getHour, getInitTimeFuture, getMinute, getSecond } from '../../utilities/getTime';
const baseURL = import.meta.env.VITE_URL_BACKEND

const Home = () => {
    const navigate = useNavigate()
    //baner
    const carousel = useRef()
    //slider flashsale
    const sliderFlashSale = useRef()
    const firstCardSliderFlashSale = useRef()
    //slider trend
    const sliderTrend = useRef()
    const firstCardSliderTrend = useRef()
    //slider cook
    const sliderCook = useRef()
    const firstCardSliderCook = useRef()
    //slider ingredient
    const sliderIngredient = useRef()
    const firstCardSliderIngredient = useRef()
    const [indexActiveBanner, setIndexActiveBanner] = useState(0)
    const [indexActiveTabs, setIndexActiveTabs] = useState("sold")
    const [indexActiveTabsCook, setIndexActiveTabsCook] = useState("fried")
    const [indexActiveTabsIngredient, setIndexActiveTabsIngredient] = useState("chicken")
    //timer
    const [timeFuture, setTimeFuture] = useState(null)
    const [second, setSecond] = useState(0)
    const [minute, setMinute] = useState(30)
    const [hour, setHours] = useState(0)
    const [isTimeEnd, setIsTimeEnd] = useState(false)

    //data item flashsale
    const [dataItemFlashSale, setDataItemFlashSale] = useState([])
    const [dataItemTrend, setDataItemTrend] = useState([])
    const [dataItemCook, setDataItemCook] = useState([])
    const [dataItemIngredient, setDataItemIngredient] = useState([])


    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });

    const handleMoveRightBanner = () => {

        if (Math.floor(carousel.current.scrollLeft) == carousel.current.scrollWidth - carousel.current.offsetWidth) {
            carousel.current.classList.add("no-transition")
            carousel.current.scrollLeft = 0
            carousel.current.classList.remove("no-transition")
        } else {
            carousel.current.scrollLeft += carousel.current.offsetWidth
        }
        setIndexActiveBanner(Math.round((carousel.current.scrollLeft) / carousel.current.offsetWidth))
    }

    const handleMoveLeftBanner = () => {
        // carousel.current.scrollLeft -= carousel.current.offsetWidth
        if (carousel.current.scrollLeft == 0) {
            carousel.current.classList.add("no-transition")
            carousel.current.scrollLeft = carousel.current.scrollWidth - carousel.current.offsetWidth
            carousel.current.classList.remove("no-transition")
        } else {
            carousel.current.scrollLeft -= carousel.current.offsetWidth
        }
    }

    const handleMoveRightSlider = (type) => {
        if (type == "flashsale") {
            sliderFlashSale.current.scrollLeft += firstCardSliderFlashSale.current.offsetWidth
        }

        if (type == "trend") {
            sliderTrend.current.scrollLeft += firstCardSliderTrend.current.offsetWidth
        }
        if (type == "cook") {
            sliderCook.current.scrollLeft += firstCardSliderCook.current.offsetWidth
        }

        if (type == "ingredient") {
            sliderIngredient.current.scrollLeft += firstCardSliderIngredient.current.offsetWidth
        }

    }

    const handleMoveLeftSlider = (type) => {
        if (type == "flashsale") {
            sliderFlashSale.current.scrollLeft -= firstCardSliderFlashSale.current.offsetWidth
        }

        if (type == "trend") {
            sliderTrend.current.scrollLeft -= firstCardSliderTrend.current.offsetWidth
        }

        if (type == "cook") {
            sliderCook.current.scrollLeft -= firstCardSliderCook.current.offsetWidth
        }

        if (type == "ingredient") {
            sliderIngredient.current.scrollLeft -= firstCardSliderIngredient.current.offsetWidth
        }
    }


    const changeActiveTrendShopping = async (key) => {
        setIndexActiveTabs(key)
        setDataItemTrend([])
        let res = await handleFetchProductPaginate(1, 10, `-${key}`)
        if (res && res.data) {
            setDataItemTrend(res.data?.listProduct)

        }
    }

    const changeActiveTabsCook = async (key) => {
        setIndexActiveTabsCook(key)
        setDataItemCook([])
        let res = await handleFetchProductCategory(1, 10, 'cook', key, 'sold')
        console.log(res)
        if (res && res.data) {
            setDataItemCook(res.data?.listProduct)
        }
    }

    const changeActiveTabsIngredient = async (key) => {
        setIndexActiveTabsIngredient(key)
        setDataItemIngredient([])
        let res = await handleFetchProductCategory(1, 10, 'ingredient', key, 'sold')
        if (res && res.data) {
            setDataItemIngredient(res.data?.listProduct)

        }
    }



    const slug = function (str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    };

    const handleNavigateDetailPage = (prod, type) => {
        let nameQuery = slug(prod?.mainText)
        navigate(`/product/${nameQuery}?id=${prod?._id}`, { state: { prod } })

    }

    useEffect(() => {
        let timeIntever = setInterval(() => {
            handleMoveRightBanner()
        }, 5000);


        return () => {
            clearInterval(timeIntever)
        }
    }, [])

    useEffect(() => {
        getInitTimeFuture(setSecond, setMinute, setHours, setTimeFuture, setDataItemFlashSale, setIsTimeEnd)
        changeActiveTrendShopping(indexActiveTabs)
        changeActiveTabsCook(indexActiveTabsCook)
        changeActiveTabsIngredient(indexActiveTabsIngredient)
    }, [])

    useEffect(() => {
        if (second <= 1 && minute == 0 && hour == 0) {
            setSecond(0)
            setIsTimeEnd(true)
            console.log('het hang stop time out')
            return
        }

        let timeID = setTimeout(() => {
            console.log(1)
            if (timeFuture) {
                getSecond(new Date(), timeFuture, setSecond)
                getMinute(new Date(), timeFuture, setMinute)
                getHour(new Date(), timeFuture, setHours)
            } else {

                return
            }
        }, 1000);



        return () => clearTimeout(timeID)

    }, [second])



    return <Row className='home-container'>

        <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={3} className='img-left'>
        </Col>

        <Col className='content-container' xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
            <Row >
                <Col span={24} className='banner-slider'>
                    <Row gutter={[10, 10]} className='wrapper' >
                        <Col className='slider' xs={24} sm={24} md={24} lg={24} xl={16} xxl={16} style={{ margin: '0 auto', position: 'relative' }} >
                            <LeftOutlined onClick={() => handleMoveLeftBanner()} className='arrow-control hide-xs' />
                            <div ref={carousel} className='carousel' >


                                <img src='https://cdn0.fahasa.com/media/magentothem/banner7/DinhTiT8_Slide_840x320.jpg' />


                                <img src='https://cdn0.fahasa.com/media/magentothem/banner7/Fahasa_Sinhnhat_Co_Logo_Slide_840x320.jpg' />


                                <img src='https://cdn0.fahasa.com/media/magentothem/banner7/DinhTiT8_Slide_840x320.jpg' />


                                <img src='https://cdn0.fahasa.com/media/magentothem/banner7/TanViet_PlatinumT723_Banner_Slide_840x320.jpg' />


                                <img src='https://cdn0.fahasa.com/media/magentothem/banner7/PlatinumT723_ThienLong_Slide_840x320.jpg' />


                            </div>
                            <Space className='btn-index'>
                                <div className={indexActiveBanner == 0 ? 'slider-index index-active' : 'slider-index'} > </div>
                                <div className={indexActiveBanner == 1 ? 'slider-index index-active' : 'slider-index'} > </div>
                                <div className={indexActiveBanner == 2 ? 'slider-index index-active' : 'slider-index'} > </div>
                                <div className={indexActiveBanner == 3 ? 'slider-index index-active' : 'slider-index'} > </div>
                            </Space>
                            <RightOutlined onClick={() => handleMoveRightBanner()} className='arrow-control hide-xs' />
                        </Col>
                        <Col xs={0} sm={0} md={24} lg={24} xl={8} xxl={8}>
                            <Row gutter={[10, 10]}>
                                <Col xs={0} sm={0} md={12} lg={12} xl={24} xxl={24}>
                                    <img width={'100%'} height={'100%'} style={{ borderRadius: 5 }} src='https://cdn0.fahasa.com/media/wysiwyg/Thang-08-2023/poticoAHASA392x156.png' />
                                </Col>
                                <Col xs={0} sm={0} md={12} lg={12} xl={24} xxl={24}>
                                    <img width={'100%'} height={'100%'} style={{ borderRadius: 5 }} src='https://cdn0.fahasa.com/media/wysiwyg/Thang-08-2023/392x156-423_FAHASAzalo.jpg' />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Col>

            </Row>

            <Row className='flashsale-container'>
                <Col span={24} className='title-flashsale'>
                    <img src='https://cdn0.fahasa.com/media/wysiwyg/icon-menu/ico_flashsale@3x.png' />
                    <span style={{ fontSize: 17, fontWeight: 600, padding: '0 8px', borderRight: '2px solid #666666' }}>FLASH SALE </span>
                    <span className='time-end'>Kết Thúc Trong   </span>
                    <span className='time-countdown'>{hour < 10 ? `0${hour}` : hour}</span>
                    <span style={{ fontWeight: 700 }}>:</span>
                    <span className='time-countdown'>{minute < 10 ? `0${minute}` : minute}</span>
                    <span style={{ fontWeight: 700 }}>:</span>
                    <span className='time-countdown'>{second < 10 ? `0${second}` : second}</span>

                </Col>
                <Col span={24} className='content-flashsale '>
                    <LeftOutlined onClick={() => handleMoveLeftSlider("flashsale")} className='arrow-control hide-xs' />

                    <Row ref={sliderFlashSale} style={{ height: '100%' }} gutter={10} className='card-slider-flashsale'>
                        {dataItemFlashSale?.length > 0 ? dataItemFlashSale.map((item, index) => {
                            return (
                                <Col onClick={() => handleNavigateDetailPage(item, "flashsale")} key={index} ref={firstCardSliderFlashSale} className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',

                                        }}
                                        cover={<div style={{ position: 'relative' }} >
                                            {isTimeEnd || item?.quantity <= 0 ? <div style={{
                                                display: 'grid', placeItems: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.3)', position: 'absolute', width: '100%', height: '100%'
                                            }}>
                                                <img className='img-time-out' style={{ objectFit: 'cover', width: '60%', height: 70 }}
                                                    src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/flashsale/Chay-hang-icon.svg' />
                                            </div> : <></>}
                                            <img className='img-card' style={{ objectFit: 'cover', width: '100%' }} draggable={false} alt="example" src={`${baseURL}/images/${item?.thumbnail}`} />
                                        </div>}
                                    >
                                        <Row className='content-card'>
                                            <Col span={24} className='title-card'>
                                                {item?.mainText}

                                            </Col>



                                            <Col span={24} className='price-card'>

                                                <span> {formatter.format(item?.priceFlashSale)}đ</span>

                                            </Col>
                                            <Col span={24} className='old-price-card'>
                                                {formatter.format(item?.price)}

                                            </Col>

                                            <Col span={24} className='rate-card'>
                                                <Rate disabled value={item?.comments?.length > 0 ? 5 : 0} style={{ fontSize: 13 }} />
                                                <span className='number-comment'>({item?.comments?.length})</span>
                                            </Col>

                                            <Col span={24} className='sold-card'>
                                                Đã bán {item?.sold}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )
                        }) :
                            <>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'

                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>



                            </>}



                    </Row>
                    <RightOutlined onClick={() => handleMoveRightSlider("flashsale")} className='arrow-control hide-xs' />


                </Col>
            </Row>

            <Row className='flashsale-container code-seller'>
                <Col span={24} className='title-flashsale'>
                    <img src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_menu_red.svg' />
                    <span style={{ fontSize: 17, fontWeight: 600, padding: '0 10px' }}>
                        MÃ GIẢM GIÁ HIỆN HÀNH
                    </span>


                </Col>
                <Col span={24} className='content-flashsale content-code-seller-shopping'>

                    <Row style={{ height: '100%', maxWidth: '100%', overflow: 'scroll', display: 'flex' }} gutter={10} className='card-slider-code'>
                        <Col className='card-code-seller'>
                            <Card
                                hoverable

                                draggable={false}

                                style={{
                                    width: '100%',

                                }}
                            >
                                <Row gutter={30} style={{ padding: '0 10px', display: 'flex', alignItems: 'center' }} className='content-card'>
                                    <Col span={10} className='code-hash'>
                                        YRVU7MJ

                                    </Col>
                                    <Col className='code-title' span={14} >
                                        Giảm 20k cho lần đầu mua hàng tại Fahasa
                                    </Col>
                                </Row>
                            </Card>

                        </Col>

                        <Col className='card-code-seller'>
                            <Card
                                hoverable
                                draggable={false}

                                style={{
                                    width: '100%',

                                }}
                            >
                                <Row gutter={20} style={{ padding: '0 5px', display: 'flex', alignItems: 'center' }} className='content-card'>
                                    <Col span={10} className='code-hash'>
                                        YRVU7MJ

                                    </Col>
                                    <Col span={14} className='code-title'>
                                        Giảm 10% cho đơn hàng có giá trị hơn 200k !
                                    </Col>
                                </Row>
                            </Card>

                        </Col>

                        <Col className='card-code-seller'>
                            <Card
                                hoverable

                                draggable={false}

                                style={{
                                    width: '100%',

                                }}
                            >
                                <Row gutter={20} style={{ padding: '0 5px', display: 'flex', alignItems: 'center' }} className='content-card'>
                                    <Col span={10} className='code-hash'>
                                        YRVU7MJ

                                    </Col>
                                    <Col span={14} className='code-title'>
                                        Giảm 20% cho đơn hàng có giá trị hơn 500k !
                                    </Col>
                                </Row>
                            </Card>

                        </Col>


                    </Row>


                </Col>
            </Row>

            <Row className='flashsale-container trend-shopping'>
                <Col span={24} className='title-flashsale'>
                    <img src='https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png' />
                    <span style={{ fontSize: 17, fontWeight: 600, padding: '0 10px' }}>XU HƯỚNG MUA SẮM </span>


                </Col>

                <Col span={24} className='content-flashsale content-trend-shopping'>
                    <LeftOutlined onClick={() => handleMoveLeftSlider("cook")} className='arrow-control hide-xs' />
                    <Row>
                        <Col span={24} >
                            <Space >
                                <div onClick={() => changeActiveTrendShopping("sold")} className={indexActiveTabs == "sold" ? 'tabs-index tabs-active' : 'tabs-index'}>Bán Chạy Nhất</div>
                                <div style={{ marginLeft: 3 }} onClick={() => changeActiveTrendShopping("createdAt")} className={indexActiveTabs == "createdAt" ? 'tabs-index tabs-active' : 'tabs-index'}>Đồ Mới</div>
                                <div onClick={() => changeActiveTrendShopping("percentSale")} className={indexActiveTabs == "percentSale" ? 'tabs-index tabs-active' : 'tabs-index'}>Best-seller</div>

                            </Space>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 10 }} ref={sliderCook} gutter={10} className='card-slider-flashsale'>

                        {dataItemTrend?.length > 0 ? dataItemTrend.map((item, index) => {
                            return (
                                <Col onClick={() => handleNavigateDetailPage(item, "trend")} key={index} ref={firstCardSliderCook} className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',

                                        }}
                                        cover={<img className='img-card' style={{ objectFit: 'cover' }} draggable={false} alt="example" src={`${baseURL}/images/${item?.thumbnail}`} />}

                                    >
                                        <Row className='content-card'>
                                            <Col span={24} className='title-card'>
                                                {item?.mainText}

                                            </Col>



                                            <Col span={24} className='price-card price-shopping'>

                                                <span> {formatter.format(item?.priceFlashSale && item?.isFlashsale ?
                                                    item?.priceFlashSale : item?.price)}đ</span>

                                            </Col>
                                            <Col span={24} className='old-price-card'>

                                                {formatter.format(item?.isFlashsale ?
                                                    item?.price :
                                                    item?.price + (item?.price / 100 * item?.percentSale))}

                                            </Col>

                                            <Col span={24} className='rate-card'>
                                                <Rate disabled value={item?.comments?.length > 0 ? 5 : 0} style={{ fontSize: 13 }} />
                                                <span className='number-comment'>({item?.comments.length})</span>
                                            </Col>

                                            <Col span={24} className='sold-card sold-shopping'>
                                                Đã bán {item?.sold}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )
                        }) :
                            <>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'

                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>



                            </>}


                    </Row>
                    <Row style={{ marginTop: 15 }}>
                        <Button onClick={() => navigate('/xu-huong-mua-sam')} style={{
                            margin: '0 auto', width: '150px', height: 40,
                            border: '1px solid #C92127', color: '#c92127', fontWeight: 600
                        }}>Xem Thêm</Button>
                    </Row>
                    <RightOutlined onClick={() => handleMoveRightSlider("cook")} className='arrow-control hide-xs' />


                </Col>
            </Row>

            <Row style={{ marginTop: 15 }} className='flashsale-container item-normal'>
                <Col span={24} className='normal-title'>
                    <span style={{ fontSize: 18, fontWeight: 700, padding: '0 7px', color: '#333333' }}>ĐỒ ĂN CHẾ BIẾN </span>


                </Col>

                <Col span={24} className='content-flashsale normal-content'>
                    <LeftOutlined onClick={() => handleMoveLeftSlider("ingredient")} className='arrow-control hide-xs' />
                    <Row>
                        <Col span={24} >
                            <Space >
                                <div onClick={() => changeActiveTabsCook('fried')} className={indexActiveTabsCook == 'fried' ? 'tabs-index tabs-active' : 'tabs-index'}>Món Chiên</div>
                                <div style={{ marginLeft: 3 }} onClick={() => changeActiveTabsCook('boil')} className={indexActiveTabsCook == 'boil' ? 'tabs-index tabs-active' : 'tabs-index'}>Món Luộc</div>
                                <div onClick={() => changeActiveTabsCook('braise')} className={indexActiveTabsCook == 'braise' ? 'tabs-index tabs-active' : 'tabs-index'}>Món Kho</div>

                            </Space>
                        </Col>
                    </Row>

                    <Row ref={sliderIngredient} style={{ marginTop: 10 }} gutter={10} className='card-slider-flashsale'>
                        {dataItemCook?.length > 0 ? dataItemCook.map((item, index) => {
                            return (

                                <Col onClick={() => handleNavigateDetailPage(item, "flashsale")} key={index} ref={firstCardSliderIngredient} className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',

                                        }}
                                        cover={<img className='img-card' draggable={false} alt="example" src={`${baseURL}/images/${item?.thumbnail}`} />}
                                    >
                                        <Row className='content-card'>
                                            <Col span={24} className='title-card'>
                                                {item?.mainText}

                                            </Col>
                                            <Col span={24} className='price-card price-shopping'>
                                                {formatter.format(item?.priceFlashSale && item?.isFlashsale ?
                                                    item?.priceFlashSale : item?.price)}đ

                                            </Col>
                                            <Col span={24} className='old-price-card '>
                                                {formatter.format(item?.isFlashsale ?
                                                    item?.price :
                                                    item?.price + (item?.price / 100 * item?.percentSale))}đ

                                            </Col>
                                            <Col span={24} className='rate-card'>
                                                <Rate disabled value={item?.comments?.length > 0 ? 5 : 0} style={{ fontSize: 13 }} />
                                                <span className='number-comment'>({item?.comments.length})</span>
                                            </Col>
                                            <Col span={24} className='sold-card sold-shopping'>
                                                Đã bán {item?.sold}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>

                            )
                        }) :
                            <>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'

                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>



                            </>}

                    </Row>


                    <RightOutlined onClick={() => handleMoveRightSlider("ingredient")} className='arrow-control hide-xs' />


                </Col>
            </Row>

            <Row style={{ marginTop: 15 }} className='flashsale-container item-normal'>
                <Col span={24} className='normal-title'>
                    <span style={{ fontSize: 18, fontWeight: 700, padding: '0 7px', color: '#333333' }}>NGUYÊN LIỆU</span>


                </Col>

                <Col span={24} className='content-flashsale normal-content'>
                    <LeftOutlined onClick={() => handleMoveLeftSlider("213")} className='arrow-control hide-xs' />
                    <Row>
                        <Col span={24} >
                            <Space >
                                <div onClick={() => changeActiveTabsIngredient('chicken')} className={indexActiveTabsIngredient == 'chicken' ? 'tabs-index tabs-active' : 'tabs-index'}>Thịt Gà</div>
                                <div style={{ marginLeft: 3 }} onClick={() => changeActiveTabsIngredient('cow')} className={indexActiveTabsIngredient == 'cow' ? 'tabs-index tabs-active' : 'tabs-index'}>Thịt Bò</div>
                                <div onClick={() => changeActiveTabsIngredient('duck')} className={indexActiveTabsIngredient == 'duck' ? 'tabs-index tabs-active' : 'tabs-index'}>Thịt Vịt</div>

                            </Space>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 10 }} gutter={10} className='card-slider-flashsale'>
                        {dataItemIngredient?.length > 0 ? dataItemIngredient.map((item, index) => {
                            return (

                                <Col onClick={() => handleNavigateDetailPage(item, "flashsale")} key={index} ref={firstCardSliderTrend} className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',

                                        }}
                                        cover={<img className='img-card' draggable={false} alt="example" src={`${baseURL}/images/${item?.thumbnail}`} />}
                                    >
                                        <Row className='content-card'>
                                            <Col span={24} className='title-card'>
                                                {item?.mainText}

                                            </Col>
                                            <Col span={24} className='price-card price-shopping'>
                                                {formatter.format(item?.priceFlashSale && item?.isFlashsale ?
                                                    item?.priceFlashSale : item?.price)}đ

                                            </Col>
                                            <Col span={24} className='old-price-card '>
                                                {formatter.format(item?.isFlashsale ?
                                                    item?.price :
                                                    item?.price + (item?.price / 100 * item?.percentSale))}đ

                                            </Col>
                                            <Col span={24} className='rate-card'>
                                                <Rate disabled value={item?.comments?.length > 0 ? 5 : 0} style={{ fontSize: 13 }} />
                                                <span className='number-comment'>({item?.comments.length})</span>
                                            </Col>
                                            <Col span={24} className='sold-card sold-shopping'>
                                                Đã bán {item?.sold}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>

                            )
                        }) :
                            <>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'

                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}

                                    >
                                        <Row gutter={[0, 10]}>
                                            <Skeleton style={{ height: '100%' }} active />
                                            <Skeleton style={{ height: '100%' }} active />
                                        </Row>
                                    </Card>
                                </Col>



                            </>}

                    </Row>

                    <RightOutlined onClick={() => handleMoveRightSlider("213")} className='arrow-control hide-xs' />


                </Col>
            </Row>




        </Col >

        <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={3} className='img-right'>
        </Col>
    </Row >
}

export default Home