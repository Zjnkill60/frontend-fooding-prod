import { Col, Drawer, Row } from "antd"
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { useState } from "react"

const DrawerMenuMoblie = (props) => {
  const { open, setOpen } = props
  const [indexActiveMenu, setIndexActiveMenu] = useState(1)
  const onClose = () => {
    setOpen(false);
  };

  const title = (
    <Row style={{ backgroundColor: '#c92127', padding: '18px', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <ArrowLeftOutlined onClick={onClose} style={{ color: '#fff', fontSize: 20 }} />
      <span style={{
        position: 'absolute', right: '50%', transform: 'translateX(50%)', fontSize: 18, fontWeight: 700, color: '#fff'
      }}>Danh Mục Sản Phẩm</span>
    </Row>
  )
  return (
    <Drawer
      title={title}
      placement={'left'}
      closable={false}
      style={{ width: '100vw' }}
      onClose={onClose}
      open={open}

    >
      <Row style={{ backgroundColor: '#ededed ', height: '100%' }}>
        <Col span={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Row onClick={() => setIndexActiveMenu(1)} gutter={[0, 5]} className={indexActiveMenu == 1 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_sachtrongnuoc.svg" />
            </Col>
            <Col span={24} className="title-item">
              Đồ ăn chế biến
            </Col>
          </Row>
          <Row onClick={() => setIndexActiveMenu(2)} gutter={[0, 5]} className={indexActiveMenu == 2 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_foreignbooks.svg" />
            </Col>
            <Col span={24} className="title-item">
              Nguyên liệu  sống
            </Col>
          </Row>
          <Row onClick={() => setIndexActiveMenu(3)} gutter={[0, 5]} className={indexActiveMenu == 3 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_VPP.svg" />
            </Col>
            <Col span={24} className="title-item">
              Rau củ quả
            </Col>
          </Row>

          <Row onClick={() => setIndexActiveMenu(4)} gutter={[0, 5]} className={indexActiveMenu == 4 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_dochoi.svg" />
            </Col>
            <Col span={24} className="title-item">
              Nước chấm
            </Col>
          </Row>

          <Row onClick={() => setIndexActiveMenu(5)} gutter={[0, 5]} className={indexActiveMenu == 5 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_sachtrongnuoc.svg" />
            </Col>
            <Col span={24} className="title-item">
              Đồ ăn chế biến
            </Col>
          </Row>
          <Row onClick={() => setIndexActiveMenu(6)} gutter={[0, 5]} className={indexActiveMenu == 6 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_foreignbooks.svg" />
            </Col>
            <Col span={24} className="title-item">
              Nguyên liệu sống
            </Col>
          </Row>
          <Row onClick={() => setIndexActiveMenu(7)} gutter={[0, 5]} className={indexActiveMenu == 7 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_VPP.svg" />
            </Col>
            <Col span={24} className="title-item">
              Rau củ quả
            </Col>
          </Row>

          <Row onClick={() => setIndexActiveMenu(8)} gutter={[0, 5]} className={indexActiveMenu == 8 ? "menu-item-drawer item-active" : "menu-item-drawer"}>
            <Col span={24}>
              <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_dochoi.svg" />
            </Col>
            <Col span={24} className="title-item">
              Nước chấm
            </Col>
          </Row>
        </Col>

        {indexActiveMenu == 1 || indexActiveMenu == 5 ?
          <Col span={18}>
            <Row gutter={[0, 3]} style={{ padding: '3px 5px' }}>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>TẤT CẢ SẢN PHẨM</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>MÓN CHIÊN XÙ</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>MÓN LUỘC</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>MÓN HẤP</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>MÓN RÁN</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>MÓN CANH</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
            </Row>
          </Col> : <></>}

        {indexActiveMenu == 2 || indexActiveMenu == 6 ?
          <Col span={18}>
            <Row gutter={[0, 3]} style={{ padding: '3px 5px' }}>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>TẤT CẢ SẢN PHẨM</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>THỊT GÀ</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>THỊT VỊT</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>THỊT LỢN</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>THỊT BÒ</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>

            </Row>
          </Col> : <></>}

        {indexActiveMenu == 3 || indexActiveMenu == 7 ?
          <Col span={18}>
            <Row gutter={[0, 3]} style={{ padding: '3px 5px' }}>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>TẤT CẢ SẢN PHẨM</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>RAU SỐNG</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>RAU GIA VỊ</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>RAU VITAMIN</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>RAU KHOÁNG CHẤT</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>

            </Row>
          </Col> : <></>}

        {indexActiveMenu == 4 || indexActiveMenu == 8 ?
          <Col span={18}>
            <Row gutter={[0, 3]} style={{ padding: '3px 5px' }}>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>TẤT CẢ SẢN PHẨM</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>NƯỚC CHẤM THẦN THÁNH</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>NƯỚC CHẤM HẢI SẢN</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>NƯỚC CHẤM VỊT</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>
              <Col span={24} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                backgroundColor: '#fafafa', height: 50
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#212121', padding: '10px' }}>NƯỚC CHẤM SIÊU CAY</span>
                <RightOutlined style={{ position: 'absolute', right: 10, fontWeight: 600 }} />
              </Col>

            </Row>
          </Col> : <></>}
      </Row>
    </Drawer>
  )
}

export default DrawerMenuMoblie