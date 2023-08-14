import { Breadcrumb, Button, Col, Form, Input, Modal, Popconfirm, Row, Space, message } from "antd"
import { RedoOutlined, EditOutlined, QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import ModalCreateItemFlashSale from "../../../component/Modal/ModalCreateItemFlashSale"
import { useEffect, useState } from "react"
import { fetchInfoFlashsale, handleRemoveItemFlashSale, handleUpdateTimer } from "../../../service/api"
import TableControl from "../../../component/TableControl/TableControl"
import ModalUpdateItemFlashSale from "../../../component/Modal/ModalUpdateItemFlashSale"
import { useForm } from "antd/es/form/Form"

const columns = [
    {
        title: 'STT',
        dataIndex: 'key',

    },
    {
        title: 'Tên',
        dataIndex: 'mainText',

    },
    {
        title: 'Giá Sale',
        dataIndex: 'price',

    },
    {
        title: 'Giá Gốc',
        dataIndex: 'priceCurrent',

    },
    {
        title: 'Sale',
        dataIndex: 'sale',

    },
    {
        title: 'Sold',
        dataIndex: 'sold',


    },
    {
        title: 'Action',
        dataIndex: 'action'
    }
];






const ManageFlashSale = () => {
    const [form] = useForm()
    const [dataTable, setDataTable] = useState([])
    const [IDdataFlashsale, setIDDataFlashsale] = useState({})
    const [isModalCreateOpen, setIsModalCreatelOpen] = useState(false)
    const [isModalUpdateOpen, setIsModalUpdatelOpen] = useState(false)
    const [isModalTimerOpen, setIsModalTimerOpen] = useState(false)

    const [isFinish, setIsFinish] = useState(false)
    const [dataClick, setDataClick] = useState({})

    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });

    const showModalUpdateFlashsale = (item) => {
        console.log(IDdataFlashsale)
        setIsModalUpdatelOpen(true)
        setDataClick(item)
    }



    const fetchInfoFlashSale = async () => {
        let res = await fetchInfoFlashsale()
        console.log(res)
        if (res && res.data) {
            setIDDataFlashsale(res.data.modelFlashsale[0]._id)
            let dateFuture = new Date(res.data?.modelFlashsale[0]?.timer)
            let dateNow = new Date()
            console.log('dateFuture : ', dateFuture.getHours())


            if ((dateFuture.getDate() * 86400 + dateFuture.getHours() * 3600 + dateFuture.getMinutes() * 60) <
                (dateNow.getDate() * 86400 + dateNow.getHours() * 3600 + dateNow.getMinutes() * 60)) {
                setIsFinish(true)

            }


            let data = res.data?.modelFlashsale[0]?.itemFlashSale?.map((item, index) => {
                return {
                    key: index + 1,
                    _id: item?._id,
                    mainText: item.mainText,
                    price: formatter.format(item.priceFlashSale),
                    priceCurrent: formatter.format(item.price),
                    sale: `${Math.round(100 - (item.priceFlashSale / item.price) * 100)}%`,
                    category: item.category,
                    author: item.author,
                    sold: item?.soldFlashSale,

                    action: <Space key={index}>

                        <Button onClick={() => showModalUpdateFlashsale(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>
                        <Popconfirm
                            title="Xoá sản phẩm"
                            placement="bottomLeft"
                            description="Bạn có chắc chắn muốn xoá ?"
                            icon={
                                <QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }}
                                />
                            }
                            onConfirm={() => confirmDeleteProduct(item)}
                            okText="Yes"
                            okButtonProps={{ style: { backgroundColor: 'red', marginTop: 15 } }}
                            cancelText="No"
                        >
                            <Button key={2} type={"primary"} style={{ backgroundColor: 'red' }}><DeleteOutlined /></Button>
                        </Popconfirm>

                    </Space>

                }
            })
            console.log("data : ", data)
            setDataTable(data)
        }
    }


    const confirmDeleteProduct = async (item) => {
        let dataFlashsale = await fetchInfoFlashsale()

        if (dataFlashsale && dataFlashsale.data) {
            let res = await handleRemoveItemFlashSale(dataFlashsale?.data?.modelFlashsale[0]?._id, item?._id)
            if (res && res.data) {
                message.success("Xoá thành công")
                fetchInfoFlashSale()
            }
        }
    }

    const handleOk = () => {
        form.submit()
    };

    const handleCancel = () => {
        setIsModalTimerOpen(false);
    };

    const onFinish = async (values) => {
        var today = new Date();
        let number = +today.getHours() + (+values.timer)
        today.setHours(number);
        today.setSeconds(0)
        let res = await handleUpdateTimer(dataFlashsale?._id, today.toString())
        if (res && res.data) {
            message.success("Cập nhật thành công")
            setIsModalTimerOpen(false)
        }

    };


    useEffect(() => {
        fetchInfoFlashSale()
    }, [])



    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'40%'} title="Thêm thời gian" open={isModalTimerOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="from-update-timer"
                    style={{ marginTop: 30 }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Row gutter={20} style={{ marginTop: 10 }}>
                        <Col span={24} >
                            <Form.Item
                                label="Thời Gian"
                                labelCol={{ span: 24 }}
                                name="timer"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chưa nhập',
                                    },
                                ]}
                            >
                                <Input type='number' style={{ textAlign: 'center' }} addonAfter='h' />
                            </Form.Item>

                        </Col>
                    </Row>
                </Form>
            </Modal>
            <ModalUpdateItemFlashSale dataFlashsale={IDdataFlashsale} isModalOpen={isModalUpdateOpen} setIsModalOpen={setIsModalUpdatelOpen} dataClick={dataClick} fetchInfoFlashSale={fetchInfoFlashSale} />
            <ModalCreateItemFlashSale dataFlashsale={IDdataFlashsale} isModalOpen={isModalCreateOpen} setIsModalOpen={setIsModalCreatelOpen} fetchInfoFlashSale={fetchInfoFlashSale} />
            <Breadcrumb
                style={{
                    margin: '16px 0',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>Manage FlashSale</Breadcrumb.Item>

            </Breadcrumb>

            <Row className="header-content" style={{ marginTop: 70 }}>
                <Col xs={18} sm={18} md={18} lg={13} xl={13} xxl={13} style={{ fontSize: 30 }}>
                    Trạng thái :{isFinish ? " Đã kết thúc" : " Đang diễn ra"}
                    {isFinish ? <Row style={{ marginTop: 50 }}><Button onClick={() => setIsModalTimerOpen(true)} type="primary">Thêm thời gian</Button></Row> : <></>}
                </Col>

                <Col xs={0} sm={0} md={0} lg={6} xl={6} xxl={6} style={{ marginLeft: 'auto' }}>
                    <Button onClick={() => setIsModalCreatelOpen(true)}
                        className="hide-lg" size="large" type="primary"
                        style={{ marginRight: 13 }}> <EditOutlined /> Thêm mới sản phẩm</Button>
                    <Button size="large" > <RedoOutlined /> </Button>

                </Col>
            </Row>

            <Row className="table-content" style={{ marginTop: 70 }}>
                {/* setDataTable={setDataTable}  */}
                <Col span={24}>
                    <TableControl
                        data={dataTable} columns={columns} />
                </Col>
            </Row>
        </>
    )
}

export default ManageFlashSale