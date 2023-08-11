import { Button, Checkbox, Col, Divider, Form, Input, Row, message } from "antd"
import './account.scss'
import { useEffect, useState } from "react";
import { handleFindOneShipper, handleUpdateInfoUser } from "../../service/api";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};


const Account = () => {
    const [form] = useForm()
    const [isChangePassword, setIsChangePassword] = useState(false)
    const [data, setData] = useState(null)
    const dataAccount = useSelector(state => state.account?.info)

    const onChange = (e) => {
        setIsChangePassword(e.target.checked)
    };


    const fetchDataAccountUser = async () => {
        let res = await handleFindOneShipper(dataAccount?._id)
        console.log(res)
        if (res && res.data) {
            setData(res?.data?.user)
        }
    }

    const onFinish = async (values) => {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = values
        if (newPassword == confirmNewPassword) {
            let res = await handleUpdateInfoUser(dataAccount?._id, name, email, currentPassword, newPassword, confirmNewPassword)
            console.log(res)
            if (res && res.data) {
                message.success("Cập nhật thành công")
                fetchDataAccountUser()
                setIsChangePassword(false)
            } else {
                message.error(res.message)
            }
        } else {
            message.error("Mật khẩu mới chưa khớp ")
        }
        console.log('Success:', values);
    };

    useEffect(() => {
        fetchDataAccountUser()
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            name: data?.name,
            phoneNumber: data?.phoneNumber,
            email: data?.email,
        })
    }, [data])
    return (
        <Row>
            <Col span={24}>
                <Row style={{ padding: 10, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #88888', padding: '25px 20px 15px' }}>
                    <Col span={24} style={{ fontSize: 17, fontWeight: 500 }}>
                        THÔNG TIN TÀI KHOẢN
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 24,
                            }}
                            form={form}


                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}

                        >
                            <Form.Item
                                label="Họ Tên"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng điền trường này !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Số Điện Thoại"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng điền trường này',
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng điền trường này',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Checkbox onChange={onChange}>Đổi mật khẩu</Checkbox>

                            {isChangePassword ?

                                <div style={{ marginTop: 20 }}>
                                    <Form.Item
                                        label="Mật khẩu hiện tại"
                                        name="currentPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng điền trường này',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Mật khẩu mới"
                                        name="newPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng điền trường này',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Nhập lại mật khẩu mới"
                                        name="confirmNewPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng điền trường này',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                :
                                <></>}

                            <Row style={{ marginTop: 20 }}>
                                <Button htmlType="submits" type="primary" style={{ margin: '0 auto', backgroundColor: '#c92127', color: '#fff', width: 200, height: 40, fontSize: 16, fontWeight: 600 }}>
                                    Lưu thay đổi
                                </Button>
                            </Row>


                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Account