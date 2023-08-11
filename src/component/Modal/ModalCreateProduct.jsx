import { Button, Modal, Form, Input, Row, Col, Select, message, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { handleCreateProduct, handleUploadFile } from '../../service/api';



const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


const ModalCreateProduct = (props) => {
    const { isModalOpen, setIsModalOpen, handleGetAllProductPaginate } = props
    const baseURL = import.meta.env.VITE_URL_BACKEND

    const [form] = useForm()

    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        let imgSlider = slider.map(item => {
            return item.urlUpload
        })
        const { mainText, author, price, sold, category, percentSale } = values
        let res = await handleCreateProduct(author, mainText, category, price, percentSale, sold, thumbnail[0].urlUpload, imgSlider)
        if (res && res.data) {
            message.success('Tạo mới sản phẩm thành công !')
            await handleGetAllProductPaginate(1, 6)
            setIsModalOpen(false)
        } else {
            message.error(res.message)
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            category: "KHOA HỌC KỸ THUẬT"
        })
    }, [])

    //UPLOAD
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [thumbnail, setThumbnail] = useState([]);

    const [slider, setSlider] = useState([]);
    const handleCancelPreview = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        let res = await handleUploadFile(file)
        console.log(res)
        if (res && res.data) {
            setThumbnail([{
                url: `${baseURL}images/${res.data?.imgUpload}`,
                urlUpload: res.data?.imgUpload
            }])
            onSuccess('Upload success !')
        } else {
            onError('Error !')
        }

    }

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        let res = await handleUploadFile(file)
        console.log(res)
        if (res && res.data) {
            let imgSlider = {
                url: `${baseURL}images/${res.data?.imgUpload}`,
                urlUpload: res.data?.imgUpload
            }
            setSlider(slider => [...slider, imgSlider])
            onSuccess('Upload success !')
        } else {
            onError('Error !')
        }

    }

    const handleRemove = (file, type) => {
        if (type == 'thumbnail') {
            setThumbnail([])
        } else {
            let imgSlider = slider.filter(item => {
                return item.url != file.url
            })
            setSlider(imgSlider)
        }
    }
    return (
        <>
            <Modal className='ant-drawer-content-wrapper' width={'60%'} title="Tạo mới sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="from-add-book"
                    style={{ marginTop: 50 }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên Sản Phẩm"
                                labelCol={{ span: 24 }}
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sản phẩm',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác Giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên tác giả ',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item
                                label="Giá"
                                labelCol={{ span: 24 }}
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá',
                                    },
                                ]}
                            >
                                <Input addonAfter="VND" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giảm Giá"
                                name="percentSale"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số ',
                                    },
                                ]}
                            >
                                <Input type='number' addonAfter={'%'} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã Bán"
                                name="sold"

                            >
                                <Input type='number' />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="Thể Loại"
                                labelCol={{ span: 24 }}
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chon thể loại'
                                    },
                                ]}
                            >
                                <Select
                                    style={{ textAlign: 'center' }}
                                    options={[
                                        {
                                            value: 'VĂN HỌC',
                                            label: 'VĂN HỌC',
                                        },
                                        {
                                            value: 'KHOA HỌC KỸ THUẬT',
                                            label: 'KHOA HỌC KỸ THUẬT',
                                        },
                                        {
                                            value: 'VĂN HÓA - NGHỆ THUẬT',
                                            label: 'VĂN HÓA - NGHỆ THUẬT',
                                        },
                                        {
                                            value: 'KINH TẾ ',
                                            label: 'KINH TẾ ',

                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>



                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh Đại Diện"
                                labelCol={{ span: 24 }}
                                name="thumbnail"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chon ảnh đại diện'
                                    },
                                ]}
                            >
                                <Upload
                                    customRequest={handleUploadFileThumbnail}
                                    listType="picture-card"
                                    maxCount={1}
                                    fileList={thumbnail}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, "thumbnail")}

                                >
                                    {uploadButton}
                                </Upload>

                            </Form.Item>
                        </Col>

                        <Col span={12}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Menu"
                                name="slider"

                            >
                                <Upload
                                    customRequest={handleUploadFileSlider}
                                    listType="picture-card"
                                    fileList={slider}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, "slider")}

                                >
                                    {slider?.length >= 8 ? null : uploadButton}

                                </Upload>

                            </Form.Item>
                        </Col>


                    </Row>



                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    )
}

export default ModalCreateProduct