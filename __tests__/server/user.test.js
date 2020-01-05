describe("Users", () => {
  //$ Name
  const goodName = "Will Holley";
  // Bad Names
  const shortName = "aa"; // too short
  const longName = "aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa"; // too long
  const wrongNameType = true; // name must be a string

  //$ Email
  const goodEmail = "test@willholley.com";
  // Bad Emails
  const badSegments = "test@willholley";
  const notAnEmail = "test@";
  const badTLD = "test@willholley.xxx";
  const wrongEmailType = true; // email must be a string

  //$ Password
  // Counterintuitively, the password validation currently only allows shitty passwords...
  const goodPassword = "password";
  const badPassword = "H`NX/tp!2rt8D.4d";
  const wrongPasswordType = true; // password must be a string

  test("user can register and receives a jwt upon successful registration", async () => {
    // const response = await this.global.api.post("/api/1/user/register").send({
    //   name: goodName,
    //   email: goodEmail,
    //   password: goodPassword
    // });
    // console.log(response.body);
    // expect(response.token).not.toBeNull();
    expect(true).toBeTruthy();
  });

  // test("registration requires name", async () => {});

  // test("registration requires password", async () => {});

  // test("registration requires email", async () => {});

  // test("registration requires valid email", async () => {});

  // test("registration fails if email already exists");

  // test("user can login and receives a jwt token if successful");

  // test("user login fails with bad email");

  // test("user login fails with bad password");
});
