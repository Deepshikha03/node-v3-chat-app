const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error : 'Username and room are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate username
    if(existingUser){
        return {
            error : 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    return user
}

const getUsersInRoom = (room) => { 
    room = room.trim().toLowerCase()
    const usersInRoom = users.filter((user)=>{
        return user.room === room
    })
    return usersInRoom
}

// addUser({
//     id : 22,
//     username : 'Andrew',
//     room : 'South Philly'
// })

// addUser({
//     id : 42,
//     username : 'Mike',
//     room : 'South Philly'
// })

// addUser({
//     id : 32,
//     username : 'Andrew',
//     room : 'Center City'
// })


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// console.log(getUser(32))
// console.log(getUsersInRoom('South Philly'))

//console.log(users)

// const res = addUser({
//     id : 33,
//     username : 'andrew',
//     room : 'south philly'
// })

// console.log(res)

// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)