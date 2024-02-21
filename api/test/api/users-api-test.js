const { assert} = require("chai");
const { assertSubset } = require("../test-utils.js");
const { kCloudService} = require("./kcloud-service.js");
const { maggie,maggieCredentials, testUsers, homer,homerCredentials } = require("../fixtures.js");
const users = new Array(testUsers.length);
suite("User API tests", () => { 
    setup(async () => {
      await kCloudService.clearAuth();
      await kCloudService.deleteAllUsers();
      await kCloudService.createUser(maggie);
      await kCloudService.authenticate(maggieCredentials); // create a jwt for test user
      for (let i = 0; i < testUsers.length; i += 1) {
        users[i] = await kCloudService.createUser(testUsers[i]);
      }
    });
    teardown(async () => {});
  
    test("create a user", async () => {
      const newUser = await kCloudService.createUser(homer);
      assertSubset(homer, newUser);
      assert.isDefined(newUser.id);
    });
  
    test("delete all user Api", async () => {
      let returnedUsers = await kCloudService.getAllUsers();
      assert.equal(returnedUsers.length, 4);
      await kCloudService.deleteAllUsers(); // delete them all
      await kCloudService.createUser(maggie); // create and authenticate the test user so we call the get users command
      await kCloudService.authenticate(maggieCredentials);
      returnedUsers = await kCloudService.getAllUsers();
      assert.equal(returnedUsers.length, 1);
    });
  
    test("get a user", async () => {
      const returnedUser = await kCloudService.getUser(users[0].id);
      assertSubset(users[0], returnedUser);
    });
  
  
  });
  

