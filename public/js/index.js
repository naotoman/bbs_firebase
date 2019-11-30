  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "",
    authDomain: "bbs-firebase.firebaseapp.com",
    databaseURL: "https://bbs-firebase.firebaseio.com/",
    storageBucket: "https://bbs-firebase.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();



const submit_btn = document.getElementById("submit-button")
submit_btn.addEventListener("click", () => {
    alert('alert!');
    const chatAll = database.ref('/');
    chatAll.set({'name': 'kido'});
});