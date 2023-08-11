import { Button, Modal, Checkbox, Form, Input, Row, Col, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { handleUpdateListAddress } from '../../service/api';





const ModalUpdateListAddress = (props) => {
    const { isModalOpen, setIsModalOpen, fetchDataAccountUser } = props
    const idAccount = useSelector(state => state.account?.info?._id)
    const [form2] = useForm()

    const handleOk = () => {
        form2.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        const { name, email, address, phoneNumber } = values
        console.log(name, email, address, phoneNumber)
        let res = await handleUpdateListAddress(idAccount, name, email, address, phoneNumber)
        console.log(res)
        if (res && res.data) {
            message.success("Thêm địa chỉ mới thành công")
            setIsModalOpen(false)
            fetchDataAccountUser()

        } else {
            message.error(res.message)
        }
    };



    return (
        <>
            <Modal className='ant-drawer-content-wrapper' okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Row style={{ padding: 10 }}>
                    <Col span={24} style={{ textAlign: 'center', padding: '0px 0px 10px', fontSize: 17, color: '#c92127', fontWeight: 500 }}>
                        THÊM MỚI ĐỊA CHỈ GIAO HÀNG
                    </Col>
                    <Form
                        name="from-update"
                        style={{ margin: '10px auto 0' }}
                        onFinish={onFinish}
                        form={form2}
                    >


                        <Row >

                            <Col span={24}>
                                <Form.Item
                                    label="Họ Tên"
                                    labelCol={{ span: 24 }}
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng điền trường này',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SĐT"
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng điền trường này',
                                        },
                                    ]}
                                >
                                    <Input type='number' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng điền trường này',
                                        },
                                    ]}
                                >

                                    <Input type='email' />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng điền trường này',
                                        },
                                    ]}
                                >

                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Button htmlType="submit" size='large' style={{ margin: '0 auto', backgroundColor: '#c92127', color: '#fff', width: 150 }}>
                                Xác nhận
                            </Button>
                        </Row>

                    </Form>
                </Row>
            </Modal>
        </>
    )
}

export default ModalUpdateListAddress