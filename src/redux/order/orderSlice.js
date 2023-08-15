import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    totalPrice: 0,
    codeDiscount: {
        codeSeller: "",
        title: "",
        description: "",
        priceApplicable: 0,
        discount: 0,
        category: ""

    }
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        handleAddItemToCart: (state, action) => {
            let isRecur = false
            let total = 0
            state.items.forEach(item => {
                if (item?.mainText == action.payload?.mainText) {
                    isRecur = true
                    if (action.payload?.quantityFlashsale && action.payload?.quantityFlashsale <= item.quantity + action.payload?.quantity) {
                        item.quantity = action.payload?.quantityFlashsale
                    } else {
                        item.quantity = +item.quantity + action.payload?.quantity
                    }

                }
            })
            if (!isRecur) {
                state.items = [...state.items, action.payload]
            }
            state.items.forEach(item => {
                total += (item.quantity * item.price)
            })
            state.totalPrice = total - state.codeDiscount?.discount


        },
        handleRemoveItemFromCart: (state, action) => {
            let total = 0

            let newArray = state.items.filter(item => {
                return item.mainText != action.payload.mainText

            })
            state.items = newArray

            state.items.forEach(item => {
                total += (item.quantity * item.price)
            })

            if (total < state.codeDiscount.priceApplicable) {
                state.codeDiscount = {
                    codeSeller: "",
                    title: "",
                    description: "",
                    priceApplicable: 0,
                    discount: 0,
                    category: ""

                }
            }
            state.totalPrice = total - state.codeDiscount?.discount
        },
        handlePlusQuantityItem: (state, action) => {
            let total = 0

            state.items.forEach(item => {
                if (item.mainText == action.payload.mainText) {
                    if (item.quantityFlashsale && item.quantityFlashsale <= item.quantity + 1) {
                        item.quantity = item.quantityFlashsale
                    } else {
                        item.quantity += 1
                    }

                }
                total += (item.quantity * item.price) - state.codeDiscount?.discount
            })
            state.totalPrice = total

        },
        handleMinusQuantityItem: (state, action) => {
            let total = 0
            state.items.forEach(item => {
                if (item.mainText == action.payload.mainText) {
                    item.quantity -= 1
                    if (item.quantity <= 1) {
                        item.quantity = 1
                    }

                }
                total += (item.quantity * item.price)
            })

            if (total < state.codeDiscount.priceApplicable) {
                state.codeDiscount = {
                    codeSeller: "",
                    title: "",
                    description: "",
                    priceApplicable: 0,
                    discount: 0,
                    category: ""

                }
            }
            state.totalPrice = total - state.codeDiscount?.discount
        },
        handleChangeQuantityItem: (state, action) => {
            let total = 0
            state.items.forEach(item => {
                if (item.mainText == action.payload.mainText) {
                    if (item.quantityFlashsale && item.quantityFlashsale <= action.payload?.quantity) {
                        item.quantity = item.quantityFlashsale
                    } else {
                        item.quantity = (+action.payload?.quantity)
                    }

                }
                total += (item.quantity * item.price)
            })
            if (total < state.codeDiscount.priceApplicable) {
                state.codeDiscount = {
                    codeSeller: "",
                    title: "",
                    description: "",
                    priceApplicable: 0,
                    discount: 0,
                    category: ""

                }
            }
            state.totalPrice = total - state.codeDiscount?.discount
        },
        doOrderSuccess: (state) => {
            state.items = []
            state.totalPrice = 0
        },

        handleSetCodeDiscount: (state, action) => {
            state.codeDiscount = action.payload
            state.totalPrice -= (+state.codeDiscount?.discount)
        },
        handleRemoveDiscount: (state, action) => {
            console.log("chay tiep vao day")
            state.codeDiscount = {
                codeSeller: "",
                title: "",
                description: "",
                priceApplicable: 0,
                discount: 0,
                category: ""

            }
            state.totalPrice += action.payload.discount
        },
        handleChangeDiscount: (state, action) => {
            state.codeDiscount = action.payload.item
            state.totalPrice += action.payload.discount - action.payload?.item?.discount
        },

    },
})

// Action creators are generated for each case reducer function
export const { handleAddItemToCart, handleRemoveItemFromCart, handlePlusQuantityItem, handleSetCodeDiscount, handleRemoveDiscount, handleChangeDiscount,
    handleMinusQuantityItem, handleChangeQuantityItem, doOrderSuccess } = orderSlice.actions

export default orderSlice.reducer