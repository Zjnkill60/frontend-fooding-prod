import { Avatar, Breadcrumb, Button, Card, Col, Divider, Modal, Rate, Row, Space, Upload, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import './detail.scss'
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined, LeftOutlined, RightOutlined, LikeOutlined } from '@ant-design/icons'
import { fetchCommentByIdProduct, handleCreateNewComment, handleUploadFile } from "../../service/api";
import moment from 'moment'
import ModalPreviewImageComments from "./ModalPreviewImageComment";
import { handleAddItemToCart } from "../../redux/order/orderSlice";

const baseURL = import.meta.env.VITE_URL_BACKEND

const DetailProd = () => {
    //slider flashsale
    const sliderItems = useRef()
    const firstCardSlider = useRef()
    const navigate = useNavigate()

    const location = useLocation()
    const sliderImage = useRef()
    const image = useRef()
    const [thumbnail, setThumbnail] = useState("")
    const [indexActive, setIndexActive] = useState(0)
    const [indexImageSlider, setIndexImageSlider] = useState(0)
    const [listImg, setListImg] = useState([])
    //rate comment
    const [rate, setRate] = useState(5)
    //get info account redux
    const infoAccount = useSelector(state => state?.account)

    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });

    const handleSetImage = (img, index) => {
        setThumbnail(img)
        setIndexActive(index)
    }

    const handleMouseDown = () => {
        if (Number.isInteger(sliderImage.current.scrollLeft / image.current.offsetWidth)) {
            setIndexImageSlider(sliderImage.current.scrollLeft / image.current.offsetWidth)
        }

    }

    const handleMoveRightSlider = (type) => {

        sliderItems.current.scrollLeft += firstCardSlider.current.offsetWidth

    }

    const handleMoveLeftSlider = (type) => {

        sliderItems.current.scrollLeft -= firstCardSlider.current.offsetWidth

    }

    //navigate

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

    const handleNavigateDetailPage = (prod) => {
        let nameQuery = slug(prod?.mainText)
        navigate(`/product/${nameQuery}?id=${prod?._id}`, { state: { prod, items: location.state?.items } })

    }
    //upload file
    const inputComment = useRef()
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [slider, setSlider] = useState([]);

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        let res = await handleUploadFile(file)
        console.log(res)
        if (res && res.data) {
            let imgSlider = {
                url: `${baseURL}images/${res.data?.imgUpload}`,
                urlUpload: res.data?.imgUpload
            }
            message.success("Tải ảnh thành công")
            setSlider(slider => [...slider, imgSlider])
            onSuccess('Upload success !')
        } else {
            onError('Error !')
            message.error(res.message)
        }

    }

    const handleRemove = (file, type) => {
        if (type == 'thumbnail') {
            setThumbnail([])
        } else {
            let imgSlider = slider.filter(item => {
                return item.url != file.url
            })
            setSlider(imgSlider)
        }
    }
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const handleCancelPreview = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    //find comment
    const [comments, setComments] = useState([])
    const [isModalPreview, setIsModalPreview] = useState(false);
    const [previewImageComment, setPreviewImageComment] = useState('');
    const [indexActiveTabsComments, setindexActiveTabsComments] = useState('-createdAt')
    const handleFindCommentForProd = async (current, pageSize, sort) => {
        let res = await fetchCommentByIdProduct(current, pageSize, location.state?.prod?._id, sort)
        if (res && res.data) {
            setComments(res.data?.listComment)
        }
        console.log('data comment : ', res)
    }

    const handleChangeTabsComment = (key) => {
        setindexActiveTabsComments(key)
        handleFindCommentForProd(1, 15, key)
    }

    const handleUploadComment = async () => {
        let imgSlider = slider.map(item => {
            return item.urlUpload
        })
        let res = await handleCreateNewComment(inputComment.current.value, rate, imgSlider, location.state?.prod?._id)
        if (res && res.data) {
            message.success("Bình luận thành công !")
            setSlider([])
            inputComment.current.value = ""
            setRate(5)
            handleFindCommentForProd(1, 15, "-createdAt")
        } else {
            message.error(res.message)
        }
    }

    const handlePreviewImageComment = (img) => {
        setPreviewImageComment(img)
        setIsModalPreview(true)
    }

    //add cart
    const [priceItem, setPriceItem] = useState("")
    const valueQuantityPc = useRef()
    const valueQuantityMobile = useRef()
    const distpach = useDispatch()

    const handleMinusValueQuantity = (type) => {
        if (type == "mobile") {
            if (valueQuantityMobile.current.value <= 1) {
                return
            }
            valueQuantityMobile.current.value = (+valueQuantityMobile.current.value) - 1
        } else {
            if (valueQuantityPc.current.value <= 1) {
                return
            }
            valueQuantityPc.current.value = (+valueQuantityPc.current.value) - 1
        }
    }

    const handlePlusValueQuantity = (type) => {
        if (type == "mobile") {
            console.log(valueQuantityMobile.current.value)
            if (valueQuantityMobile.current.value >= 99) {
                return
            }
            valueQuantityMobile.current.value = (+valueQuantityMobile.current.value) + 1
        } else {
            if (valueQuantityPc.current.value >= 99) {
                return
            }
            valueQuantityPc.current.value = (+valueQuantityPc.current.value) + 1
        }
    }

    const handleDispatchItemToCart = (type, action) => {
        distpach(handleAddItemToCart({
            price: priceItem,
            thumbnail: thumbnail,
            quantity: type == "mobile" ? +valueQuantityMobile.current?.value : +valueQuantityPc.current?.value,
            mainText: location.state?.prod?.mainText
        }))
        message.success("Thêm sản phẩm vào giỏ hàng !")

        if (action == "buy") {
            navigate('/cart')
        }
    }

    useEffect(() => {
        let isRecur = false
        location.state?.prod?.slider.map(img => {
            if (img.includes(location.state?.prod?.thumbnail)) {
                isRecur = true
            }
        })
        if (!isRecur) {
            location.state?.prod?.slider.unshift(location.state?.prod?.thumbnail)
        }

        setPriceItem(location.state?.prod?.priceFlashSale && location.state?.isFlashsale == true ?
            location.state?.prod?.priceFlashSale : location.state?.prod?.price)
        setListImg(location.state?.prod?.slider)
        setThumbnail(location.state?.prod?.thumbnail)
        handleFindCommentForProd(1, 15, "-createdAt")
        window.scrollTo({ top: 0 });
        sliderImage.current.addEventListener("scroll", handleMouseDown)

        return () => sliderImage?.current?.removeEventListener("scroll", handleMouseDown)
    }, [location.state?.prod?._id])


    console.log('re render')
    return (
        <div style={{ backgroundColor: '#ededed' }}>
            <ModalPreviewImageComments previewImageComment={previewImageComment} isModalOpen={isModalPreview} setIsModalOpen={setIsModalPreview} />
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
            <Row className="detail-page-container" style={{ maxWidth: 1260, margin: '0 auto' }}>
                <Col span={24} style={{ width: '100%' }}>
                    <Row className="detail-content">
                        <Col span={24}>

                            <Breadcrumb
                                className="hide-detail"
                                style={{
                                    margin: '16px 0px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Breadcrumb.Item>SÁCH TIẾNG VIỆT</Breadcrumb.Item>
                                <Breadcrumb.Item>{location?.state?.prod?.category}</Breadcrumb.Item>

                            </Breadcrumb>
                        </Col>
                        <Col span={24} className="detail-page-content">
                            <Row >
                                <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10} className="content-left">
                                    <Row >
                                        <Col className="hide-detail " style={{
                                            display: 'flex', alignItems: 'center',
                                            flexDirection: 'column'
                                        }} xs={0} sm={0} md={0} lg={5} xl={5} xxl={5}>

                                            {listImg.map((img, index) => {
                                                return (<div onMouseOver={() => handleSetImage(img, index)}>
                                                    <Avatar className={indexActive == index ? "img-active " : null}
                                                        style={{ marginTop: 5, height: 100, width: '100%', objectFit: 'cover' }}
                                                        shape="square" key={index} src={baseURL + 'images/' + img} />
                                                </div>
                                                )
                                            })}

                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0} style={{ margin: '0 auto' }}>
                                            <div ref={sliderImage} className="slider-image-detail" style={{ textAlign: 'center' }}>

                                                {listImg.map((img, index) => {
                                                    return (
                                                        <img ref={image} className="img-thumbnail" draggable={false}
                                                            style={{ flex: '1 0 100%' }}
                                                            shape="square" key={index} src={baseURL + 'images/' + img} />

                                                    )
                                                })}
                                            </div>
                                            <div style={{
                                                position: 'absolute', bottom: 0, right: '50%', padding: '5px 20px', backgroundColor: '#888888'
                                                , color: '#fff', borderRadius: 15, zIndex: 5, transform: "translateX(50%)"
                                            }}> {indexImageSlider + 1} / {listImg?.length} </div>
                                        </Col>
                                        <Col xs={0} sm={0} md={0} lg={19} xl={19} xxl={19} style={{ margin: '0 auto' }}>
                                            <div className="slider-image-detail" style={{ textAlign: 'center' }}>

                                                <img className="img-thumbnail" draggable={false}
                                                    style={{ flex: '1 0 100%', padding: '0 10px' }}
                                                    shape="square" src={baseURL + 'images/' + thumbnail} />


                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={13} xl={13} xxl={13} className="content-right">
                                    <Row gutter={[0, 10]}>
                                        <Col span={24} className="title-prod">
                                            {location.state?.prod?.mainText}
                                        </Col>
                                        <Col style={{ marginTop: 15 }} span={24} className="sub-title-prod">
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}> Nhà cung cấp :</span>
                                                <span style={{ marginLeft: 5, color: '#2489f4', fontWeight: 700 }}>FAHASA</span>
                                            </Row>
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}>Tác giả : </span>
                                                <span style={{ marginLeft: 5, fontWeight: 600 }}>{location.state?.prod?.author}</span>
                                            </Row>
                                        </Col>

                                        <Col span={24} className="sub-title-prod hide-detail">
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}> Nhà xuất bản :</span>
                                                <span style={{ marginLeft: 5, fontWeight: 600 }}>NXB Thế Giới</span>
                                            </Row>
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}> Hình thức bìa :</span>
                                                <span style={{ marginLeft: 5, fontWeight: 600 }}>Bìa Mềm</span>
                                            </Row>
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                            <Rate value={5} style={{ color: 'f6a500', fontSize: 14 }} />
                                            <span style={{ marginLeft: 10, color: '#f6a500', marginTop: 1, fontWeight: 500 }}>({comments?.length} đánh giá)</span>
                                        </Col>
                                        <Col className="price-prod" span={24} style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                            <span className="main-price">{formatter.format(priceItem)} đ</span>
                                            <span className="sub-price">{formatter.format(location.state?.isFlashsale ?
                                                location.state?.prod?.price :
                                                priceItem + (priceItem / 100 * location.state?.prod?.percentSale))} đ</span>
                                            <div className="percent-price">
                                                {location.state?.prod?.priceFlashSale && location.state?.isFlashsale
                                                    ? `-${formatter.format(Math.round(100 - (location.state?.prod?.priceFlashSale / location.state?.prod?.price) * 100))}%`
                                                    : `-${location.state?.prod?.percentSale}%`}

                                            </div>
                                        </Col>
                                        <Col span={24} style={{ marginTop: 15 }} >
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}> Thời gian giao hàng :</span>
                                                <span style={{ marginLeft: 5, color: '#2489f4', fontWeight: 600 }}>10h-17h / ngày</span>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <span style={{ color: '#333333', fontSize: 14 }}>Giao hàng đến : </span>
                                                <span style={{ marginLeft: 5, fontWeight: 600 }}>Toàn Quốc</span>
                                            </Row>
                                        </Col>
                                        <Col className="hide-detail" span={24} style={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: '20%' }}>
                                            <span style={{ fontSize: 16, color: '#555555', fontWeight: 600 }}>Số lượng : </span>
                                            <div style={{ padding: '10px 20px', border: '1px solid #333', height: 20, borderRadius: 5, marginLeft: 50 }}>
                                                <MinusOutlined onClick={() => handleMinusValueQuantity("pc")} style={{ cursor: 'pointer' }} />
                                                <input ref={valueQuantityPc} defaultValue={1}
                                                    style={{ width: 50, height: 20, border: 'none', outline: 'none', textAlign: 'center', fontWeight: 700, userSelect: 'none' }}
                                                    type="number" />
                                                <PlusOutlined onClick={() => handlePlusValueQuantity("pc")} style={{ cursor: 'pointer' }} />
                                            </div>
                                        </Col>
                                        <Col className="hide-detail" span={24} style={{ display: 'flex', position: 'absolute', bottom: 10 }}>
                                            <Button onClick={() => handleDispatchItemToCart("pc", "add")} style={{ width: 200, height: 45, border: '2px solid #c92127', display: 'flex', alignItems: 'center' }}>
                                                <ShoppingCartOutlined style={{ fontSize: 23, color: '#c92127', fontWeight: 700 }} />
                                                <span style={{ color: '#c92127', fontWeight: 600, fontSize: 15 }} >  Thêm vào giỏ hàng</span>

                                            </Button>
                                            <Button onClick={() => handleDispatchItemToCart("pc", "buy")} style={{ width: 200, height: 45, backgroundColor: '#c92127', color: '#fff', fontWeight: 600, fontSize: 15, marginLeft: 15 }}>
                                                Mua ngay
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{
                            position: 'fixed', left: 0, bottom: 0, width: '100%', height: 50,
                            backgroundColor: '#fff', zIndex: 10, borderTop: '1px solid #ededed'
                        }}
                            xs={24} sm={24} md={24} lg={0} xl={0} xxl={0} >
                            <Row style={{ height: '100%' }}>
                                <Col span={8} style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #ededed' }}>
                                    <div style={{ padding: '10px 0px', height: 20, borderRadius: 5, margin: '0 auto' }}>
                                        <MinusOutlined onClick={() => handleMinusValueQuantity("mobile")} style={{ cursor: 'pointer', fontSize: 17 }} />
                                        <input ref={valueQuantityMobile} defaultValue={1}
                                            style={{
                                                width: 60, height: 20, border: 'none', outline: 'none', textAlign: 'center',
                                                fontWeight: 700, backgroundColor: '#fff', color: '#c92127'
                                            }}
                                            type="number" />
                                        <PlusOutlined onClick={() => handlePlusValueQuantity("mobile")} style={{ cursor: 'pointer', fontSize: 17 }} />
                                    </div>
                                </Col>
                                <Col onClick={() => handleDispatchItemToCart("mobile", "add")} span={7} style={{
                                    display: 'grid', placeItems: 'center', fontSize: 14,
                                    padding: '0 15px', color: '#c92127', fontWeight: 600, textAlign: 'center'
                                }}>
                                    <Row style={{ textAlign: 'center' }}>
                                        <Col span={24}>
                                            <ShoppingCartOutlined style={{ fontSize: 23 }} />
                                        </Col>
                                        <Col span={24}>
                                            Thêm vào
                                        </Col>
                                    </Row>
                                </Col>
                                <Col onClick={() => handleDispatchItemToCart("mobile", "buy")} span={9} style={{ backgroundColor: '#c92127', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>
                                    Mua ngay
                                </Col>
                            </Row>
                        </Col>


                    </Row>


                </Col>
            </Row>
            <Row className="detail-page-container code-seller-content" style={{
                maxWidth: 1260, margin: '0 auto', marginTop: 20, backgroundColor: '#fff',
                padding: 10, borderRadius: 5
            }}>
                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_coupon_red.svg?q=102418" />
                    <h3 style={{ marginLeft: 10, fontSize: 18, fontWeight: 500, color: '#333' }}>ƯU ĐÃI LIÊN QUAN</h3>
                </Col>

                <Col className="carousel-card" span={24} style={{ display: 'flex', alignItems: 'center', marginTop: 20, maxWidth: '100vw', overflow: 'scroll' }}>
                    <Row className="card-seller" style={{ height: 100, flex: '1 0 33%', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: 10, padding: 10 }}>
                        <Col span={5} style={{ backgroundColor: 'orange', display: 'grid', placeItems: 'center', borderRadius: 10 }}>
                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_promotion.svg?q=102418" />
                        </Col>
                        <Col span={18} style={{ padding: '0 10px', marginLeft: 'auto' }}>
                            <Row gutter={[0, 10]}>
                                <Col span={24} style={{ fontWeight: 600, color: '#333', fontSize: 16 }}>
                                    MÃ GIẢM GIÁ 15K
                                </Col>
                                <Col style={{ color: '#aaaaaa', fontSize: 13 }} span={24}>
                                    Áp Dụng Cho Tài Khoản Mới Lần Đầu Mua Hàng  Tại Fahasa
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="card-seller" style={{ height: 100, flex: '1 0 33%', borderRadius: 10, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', padding: 10, marginLeft: 10 }}>
                        <Col span={5} style={{ backgroundColor: 'orange', display: 'grid', placeItems: 'center', borderRadius: 10 }}>
                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_promotion.svg?q=102418" />
                        </Col>
                        <Col span={18} style={{ padding: '0 10px', marginLeft: 'auto' }}>
                            <Row gutter={[0, 10]}>
                                <Col span={24} style={{ fontWeight: 600, color: '#333', fontSize: 16 }}>
                                    MÃ GIẢM GIÁ 20k
                                </Col>
                                <Col style={{ color: '#aaaaaa', fontSize: 13 }} span={24}>
                                    Áp Dụng Cho Đơn Hàng Có Gía Trị 200k
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="card-seller" style={{ height: 100, flex: '1 0 33%', borderRadius: 10, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', padding: 10, marginLeft: 10 }}>
                        <Col span={5} style={{ backgroundColor: 'orange', display: 'grid', placeItems: 'center', borderRadius: 10 }}>
                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_promotion.svg?q=102418" />
                        </Col>
                        <Col span={18} style={{ padding: '0 10px', marginLeft: 'auto' }}>
                            <Row gutter={[0, 10]}>
                                <Col span={24} style={{ fontWeight: 600, color: '#333', fontSize: 16 }}>
                                    MÃ GIẢM GIÁ 30K
                                </Col>
                                <Col style={{ color: '#aaaaaa', fontSize: 13 }} span={24}>
                                    Áp Dụng Cho Đơn Hàng Có Gía Trị 300k
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Col>
            </Row>

            <Row className="detail-page-container code-seller-content" style={{
                maxWidth: 1260, margin: '0 auto', marginTop: 20, backgroundColor: '#fff',
                padding: 10, borderRadius: 5
            }}>

                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_coupon_red.svg?q=102418" />
                    <h3 style={{ marginLeft: 10, fontSize: 18, fontWeight: 500, color: '#333' }}>FAHASA GIỚI THIỆU</h3>
                </Col>

                <Col span={24} className='content-flashsale normal-content'>
                    <LeftOutlined onClick={() => handleMoveLeftSlider("213")} className='arrow-control hide-xs' />


                    <Row ref={sliderItems} style={{ marginTop: 10 }} gutter={10} className='card-slider-flashsale'>
                        {location.state?.items && location.state?.items?.length > 0 ?
                            location.state?.items.map((item, index) => {
                                return (
                                    <Col onClick={() => handleNavigateDetailPage(item)} ref={firstCardSlider} key={index} className='card'>
                                        <Card
                                            hoverable
                                            bordered={false}
                                            draggable={false}

                                            style={{
                                                width: '100%',

                                            }}
                                            cover={<img draggable={false} alt="example" src={baseURL + 'images/' + item?.thumbnail} />}
                                        >
                                            <Row className='content-card'>
                                                <Col span={24} className='title-card'>
                                                    {item?.mainText}

                                                </Col>
                                                <Col span={24} className='price-card price-shopping'>
                                                    {formatter.format(item?.price)} đ

                                                </Col>
                                                <Col span={24} className='old-price-card '>
                                                    {formatter.format(item?.price + (item?.price * item?.percentSale / 100))}

                                                </Col>
                                                <Col span={24} className='rate-card'>
                                                    <Rate value={5} style={{ fontSize: 13 }} />
                                                    <span className='number-comment'>(4)</span>
                                                </Col>
                                                <Col span={24} className='sold-card sold-shopping'>
                                                    Đã bán {item?.sold}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                )
                            }) : <></>}


                    </Row>

                    <RightOutlined onClick={() => handleMoveRightSlider("213")} className='arrow-control hide-xs' />


                </Col>
            </Row>

            <Row className="detail-page-container code-seller-content" style={{
                maxWidth: 1260, margin: '0 auto', marginTop: 20, backgroundColor: '#fff',
                padding: 10, borderRadius: 5
            }}>

                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_coupon_red.svg?q=102418" />
                    <h3 style={{ marginLeft: 10, fontSize: 18, fontWeight: 500, color: '#333' }}>
                        BÌNH LUẬN ({comments && comments.length ? comments.length : 0})
                    </h3>
                </Col>

                <Col span={24} style={{ marginTop: 24 }}>
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col span={24}>
                            {infoAccount?.isAuthenticated ? <Card
                                title={<span style={{ fontSize: 15, fontWeight: 500, color: '#333' }}>
                                    <Avatar style={{ marginRight: 10 }} shape="square" size={50} src={baseURL + 'images/' + infoAccount?.info?.avatar} />
                                    Xin chào {infoAccount?.info?.name} ! Hãy bình luận để đánh giá sản phẩm
                                    <Rate onChange={value => setRate(value)} style={{ marginLeft: 15 }} defaultValue={rate} /></span>}
                                bordered={false}
                                style={{
                                    width: '100%',
                                    position: 'relative'
                                }}
                            >

                                <div style={{ height: 100 }}>
                                    <input ref={inputComment} type="text" style={{ width: '90%', height: 40, border: 'none', outline: 'none', padding: '5px 15px', wordWrap: 'break-word' }}
                                        placeholder="Nhập đánh giá ..." />

                                </div>
                                <Row style={{ position: 'absolute', bottom: 5, right: 10 }}>
                                    <Upload
                                        customRequest={handleUploadFileSlider}
                                        listType="picture"
                                        fileList={slider}
                                        onPreview={handlePreview}
                                        onRemove={(file) => handleRemove(file, "slider")}
                                    >

                                        <Button style={{ marginRight: 10 }} >Tải ảnh</Button>
                                    </Upload>

                                    <Button onClick={handleUploadComment} style={{ backgroundColor: '#c92127', color: '#fff' }} type="primary">Tạo mới bình luận</Button>
                                </Row>
                            </Card> : <span onClick={() => navigate('/auth')} style={{ color: '#2489f4', padding: '0 5px', cursor: 'pointer' }}>
                                Hãy đăng nhập để đánh giá sản phẩm !
                            </span>}
                        </Col>

                    </Row>

                </Col>

                <Col span={24} style={{ marginTop: 15, borderBottom: '1px solid #888888', padding: '10px 0' }}>
                    <span onClick={() => handleChangeTabsComment('-createdAt')}
                        className={indexActiveTabsComments == "-createdAt" ? "active-tabs-comments" : null}
                        style={{ color: '#646464', padding: '10px 5px', cursor: 'pointer' }}>Mới nhất</span>
                    <span onClick={() => handleChangeTabsComment('createdAt')}
                        className={indexActiveTabsComments == "createdAt" ? "active-tabs-comments" : null}
                        style={{ marginLeft: 20, padding: '10px 5px', color: '#646464', cursor: 'pointer' }}>Lâu nhất</span>
                </Col>

                <Col span={24} style={{ marginTop: 20, padding: 5 }}>
                    <Row gutter={[0, 40]}>
                        {comments && comments.length > 0 ? comments.map((item, index) => {
                            return (
                                <Col span={24}>
                                    <Row gutter={[0, 10]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={3} xxl={3} >
                                            <Row gutter={[0, 5]} style={{ position: 'relative' }}>
                                                <Col span={24}>
                                                    <Avatar shape="square" size={50} src={baseURL + 'images/' + item?.avatar} />
                                                </Col>
                                                <Col span={24} style={{ fontWeight: 600 }}>
                                                    {item?.name}
                                                </Col>
                                                <Col className="timer-comment-mobile" span={24} style={{ fontSize: 12, color: '#666666' }}>
                                                    {moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={20}>
                                            <Row gutter={[0, 10]}>
                                                <Col span={24}>
                                                    <Rate value={item?.rate} style={{ fontSize: 14 }} />
                                                </Col>
                                                <Col span={24} style={{ color: '#333' }}>
                                                    <p>{item?.description}</p>
                                                </Col>
                                                {item?.image?.length > 0 ? <Space style={{ maxWidth: '100vw', overflow: 'scroll' }}>
                                                    {item.image.map((item, index) => {
                                                        return (
                                                            <Avatar onClick={() => handlePreviewImageComment(item)} style={{ cursor: 'pointer' }} size={80} shape="square" key={index} src={baseURL + 'images/' + item} />
                                                        )
                                                    })}
                                                </Space> : <></>}
                                                <Col span={24} style={{ display: 'flex', alignItems: 'center', color: '#666666', marginTop: 15 }}>
                                                    <LikeOutlined />
                                                    <span style={{ marginLeft: 10 }}>Thích (0)</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        }) : <span style={{ color: '#333333' }}>Chưa có đánh giá nào ! Hãy là người đánh giá đầu tiên về sản phẩm này </span>}

                    </Row>
                </Col>




            </Row>

        </div>
    )
}

export default DetailProd