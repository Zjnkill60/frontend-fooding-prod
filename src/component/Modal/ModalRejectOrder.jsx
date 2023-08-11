import { Form, Input, Modal, message } from "antd";
import { handleRejectOrder } from "../../service/api";
import { useForm } from "antd/es/form/Form";



const ModalRejectOrder = (props) => {
    const [form] = useForm()

    const { isModalOpen, setIsModalOpen, dataClick, getAllOrders, setCurrent } = props


    const onFinish = async (values) => {
        const { reasonReject } = values

        let res = await handleRejectOrder(dataClick?._id, "Từ chối", reasonReject)
        if (res && res.data) {
            setIsModalOpen(false)
            message.success(`Cập nhật thành công`)
            getAllOrders(1, 6)
            setCurrent(1)

        } else {
            message.error(res.message)
        }



    };

    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>

            <Modal title={<span style={{ fontSize: 17, color: 'red' }}>Từ chối đơn hàng</span>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    style={{ marginTop: 20 }}
                    name="form-modal-reject-order"
                    onFinish={onFinish}

                >

                    <Form.Item
                        label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Lý do từ chối</span>}
                        name="reasonReject"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền  !',
                            },
                        ]}
                    >
                        <Input size='large' placeholder='Quá xa , v.v...' />


                    </Form.Item>


                </Form>
            </Modal>
        </>
    );
}

export default ModalRejectOrder