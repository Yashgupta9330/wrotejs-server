const users = [];
const messages=[];
// Join user to chat
/*const userJoin = (id, username, room, host) => {
  const user = {id, username, room, host};

  users.push(user);
  return user;
};  */


const userJoin = (userId, userName, roomId,host) => {
  if (userName !== undefined) {
    const user = {
      id: userId,
      username: userName,
      room: roomId,
      host: host,
    };

    users.push(user);

    console.log(user);
    return user;
  }
   else {
    console.error("Error: Username is undefined for user with ID", userId);
  }
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get users
const getUsers = (room) => {
  const RoomUsers = [];
  users.map((user) => {
    if (user.room == room) {
      RoomUsers.push(user);
    }
  });
  return RoomUsers;
};

//set messages
const setMessage=(roomId,text,userName,user,timestamp)=>{
  const message = {
    user: user,
    username: userName,
    room: roomId,
    text:text,
    time:timestamp
  };

  messages.push(message);

  console.log(message);
  return message;
}

//get room message
const getroommessage= (room) => {
  const Roommessage = [];
  messages.map((message) => {
    if (message.room == room) {
      Roommessage.push(message);
    }
  });
  return Roommessage;
};

module.exports = {
  userJoin,
  userLeave,
  getUsers,
  setMessage,
  getroommessage,
};