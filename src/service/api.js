import axios from './customizeAxios'

//AUTH
export const handleSendSMS = async (phoneNumber) => {
    return await axios.post('sms/send-otp', { phoneNumber })
}

export const handleVerifySMS = async (phoneNumber, otp) => {
    return await axios.post('sms/verify-otp', { phoneNumber, otp })
}

export const handleRegister = async (phoneNumber, name, password) => {
    return await axios.post('auth/register', { phoneNumber, name, password })
}

export const handleLoginGoogle = async (name, imageUrl, email, phoneNumber) => {
    return await axios.post('auth/google', { name, imageUrl, email, phoneNumber })
}

export const handleLogin = async (username, password) => {
    return await axios.post('auth/login', { username, password })
}

export const handleLogout = async () => {
    return await axios.post('auth/logout')
}

export const handleFetchAccount = async () => {
    return await axios.get('auth/profile')
}


//USER

export const handleFetchUserPaginate = async (current, pageSize, sort) => {
    return await axios.get(`users?current=${current}&pageSize=${pageSize}&sort=${sort}`)
}

export const handleFilterPhoneNumber = async (current, pageSize, filter) => {
    return await axios.get(`users?current=${current}&pageSize=${pageSize}&phoneNumber=/${filter}/i`)
}

export const handleUpdateRoleUser = async (id, role) => {
    return await axios.patch(`users/${id}`, { role })
}

export const handleDeleteUser = async (id) => {
    return await axios.delete(`users/${id}`)
}

export const handleFindOneShipper = async (id) => {
    return await axios.get(`users/shipper/${id}`)

}

export const handleUpdateInfoUser = async (id, name, email, currentPassword, newPassword, confirmNewPassword) => {
    return await axios.patch(`users/info/${id}`, { name, email, currentPassword, newPassword, confirmNewPassword })
}

export const handleUpdateListAddress = async (id, name, email, address, phoneNumber) => {
    return await axios.post(`users/address/${id}`, { name, email, address, phoneNumber })
}

//PRODUCT
export const handleFetchAllProd = async () => {

    return await axios.get(`product`)

}

export const handleFindOneProd = async (id) => {

    return await axios.get(`product/${id}`)

}

export const handleFetchProductPaginate = async (current, pageSize, sort) => {
    if (sort) {
        return await axios.get(`product?current=${current}&pageSize=${pageSize}&sort=${sort}`)
    }
    return await axios.get(`product?current=${current}&pageSize=${pageSize}`)

}

export const handleFetchProductCategory = async (current, pageSize, category, type, sort) => {

    return await axios.get(`product?current=${current}&pageSize=${pageSize}&category=${category}&type=${type}&sort=${sort}`)

}

export const handleFilterNameProduct = async (current, pageSize, filter) => {
    return await axios.get(`product?current=${current}&pageSize=${pageSize}&mainText=/${filter}/i`)
}

export const handleCreateProduct = async (author, mainText, category, price, percentSale, sold, thumbnail, slider, type) => {
    return await axios.post('product', { author, mainText, category, price, percentSale, sold, thumbnail, slider, type })
}

export const handleUpdateProduct = async (id, author, mainText, category, price, percentSale, sold, thumbnail, slider, type) => {
    return await axios.patch(`product/${id}`, { author, mainText, category, price, percentSale, sold, thumbnail, slider, type })
}

export const handleDeleteProduct = async (id) => {
    return await axios.delete(`product/${id}`)
}


//UPLOAD FILE

export const handleUploadFile = async (file) => {
    const bodyFormData = new FormData()
    bodyFormData.append('image', file)
    return await axios({
        method: 'post',
        url: 'file/upload',
        data: bodyFormData,
        headers: { "content-type": "multipart/form-data" }
    })

}

//ORDER
export const handleFetchOrderPaginate = async (current, pageSize, sort, filter) => {

    if (filter) {
        if (filter == "Tất cả") {
            if (sort) {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&sort=${sort}`)
            } else {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}`)
            }

        } else {
            if (sort) {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&status=${filter}&sort=${sort}`)
            } else {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&status=${filter}`)

            }
        }
    }

    return await axios.get(`orders?current=${current}&pageSize=${pageSize}`)


}

export const handleFilterStatusOrder = async (current, pageSize, filter) => {
    return await axios.get(`orders?current=${current}&pageSize=${pageSize}`)
}

export const handleFetchOrderLength = async () => {
    return await axios.get(`orders/length`)

}

export const handleFetchOrderLengthForShipper = async (id) => {
    return await axios.get(`orders/length/shipper/${id}`)

}

export const handleFilterOrderByPhoneNumber = async (current, pageSize, filter, status, sort) => {
    if (status) {
        if (status == "Tất cả") {
            if (sort) {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&phoneNumber=/${filter}/i&sort=${sort}`)
            } else {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&phoneNumber=/${filter}/i`)
            }

        } else {
            if (sort) {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&phoneNumber=/${filter}/i&status=${status}&sort=${sort}`)
            } else {
                return await axios.get(`orders?current=${current}&pageSize=${pageSize}&phoneNumber=/${filter}/i&status=${status}`)
            }
        }
    }

}


export const handleFindAllShipper = async () => {
    return await axios.get(`users?role=SHIPPER`)

}

export const handleCreateOrder = async (name, email, phoneNumber, address, totalPrice, status, shipper, item, payments, orderCode, idPerson) => {
    console.log("idPerson : ", idPerson)
    if (idPerson) {

        return await axios.post('orders', { name, email, phoneNumber, address, totalPrice, status, shipper, item, payments, orderCode, idPerson })

    }
    return await axios.post('orders', { name, email, phoneNumber, address, totalPrice, status, shipper, item, payments, orderCode })
}


export const handleUpdateOrder = async (id, name, email, phoneNumber, address, totalPrice, status, shipper, item) => {
    return await axios.patch(`orders/${id}`, { name, email, phoneNumber, address, totalPrice, status, shipper, item })
}

export const handleRejectOrder = async (id, status, reasonReject) => {
    return await axios.patch(`orders/${id}`, { status, reasonReject })
}

export const handleSuccessOrder = async (id, status, isPayment, cash) => {
    return await axios.patch(`orders/${id}`, { status, isPayment, cash })
}

export const handleFetchOrderForShipper = async (idShipper, status) => {


    return await axios.get(`orders?status=${status}&shipper=${idShipper}`)


}

//FLASH SALE
export const fetchInfoFlashsale = async () => {
    return await axios.get(`flashsale`)
}

export const handleUpdatePropFlashSale = async (idItem, priceSale, quantity, soldFlashsale) => {
    return await axios.patch(`flashsale`, { idItem, priceSale, quantity, soldFlashsale })
}

export const handleCreateNewItemFlashSale = async (id, idItem, priceSale, quantity, soldFlashsale) => {
    return await axios.post(`flashsale/create/${id}`, { idItem, priceSale, quantity, soldFlashsale })
}

export const handleRemoveItemFlashSale = async (id, idItem) => {
    return await axios.patch(`flashsale/item/${id}`, { idItem })
}

export const handleUpdateTimer = async (id, timer) => {
    return await axios.patch(`flashsale/timer/${id}`, { timer })
}

//COMMENT

export const handleCreateNewComment = async (description, rate, image, productID) => {
    return await axios.post(`comments`, { description, rate, image, productID })
}

export const fetchCommentByIdProduct = async (current, pageSize, filter, sort) => {
    return await axios.get(`comments?current=${current}&pageSize=${pageSize}&productID=${filter}&sort=${sort}`)
}

//DISCOUNT

export const fetchAllDiscount = async (current, pageSize, filter, sort) => {
    return await axios.get(`discount?current=${current}&pageSize=${pageSize}&category=${filter}`)
}

export const handleCreateNewDiscount = async (codeSeller, title, description, discount, priceApplicable, category) => {
    return await axios.post(`discount`, { codeSeller, title, description, discount, priceApplicable, category })
}



