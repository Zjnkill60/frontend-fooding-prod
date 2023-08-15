import { Modal, Form, Input, Row, Col, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { handleCreateNewItemFlashSale, handleFetchAllProd } from '../../service/api';


const ModalCreateItemFlashSale = (props) => {
    const [form] = useForm()
    const { isModalOpen, setIsModalOpen, fetchInfoFlashSale, dataFlashsale } = props
    const [dataProductSelect, setDataProductSelect] = useState([])



    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });


    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {

        let res = await handleCreateNewItemFlashSale(dataFlashsale, values.select, values.price, values.quantity, values.soldFlashsale)
        console.log(res)
        if (res && res.data) {
            message.success("Thêm sản phẩm vào flashsale thành công !")
            setIsModalOpen(false)
            fetchInfoFlashSale()
        }


    };



    const getAllProductSelect = async () => {
        let res = await handleFetchAllProd()
        if (res && res?.data) {
            let arrayProduct = res?.data?.listProduct.map((item, index) => {
                return {
                    value: item?._id,

                    label: `${item?.mainText} - ${formatter.format(item?.price - (item?.price * (item?.percentSale / 100)))}đ`
                }
            })
            setDataProductSelect(arrayProduct)
        }


    }

    useEffect(() => {
        getAllProductSelect()

    }, [])


    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'60%'} title="Thêm mới sản phẩm vào Flashsale" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="from-create-order"
                    style={{ marginTop: 30 }}
                    onFinish={onFinish}
                    form={form}
                >

                    <Row gutter={20} style={{ marginTop: 10 }}>
                        <Col span={15}>
                            <Form.Item
                                label="Sản phẩm"
                                labelCol={{ span: 24 }}
                                name={"select"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Select

                                    style={{ textAlign: 'center', width: '100%' }}
                                    options={dataProductSelect}
                                />
                            </Form.Item>


                        </Col>
                        <Col span={3} >
                            <Form.Item
                                label="Giá sale "
                                labelCol={{ span: 24 }}
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input type='number' style={{ textAlign: 'center' }} />
                            </Form.Item>


                        </Col>

                        <Col span={3} >
                            <Form.Item
                                label="Số lượng "
                                labelCol={{ span: 24 }}
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input type='number' style={{ textAlign: 'center' }} />
                            </Form.Item>


                        </Col>
                        <Col span={3} >
                            <Form.Item
                                label="Đã bán"
                                labelCol={{ span: 24 }}
                                name="soldFlashsale"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input type='number' style={{ textAlign: 'center' }} />
                            </Form.Item>


                        </Col>

                    </Row>







                </Form>
            </Modal>

        </>
    )
}

export default ModalCreateItemFlashSale