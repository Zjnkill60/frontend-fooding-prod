import { Button, Col, Divider, Row, Table } from "antd"
import { useEffect, useState } from "react";
import ModalUpdateListAddress from "../../component/Modal/ModalUpdateListAddress";
import { useSelector } from "react-redux";
import { handleFindOneShipper } from "../../service/api";

const columns = [

    // {
    //     title: 'Tên',
    //     dataIndex: 'name',
    //     key: 'age',
    // },
    {
        title: 'SĐT',
        dataIndex: 'phoneNumber',
        key: 'address',
    },
    // {
    //     title: 'Email',
    //     dataIndex: 'email',
    //     key: 'item',
    // },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'status',
    },
];

const ListAddress = (props) => {
    const [dataTable, setDataTable] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dataAccount = useSelector(state => state.account?.info)


    const fetchDataAccountUser = async () => {
        let res = await handleFindOneShipper(dataAccount?._id)
        console.log(res)
        if (res && res.data) {
            setDataTable(res?.data?.user?.address)
        }
    }

    useEffect(() => {
        fetchDataAccountUser()
    }, [])
    return (
        <>
            <ModalUpdateListAddress fetchDataAccountUser={fetchDataAccountUser} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <Row>
                <Col span={24} style={{ maxWidth: '100vw', overflow: 'scroll' }}>
                    <Row style={{ backgroundColor: '#fff', borderRadius: 3, border: '1px solid #88888', padding: '15px 20px ' }}>
                        <Col span={24} style={{ fontSize: 17, fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span> SỔ ĐỊA CHỈ</span>
                            <Button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#c92127', color: '#fff' }} size="large">THÊM ĐỊA CHỈ MỚI</Button>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Table dataSource={dataTable} columns={columns} />
                        </Col>

                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ListAddress