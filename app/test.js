let email = "hello@gmadsaiul.com"
let password = "password"

let data = {
    username: email,
    password: password
}

let newData = JSON.stringify(data)

let anotherData = JSON.parse(newData)




let items = {
    token: "adsasdasd",
    state: "logined"
}

// let userInfo = items
localStorage.setItem('userInfo', items);
let someData = localStorage.getItem('userInfo')

