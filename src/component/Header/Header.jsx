import { Avatar, Badge, Button, Col, Divider, Dropdown, Popover, Row, message } from "antd"
import './header.scss'
import { SearchOutlined, MinusSquareOutlined, UserOutlined, ShoppingCartOutlined, DownOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from 'react-google-login';
import ModalSendSMS from "../Modal/ModalSendSMS"
import { useDispatch, useSelector } from "react-redux"
import { handleFilterNameProduct, handleLoginGoogle, handleLogout } from "../../service/api"
import { handleDispatchLogin, handleDispatchLogout } from "../../redux/account/accountSlice"
import DrawerMenuMoblie from "./DrawerMenuMoblie"
const baseURL = import.meta.env.VITE_URL_BACKEND

const Header = () => {
    const [dataSearch, setDataSearch] = useState([])
    const [dataLoginGoogle, setDataLoginGoogle] = useState(null)
    const [isModalSendSmsOpen, setIsModalSendSmsOpen] = useState(false);
    //drawer
    const [openDrawerMenu, setOpenDrawerMenu] = useState(false);
    const dataCart = useSelector(state => state.order)
    const dataUser = useSelector(state => state.account)
    const headerLogo = useRef()
    const headerContent = useRef()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleScroll = (e) => {
        if (window.pageYOffset > 26) {
            headerContent.current.classList.add("sticky");
        } else {
            headerContent.current.classList.remove("sticky");
        }
    }

    const navigateAuth = (number) => {
        navigate('/auth', { state: { number } })

    };

    const responseGoogle = async (response) => {
        if (response.profileObj) {
            const { email, name, imageUrl } = response.profileObj

            setDataLoginGoogle(response.profileObj)

            let res = await handleLoginGoogle(name, imageUrl, email)
            if (res && res.data && res?.data?.exist) {
                dispatch(handleDispatchLogin(res.data.newPayload))
                localStorage.setItem('access_token', res.data.access_token)
                message.success(`Xin chào ${name} !`)
                if (window.location.pathname.includes("auth")) {
                    navigate('/')
                }

            } else {
                setIsModalSendSmsOpen(true)
                localStorage.removeItem('access_token')
            }
        }
    }

    const handleLogOut = async () => {
        let res = await handleLogout()
        if (res && res.data) {
            message.success("Đăng xuất thành công")
            localStorage.removeItem('access_token')
            dispatch(handleDispatchLogout())
        }
    }

    let items = [
        {
            key: '1',
            label: (
                <Button onClick={() => navigateAuth(1)}
                    size="large" style={{ width: '100%', height: 45, backgroundColor: '#C92127' }} type="primary">Đăng nhập</Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button onClick={() => navigateAuth(2)}
                    size="large" style={{ width: '100%', height: 45, backgroundColor: '#fff', border: '2px solid #C92127', color: '#C92127' }}
                    type="primary">Đăng ký</Button>
            ),

        },
        {
            key: '3',
            label: (
                <GoogleLogin
                    clientId="619086820314-ucbag8u8jr1bd9thfno9aib62i010tk7.apps.googleusercontent.com"
                    buttonText="Login"
                    render={renderProps => (
                        <Button onClick={renderProps.onClick} disabled={renderProps.disabled} size='large' style={{
                            border: '1px solid #aaaaaa ',
                            width: '100%', height: 45, backgroundColor: '#fff', color: '#333'
                        }}
                            type="primary" htmlType="submit">
                            <Row>
                                <Col span={24} style={{ display: 'flex', alignItems: 'center', margin: '0 auto', }}>
                                    <img src='	https://aristino.com/Content/pc/images/icon/google.svg' />
                                    <span style={{ marginLeft: 10, fontSize: 15, color: '#666666' }}>Đăng nhập bằng Google</span>
                                </Col>
                            </Row>
                        </Button>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                // isSignedIn={true}
                />
            ),

        }

    ];

    const itemsHaveLogin = [
        {
            key: '1',
            label: (
                <Button onClick={() => navigate('/account')}
                    size="large" style={{ width: '100%', height: 45, backgroundColor: '#C92127', border: '2px solid #C92127' }} type="primary">Thông tin cá nhân</Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button
                    onClick={() => navigate('/account/history')}
                    size="large" style={{ width: '100%', height: 45, backgroundColor: '#C92127', border: '2px solid #C92127' }}
                    type="primary">Lịch sử đơn hàng </Button>
            ),

        },


    ];

    if (dataUser.isAuthenticated == true) {
        items.splice(0, 3)
        items = [...itemsHaveLogin]
        if (dataUser.info?.role == "ADMIN") {
            items.unshift({
                key: '4',
                label: (
                    <Button onClick={() => navigate('/admin')}
                        size="large" style={{ width: '100%', height: 45, backgroundColor: '#C92127', border: '2px solid #C92127' }}
                        type="primary">Trang quản trị viên </Button>
                ),

            },)
        }
        if (dataUser.info?.role == "SHIPPER") {
            items.unshift({
                key: '10',
                label: (
                    <Button onClick={() => navigate('/shipper')}
                        size="large" style={{ width: '100%', height: 45, backgroundColor: '#C92127', border: '2px solid #C92127' }}
                        type="primary">Trang giao hàng </Button>
                ),

            },)
        }
        items.push({
            key: '5',
            label: (
                <Button onClick={handleLogOut}
                    size="large" style={{ width: '100%', height: 45, backgroundColor: '#fff', border: '2px solid #C92127', color: '#C92127' }}
                    type="primary">Đăng xuất </Button>
            ),

        },)
    }


    //navigate chua fix

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

    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });

    const content = (
        <Row style={{ maxWidth: 500 }}>
            <Row className="cart-header-list-item" style={{ maxHeight: 300, overflow: 'scroll', width: '100%' }}>
                {dataCart?.items?.length > 0 ? dataCart.items.map((item) => {
                    return (
                        <>
                            <Col onClick={() => handleNavigateDetailPage(item)} span={24} style={{ marginTop: 10, cursor: 'pointer', width: '100%' }}>

                                <Row >
                                    <Col span={5}>
                                        <Badge count={item?.quantity}>
                                            <Avatar shape="square" size={60} src={`${baseURL}/images/${item?.thumbnail}`} />
                                        </Badge>
                                    </Col>
                                    <Col span={13} style={{ color: '#333', fontSize: 14, maxHeight: 40, overflow: 'hidden' }}>
                                        {item.mainText} x {item.quantity}
                                    </Col>
                                    <Col span={5} style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 500 }}>
                                        {formatter.format(item.price)}đ
                                    </Col>
                                </Row>
                            </Col>
                            <Divider />
                        </>
                    )
                }) : <>Bạn chưa thêm sản phẩm nào vào giỏ hàng !</>}

            </Row>

            {dataCart?.items?.length > 0 ? <Button onClick={() => navigate('/cart')} size="large" type="primary" style={{ marginTop: '10px', width: '100%', backgroundColor: '#c92127', color: '#fff' }}>
                Xem Giỏ Hàng

            </Button> : <></>}
        </Row>
    );

    const contentInput = (
        <div className="cart-header-list-item" style={{ maxHeight: 300, overflow: 'scroll' }}>
            {dataSearch?.length > 0 ? dataSearch?.map((item, index) => {
                return (
                    <>
                        <Row onClick={() => handleNavigateDetailPage(item)} style={{ maxWidth: 550 }} key={index}>
                            <Col span={5}>
                                <Avatar src={`${baseURL}/images/${item?.thumbnail}`} size={60} shape="square" />
                            </Col>
                            <Col span={13} style={{ fontSize: 13, maxHeight: 40, overflow: 'hidden' }}>
                                {item.mainText}
                            </Col>
                            <Col span={5} style={{ fontSize: 14, fontWeight: 600, marginLeft: 'auto' }}>
                                {formatter.format(item.price)}đ
                            </Col>
                        </Row>
                        <Divider />
                    </>

                )
            }) : <>Không có sản phẩm nào , hãy nhập tên sản phẩm</>}

        </div>


    );

    const handleChangeInput = async (e) => {
        let res = await handleFilterNameProduct(1, 10, e.target.value)

        if (res && res.data) {
            setDataSearch(res.data?.listProduct)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])





    return (
        <>
            <DrawerMenuMoblie open={openDrawerMenu} setOpen={setOpenDrawerMenu} />
            <ModalSendSMS dataLoginGoogle={dataLoginGoogle} isModalOpen={isModalSendSmsOpen} setIsModalOpen={setIsModalSendSmsOpen} />
            <Row className="hide-sm" style={{ backgroundColor: '#d4525a' }} >
                <Col span={24}>
                    <Row style={{ maxWidth: 1290, margin: '0 auto' }}>
                        <img style={{ objectFit: 'cover' }} width={'100%'} src="https://cdn0.fahasa.com/media/wysiwyg/Thang-07-2023/Fahasa_Sinhnhat_Logo_Header_1263x60.jpg" alt="" />
                    </Row>
                </Col>

            </Row>

            <Row className="header-container" style={{ backgroundColor: 'fff', padding: '0 4px' }}>
                <Col span={24}>
                    <Row style={{ maxWidth: 1260, margin: '0 auto', padding: '5px 0', minHeight: 70, display: 'flex', alignItems: 'center' }}>
                        <Col style={{ cursor: 'pointer' }} onClick={() => navigate('/')} ref={headerLogo} className="logo-header-padding-sm" xs={24} sm={24} md={24} lg={6} xl={6} xxl={6} >
                            <img className="hide-sm" src={"/366234224_2528201954012003_6572641911100881814_n.png"} style={{ height: '50px', width: '80%', objectFit: 'cover' }} />
                            <img className="pc-hide" style={{ width: 140, maxHeight: 30, objectFit: 'cover' }} src={"/logoUpperCase.png"} alt="FAHASA.COM"></img>

                        </Col>

                        <Col ref={headerContent} xs={24} sm={24} md={24} lg={18} xl={18} xxl={18} >
                            <Row className="header-sticky" style={{ padding: '10px ' }}>
                                <Col xs={2} sm={1} md={1} lg={0} xl={0} xxl={0} >
                                    <Row onClick={() => setOpenDrawerMenu(true)} style={{ cursor: 'pointer' }}>
                                        <Col span={24}>
                                            <AppstoreOutlined className="icon-sm" style={{ fontSize: 23 }} />
                                        </Col>

                                    </Row>
                                </Col>


                                <Col xs={16} sm={19} md={20} lg={16} xl={16} xxl={16} className="container-input-header" >
                                    <Popover placement="bottom" content={contentInput} trigger={'click'}  >
                                        <Row className="height-input" style={{ border: '1px solid #CDCFD0', height: '45px', borderRadius: 10, padding: '0 10px', display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Col xs={22} sm={23} md={23} lg={18} xl={18} xxl={18} style={{ height: '100%' }}>

                                                <input onChange={(e) => handleChangeInput(e)} style={{
                                                    height: '100%', width: '100%', fontSize: 15,
                                                    border: 'none', outline: 'none', padding: '0 20px', borderRadius: 5
                                                }}
                                                    placeholder="Tìm kiếm sản phẩm mong muốn ...." />


                                            </Col>
                                            <Col className="hide-sm" style={{ marginLeft: 'auto' }}>
                                                <Button style={{ width: 70, backgroundColor: '#c92127', borderRadius: 10 }} type="primary" >
                                                    <SearchOutlined style={{ fontSize: 20 }} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Popover>
                                </Col>

                                <Col style={{ marginLeft: 40 }} xs={0} sm={0} md={0} lg={2} xl={2} xxl={2} >
                                    <Row gutter={[0, 10]} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer' }}>
                                        <Col span={24}>
                                            <MinusSquareOutlined style={{ fontSize: 23 }} />
                                        </Col>
                                        <Col className="hide-sm" span={24} style={{ fontSize: 12, color: '#666666' }}>
                                            Tra Cứu
                                        </Col>
                                    </Row>
                                </Col>

                                <Col className="cart-sm" xs={2} sm={2} md={1} lg={2} xl={2} xxl={2} >
                                    <Row gutter={[0, 10]} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer' }}>
                                        <Popover placement="bottom" content={content} >
                                            <Col span={24}>

                                                <Badge count={dataCart?.items?.length}>
                                                    <ShoppingCartOutlined className="icon-sm" style={{ fontSize: 23 }} />

                                                </Badge>


                                            </Col>
                                        </Popover>
                                        <Col className="hide-sm" span={24} style={{ fontSize: 12, color: '#666666' }}>
                                            Giỏ Hàng
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={1} sm={1} md={1} lg={2} xl={2} xxl={2} style={{ margin: '0 5px' }} >
                                    <Dropdown
                                        menu={{
                                            items,
                                        }}


                                    >

                                        <Row gutter={[0, 10]} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer' }}>

                                            <Col span={24} >
                                                <UserOutlined className="icon-sm icon-account-sm" style={{ fontSize: 23 }} />
                                            </Col>
                                            <Col className="hide-sm" span={24} style={{ fontSize: 12, color: '#666666' }}>
                                                Tài Khoản
                                            </Col>
                                            <DownOutlined className="hide-sm" style={{ position: 'absolute', right: 4, top: '30%', transform: 'translateY(-50%)' }} />

                                        </Row>

                                    </Dropdown>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Header