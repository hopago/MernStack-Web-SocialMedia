export const loginStart = (userCreds) => ({
    type: "LOGIN_START"
});

export const loginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});

export const loginFailure = () => ({
    type: "LOGIN_FAILURE"
});

export const follow = (userId) => ({
    type: "FOLLOW",
    payload: userId
});

export const unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId
});