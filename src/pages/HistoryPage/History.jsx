import { Col, Divider, Row, Table } from "antd"
import { useSelector } from "react-redux"
import { handleFindOneShipper } from "../../service/api"
import { useEffect, useState } from "react"
import moment from 'moment'

const formatter = new Intl.NumberFormat({
    style: 'currency',

});

const columns = [

    {
        title: 'Mã Order',
        dataIndex: 'orderCode',
        key: 'age',
    },
    {
        title: 'Số tiền',
        dataIndex: 'totalPrice',
        key: 'address',
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'item',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
];

const History = () => {
    const dataAccount = useSelector(state => state.account)
    const [data, setData] = useState(null)
    const [total, setTotal] = useState(null)

    const fetchDataAccount = async () => {
        let res = await handleFindOneShipper(dataAccount?.info?._id)
        let sum = 0
        if (res && res.data) {
            let newArr = res.data?.user?.orderHistory?.map(item => {
                sum += item.totalPrice
                return {
                    orderCode: item?.orderCode,
                    createdAt: moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    totalPrice: formatter.format(item?.totalPrice),
                    status: item?.status,
                    item: <ul >
                        {item?.item.map((item, index) => {
                            return <li style={{ fontSize: 10 }} key={index}>{item?.name}x{item?.quantity}</li>
                        })}
                    </ul>

                }
            })
            setTotal(sum)
            setData(newArr)
        }
        console.log(res)
    }

    useEffect(() => {
        fetchDataAccount()
    }, [])


    return (
        <Row>
            <Col span={24} style={{ maxWidth: '100vw', overflow: 'scroll' }}>
                <Row style={{ padding: 10, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #88888', padding: '25px 10px 15px' }}>
                    <Col span={24} style={{ fontSize: 17, fontWeight: 500, padding: '0 10px' }}>
                        <span>LỊCH SỬ ĐƠN HÀNG CỦA BẠN ({data?.length})</span>
                        <span> -- {formatter.format(total)}đ</span>
                    </Col>
                    <Divider />
                    <Col span={24}  >


                        <Col span={24}>
                            <Table dataSource={data} columns={columns} />
                        </Col>

                    </Col>


                </Row>
            </Col>
        </Row>
    )
}

export default History