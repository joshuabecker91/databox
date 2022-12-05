import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

function App() {
  const [user, setUser] = useState({});

  function handleCallbackRepsonse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(e) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "398558560876-o9fvk42cu2mh54tfqbbtkc91dsu3ehfu.apps.googleusercontent.com",
      callback: handleCallbackRepsonse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  }, []);

  // If we have no user: sign in button
  // If we have a user: log out button
  return (
    <div className="App">
      <div
        className="position-absolute top-50 start-50 translate-middle sm:w-[0%]"
        id="signInDiv"
      ></div>
      {Object.keys(user).length !== 0 && (
        <button
          className="btn btn-primary m-1 "
          onClick={(e) => handleSignOut(e)}
        >
          Sign Out
        </button>
      )}
      {user && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <img src={user.picture} className="rounded-sm" alt=""></img>
          <h3>{user.name}</h3>
          <h5>{user.email}</h5>
        </div>
      )}
    </div>
  );
}

export default App;
