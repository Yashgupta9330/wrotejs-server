const users = [];

// Join user to chat
/*const userJoin = (id, username, room, host) => {
  const user = {id, username, room, host};

  users.push(user);
  return user;
};  */

// Example server-side code
const userJoin = (roomId, userId, userName, host) => {
  // Extract data from the incoming join room event
  // Check if the username is defined
  if (userName !== undefined) {
    // Add the user to the array of users in the room
    const user = {
      id: userId,
      username: userName,
      room: roomId,
      host: host,
    };

    // Add the user to the array of users who joined the room
    // (Assuming usersInRoom is an array that keeps track of users in the room)
    users.push(user);

    // Log the updated array of users
    console.log(user);
    return user;
  } else {
    // Log an error if the username is undefined
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

module.exports = {
  userJoin,
  userLeave,
  getUsers,
};