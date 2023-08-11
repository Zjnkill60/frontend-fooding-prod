import { CloseOutlined } from '@ant-design/icons'
import { Modal } from "antd";

const baseURL = import.meta.env.VITE_URL_BACKEND



const ModalPreviewImageComments = (props) => {

    const { isModalOpen, setIsModalOpen, previewImageComment } = props



    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>

            <Modal closeIcon={false} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} width={'50vw'} open={isModalOpen} onCancel={handleCancel}>
                <img style={{ height: '500px', width: '100%', objectFit: 'cover' }} src={`${baseURL}/images/${previewImageComment}`} />
                <CloseOutlined onClick={handleCancel} style={{ fontSize: 30, color: '#fff', position: 'absolute', top: 10, right: 10, zIndex: 5 }} />
            </Modal>
        </>
    );
}

export default ModalPreviewImageComments