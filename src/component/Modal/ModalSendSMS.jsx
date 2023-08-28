import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react";
import { handleLoginGoogle, handleSendSMS, handleVerifySMS } from "../../service/api";
import { useDispatch } from 'react-redux';
import { handleDispatchLogin } from "../../redux/account/accountSlice";
import { useNavigate } from "react-router-dom";

const ModalSendSMS = (props) => {
    const { isModalOpen, setIsModalOpen, dataLoginGoogle } = props

    const [phoneNumberInput, setPhoneNumberInput] = useState("")
    const [otpInput, setOtpInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOTP, setIsLoadingOTP] = useState(false)
    const [isSendSMS, setIsSendSMS] = useState(false)
    const [isValidateOTP, setIsValidateOTP] = useState(false)
    const [isFalseValidate, setIsFalseValidate] = useState(false)
    const [countDownNumber, setCountDownNumber] = useState(60)
    const [isCountDown, setIsCountDown] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()


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

    const onFinish = async (values) => {
        if (isValidateOTP) {
            const { email, name, imageUrl } = dataLoginGoogle
            const { phoneNumber } = values
            let res = await handleLoginGoogle(name, imageUrl, email, phoneNumber)
            console.log('res : ', res)
            if (res && res.data) {
                dispatch(handleDispatchLogin(res.data?.newPayload))
                setIsModalOpen(false)
                if (window.location.pathname.includes("auth")) {
                    navigate("/")
                }
                message.success(`Tài khoản của ${res.data?.newPayload?.name} đã được tạo thành công !`)

            } else {
                message.error(res.message)
            }

        }

    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isCountDown) {
            if (countDownNumber == 0) {
                setIsCountDown(false)
                clearTimeout(timeout)
                return
            }
            timeout = setTimeout(() => {
                setCountDownNumber(number => number - 1)
            }, 1000);
        } else {
            return
        }
    }, [countDownNumber])
    return (
        <>

            <Modal cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div style={{ padding: '30px 20px' }}>
                    <Form

                        name="form-modal-sendsms"
                        onFinish={onFinish}

                    >
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

                        >
                            <Row style={{ marginTop: 20 }}>
                                <Col span={17} style={{ margin: '0 auto' }}>
                                    <Button className='btn-login' size='large' style={{ margin: '0 auto', width: '100%', height: 45, backgroundColor: '#C92127' }}
                                        type="primary" htmlType="submit">
                                        Xác nhận
                                    </Button>
                                </Col>

                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModalSendSMS