import { Breadcrumb, Button, Col, Input, Row, Select, Space } from "antd"
import { SearchOutlined, RedoOutlined, EditOutlined, DeleteOutlined, FolderViewOutlined } from '@ant-design/icons';
import TableControl from "../../../component/TableControl/TableControl";
import { useEffect, useState } from "react";
import { handleFetchOrderLength, handleFetchOrderPaginate, handleFilterOrderByPhoneNumber } from "../../../service/api";
import moment from 'moment'
import ModalCreateOrder from "../../../component/Modal/ModalCreateOrder";
import DrawerViewOrder from "../../../component/Drawer/DrawerViewDataOrder";
import ModalUpdateOrder from "../../../component/Modal/ModalUpdateOrder";
import ModalRejectOrder from "../../../component/Modal/ModalRejectOrder";

const columns = [
    {
        title: 'Mã ',
        dataIndex: 'orderCode',

    },
    {
        title: 'PTTT',
        dataIndex: 'payments',

    },
    {
        title: 'Tên',
        dataIndex: 'name',

    },
    {
        title: 'SĐT',
        dataIndex: 'phoneNumber',

    },
    {
        title: 'Địa Chỉ',
        dataIndex: 'address',

    },
    {
        title: 'Tổng Tiền',
        dataIndex: 'totalPrice',

    },
    {
        title: 'Trạng Thái',
        dataIndex: 'status',

    },
    {
        title: 'Thời Gian Tạo',
        dataIndex: 'createdAt',
        responsive: ['lg'],
        sorter: true

    },
    {
        title: 'Action',
        dataIndex: 'action',

    },
];



const ManageOrder = () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(6)

    const [dataTable, setDataTable] = useState([])
    const [valueInputFind, setValueInputFind] = useState("")
    const [valueSelect, setValueSelect] = useState("Tất cả")

    const [dataClick, setDataClick] = useState({})
    const [isModalCreateOpen, setIsModaCreatelOpen] = useState(false);
    const [isModalUpdateOpen, setIsModaUpdatelOpen] = useState(false);
    const [isModalRejectOpen, setIsModaRejectlOpen] = useState(false);
    const [openViewOrder, setopenViewOrder] = useState(false);
    const [lengthAllOrders, setLengthAllOrders] = useState({})
    const [totalData, setTotalData] = useState(0)


    const handleChangeSelect = async (value) => {
        setValueSelect(value)
        setCurrent(1)
        getAllOrders(1, pageSize, null, value)


    };


    const showDrawer = (text) => {
        setDataClick(text)
        setopenViewOrder(true);
    };



    const showModalUpdateOrder = (text) => {
        setDataClick(text)
        setIsModaUpdatelOpen(true);
    };

    const showModalRejectOrder = (text) => {
        setDataClick(text)
        setIsModaRejectlOpen(true);
    };


    const handleFindByPhoneNumber = async (current, pageSize, value, status, sort) => {
        setValueInputFind(value)
        let res = await handleFilterOrderByPhoneNumber(current, pageSize, value, status, sort)
        if (res && res.data) {
            setTotalData(res.data?.totalOrderFind)
            let data = res.data?.listOrder?.map((item, index) => {
                return {
                    key: index + 1,
                    name: item?.name,
                    phoneNumber: item?.phoneNumber,
                    orderCode: item?.orderCode,
                    payments: item?.payments,
                    address: item?.address,
                    totalPrice: formatter.format(item?.totalPrice),
                    status: item?.status,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    action: <Space key={index}>
                        <Button onClick={() => showDrawer(item)} key={3} type="primary"><FolderViewOutlined /></Button>

                        <Button onClick={() => showModalUpdateOrder(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>

                        <Button onClick={() => showModalRejectOrder(item)} type={"primary"} style={{ backgroundColor: 'red' }}><DeleteOutlined /></Button>


                    </Space>

                }
            })

            setDataTable(data)
        }

    }

    const handleReset = async () => {
        setValueInputFind("")
        await getAllOrders(1, 6)
        setValueSelect("Tất cả")

    }

    const getAllOrders = async (current, pageSize, sort, filter) => {
        let res = await handleFetchOrderPaginate(current, pageSize, sort, filter)
        if (res && res.data) {
            let data = res.data?.listOrder?.map((item, index) => {
                index += ((current - 1) * pageSize)
                return {
                    key: index + 1,
                    name: item?.name,
                    phoneNumber: item?.phoneNumber,
                    address: item?.address,
                    totalPrice: formatter.format(item?.totalPrice),
                    orderCode: item?.orderCode,
                    payments: item?.payments,
                    status: item?.status,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    action: <Space key={index}>
                        <Button onClick={() => showDrawer(item)} key={3} type="primary"><FolderViewOutlined /></Button>

                        <Button onClick={() => showModalUpdateOrder(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>

                        <Button onClick={() => showModalRejectOrder(item)} type={"primary"} style={{ backgroundColor: 'red' }}><DeleteOutlined /></Button>


                    </Space>

                }
            })
            switch (filter) {
                case "Tất cả":
                    setTotalData(res.data?.totalOrder)
                    break;
                case "Chờ xác nhận":
                    setTotalData(lengthAllOrders.lengthPending)
                    break;
                case "Xác nhận thành công":
                    setTotalData(lengthAllOrders.lengthRunning)
                    break;
                case "Hoàn tất":
                    setTotalData(lengthAllOrders.lengthDone)
                    break;
                case "Từ chối":
                    setTotalData(lengthAllOrders.lengthReject)
                    break;

                default:
                    setTotalData(res.data?.totalOrder)
                    break;
            }
            setDataTable(data)
        }

    }

    const getAllLengthOrders = async () => {
        let res = await handleFetchOrderLength()
        if (res && res.data) {
            setLengthAllOrders(res.data?.lengthOrder)
        }
    }

    const formatter = new Intl.NumberFormat({
        style: 'currency',

    });

    useEffect(() => {
        getAllLengthOrders()
        getAllOrders(1, 6)

    }, [])




    return (
        <>
            <DrawerViewOrder dataClick={dataClick} open={openViewOrder} setOpen={setopenViewOrder} />
            <ModalCreateOrder getAllOrders={getAllOrders} isModalOpen={isModalCreateOpen} setIsModalOpen={setIsModaCreatelOpen} />
            <ModalUpdateOrder setCurrent={setCurrent} dataClick={dataClick} getAllOrders={getAllOrders} isModalOpen={isModalUpdateOpen} setIsModalOpen={setIsModaUpdatelOpen} />
            <ModalRejectOrder setCurrent={setCurrent} getAllOrders={getAllOrders} isModalOpen={isModalRejectOpen} setIsModalOpen={setIsModaRejectlOpen} dataClick={dataClick} />

            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>Manage Orders</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="header-content" style={{ marginTop: 70 }}>
                <Col xs={18} sm={18} md={18} lg={13} xl={13} xxl={13}>
                    <Input value={valueInputFind} onChange={(e) => handleFindByPhoneNumber(1, 6, e.target.value, valueSelect)} size="large" addonAfter={<SearchOutlined />} addonBefore="SDT" placeholder="Tìm đơn hàng  ..." />
                </Col>

                <Col style={{ marginLeft: 'auto' }}>
                    <Button onClick={() => setIsModaCreatelOpen(true)} className="hide-lg" size="large" type="primary" style={{ marginRight: 13 }}> <EditOutlined /> Thêm mới đơn hàng</Button>
                    <Button onClick={handleReset} size="large" > <RedoOutlined /> </Button>

                </Col>
            </Row>

            <Select

                value={valueSelect}
                style={{
                    width: '250px',
                    textAlign: 'center',
                    marginTop: 30,


                }}
                onChange={handleChangeSelect}
                options={[
                    {
                        value: 'Tất cả',
                        label: `Tất cả (${lengthAllOrders?.lengthAll})`,
                    },
                    {
                        value: 'Chờ xác nhận',
                        label: `Chờ xác nhận  (${lengthAllOrders?.lengthPending})`,
                    },
                    {
                        value: `Xác nhận thành công`,
                        label: `Xác nhận thành công  (${lengthAllOrders?.lengthRunning})`,
                    },
                    {
                        value: `Hoàn tất`,
                        label: `Hoàn tất  (${lengthAllOrders?.lengthDone})`,
                    },
                    {
                        value: `Từ chối`,
                        label: `Từ chối  (${lengthAllOrders?.lengthReject})`,
                    },
                ]}
            />

            <Row className="table-content" style={{ marginTop: 20 }}>
                <Col span={24}>
                    <TableControl handleFindByPhoneNumber={handleFindByPhoneNumber}
                        valueInputFind={valueInputFind} tool="manage-order" totalData={totalData} current={current} setCurrent={setCurrent}
                        pageSize={pageSize} setPageSize={setPageSize} valueSelect={valueSelect}
                        getAllOrders={getAllOrders} columns={columns} data={dataTable} /></Col>
            </Row>
        </>
    )
}

export default ManageOrder
