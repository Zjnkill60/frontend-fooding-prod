import { Breadcrumb, Card, Col, Divider, Row, Select, Skeleton, Space, Rate } from "antd"
import './deal.scss'
import { useEffect, useState } from "react";
import { handleFetchProductCategory } from "../../service/api";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_URL_BACKEND

const formatter = new Intl.NumberFormat({
    style: 'currency',

});
const DealHotPage = () => {
    const navigate = useNavigate()
    const [indexActiveTabs, setIndexActiveTabs] = useState("all")
    const [dataItem, setDataItem] = useState(null)

    const handleChangeActiveTabs = (tab) => {
        setIndexActiveTabs(tab)
        handleFetchProduct(1, 30, tab, undefined, '-sold')
    }

    const handleChange = (value) => {
        handleFetchProduct(1, 30, indexActiveTabs, undefined, value)

    };

    const handleFetchProduct = async (current, pageSize, category, type, sort) => {
        setDataItem(null)
        let res = await handleFetchProductCategory(current, pageSize, category, type, sort)
        console.log(res)
        if (res && res.data) {
            setDataItem(res.data?.listProduct)

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
        handleFetchProduct(undefined, undefined, "all", undefined, '-sold')
        window.scroll({ top: 0 })
    }, [])
    return (
        <Row style={{ backgroundColor: '#ededed', minHeight: '100vh' }}>
            <Col span={24}>

                <Row style={{ maxWidth: 1260, margin: '0 auto' }} className='page-shopping-container'>
                    <Col span={24}>

                        <Breadcrumb
                            className="hide-detail"
                            style={{
                                margin: '16px 0px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Breadcrumb.Item>TRANG CHỦ</Breadcrumb.Item>
                            <Breadcrumb.Item>XU HƯỚNG MUA SẮM</Breadcrumb.Item>

                        </Breadcrumb>
                    </Col>
                    <Col span={24} className='title-trend'>
                        <img src='https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png' />
                        <span style={{ fontSize: 17, fontWeight: 600, padding: '0 10px' }}>XU HƯỚNG MUA SẮM </span>


                    </Col>

                    <Col span={24} style={{ padding: 10, backgroundColor: '#fff' }}>
                        <Row>
                            <Col span={24} >
                                <Space className="tabs-slider" >
                                    <div onClick={() => handleChangeActiveTabs('all')} className={indexActiveTabs == "all" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Tất Cả</div>
                                    <div onClick={() => handleChangeActiveTabs('cook')} className={indexActiveTabs == "cook" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Đồ Ăn Nhanh</div>
                                    <div onClick={() => handleChangeActiveTabs('ingredient')} className={indexActiveTabs == "ingredient" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Thực Phẩm - Nguyên Liệu</div>
                                    <div onClick={() => handleChangeActiveTabs('soup')} className={indexActiveTabs == "soup" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Chè Thập Cẩm</div>
                                    <div onClick={() => handleChangeActiveTabs('vegetable')} className={indexActiveTabs == "vegetable" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Rau  Củ Quả</div>

                                </Space>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '13px 0' }} />
                        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <span className="hide-trend-shopping-mobile" style={{ marginRight: 20 }}>Sắp xếp theo :</span>
                            <Select
                                defaultValue="-sold"
                                style={{
                                    width: 200,


                                }}
                                onChange={handleChange}
                                options={[
                                    {
                                        value: '-sold',
                                        label: 'Bán Chạy',
                                    },
                                    {
                                        value: '-percentSale',
                                        label: 'Chiết Khấu',
                                    },
                                    {
                                        value: 'price',
                                        label: 'Giá Thấp Đến Cao',
                                    },
                                    {
                                        value: '-price',
                                        label: 'Giá Cao Đến Thấp',

                                    },
                                ]}
                            />
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[8, 8]} style={{ marginTop: 5, padding: '5px 0' }} className="card-slider-shopping">
                            {dataItem?.length > 0 ? dataItem.map((item, index) => {
                                return (

                                    <Col onClick={() => handleNavigateDetailPage(item)} key={index} className='card-trend-shopping'>
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
                                                    <Rate disabled value={5} style={{ fontSize: 13 }} />
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
                                    <Col className='card-trend-shopping'>
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
                                    <Col className='card-trend-shopping'>
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
                                    <Col className='card-trend-shopping'>
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
                                    <Col className='card-trend-shopping'>
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
                                    <Col className='card-trend-shopping'>
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
                    </Col>
                </Row>

            </Col>
        </Row>
    )
}

export default DealHotPage