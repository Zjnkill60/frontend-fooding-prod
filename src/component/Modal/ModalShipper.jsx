import { Form, Input, Modal, Select, Tabs, message } from "antd";
import { handleRejectOrder, handleSuccessOrder } from "../../service/api";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";



const ModalShipper = (props) => {
    const [formSuccess] = useForm()
    const [formReject] = useForm()
    const [keyTabs, setKeyTabs] = useState("success")
    const [isPayment, setIsPayment] = useState("YES")

    const { isModalOpen, setIsModalOpen, dataClick, fetchLengthOrerStatus, findOrderForShipper, user } = props


    const onFinishSuccess = async (values) => {
        const { isPayment, cashOut } = values
        let payment = isPayment?.value ? isPayment.value : isPayment
        console.log(isPayment, cashOut)

        let res = await handleSuccessOrder(dataClick?._id, "Hoàn tất", payment, cashOut)
        if (res && res.data) {
            setIsModalOpen(false)
            setIsPayment("YES")
            findOrderForShipper(user?.info?._id, "Xác nhận thành công")
            fetchLengthOrerStatus()
            message.success(`Cập nhật thành công`)


        } else {
            message.error(res.message)
        }
    };

    const onFinishReject = async (values) => {
        const { reasonReject } = values

        let res = await handleRejectOrder(dataClick?._id, "Từ chối", reasonReject)
        if (res && res.data) {
            setIsModalOpen(false)
            message.success(`Cập nhật thành công`)
            findOrderForShipper(user?.info?._id, "Xác nhận thành công")
            fetchLengthOrerStatus()

        } else {
            message.error(res.message)
        }
    };

    const handleOk = () => {
        if (keyTabs == "success") {
            formSuccess.submit()
        } else {
            formReject.submit()
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const onChange = async (key) => {
        setKeyTabs(key)

    };

    const handleChangeSelect = (value) => {
        setIsPayment(value)
    }

    useEffect(() => {
        formSuccess.setFieldsValue({
            isPayment: {
                label: "ĐÃ THANH TOÁN",
                value: "YES"
            }
        })
    }, [dataClick])

    const items = [
        {
            key: 'success',
            label: `Giao hàng thành công`,
            children: <div style={{ padding: 10 }}>
                <Form
                    form={formSuccess}
                    style={{ marginTop: 20 }}
                    name="form-modal-final-shippers"
                    onFinish={onFinishSuccess}

                >

                    <Form.Item
                        label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Trạng thái thanh toán</span>}
                        name="isPayment"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền !',
                            },
                        ]}
                    >
                        <Select
                            onChange={(value) => handleChangeSelect(value)}
                            options={[{
                                label: 'ĐÃ THANH TOÁN',
                                value: 'YES'
                            }, {
                                label: 'CHƯA THANH TOÁN',
                                value: 'NO'
                            }]} />


                    </Form.Item>

                    {isPayment == "YES" ? <Form.Item
                        label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Số tiền thực thu</span>}
                        name="cashOut"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền !',
                            },
                        ]}
                    >
                        <Input addonAfter="K" />
                    </Form.Item> : <></>}


                </Form>
            </div>

        },
        {
            key: 'failure',
            label: `Giao hàng thất bại`,
            children: <Form
                form={formReject}
                style={{ marginTop: 20 }}
                name="form-modal-reject-order"
                onFinish={onFinishReject}

            >

                <Form.Item
                    label={<span style={{ fontSize: 15, color: '#a1a1a1' }}>Lý do từ chối</span>}
                    name="reasonReject"
                    labelCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền !',
                        },
                    ]}
                >
                    <Input size='large' placeholder='Quá xa , v.v...' />


                </Form.Item>


            </Form>

        },

    ];
    return (
        <>

            <Modal title={<span style={{ fontSize: 17, color: 'red' }}>Xác nhận đơn hàng</span>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            </Modal>
        </>
    );
}

export default ModalShipper