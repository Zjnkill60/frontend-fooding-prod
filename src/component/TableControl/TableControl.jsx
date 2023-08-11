import { Table } from "antd";
import { useState } from "react";

const TableControl = (props) => {
    // const [current, setCurrent] = useState(1)
    // const [pageSize, setPageSize] = useState(6)
    const [order, setOrder] = useState({})
    const { columns, data, handleGetAllProductPaginate, tool, handleGetAllUserPaginate, getAllOrders, totalData,
        current, setCurrent, pageSize, setPageSize, valueSelect, valueInputFind, handleFindByPhoneNumber } = props

    const onChange = async (pagination, filters, sorter, extra) => {
        if (tool) {
            setOrder({ trend: sorter?.order, field: sorter?.field })
            setPageSize(pagination.pageSize)
            setCurrent(pagination.current)
        }

        if (current != pagination.current || pageSize != pagination.pageSize) {
            if (tool == "manage-user") {
                if (order?.trend == 'ascend') {
                    await handleGetAllUserPaginate(pagination.current, pagination.pageSize, `-${order?.field}`)
                } else if (order?.trend == 'descend') {
                    await handleGetAllUserPaginate(pagination.current, pagination.pageSize, `${order?.field}`)
                } else {
                    await handleGetAllUserPaginate(pagination.current, pagination.pageSize)
                }
            } else if (tool == "manage-product") {
                if (order?.trend == 'ascend') {
                    await handleGetAllProductPaginate(pagination.current, pagination.pageSize, `-${order?.field}`)
                } else if (order?.trend == 'descend') {
                    await handleGetAllProductPaginate(pagination.current, pagination.pageSize, `${order?.field}`)
                } else {
                    await handleGetAllProductPaginate(pagination.current, pagination.pageSize)
                }
            } else if (tool == "manage-order") {
                if (order?.trend == 'ascend') {
                    if (valueInputFind) {
                        await handleFindByPhoneNumber(pagination.current, pagination.pageSize, valueInputFind, valueSelect, `-${sorter?.field}`)
                    } else {
                        await getAllOrders(pagination.current, pagination.pageSize, `-${order?.field}`, valueSelect)
                    }
                } else if (order?.trend == 'descend') {
                    if (valueInputFind) {
                        await handleFindByPhoneNumber(pagination.current, pagination.pageSize, valueInputFind, valueSelect, `-${sorter?.field}`)
                    } else {
                        await getAllOrders(pagination.current, pagination.pageSize, `${order?.field}`, valueSelect)
                    }
                } else {
                    if (valueInputFind) {
                        await handleFindByPhoneNumber(pagination.current, pagination.pageSize, valueInputFind, valueSelect, null)
                    } else {
                        await getAllOrders(pagination.current, pagination.pageSize, null, valueSelect)
                    }
                }
            }
        }

        if (order?.trend != sorter?.order) {
            if (tool == "manage-product") {
                if (sorter?.order == 'ascend') {
                    await handleGetAllProductPaginate(current, pageSize, `-${sorter?.field}`)
                }

                if (sorter?.order == 'descend') {
                    await handleGetAllProductPaginate(current, pageSize, `${sorter?.field}`)

                }
            } else if (tool == "manage-user") {
                if (sorter?.field == "orderHistory") {
                    if (sorter?.order == 'ascend') {
                        data.sort((a, b) => {
                            return a.orderNumber - b.orderNumber
                        });
                    }

                    if (sorter?.order == 'descend') {
                        data.sort((a, b) => {
                            return b.orderNumber - a.orderNumber
                        });
                    }
                } else {
                    if (sorter?.order == 'ascend') {
                        await handleGetAllUserPaginate(current, pageSize, `-${sorter?.field}`)
                    }

                    if (sorter?.order == 'descend') {
                        await handleGetAllUserPaginate(current, pageSize, `${sorter?.field}`)
                    }
                }
            } else {
                if (sorter?.order == 'ascend') {
                    if (valueInputFind) {
                        await handleFindByPhoneNumber(current, pageSize, valueInputFind, valueSelect, `-${sorter?.field}`)
                    } else {
                        await getAllOrders(current, pageSize, `-${sorter?.field}`, valueSelect)
                    }

                }

                if (sorter?.order == 'descend') {
                    if (valueInputFind) {
                        await handleFindByPhoneNumber(current, pageSize, valueInputFind, valueSelect, `${sorter?.field}`)
                    } else {
                        await getAllOrders(current, pageSize, `${sorter?.field}`, valueSelect)
                    }

                }
            }
        }


    };




    return (
        <Table columns={columns} dataSource={data} onChange={onChange}
            pagination={{
                pageSize: pageSize, current: current, total: totalData,
                position: ['bottomCenter'], showSizeChanger: true
            }} />
    )
}

export default TableControl