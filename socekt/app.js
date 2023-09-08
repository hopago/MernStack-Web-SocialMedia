const io = require("socket.io")(5000, {
    cors: {
        origin: "http://localhost:3000"
    },
});

let users = [];

const addUser = (userId, socketId) => {

    !users.some(user => user.userId === userId) && 
        users.push({ userId, socketId })

    console.log(users);

};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
};

io.on("connection", (socket) => {

    // Connect
    console.log("Socket Io Connected!");

    // Take user Id and socketId from user
    socket.on("reqUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUserId", users);
    });

    // Send and Get messages
    socket.on("sendMessage", ({senderId, receiverId, text}) => {

        const user = getUser(receiverId);

        io.to(user.socketId).emit("getMessage", {
            senderId, text
        });

    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnect!");
        removeUser(socket.id);
        io.emit("getUserId", users);
    });

});

