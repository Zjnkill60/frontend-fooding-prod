import { Avatar, Breadcrumb, Button, Col, Input, Popconfirm, Row, Space, message } from "antd"
import { SearchOutlined, UserOutlined, RedoOutlined, EditOutlined, DeleteOutlined, FolderViewOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import TableControl from "../../../component/TableControl/TableControl";
import { handleDeleteUser, handleFetchUserPaginate, handleFilterPhoneNumber } from "../../../service/api";
import { useEffect, useState } from "react";
import DrawerViewDataAdmin from "../../../component/Drawer/DrawerViewDataAdmin";
import moment from 'moment'
import ModalUpdateUser from "../../../component/Modal/ModalUpdateUser";


const columns = [
    {
        title: 'Tên',
        dataIndex: 'name',

    },
    {
        title: 'Avatar',
        dataIndex: 'avatar',

    },
    {
        title: 'SĐT',
        dataIndex: 'phoneNumber',

    },
    {
        title: 'Vai Trò',
        dataIndex: 'role',


    },
    {
        title: 'Số Lần Mua Hàng',
        dataIndex: 'orderHistory',
        responsive: ['lg'],
        sorter: true
    },
    {
        title: 'Thời Gian Taọ',
        dataIndex: 'createdAt',
        sorter: true,
        responsive: ['lg']

    },
    {
        title: 'Action',
        dataIndex: 'action'
    }
];
const baseURL = import.meta.env.VITE_URL_BACKEND

const ManageUser = () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(6)

    const [dataTableUser, setDataTableUser] = useState([])
    const [valueInputFind, setValueInputFind] = useState("")
    const [dataClick, setDataClick] = useState({})
    const [openDrawerView, setOpenDrawerView] = useState(false)
    const [openModalUpdate, setOpenModalUpdate] = useState(false)
    const [totalData, setTotalData] = useState(0)

    const handleFindBySDT = async (e) => {
        setValueInputFind(e.target.value)
        let res = await handleFilterPhoneNumber(1, 7, e.target.value)
        if (res && res.data) {
            let data = res.data?.listUser?.map((item, index) => {
                return {
                    name: item.name,
                    avatar: <Avatar src={`${baseURL}/images/${item.avatar}`} />,
                    role: item.role,
                    phoneNumber: item.phoneNumber,
                    orderHistory: item.orderHistory?.length,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    action: <Space key={1}>
                        <Button onClick={() => showDrawer(item)} key={3} type="primary"><FolderViewOutlined /></Button>

                        <Button onClick={() => showModalUpdateUser(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>
                        <Popconfirm
                            title="Delete a user"
                            description="Bạn có chắc chắn muốn xoá user này ?"
                            icon={
                                <QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }}
                                />
                            }
                            onConfirm={() => confirm(text)}
                            okText="Yes"
                            okButtonProps={{ style: { backgroundColor: 'red', marginTop: 15 } }}
                            cancelText="No"
                        >
                            <Button key={2} type={"primary"} style={{ backgroundColor: 'red' }}><DeleteOutlined /></Button>
                        </Popconfirm>

                    </Space>

                }
            })
            setDataTableUser(data)
        }

    }

    const handleGetAllUserPaginate = async (current, pageSize, sort) => {
        let res = await handleFetchUserPaginate(current, pageSize, sort)
        if (res && res.data) {
            setTotalData(res.data?.totalUser)
            let data = res.data?.listUser?.map((item, index) => {
                return {
                    name: item.name,
                    avatar: <Avatar key={index} src={`${baseURL}/images/${item.avatar}`} />,
                    role: item.role,
                    phoneNumber: item.phoneNumber,
                    orderHistory: item.orderHistory?.length,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    action: <Space key={index}>
                        <Button onClick={() => showDrawer(item)} key={3} type="primary"><FolderViewOutlined /></Button>

                        <Button onClick={() => showModalUpdateUser(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>
                        <Popconfirm
                            title="Delete a user"
                            description="Bạn có chắc chắn muốn xoá user này ?"
                            icon={
                                <QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }}
                                />
                            }
                            onConfirm={() => confirmDeleteUser(item)}
                            okText="Yes"
                            okButtonProps={{ style: { backgroundColor: 'red', marginTop: 15 } }}
                            cancelText="No"
                        >
                            <Button key={2} type={"primary"} style={{ backgroundColor: 'red' }}><DeleteOutlined /></Button>
                        </Popconfirm>

                    </Space>

                }
            })
            setDataTableUser(data)
        }
    }

    const confirmDeleteUser = async (item) => {
        let res = await handleDeleteUser(item?._id)
        if (res && res.data) {
            message.success('Xoá người dùng thành công')
            handleGetAllUserPaginate(1, 6)
        } else {
            message.error(res.message)
        }
    }

    const showDrawer = (item) => {
        setDataClick(item)
        setOpenDrawerView(true)
    }

    const showModalUpdateUser = (item) => {
        setDataClick(item)
        setOpenModalUpdate(true)
    }


    const handleReset = async () => {
        setValueInputFind("")
        await handleGetAllUserPaginate()
    }

    useEffect(() => {
        handleGetAllUserPaginate(1, 6)
    }, [])
    return <>
        <ModalUpdateUser handleGetAllUserPaginate={handleGetAllUserPaginate} dataClick={dataClick} isModalOpen={openModalUpdate} setIsModalOpen={setOpenModalUpdate} />
        <DrawerViewDataAdmin open={openDrawerView} setOpen={setOpenDrawerView} dataClick={dataClick} />
        <Breadcrumb
            style={{
                margin: '16px 0',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Users</Breadcrumb.Item>

        </Breadcrumb>

        <Row className="header-content" style={{ marginTop: 70 }}>
            <Col xs={18} sm={18} md={18} lg={15} xl={15} xxl={15}>
                <Input value={valueInputFind} type="number" onChange={(e) => handleFindBySDT(e)} size="large" addonAfter={<SearchOutlined />} addonBefore="SDT" placeholder="Tìm theo SDT" />
            </Col>

            <Col style={{ marginLeft: 'auto' }}>
                <Button onClick={handleReset} size="large" > <RedoOutlined /> </Button>

            </Col>
        </Row>

        <Row className="table-content" style={{ marginTop: 70 }}>
            {/* setDataTable={setDataTable}  */}
            <Col span={24}> <TableControl totalData={totalData}
                setDataTableUser={setDataTableUser} handleGetAllUserPaginate={handleGetAllUserPaginate}
                current={current} setCurrent={setCurrent}
                pageSize={pageSize} setPageSize={setPageSize}
                data={dataTableUser} columns={columns} tool='manage-user' /></Col>
        </Row>
    </>
}

export default ManageUser