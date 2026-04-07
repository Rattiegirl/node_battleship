// lib (functions)

const getField = async () => {
    const response = await fetch("/api/field")
    const data = await response.json()
    return data
}

const unveilField = (data) => {
// найти элементы
// цикл по каждому field элементу
// создать ячейку и append в специально подготовленный wrapper (div) 

// document.createElement()    document.body.append()

// или

// <div>элемент</div>
// <div>элемент</div>
// <div>элемент</div>...  innerHTML(wrapper)
}

// app

getField().then((data) => {
    console.log(data)
    unveilField(data)
})

