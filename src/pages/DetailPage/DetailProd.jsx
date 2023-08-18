import { Avatar, Breadcrumb, Button, Card, Col, Divider, Modal, Rate, Row, Skeleton, Space, Upload, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import './detail.scss'
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined, LeftOutlined, RightOutlined, LikeOutlined } from '@ant-design/icons'
import { fetchCommentByIdProduct, handleCreateNewComment, handleFetchProductPaginate, handleFindOneProd, handleUploadFile } from "../../service/api";
import moment from 'moment'
import ModalPreviewImageComments from "./ModalPreviewImageComment";
import { handleAddItemToCart } from "../../redux/order/orderSlice";
import { getHour, getInitTimeFuture, getMinute, getSecond } from "../../utilities/getTime";

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
    const [percentSold, setPercentSold] = useState(0)
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
        navigate(`/product/${nameQuery}?id=${prod?._id}`, { state: { prod } })

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
    const [dataProd, setDataProd] = useState(null)
    const [dataRecomment, setDataRecomment] = useState(null)
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
            if (dataProd?.isFlashsale && valueQuantityMobile.current.value >= dataProd?.quantity - dataProd?.soldFlashSale) {
                valueQuantityMobile.current.value = dataProd.quantity - dataProd?.soldFlashSale
                message.error(`Số lượng sản phẩm còn lại là ${dataProd.quantity - dataProd?.soldFlashSale}`)
                return
            }
            if (valueQuantityMobile.current.value >= 99) {
                return
            }
            valueQuantityMobile.current.value = (+valueQuantityMobile.current.value) + 1
        } else {
            if (dataProd?.isFlashsale && valueQuantityPc.current.value >= dataProd?.quantity - dataProd?.soldFlashSale) {
                valueQuantityPc.current.value = dataProd.quantity - dataProd?.soldFlashSale
                message.error(`Số lượng sản phẩm còn lại là ${dataProd.quantity - dataProd?.soldFlashSale}`)
                return
            }
            if (valueQuantityPc.current.value >= 99) {
                return
            }
            valueQuantityPc.current.value = (+valueQuantityPc.current.value) + 1
        }
    }

    const handleChaneInputQuantity = () => {

        if (valueQuantityPc.current.value <= 0) {
            valueQuantityPc.current.value = 1
        }

        if (dataProd?.isFlashsale && valueQuantityPc.current.value >= dataProd?.quantity - dataProd?.soldFlashSale) {
            valueQuantityPc.current.value = dataProd.quantity - dataProd?.soldFlashSale
            message.error(`Số lượng sản phẩm còn lại là ${dataProd.quantity - dataProd?.soldFlashSale}`)
            return
        }
        if (valueQuantityPc.current.value >= 99) {
            return
        }

        if (valueQuantityMobile.current.value <= 0) {
            valueQuantityMobile.current.value = 1
        }

        if (dataProd?.isFlashsale && valueQuantityMobile.current.value >= dataProd?.quantity - dataProd?.soldFlashSale) {
            valueQuantityMobile.current.value = dataProd.quantity - dataProd?.soldFlashSale
            message.error(`Số lượng sản phẩm còn lại là ${dataProd.quantity - dataProd?.soldFlashSale}`)
            return
        }
        if (valueQuantityMobile.current.value >= 99) {
            valueQuantityMobile.current.value = 99
            return
        }

    }

    const handleDispatchItemToCart = (type, action) => {
        distpach(handleAddItemToCart({
            _id: location.state?.prod?._id,
            price: priceItem,
            thumbnail: thumbnail,
            quantity: type == "mobile" ? +valueQuantityMobile.current?.value : +valueQuantityPc.current?.value,
            mainText: location.state?.prod?.mainText,
            quantityFlashsale: dataProd?.isFlashsale ? dataProd?.quantity - dataProd?.soldFlashSale : undefined
        }))
        message.success("Thêm sản phẩm vào giỏ hàng !")

        if (action == "buy") {
            navigate('/cart')
        }
    }

    const fetchFindOneProdById = async () => {
        setDataProd(null)
        let res = await handleFindOneProd(location.state?.prod?._id)
        if (res && res.data) {
            let isRecur = false
            res.data?.product?.slider.map(img => {
                if (img.includes(res.data?.product?.thumbnail)) {
                    isRecur = true
                }
            })
            if (!isRecur) {
                res.data?.product?.slider.unshift(res.data?.product?.thumbnail)
            }

            setPercentSold(res?.data?.product?.isFlashsale ? (res?.data?.product?.soldFlashSale / res?.data?.product?.quantity) * 100 : 0)
            setDataProd(res?.data?.product)
            setIndexImageSlider(0)
            setPriceItem(res?.data?.product?.priceFlashSale && res?.data?.product?.isFlashsale ?
                res?.data?.product?.priceFlashSale : res?.data?.product?.price)
            setListImg(res?.data?.product?.slider)
            setThumbnail(res?.data?.product?.thumbnail)
        }
    }

    const fetchListProdRecommend = async () => {
        setDataRecomment(null)
        let res = await handleFetchProductPaginate(1, 10, `-createdAt`)
        if (res && res.data) {
            setDataRecomment(res.data?.listProduct)

        }
    }

    //timer
    const [timeFuture, setTimeFuture] = useState(null)
    const [second, setSecond] = useState(0)
    const [minute, setMinute] = useState(30)
    const [hour, setHours] = useState(0)
    const [isTimeEnd, setIsTimeEnd] = useState(false)

    useEffect(() => {
        getInitTimeFuture(setSecond, setMinute, setHours, setTimeFuture, null, setIsTimeEnd)
        fetchListProdRecommend()
        fetchFindOneProdById()
        handleFindCommentForProd(1, 15, "-createdAt")

        document.title = location.state?.prod?.mainText
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }, [location.state?.prod?._id])

    useEffect(() => {
        sliderImage?.current?.addEventListener("scroll", handleMouseDown)

        return () => sliderImage?.current?.removeEventListener("scroll", handleMouseDown)
    }, [dataProd])

    useEffect(() => {
        if (second <= 1 && minute == 0 && hour == 0) {
            setSecond(0)
            setIsTimeEnd(true)
            console.log('het hang stop time out')
            return
        }
        let timeID = setTimeout(() => {

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

    const category = () => {
        switch (dataProd?.category) {
            case "cook":
                return "ĐỒ ĂN CHẾ BIẾN"
                break;
            case "ingredient":
                return "NGUYÊN LIỆU"
                break;
            case "vegetable":
                return "RAU CỦ QUẢ"
                break;
            default:
                break;
        }

    }
    const type = () => {
        switch (dataProd?.type) {
            case "chicken":
                return "THỊT GÀ"

            case "duck":
                return "THỊT VỊT"

            case "cow":
                return "THỊT BÒ"
            case "boil":
                return "MÓN LUỘC"

            case "fried":
                return "MÓN CHIÊN"

            case "brause":
                return "MÓN KHO"

            default:
                break;
        }

    }



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
                                <Breadcrumb.Item>{category()}</Breadcrumb.Item>
                                <Breadcrumb.Item>{type()}</Breadcrumb.Item>

                            </Breadcrumb>
                        </Col>
                        {dataProd ? <Col span={24} className="detail-page-content" >
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
                                                        shape="square" key={index} src={`${baseURL}/images/${img}`} />
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
                                                            shape="square" key={index} src={`${baseURL}/images/${img}`} />

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
                                                    shape="square" src={`${baseURL}/images/${thumbnail}`} />


                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={13} xl={13} xxl={13} className="content-right">
                                    <Row gutter={[0, 10]}>
                                        {dataProd?.isFlashsale ?
                                            <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0} >
                                                <Row style={{ backgroundColor: '#ff6d6d', padding: 5 }}>
                                                    <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ padding: 5, backgroundColor: '#fff', maxHeight: 20, borderRadius: '0 0 10px 0' }}>
                                                            <img style={{ height: 15, width: 120, objectFit: 'cover' }} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/flashsale/label-flashsale.svg?q=102450" />

                                                        </div>
                                                        <div style={{ height: 15, width: '150px', backgroundColor: '#ffcfce', position: 'relative', borderRadius: 10 }}>
                                                            <div style={isTimeEnd ?
                                                                { width: '100%', background: '#fff', height: '100%', borderRadius: 10 }
                                                                :
                                                                { width: `${percentSold}%`, height: '100%', borderRadius: 10, background: '#fff' }}>

                                                            </div>
                                                            <span style={{ position: 'absolute', right: '50%', transform: 'translateX(50%)', fontSize: 11, color: '#f63b2f', top: 0 }}>
                                                                {isTimeEnd ? "Hết thời gian" : ` Còn lại: ${dataProd?.quantity - dataProd?.soldFlashSale}`}
                                                            </span>
                                                        </div>
                                                    </Col>
                                                    <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                                                            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }} >{formatter.format(priceItem)} đ</span>
                                                            <div style={{ fontSize: 12, padding: 3, color: '#c92127', backgroundColor: '#fff', fontWeight: 700, borderRadius: 3, margin: '0 10px' }} >
                                                                {dataProd?.priceFlashSale && dataProd?.isFlashsale
                                                                    ? `-${formatter.format(Math.round(100 - (dataProd?.priceFlashSale / dataProd?.price) * 100))}%`
                                                                    : `-${dataProd?.percentSale}%`}

                                                            </div>
                                                            <span style={{ fontSize: 12, color: '#fff', textDecoration: 'line-through' }} >{formatter.format(dataProd?.isFlashsale ?
                                                                dataProd?.price :
                                                                priceItem + (priceItem / 100 * dataProd?.percentSale))} đ
                                                            </span>

                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', padding: 5, borderRadius: 7 }}>
                                                            <span className='time-countdown-detail-prod'>{hour < 10 ? `0${hour}` : hour}</span>
                                                            <span style={{ fontWeight: 700 }}>:</span>
                                                            <span className='time-countdown-detail-prod'>{minute < 10 ? `0${minute}` : minute}</span>
                                                            <span style={{ fontWeight: 700 }}>:</span>
                                                            <span className='time-countdown-detail-prod'>{second < 10 ? `0${second}` : second}</span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            :
                                            <></>
                                        }
                                        <Col span={24} className="title-prod">
                                            {dataProd?.mainText}
                                        </Col>
                                        <Col style={{ marginTop: 15 }} span={24} className="sub-title-prod">
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}> Nhà cung cấp :</span>
                                                <span style={{ marginLeft: 5, color: '#2489f4', fontWeight: 700 }}>FAHASA</span>
                                            </Row>
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}>Tác giả : </span>
                                                <span style={{ marginLeft: 5, fontWeight: 600 }}>{dataProd?.author}</span>
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
                                        <Col span={24} className="rate-prod" style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                            <Rate value={5} style={{ color: 'f6a500', fontSize: 14 }} />
                                            <span style={{ marginLeft: 10, color: '#f6a500', marginTop: 1, fontWeight: 500 }}>({comments?.length} đánh giá)</span>
                                        </Col>
                                        {dataProd?.isFlashsale ?

                                            <Col xs={0} sm={0} md={0} lg={24} xl={24} xxl={24} style={{ backgroundColor: '#ff6d6d', borderRadius: 8 }}>
                                                <Row style={{ padding: 7, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8 }}>
                                                    <Col>
                                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 7 }}>
                                                            <img style={{ height: 25, objectFit: 'cover' }} src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/flashsale/label-flashsale.svg?q=102450" />
                                                            <span className='time-countdown-detail-prod' style={{ marginLeft: 20 }}>{hour < 10 ? `0${hour}` : hour}</span>
                                                            <span style={{ fontWeight: 700 }}>:</span>
                                                            <span className='time-countdown-detail-prod'>{minute < 10 ? `0${minute}` : minute}</span>
                                                            <span style={{ fontWeight: 700 }}>:</span>
                                                            <span className='time-countdown-detail-prod'>{second < 10 ? `0${second}` : second}</span>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div style={{ height: 15, width: 200, backgroundColor: '#ffcfce', position: 'relative', borderRadius: 10 }}>
                                                            <div style={isTimeEnd ?
                                                                { width: '100%', background: '#fff', height: '100%', borderRadius: 10 }
                                                                :
                                                                { width: `${percentSold}%`, height: '100%', borderRadius: 10, background: '#fff' }}>

                                                            </div>
                                                            <span style={{ position: 'absolute', right: '50%', transform: 'translateX(50%)', fontSize: 12, color: '#f63b2f', top: 0 }}>
                                                                {isTimeEnd ? "Hết thời gian" : ` Còn lại: ${dataProd?.quantity - dataProd?.soldFlashSale}`}
                                                            </span>
                                                        </div>
                                                    </Col>
                                                </Row>



                                            </Col> :
                                            <></>}


                                        {!dataProd?.isFlashsale ?
                                            <Col className="price-prod" style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                                <span className="main-price">{formatter.format(priceItem)} đ</span>
                                                <span className="sub-price">{formatter.format(dataProd?.isFlashsale ?
                                                    dataProd?.price :
                                                    priceItem + (priceItem / 100 * dataProd?.percentSale))} đ</span>
                                                <div className="percent-price">
                                                    {dataProd?.priceFlashSale && dataProd?.isFlashsale
                                                        ? `-${formatter.format(Math.round(100 - (dataProd?.priceFlashSale / dataProd?.price) * 100))}%`
                                                        : `-${dataProd?.percentSale}%`}

                                                </div>
                                            </Col> :
                                            <>
                                                <Col xs={0} sm={0} md={0} lg={24} xl={24} xxl={24} className="price-prod hide-detail" style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                                    <span className="main-price">{formatter.format(priceItem)} đ</span>
                                                    <span className="sub-price">{formatter.format(dataProd?.isFlashsale ?
                                                        dataProd?.price :
                                                        priceItem + (priceItem / 100 * dataProd?.percentSale))} đ</span>
                                                    <div className="percent-price">
                                                        {dataProd?.priceFlashSale && dataProd?.isFlashsale
                                                            ? `-${formatter.format(Math.round(100 - (dataProd?.priceFlashSale / dataProd?.price) * 100))}%`
                                                            : `-${dataProd?.percentSale}%`}

                                                    </div>
                                                </Col>
                                            </>}





                                        <Col className="rate-prod" span={24} style={{ margin: '5px 0' }} >
                                            <Row>
                                                <span style={{ color: '#333333', fontSize: 14 }}> Thời gian giao hàng :</span>
                                                <span style={{ marginLeft: 5, color: '#2489f4', fontWeight: 600 }}>10h-17h / ngày</span>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <span style={{ color: '#333333', fontSize: 14 }}>Giao hàng đến : </span>
                                                <span style={{ marginLeft: 5, fontWeight: 600 }}>Toàn Quốc</span>
                                            </Row>
                                        </Col>
                                        <Col className="hide-detail" span={24} style={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: '15%' }}>
                                            <span style={{ fontSize: 16, color: '#555555', fontWeight: 600 }}>Số lượng : </span>
                                            <div style={{ padding: '10px 20px', border: '1px solid #333', height: 20, borderRadius: 5, marginLeft: 50 }}>
                                                <MinusOutlined onClick={() => handleMinusValueQuantity("pc")} style={{ cursor: 'pointer' }} />
                                                <input onChange={(e) => handleChaneInputQuantity(e)} ref={valueQuantityPc} defaultValue={1}
                                                    style={{ width: 50, height: 20, border: 'none', outline: 'none', textAlign: 'center', fontWeight: 700, userSelect: 'none' }}
                                                    type="number" />
                                                <PlusOutlined onClick={() => handlePlusValueQuantity("pc")} style={{ cursor: 'pointer' }} />
                                            </div>
                                        </Col>
                                        <Col className="hide-detail" span={24} style={{ display: 'flex', position: 'absolute', bottom: 5 }}>
                                            {dataProd?.isFlashsale ?
                                                dataProd?.quantity - dataProd?.soldFlashSale > 0 && !isTimeEnd ?
                                                    <>
                                                        <Button onClick={() => handleDispatchItemToCart("pc", "add")} style={{ width: 200, height: 45, border: '2px solid #c92127', display: 'flex', alignItems: 'center' }}>
                                                            <ShoppingCartOutlined style={{ fontSize: 23, color: '#c92127', fontWeight: 700 }} />
                                                            <span style={{ color: '#c92127', fontWeight: 600, fontSize: 15 }} >  Thêm vào giỏ hàng</span>

                                                        </Button>
                                                        <Button onClick={() => handleDispatchItemToCart("pc", "buy")} style={{ width: 200, height: 45, backgroundColor: '#c92127', color: '#fff', fontWeight: 600, fontSize: 15, marginLeft: 15 }}>
                                                            Mua ngay
                                                        </Button>
                                                    </> :
                                                    <Button disabled style={{ width: 200, height: 45, fontWeight: 600, fontSize: 15 }}>
                                                        Hiện tại hết hàng
                                                    </Button>
                                                :
                                                <>
                                                    <Button onClick={() => handleDispatchItemToCart("pc", "add")} style={{ width: 200, height: 45, border: '2px solid #c92127', display: 'flex', alignItems: 'center' }}>
                                                        <ShoppingCartOutlined style={{ fontSize: 23, color: '#c92127', fontWeight: 700 }} />
                                                        <span style={{ color: '#c92127', fontWeight: 600, fontSize: 15 }} >  Thêm vào giỏ hàng</span>

                                                    </Button>
                                                    <Button onClick={() => handleDispatchItemToCart("pc", "buy")} style={{ width: 200, height: 45, backgroundColor: '#c92127', color: '#fff', fontWeight: 600, fontSize: 15, marginLeft: 15 }}>
                                                        Mua ngay
                                                    </Button>

                                                </>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col> :
                            <Col span={24} style={{ padding: '20px', minHeight: 450, backgroundColor: '#fff', borderRadius: 4 }}>
                                <Row gutter={[0, 20]}>
                                    <Col span={24}>
                                        <Skeleton active />
                                    </Col>
                                    <Col span={24}>
                                        <Skeleton active />
                                    </Col>
                                    <Col span={24}>
                                        <Skeleton active />
                                    </Col>
                                </Row>
                            </Col>}
                        <Col style={{
                            position: 'fixed', left: 0, bottom: 0, width: '100%', height: 50,
                            backgroundColor: '#fff', zIndex: 10, borderTop: '1px solid #ededed'
                        }}
                            xs={24} sm={24} md={24} lg={0} xl={0} xxl={0} >
                            <Row style={{ height: '100%' }}>
                                <Col span={8} style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #ededed' }}>
                                    <div style={{ padding: '10px 0px', height: 20, borderRadius: 5, margin: '0 auto' }}>
                                        <MinusOutlined onClick={() => handleMinusValueQuantity("mobile")} style={{ cursor: 'pointer', fontSize: 17 }} />
                                        <input onChange={handleChaneInputQuantity} ref={valueQuantityMobile} defaultValue={1}
                                            style={{
                                                width: 60, height: 20, border: 'none', outline: 'none', textAlign: 'center',
                                                fontWeight: 700, backgroundColor: '#fff', color: '#c92127'
                                            }}
                                            type="number" />
                                        <PlusOutlined onClick={() => handlePlusValueQuantity("mobile")} style={{ cursor: 'pointer', fontSize: 17 }} />
                                    </div>
                                </Col>
                                {dataProd?.isFlashsale ?
                                    dataProd?.quantity - dataProd?.soldFlashSale > 0 && !isTimeEnd ?
                                        <>
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
                                        </>
                                        :
                                        <>
                                            <Col disabled span={16} style={{ backgroundColor: '#ccc', display: 'grid', placeItems: 'center', color: '#555', fontWeight: 500 }}>
                                                Hiện tại hết hàng
                                            </Col>
                                        </>
                                    :
                                    <>
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
                                    </>}
                            </Row>
                        </Col>


                    </Row>


                </Col>
            </Row >
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
                        {dataRecomment ? dataRecomment.map((item, index) => {
                            return (
                                <Col onClick={() => handleNavigateDetailPage(item)} ref={firstCardSlider} key={index} className='card'>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        draggable={false}

                                        style={{
                                            width: '100%',

                                        }}
                                        cover={<img draggable={false} alt="example" src={`${baseURL}/images/${item?.thumbnail}`} />}
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
                                                <span className='number-comment'>({item?.comments?.length})</span>
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
                                    <Avatar style={{ marginRight: 10 }} shape="square" size={50} src={`${baseURL}/images/${infoAccount?.info?.avatar}`} />
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
                                                    <Avatar shape="square" size={50} src={`${baseURL}/images/${item?.avatar}`} />
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
                                                            <Avatar onClick={() => handlePreviewImageComment(item)} style={{ cursor: 'pointer' }} size={80} shape="square" key={index} src={`${baseURL}/images/${item}`} />
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

        </div >
    )
}

export default DetailProd