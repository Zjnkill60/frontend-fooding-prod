import { Button, Modal, Checkbox, Form, Input, Row, Col, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { handleUpdateRoleUser } from '../../service/api';





const ModalUpdateUser = (props) => {
    const { isModalOpen, setIsModalOpen, handleGetAllUserPaginate, dataClick } = props
    const idAccount = useSelector(state => state.account?.info?._id)
    const [form2] = useForm()

    const handleOk = () => {
        form2.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        const { role } = values
        if (dataClick?._id == idAccount) {
            message.error('Không thể tự cập nhật tài khoản của chính mình !')
            return
        }
        let res = await handleUpdateRoleUser(dataClick?._id, role)
        if (res && res.data) {
            message.success('Cập nhật user thành công !')
            setIsModalOpen(false);
            await handleGetAllUserPaginate(1, 6)


        } else {
            message.error(res.message)
        }
    };

    useEffect(() => {
        form2.setFieldsValue({
            role: dataClick?.role,
            email: dataClick?.email,
            name: dataClick?.name,
            phone: dataClick?.phoneNumber,
        })
    }, [dataClick])

    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'50%'} title="Update Role User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="from-update"
                    style={{ marginTop: 50 }}
                    onFinish={onFinish}
                    form={form2}
                >


                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Full Name"
                                labelCol={{ span: 24 }}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Phone Number"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your phone number!',
                                    },
                                ]}
                            >
                                <Input disabled addonAfter='SDT' type='number' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 50 }}>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}

                                name="role"


                            >
                                <Select
                                    style={{ textAlign: 'center' }}
                                    size='large'

                                    options={[
                                        {
                                            value: 'USER',
                                            label: 'USER',
                                        },
                                        {
                                            value: 'SHIPPER',
                                            label: 'SHIPPER',
                                        },
                                        {
                                            value: 'ADMIN',
                                            label: 'ADMIN',
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </>
    )
}

export default ModalUpdateUser