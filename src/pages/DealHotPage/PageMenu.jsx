import { Breadcrumb, Card, Col, Divider, Row, Select, Skeleton, Space, Rate } from "antd"
import './deal.scss'
import { useEffect, useRef, useState } from "react";
import { handleFetchProductCategory } from "../../service/api";
import { useLocation, useNavigate } from "react-router-dom";
import TabsMenu from "./TabsMenu";

const baseURL = import.meta.env.VITE_URL_BACKEND

const formatter = new Intl.NumberFormat({
    style: 'currency',

});
const PageMenu = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [indexActiveTabs, setIndexActiveTabs] = useState(null)
    const [dataSelect, setDataSelect] = useState("-sold")
    const [dataItem, setDataItem] = useState(null)

    const handleChangeActiveTabs = (category, type) => {
        setIndexActiveTabs(type)
        handleFetchProduct(1, 30, category, type, '-sold')
        setDataSelect("-sold")

    }

    const handleChange = (value) => {
        setDataSelect(value)
        handleFetchProduct(1, 30, location?.state?.category, indexActiveTabs, value)

    };

    const handleFetchProduct = async (current, pageSize, category, type, sort) => {
        setDataItem(null)
        let res = await handleFetchProductCategory(current, pageSize, category, type, sort)
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
        handleFetchProduct(1, 30, location?.state?.category, location?.state?.type, '-sold')
        setIndexActiveTabs(location?.state?.type)
        window.scroll({ top: 0 })
        setDataSelect("-sold")
    }, [location?.state?.type])


    return (
        <Row style={{ backgroundColor: '#ededed', minHeight: '100vh' }}>
            <Col span={24}>

                <Row style={{ maxWidth: 1260, margin: '0 auto' }} className='page-shopping-container'>

                    <Col span={24} style={{ padding: 10, backgroundColor: '#fff' }}>
                        <Row>
                            <Col span={24} >
                                <TabsMenu category={location?.state?.category} indexActiveTabs={indexActiveTabs} handleChangeActiveTabs={handleChangeActiveTabs} />
                            </Col>
                        </Row>
                        <Divider style={{ margin: '13px 0' }} />
                        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <span className="hide-trend-shopping-mobile" style={{ marginRight: 20 }}>Sắp xếp theo :</span>
                            <Select
                                value={dataSelect}
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
                                                    <Rate disabled value={item?.comments.length > 0 ? 5 : 0} style={{ fontSize: 13 }} />
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

export default PageMenu