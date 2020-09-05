


  // Firebase configuration FIRST
  var firebaseConfig = {
    apiKey: "AIzaSyAR4YGZ6-d3r-bHQsLokKjD03q9J3LxIlw",
    authDomain: "vantage-tutoring.firebaseapp.com",
    databaseURL: "https://vantage-tutoring.firebaseio.com",
    projectId: "vantage-tutoring",
    storageBucket: "vantage-tutoring.appspot.com",
    messagingSenderId: "359135646635",
    appId: "1:359135646635:web:752ac980c1d24f9f0af8ee",
    measurementId: "G-3KSXKSRKNX"
  };
  // Initialization
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var provider = new firebase.auth.GoogleAuthProvider();
  var db = firebase.firestore();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
  

      
      console.log('hello, you are logged in.');
      $('#login-screen').hide();
      $('#main').show();
      
      renderCourseList();


      // ...
    } else {
      $('#login-screen').show()
      $('#main').hide();
        console.log('you are logged out.')
        
      // User is signed out.
      // ...
    }
  });


  function logout(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

function signIn(){
    firebase.auth()
   
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      db.collection('users').doc(user.uid).get().then(doc=>{
        console.log(doc)
        if (doc.data().general.account != 'admin'){
          alert('you are not an admin.');
          logout();
        }
      })
      
		
      console.log(token)
      console.log(user)
   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
		
      console.log(error.code)
      console.log(error.message)
   });
  }

  function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

 function renderCourseList(){
  renderChat();
      $('#courselist').empty();
      $('#pendingUsers').empty();
      $('#verifiedtutors').empty();
      db.collection("courses")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                $('<li>').text(doc.data().name + ' ('+doc.id+')').appendTo('#courselist').click(()=>{
                  editcourse(doc.id)});
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });


      db.collection("users").where("verified", "==", false).get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              console.log(doc.id, " => ", doc.data().general.name);
              $('<li>').text(doc.data().general.name).appendTo('#pendingUsers').click(()=>{
                verifyUser(doc.id)});
          });
      });
      db.collection("users").where("verified", "==", true).get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              console.log(doc.id, " => ", doc.data().general.name);
              $('<li>').text(doc.data().general.name).appendTo('#verifiedtutors').click(()=>{
                console.log('User verified.');
              })
          });
      });
 }