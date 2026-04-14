// lib (functions)

const getField = async () => {
    const response = await fetch("/api/field")
    const data = await response.json()
    return data
}

const move = async () => {
    const response = await fetch("/api/move", {
        method:"POST",
        body: JSON.stringify({
            player: "O",
            coordinate: Math.floor(Math.random()*9)
        }),
        headers: {
            "Content-Type":"application/json"
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
    for (const dot of field){
        peremennaya += `<div class="cell">${dot}</div>`
    }
    box.innerHTML = peremennaya 
// создать ячейку и append в специально подготовленный wrapper (div) 

// document.createElement()    document.body.append()

// или

// <div>элемент</div>
// <div>элемент</div>
// <div>элемент</div>...  innerHTML(wrapper)
}

// app
move().then(()=>{
    
    getField().then((data) => {
        console.log(data)
        unveilField(data.field)
    })

})

