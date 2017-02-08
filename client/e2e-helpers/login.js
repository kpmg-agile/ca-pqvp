/**
 * This is just a stub for authenticating the current user before
 * tests are executed on behalf of the user. You will need to
 * modify the body of this function to implement your
 * means of authenticating as the given user before the
 * page can be loaded as the given user.
 * @param {*} user The user to authenticate as.
 * @returns {Promise} A promise resolved when user is logged in and authenticated
 */
module.exports = function login(user) {
    return new Promise(resolve => {
        resolve(user);
    });
};
