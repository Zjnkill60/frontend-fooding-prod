import {
    MenuFoldOutlined,
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    AccountBookOutlined
} from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, message, theme } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogout } from '../../service/api';
import { handleDispatchLogout } from '../../redux/account/accountSlice'
import './admin.scss'

const { Header, Sider, Content } = Layout;

const LayoutAdmin = (props) => {
    const { dataUser } = props
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isScreen980, setIsScreen980] = useState(false)
    const baseURL = import.meta.env.VITE_URL_BACKEND




    const handleLogoutAccount = async () => {
        let res = await handleLogout()
        console.log(res)
        localStorage.setItem('access_token', null)
        message.success('Đăng xuất thành công')
        dispatch(handleDispatchLogout())
        navigate('/')
    }

    let items = [
        {
            key: '1',
            label: (
                <Button onClick={() => navigate('/')}
                    size="large" style={{ width: '100%', height: 45 }} type="primary">Về trang chủ</Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button onClick={() => handleLogoutAccount()}
                    size="large" style={{ width: '100%', height: 45, backgroundColor: '#C92127' }} type="primary">Đăng xuất</Button>
            ),
        },



    ];

    const itemsHeader = [
        {
            label: 'Menu',
            key: 'SubMenu',
            icon: <MenuFoldOutlined />,
            children: [
                {
                    type: 'group',
                    label: <div className='item-menu' onClick={() => navigate('/admin')}> Dashboard</div>,

                },
                {
                    type: 'group',
                    label: <div className='item-menu' onClick={() => navigate('/admin/manage-users')}> Manage Users</div>,

                },
                {
                    type: 'group',
                    label: <div className='item-menu' onClick={() => navigate('/admin/manage-products')} > Manage Products</div>,

                },
                {
                    type: 'group',
                    label: <div className='item-menu' onClick={() => navigate('/admin/manage-orders')} > Manage Orders</div>,

                },
                {
                    type: 'group',
                    label: <div className='item-menu' onClick={() => navigate('/admin/manage-flashsale')} > Manage FlashSale</div>,

                },
                {
                    type: 'group',
                    label: <div className='item-menu' onClick={() => navigate('/admin/manage-discount')} > Manage Discount</div>,

                },
            ],
        },
        {

            key: 'dropdown',
            label: <div className='dropdown-headeradmin'>
                <Dropdown
                    menu={{
                        items
                    }}
                    placement="bottom"

                >

                    <Row style={{ textAlign: 'center' }} gutter={[0, 5]}>
                        <Col span={24}>
                            <UserOutlined style={{ fontSize: 18 }} />
                            <DownOutlined style={{ marginLeft: 5 }} />

                        </Col>


                    </Row>

                </Dropdown>
            </div>
        }

    ];

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}
                className={isScreen980 ? 'hide' : null}

                onBreakpoint={(broken) => {
                    setIsScreen980(broken)
                }} breakpoint="lg">

                <Row style={{ padding: 10 }} gutter={[0, 10]}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Avatar src={baseURL + 'images/' + dataUser?.info?.avatar} size={64} icon={<UserOutlined />} />

                    </Col>
                    <Col span={24} style={{ textAlign: 'center', color: '#fff' }}>
                        Xin chào {dataUser?.info?.name}
                    </Col>
                </Row>
                <Menu
                    style={{ marginTop: 50 }}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined />,
                            label: <Link to='/admin'>Dashboard</Link>,
                        },
                        {
                            key: '2',
                            icon: <UserOutlined />,
                            label: <Link to='manage-users'>Manage Users</Link>,
                        },
                        {
                            key: '3',
                            icon: <BookOutlined />,
                            label: <Link to='manage-products'>Manage Products</Link>,
                        },
                        {
                            key: '4',
                            icon: <AccountBookOutlined />,
                            label: <Link to='manage-orders'>Manage Orders</Link>,
                        },
                        {
                            key: '5',
                            icon: <DashboardOutlined />,
                            label: <Link to='manage-flashsale'>Manage FlashSale</Link>,
                        },
                        {
                            key: '6',
                            icon: <AccountBookOutlined />,
                            label: <Link to='manage-discount'>Manage Discount</Link>,
                        },
                    ]}

                />
            </Sider>


            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Menu defaultSelectedKeys={1} className={isScreen980 ? 'menu-header-admin' : 'hide'} theme="dark" mode="horizontal" items={itemsHeader} />

                    {isScreen980 ? <></> :
                        <Row>
                            <Col>
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{
                                        fontSize: '16px',
                                        width: 64,
                                        height: 64,
                                    }}
                                />
                            </Col>
                            <Col span={3} style={{ marginLeft: 'auto' }}>
                                <Dropdown
                                    menu={{
                                        items,
                                    }}
                                    placement="bottom"

                                >

                                    <Row style={{ textAlign: 'center' }} gutter={[0, 5]}>
                                        <Col span={24}>
                                            <UserOutlined style={{ fontSize: 18 }} />
                                            <DownOutlined style={{ marginLeft: 5 }} />

                                        </Col>


                                    </Row>

                                </Dropdown>

                            </Col>
                        </Row>
                    }
                </Header>
                <Content
                    className='content-admin'
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >


                    {props.children}

                </Content>
            </Layout>
        </Layout>
    )
}

export default LayoutAdmin