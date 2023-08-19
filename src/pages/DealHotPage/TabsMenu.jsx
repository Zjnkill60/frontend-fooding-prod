import { Space } from "antd"

const TabsMenu = (props) => {
    const { indexActiveTabs, handleChangeActiveTabs, category } = props
    if (category == "cook") {
        return (
            <Space className="tabs-slider" >
                <div onClick={() => handleChangeActiveTabs('cook', 'all')} className={indexActiveTabs == "all" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Tất Cả</div>
                <div onClick={() => handleChangeActiveTabs('cook', 'fried')} className={indexActiveTabs == "fried" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Món Chiên</div>
                <div onClick={() => handleChangeActiveTabs('cook', 'boil')} className={indexActiveTabs == "boil" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Món Luộc</div>
                <div onClick={() => handleChangeActiveTabs('cook', 'brause')} className={indexActiveTabs == "brause" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Món Kho</div>

            </Space>
        )
    }

    if (category == "soup") {
        return (
            <Space className="tabs-slider" >
                <div onClick={() => handleChangeActiveTabs('all')} className={indexActiveTabs == "all" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Tất Cả</div>
                <div onClick={() => handleChangeActiveTabs('cook')} className={indexActiveTabs == "fried" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Đồ Ăn Nhanh</div>
                <div onClick={() => handleChangeActiveTabs('ingredient')} className={indexActiveTabs == "boil" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Thực Phẩm - Nguyên Liệu</div>
                <div onClick={() => handleChangeActiveTabs('soup')} className={indexActiveTabs == "brause" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Chè Thập Cẩm</div>

            </Space>
        )
    }


    if (category == "ingredient") {
        return (
            <Space className="tabs-slider" >
                <div onClick={() => handleChangeActiveTabs('ingredient', 'all')} className={indexActiveTabs == "all" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Tất Cả</div>
                <div onClick={() => handleChangeActiveTabs('ingredient', 'chicken')} className={indexActiveTabs == "chicken" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Thịt Gà</div>
                <div onClick={() => handleChangeActiveTabs('ingredient', 'duck')} className={indexActiveTabs == "duck" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Thịt Vịt</div>
                <div onClick={() => handleChangeActiveTabs('ingredient', 'cow')} className={indexActiveTabs == "cow" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Thịt Bò</div>
                <div onClick={() => handleChangeActiveTabs('ingredient', 'pork')} className={indexActiveTabs == "pork" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Thịt Lợn</div>

            </Space>
        )
    }


    if (category == "vegetable") {
        return (
            <Space className="tabs-slider" >
                <div onClick={() => handleChangeActiveTabs('all')} className={indexActiveTabs == "all" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Tất Cả</div>
                <div onClick={() => handleChangeActiveTabs('cook')} className={indexActiveTabs == "fried" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"} >Đồ Ăn Nhanh</div>
                <div onClick={() => handleChangeActiveTabs('ingredient')} className={indexActiveTabs == "boil" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Thực Phẩm - Nguyên Liệu</div>
                <div onClick={() => handleChangeActiveTabs('soup')} className={indexActiveTabs == "brause" ? "tabs-trend-shopping tabs-active" : "tabs-trend-shopping"}>Chè Thập Cẩm</div>

            </Space>
        )
    }

}
export default TabsMenu