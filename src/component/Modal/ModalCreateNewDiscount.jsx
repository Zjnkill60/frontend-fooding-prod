import { Modal, Form, Input, Row, Col, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { handleCreateNewDiscount, handleCreateNewItemFlashSale, handleFetchAllProd } from '../../service/api';


const ModalCreateNewDiscount = (props) => {
    const [form] = useForm()
    const { isModalOpen, setIsModalOpen, fetchAllDiscount } = props


    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        const { codeSeller, title, description, discount, priceApplicable, category } = values
        let res = await handleCreateNewDiscount(codeSeller, title, description, discount, priceApplicable, category)
        console.log(res)
        if (res && res.data) {
            message.success("Thêm sản phẩm vào flashsale thành công !")
            setIsModalOpen(false)
            fetchAllDiscount()
        }


    };



    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'60%'} title="Thêm mới mã giảm giá" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="from-create-order"
                    style={{ marginTop: 30 }}
                    onFinish={onFinish}
                    form={form}
                >

                    <Row gutter={20} style={{ marginTop: 10 }}>
                        <Col span={12}>
                            <Form.Item
                                label="Mã Giảm Giá"
                                labelCol={{ span: 24 }}
                                name={"codeSeller"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                        </Col>
                        <Col span={12} >
                            <Form.Item
                                label="Loại mã giảm giá"
                                labelCol={{ span: 24 }}
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Select

                                    style={{ textAlign: 'center', width: '100%' }}
                                    options={[{
                                        value: 'deals',
                                        label: 'deals'
                                    }, {
                                        value: 'discount',
                                        label: 'discount'
                                    }]}
                                />
                            </Form.Item>


                        </Col>



                    </Row>

                    <Row gutter={20} style={{ marginTop: 10 }}>
                        <Col span={12}>
                            <Form.Item
                                label="Số Tiền Giảm"
                                labelCol={{ span: 24 }}
                                name={"discount"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input type='number' />
                            </Form.Item>


                        </Col>
                        <Col span={12} >
                            <Form.Item
                                label="Gía Áp Dụng"
                                labelCol={{ span: 24 }}
                                name="priceApplicable"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input type='number' />
                            </Form.Item>


                        </Col>



                    </Row>

                    <Row gutter={20} style={{ marginTop: 10 }}>
                        <Col span={12}>
                            <Form.Item
                                label="Tiêu đề"
                                labelCol={{ span: 24 }}
                                name={"title"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                        </Col>
                        <Col span={12} >
                            <Form.Item
                                label="Mô tả"
                                labelCol={{ span: 24 }}
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                        </Col>



                    </Row>







                </Form>
            </Modal>

        </>
    )
}

export default ModalCreateNewDiscount