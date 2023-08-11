import { Avatar, Badge, Descriptions, Drawer } from 'antd';
import moment from 'moment'

const DrawerViewDataAdmin = (props) => {
    const { open, setOpen, dataClick } = props
    const baseURL = import.meta.env.VITE_URL_BACKEND

    const onClose = () => {
        setOpen(false);
    };


    return (
        <>
            <Drawer className='ant-drawer-content-wrapper' width={'60vw'} title={`Infomation of ${dataClick?.name} `} placement="right" onClose={onClose} open={open}>
                <Descriptions bordered>
                    <Descriptions.Item span={3} label="Họ Tên">{dataClick?.name}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Email">{dataClick?.email}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Số Điện Thoại">{dataClick?.phoneNumber}</Descriptions.Item>

                    <Descriptions.Item label="Quyền" span={2}>
                        <Badge status="processing" text={dataClick?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số Lần Mua Hàng" span={1}>
                        {dataClick?.orderHistory?.length}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời Gian Tạo" span={3}>
                        {moment(dataClick?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời Gian Cập Nhật" span={3}>
                        {moment(dataClick?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>


                </Descriptions>
                <Avatar style={{ marginTop: 50 }} size={128} src={baseURL + 'images/' + dataClick?.avatar} />
            </Drawer>
        </>
    )
}

export default DrawerViewDataAdmin