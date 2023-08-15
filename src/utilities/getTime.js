import { fetchInfoFlashsale } from "../service/api"

export const getInitTimeFuture = async (setSecond, setMinute, setHours, setTimeFuture, setDataItemFlashSale, setIsTimeEnd) => {
    let res = await fetchInfoFlashsale()
    if (res && res.data) {
        console.log(res)
        if (setDataItemFlashSale) {
            setDataItemFlashSale(res.data?.modelFlashsale[0]?.itemFlashSale)
        }
        let dateFuture = new Date(res.data?.modelFlashsale[0]?.timer)

        let dateNow = new Date()


        if ((dateFuture.getDate() * 86400 + dateFuture.getHours() * 3600 + dateFuture.getMinutes() * 60) <
            (dateNow.getDate() * 86400 + dateNow.getHours() * 3600 + dateNow.getMinutes() * 60)) {
            setSecond(0)
            setMinute(0)
            setHours(0)
            setIsTimeEnd(true)
            return
        }

        setTimeFuture(dateFuture)

        getSecond(dateNow, dateFuture, setSecond)
        getMinute(dateNow, dateFuture, setMinute)
        getHour(dateNow, dateFuture, setHours)

    }
}

export const getSecond = (timeCurrent, timeDb, setSecond) => {
    let secondRemain = timeDb.getSeconds() - timeCurrent.getSeconds()
    if (secondRemain < 0) {
        secondRemain += 60
    }
    setSecond(secondRemain)

}

export const getMinute = (timeCurrent, timeDb, setMinute) => {
    let minuteRemain = timeDb.getMinutes() - timeCurrent.getMinutes()
    if (minuteRemain < 0) {
        minuteRemain += 60
    }
    setMinute(minuteRemain)

}

export const getHour = (timeCurrent, timeDb, setHours) => {
    let hourRemain = 0;
    if ((timeDb.getHours() * 3600 + timeDb.getMinutes() * 60) - (timeCurrent.getHours() * 3600 + timeCurrent.getMinutes() * 60) >=
        ((timeDb.getHours() - timeCurrent.getHours()) * 3600)) {
        hourRemain = timeDb.getHours() - timeCurrent.getHours()
    } else {
        hourRemain = timeDb.getHours() - timeCurrent.getHours() - 1
    }



    setHours(hourRemain <= 0 ? 0 : hourRemain)


}