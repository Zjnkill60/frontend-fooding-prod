import { Button, Checkbox, Col, Divider, Form, Input, Row, message } from 'antd';
import '../auth.scss'
import { useEffect, useRef, useState } from 'react';
import { handleRegister, handleSendSMS, handleVerifySMS } from '../../../service/api';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form';
// import { handleRegister } from '../../../service/api';




const Register = (props) => {
    const [phoneNumberInput, setPhoneNumberInput] = useState("")
    const [otpInput, setOtpInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOTP, setIsLoadingOTP] = useState(false)
    const [isSendSMS, setIsSendSMS] = useState(false)
    const [isValidateOTP, setIsValidateOTP] = useState(false)
    const [isFalseValidate, setIsFalseValidate] = useState(false)
    const [countDownNumber, setCountDownNumber] = useState(60)
    const [isCountDown, setIsCountDown] = useState(false)

    let timeout

    const { setIndexActive } = props

    const [form] = useForm()

    const onFinish = async (values) => {
        const { name, phoneNumber, password } = values
        let res = await handleRegister(phoneNumber, name, password)
        console.log(res)
        if (res && res.data) {
            setIndexActive(1)
            message.success(`Tài khoản của ${res.data?.user?.name} đã được tạo thành công !`)

        } else {
            message.error(res.message)
        }

    };

    const handleChangeInputOTP = async (value) => {
        setOtpInput(value)
        if (value.length >= 6) {
            await handleVerifyOTP(value)

        } else {
            setIsValidateOTP(false)
            setIsFalseValidate(false)
        }
    }

    const handleSendOTP = async () => {

        setIsLoading(true)
        let res = await handleSendSMS(phoneNumberInput)
        setIsLoading(false)

        console.log(res)
        if (res && res.data) {
            setIsSendSMS(true)
            setCountDownNumber(59)
            setIsCountDown(true)
            message.success("Gửi OTP thành công !")

        } else {
            if (res?.status == 429) {
                message.error("Hệ thống quá tải , vui lòng thử lại sau ")
            } else {
                message.error(res.message)
            }


        }
    }

    const handleVerifyOTP = async (otp) => {
        setIsLoadingOTP(true)
        let res = await handleVerifySMS(phoneNumberInput, otp)
        setIsLoadingOTP(false)

        if (res?.data?.msg == "approved") {
            message.success('Xác thực OTP thành công !')
            setIsValidateOTP(true)
            setIsSendSMS(false)
        } else {
            setIsFalseValidate(true)
            message.error("Mã OTP không chính xác !")
        }
    }

    useEffect(() => {
        if (isCountDown) {
            if (countDownNumber == 0) {
                setIsCountDown(false)
                clearTimeout(timeout)
                return
            }
            setTimeout(() => {
                setCountDownNumber(number => number - 1)
            }, 1000);
        } else {
            return
        }
    }, [countDownNumber])

    console.log(countDownNumber)
    return (
        <>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}

            >
                <Form.Item
                    label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Họ tên</span>}
                    name="name"
                    labelCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền trường này !',
                        },
                    ]}
                >
                    <Input size='large' placeholder='Nhập họ tên vào trường này' className='input-auth' />
                </Form.Item>


                <div style={{ position: 'relative' }}>
                    <Form.Item
                        label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Số điện thoại</span>}
                        name="phoneNumber"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền trường này !',
                            },
                        ]}
                    >
                        <Input onChange={(e) => setPhoneNumberInput(e.target.value)} type='number' size='large' placeholder=' Số điện thoại (10 số)' className='input-auth' />
                    </Form.Item>
                    {isCountDown ? <span className='txt-countdown'>({countDownNumber}s)</span> :
                        <span onClick={handleSendOTP} className='txt-countdown'>{isLoading ? <LoadingOutlined style={{ fontSize: 23 }} /> : 'Gửi mã OTP'}</span>}
                </div>

                <Form.Item
                    label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Mã xác nhận OTP</span>}
                    name="otp"
                    labelCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền mã OTP !',
                        },
                    ]}
                >
                    <Input value={otpInput} disabled={!isSendSMS} type='number' onChange={(e) => handleChangeInputOTP(e.target.value)} size='large' placeholder='6 kí tự' />
                    {isLoadingOTP ? <span className='txt-send-otp'> <LoadingOutlined style={{ fontSize: 23 }} /> </span> : <></>}
                    {isValidateOTP ? <>
                        <CheckCircleOutlined style={{ fontSize: 23, color: 'green' }} className={'txt-send-otp'} />
                    </> : <></>}
                    {isFalseValidate && otpInput.length >= 6 ? <>
                        <CloseCircleOutlined style={{ fontSize: 23, color: 'red' }} className={'txt-send-otp'} />
                    </> : <></>}


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
                    <Input.Password disabled={!isValidateOTP} size='large' placeholder='Nhập mật khẩu vào trường này' />
                </Form.Item>





                <Form.Item

                >
                    <Row style={{ marginTop: 20 }}>
                        <Col span={17} style={{ margin: '0 auto' }}>
                            <Button className='btn-login' size='large' style={{ margin: '0 auto', width: '100%', height: 45, backgroundColor: '#C92127' }}
                                type="primary" htmlType="submit">
                                Đăng ký
                            </Button>
                        </Col>

                    </Row>
                </Form.Item>
            </Form>
        </>
    )
}

export default Register