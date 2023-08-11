import { Button, Checkbox, Col, Divider, Form, Input, Row, message } from 'antd';
// import { handleLogin, handleLoginGoogle } from '../../../service/api';
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';

import { useDispatch, useSelector } from 'react-redux';
// import { handleDispatchLogin } from '../../../redux/slice/accountSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import '../auth.scss'
import ModalSendSMS from '../../../component/Modal/ModalSendSMS';
import { handleLogin, handleLoginGoogle } from '../../../service/api';
import { LoadingOutlined } from '@ant-design/icons'
import { handleDispatchLogin } from '../../../redux/account/accountSlice';






const Login = (props) => {
    const { span, setIsModalOpen } = props
    const [isLoading, setIsLoading] = useState(false)
    const [isModalSendSmsOpen, setIsModalSendSmsOpen] = useState(false);
    const [dataLoginGoogle, setDataLoginGoogle] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();





    const onFinish = async (values) => {

        const { username, password } = values
        setIsLoading(true)
        let res = await handleLogin(username, password)
        setIsLoading(false)
        console.log(res)
        if (res && res.data) {
            localStorage.setItem('access_token', res.data.access_token)
            message.success(`Xin chào ${res.data?.user?.name}`)
            dispatch(handleDispatchLogin(res.data.user))
            if (setIsModalOpen) {
                setIsModalOpen(false)
            }
            navigate('/')
            // if (location?.state?.callback) {
            //     navigate(location?.state?.callback)
            // } else {
            //     navigate('/')
            // }


        } else {
            message.error(res.message)
        }
    };

    const responseGoogle = async (response) => {
        if (response.profileObj) {
            const { email, name, imageUrl } = response.profileObj

            setDataLoginGoogle(response.profileObj)

            let res = await handleLoginGoogle(name, imageUrl, email)
            console.log(res)
            if (res && res.data && res?.data?.exist) {
                dispatch(handleDispatchLogin(res.data.newPayload))
                localStorage.setItem('access_token', res.data.access_token)
                message.success(`Xin chào ${name} !`)
                if (window.location.pathname.includes("auth")) {
                    navigate('/')
                }

            } else {
                setIsModalSendSmsOpen(true)
            }
        }
    }

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: "619086820314-ucbag8u8jr1bd9thfno9aib62i010tk7.apps.googleusercontent.com",
                scope: ""
            })
        }

        gapi.load('client:auth2', start)
    }, [])

    const dataAccount = useSelector(state => state.account.info)

    console.log('dataAccount : ', dataAccount)


    return (
        <>
            <ModalSendSMS dataLoginGoogle={dataLoginGoogle} isModalOpen={isModalSendSmsOpen} setIsModalOpen={setIsModalSendSmsOpen} />
            <Form
                name="basic"
                onFinish={onFinish}

            >
                <Form.Item
                    label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Số điện thoại / Email</span>}
                    name="username"
                    labelCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền trường này !',
                        },
                    ]}
                >
                    <Input size='large' placeholder='Nhập số điện thoại hoặc email...' className='input-auth' />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Mật khẩu</span>}

                    name="password"
                    labelCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền mật khẩu !',
                        },
                    ]}
                >
                    <Input.Password size='large' placeholder='Nhập mật khẩu...' className='input-auth' />
                </Form.Item>


                <Form.Item

                >
                    <Row style={{ marginTop: 30 }}>
                        <Col span={17} style={{ margin: '0 auto' }}>
                            <Button className='btn-login' size='large' style={{ margin: '0 auto', width: '100%', height: 45, backgroundColor: '#C92127' }}
                                type="primary" htmlType="submit">
                                {isLoading ? <LoadingOutlined /> : "Đăng nhập"}
                            </Button>
                        </Col>
                        <Divider plain><span style={{ fontSize: 13, color: '#a1a1a1' }}>Hoặc</span></Divider>
                        <Col span={17} style={{ margin: '0 auto' }}>


                            <GoogleLogin
                                clientId="619086820314-ucbag8u8jr1bd9thfno9aib62i010tk7.apps.googleusercontent.com"
                                buttonText="Login"
                                render={renderProps => (
                                    <Button onClick={renderProps.onClick} size='large' style={{
                                        border: '1px solid #aaaaaa ',
                                        width: '100%', height: 45, backgroundColor: '#fff', color: '#333'
                                    }}
                                        type="primary" htmlType="submit">
                                        <Row>
                                            <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src='	https://aristino.com/Content/pc/images/icon/google.svg' />
                                                <span className='hide-litte-phone' style={{ marginLeft: 10, fontSize: 15, color: '#666666' }}>Đăng nhập bằng Google</span>
                                            </Col>
                                        </Row>
                                    </Button>
                                )}
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            // isSignedIn={true}
                            />



                        </Col>

                    </Row>
                </Form.Item>
            </Form>
        </>
    )
}

export default Login