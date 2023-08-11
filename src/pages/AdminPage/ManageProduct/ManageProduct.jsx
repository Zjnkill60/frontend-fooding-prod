import { Breadcrumb, Button, Col, Input, Popconfirm, Row, Space, message } from "antd"
import { SearchOutlined, RedoOutlined, EditOutlined, DeleteOutlined, FolderViewOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import TableControl from "../../../component/TableControl/TableControl";
import { handleDeleteProduct, handleDeleteUser, handleFetchProductPaginate, handleFilterNameProduct } from "../../../service/api";
import { useEffect, useState } from "react";
import DrawerViewDataAdmin from "../../../component/Drawer/DrawerViewDataAdmin";
import moment from 'moment'
import ModalUpdateUser from "../../../component/Modal/ModalUpdateUser";
import '../admin.scss'
import DrawerViewDataProduct from "../../../component/Drawer/DrawerViewDataProduct";
import ModalCreateProduct from "../../../component/Modal/ModalCreateProduct";
import ModalUpdateProduct from "../../../component/Modal/ModalUpdateProduct";


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
        title: 'Giá',
        dataIndex: 'price',

    },
    {
        title: 'Sold',
        dataIndex: 'sold',
        sorter: true

    },
    {
        title: 'Comments',
        dataIndex: 'comment',

    },
    {
        title: 'Thể loại',
        dataIndex: 'category',
    },

    {
        title: 'Action',
        dataIndex: 'action'
    }
];
const baseURL = import.meta.env.VITE_URL_BACKEND

const ManageProduct = () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(6)

    const [dataTableProduct, setDataTableProduct] = useState([])
    const [valueInputFind, setValueInputFind] = useState("")
    const [dataClick, setDataClick] = useState({})
    const [openDrawerView, setOpenDrawerView] = useState(false)
    const [openModalCreate, setOpenModalCreate] = useState(false)
    const [openModalUpdate, setOpenModalUpdate] = useState(false)
    const [totalData, setTotalData] = useState(0)

    const handleFindByNameProduct = async (e) => {
        setValueInputFind(e.target.value)
        let res = await handleFilterNameProduct(1, 7, e.target.value)
        if (res && res.data) {
            setTotalData(res.data?.totalItem)
            let data = res.data?.listProduct?.map((item, index) => {
                index += ((current - 1) * pageSize)
                return {
                    key: index + 1,
                    mainText: item.mainText,
                    price: item.price,
                    sale: item.percentSale,
                    category: item.category,
                    author: item.author,
                    thumbnail: item.thumbnail,
                    slider: item.slider,
                    sold: item.sold,
                    comment: item.comments?.length,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    action: <Space key={index}>
                        <Button onClick={() => showDrawer(item)} key={3} type="primary"><FolderViewOutlined /></Button>

                        <Button onClick={() => showModalUpdateUser(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>
                        <Popconfirm
                            title="Delete a user"
                            description="Bạn có chắc chắn muốn xoá user này ?"
                            placement="bottomLeft"
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
            setDataTableProduct(data)
        }

    }

    const handleGetAllProductPaginate = async (current, pageSize, sort) => {
        let res = await handleFetchProductPaginate(current, pageSize, sort)
        if (res && res.data) {
            setTotalData(res.data?.totalItem)
            let data = res.data?.listProduct?.map((item, index) => {
                index += ((current - 1) * pageSize)
                return {
                    key: index + 1,
                    mainText: item.mainText,
                    price: item.price,
                    sale: item.percentSale,
                    category: item.category,
                    author: item.author,
                    thumbnail: item.thumbnail,
                    slider: item.slider,
                    sold: item.sold,
                    comment: item.comments?.length,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    action: <Space key={index}>
                        <Button onClick={() => showDrawer(item)} key={3} type="primary"><FolderViewOutlined /></Button>

                        <Button onClick={() => showModalUpdateUser(item)} key={1} type={"primary"} style={{ backgroundColor: 'orange', width: '100%' }}><EditOutlined /></Button>
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
            setDataTableProduct(data)
        }
    }

    const confirmDeleteProduct = async (item) => {
        let res = await handleDeleteProduct(item?._id)
        if (res && res.data) {
            message.success('Xoá người dùng thành công')
            handleGetAllProductPaginate(1, 6)
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
        await handleGetAllProductPaginate(1, 6)
    }

    useEffect(() => {
        handleGetAllProductPaginate(1, 6)
    }, [])
    return <>
        <DrawerViewDataProduct open={openDrawerView} setOpen={setOpenDrawerView} dataClick={dataClick} />
        <ModalCreateProduct handleGetAllProductPaginate={handleGetAllProductPaginate} isModalOpen={openModalCreate} setIsModalOpen={setOpenModalCreate} />
        <ModalUpdateProduct dataClick={dataClick} handleGetAllProductPaginate={handleGetAllProductPaginate} isModalOpen={openModalUpdate} setIsModalOpen={setOpenModalUpdate} />
        <Breadcrumb
            style={{
                margin: '16px 0',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Products</Breadcrumb.Item>

        </Breadcrumb>

        <Row className="header-content" style={{ marginTop: 70 }}>
            <Col xs={18} sm={18} md={18} lg={15} xl={15} xxl={15}>
                <Input value={valueInputFind} onChange={(e) => handleFindByNameProduct(e)} size="large" addonAfter={<SearchOutlined />} addonBefore="Tên Sản Phẩm" placeholder="Tìm theo tên  ..." />
            </Col>

            <Col style={{ marginLeft: 'auto' }}>
                <Button onClick={() => setOpenModalCreate(true)} className="hide-lg" size="large" type="primary" style={{ marginRight: 15 }}> <EditOutlined /> Thêm mới sản phẩm</Button>
                <Button onClick={handleReset} size="large" > <RedoOutlined /> </Button>

            </Col>
        </Row>

        <Row className="table-content" style={{ marginTop: 70 }}>
            {/* setDataTable={setDataTable}  */}
            <Col span={24}>
                <TableControl totalData={totalData} setDataTableProduct={setDataTableProduct}
                    current={current} setCurrent={setCurrent}
                    pageSize={pageSize} setPageSize={setPageSize}
                    handleGetAllProductPaginate={handleGetAllProductPaginate}
                    data={dataTableProduct} columns={columns} tool='manage-product' />
            </Col>
        </Row>
    </>
}

export default ManageProduct