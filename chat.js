



function renderChat() {
    db.collection("users")
    .get()
    .then(function(doc) {
        doc.forEach(el => {
            $('<div>').text(el.data().general.name).appendTo('#userlist').click(()=>{chat(el.id)});
        });
        
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}   


function chat(id){
    console.log('chatting with '+ id)
    var uid = firebase.auth().currentUser.uid;
    var piclink;
    db.collection('users').doc(uid).get().then(doc=>{
        if (doc.data().picture != undefined){
            piclink = doc.data().picture
        } else {
            piclink = doc.data().general.photo
        }
    });
    db.collection("users/"+id+"/chat")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                if (change.doc.data().user == uid){
                    var msg = $('<div>').addClass('user-message').prependTo('#message-con');
                    var ts = change.doc.data().time;
                    var date = ts.toDate().toDateString();
                    var today = new Date().toDateString();
                    if (date==today){
                        $('<time>').appendTo(msg).text(ts.toDate().toLocaleTimeString([], {timeStyle: 'short'}));
                    } else {
                        $('<time>').appendTo(msg).text(ts.toDate().toLocaleString('en-En',{month: "short", day: "numeric"}));
                    }
                    $('<p>').appendTo(msg).text(change.doc.data().val);
                    $('<img>').appendTo(msg).attr('src', piclink);
                }
                else {
                    var msg = $('<div>').addClass('other-message').prependTo('#message-con');
                    var ts = change.doc.data().time;
                    var date = ts.toDate().toDateString();
                    var today = new Date().toDateString();
                    $('<img>').appendTo(msg).attr('src', piclink);
                    $('<p>').appendTo(msg).text(change.doc.data().val);
                    if (date==today){
                        $('<time>').appendTo(msg).text(ts.toDate().toLocaleTimeString([], {timeStyle: 'short'}));
                    } else {
                        $('<time>').appendTo(msg).text(ts.toDate().toLocaleString('en-En',{month: "short", day: "numeric"}));
                    }
                    
                }

                $('#message-con').scrollTop($('#message-con')[0].scrollHeight);
 
            }
            /*if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }*/
        });
    });
}