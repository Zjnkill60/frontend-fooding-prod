import { Breadcrumb, Button, Col, Form, Input, Modal, Popconfirm, Row, Space, message } from "antd"
import { RedoOutlined, EditOutlined, QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import ModalCreateItemFlashSale from "../../../component/Modal/ModalCreateItemFlashSale"
import { useEffect, useState } from "react"
import { fetchAllDiscount, fetchInfoFlashsale, handleRemoveItemFlashSale, handleUpdateTimer } from "../../../service/api"
import TableControl from "../../../component/TableControl/TableControl"
import ModalUpdateItemFlashSale from "../../../component/Modal/ModalUpdateItemFlashSale"
import { useForm } from "antd/es/form/Form"
import ModalCreateNewDiscount from "../../../component/Modal/ModalCreateNewDiscount"

const columns = [

    {
        title: 'Mã',
        dataIndex: 'codeSeller',

    },
    {
        title: 'Tiêu Đề',
        dataIndex: 'title',

    },
    {
        title: 'Miêu Tả',
        dataIndex: 'description',

    },
    {
        title: 'Loại Mã',
        dataIndex: 'category',

    },
    {
        title: 'Giảm Giá',
        dataIndex: 'discount',


    },
    {
        title: 'Gía Áp Dụng',
        dataIndex: 'priceApplicable'
    }
];






const ManageCodeSeller = () => {
    const [dataTable, setDataTable] = useState([])
    const [isModalCreateOpen, setIsModalCreatelOpen] = useState(false)





    const getAllDiscount = async () => {
        let res = await fetchAllDiscount()
        console.log(res)
        if (res && res.data) {

            console.log("data : ", res)
            setDataTable(res.data?.listDiscount)
        }
    }


    useEffect(() => {
        getAllDiscount()
    }, [])



    return (
        <>

            <ModalCreateNewDiscount isModalOpen={isModalCreateOpen} setIsModalOpen={setIsModalCreatelOpen} fetchAllDiscount={fetchAllDiscount} />
            <Breadcrumb
                style={{
                    margin: '16px 0',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>Manage Discount</Breadcrumb.Item>

            </Breadcrumb>

            <Row className="header-content" style={{ marginTop: 70 }}>


                <Col xs={0} sm={0} md={0} lg={6} xl={6} xxl={6} style={{ marginLeft: 'auto' }}>
                    <Button onClick={() => setIsModalCreatelOpen(true)}
                        className="hide-lg" size="large" type="primary"
                        style={{ marginRight: 13 }}> <EditOutlined /> Thêm mới mã </Button>
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

export default ManageCodeSeller