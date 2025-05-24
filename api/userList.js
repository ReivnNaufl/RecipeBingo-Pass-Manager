import { mainAdmin } from "../lib/firebase.js";

async function getAllUsers() {
  try {
    const allUsers = [];
    let nextPageToken;
    
    do {
      const listUsersResult = await mainAdmin.auth().listUsers(1000, nextPageToken);
      allUsers.push(...listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return allUsers.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      lastLogin: user.metadata.lastSignInTime,
      createdAt: user.metadata.creationTime
    }));

  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Return empty array on error
  }
}

export default async function handler(req, res) {
    try {
        const userList = await getAllUsers();
        
        return res.status(200).json(userList);
    } catch(e){
        console.error('Error:', e);
        res.status(500).json({ error: 'Failed to get recipe list' });
    }
}