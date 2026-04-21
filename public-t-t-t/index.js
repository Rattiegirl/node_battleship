// lib (functions)

const getField = async () => {
    const response = await fetch("/api/field")
    const data = await response.json()
    return data
}

const move = async (thatOne) => {
    const response = await fetch("/api/move", {
        method: "POST",
        body: JSON.stringify({
            player: Math.random() > 0.5 ? "O" : "X",
            coordinate: thatOne
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    return data
}

const unveilField = (field) => {
    // найти элементы
    const box = document.querySelector("#field")
    // цикл по каждому field элементу
    let peremennaya = ""
    for (let i = 0; i < field.length; i++) {
        const dot = field[i]
        peremennaya += `<div data-id="${i}" class="cell">${dot}</div>`
    }
    box.innerHTML = peremennaya
    // создать ячейку и append в специально подготовленный wrapper (div) 

    // document.createElement()    document.body.append()

    // или

    // <div>элемент</div>
    // <div>элемент</div>
    // <div>элемент</div>...  innerHTML(wrapper)
}


const resetField = async () => {
    const response = await fetch("/api/fields", {
        method: "PUT"
    })
    const data = await response.json()
    return data
}

// app
getField().then((data) => {
    console.log(data)
    unveilField(data.field)
})

const playingField = document.querySelector("#field")
playingField.addEventListener("click", async (event) => {
    console.log(event)
    const { target } = event
    if (target.classList.contains("cell")) {
        const thatOne = target.getAttribute("data-id")
        const data = await move(thatOne)
        unveilField(data.field)
    }
})



const resetButton = document.querySelector("#resetBtn")
resetButton.addEventListener("click", async () => {
    const { field } = await resetField()
    unveilField(field)
    alert("You have just reset the field!")
})