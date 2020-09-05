
 function addcourse() {
    var p = $('<div>').addClass('popup');
    var data;
    p.appendTo('#main');
    p.html("<p>Course Name<p><input id='name'><p>ID<p><input id='id'><p>Description<p><textarea id='desc'></textarea><p>Grade Level<p><input id='grade'><p>Image Link</p><input id='image'><p>G-Drive Link</p><input id='drive'>")
    addcoursebtn();
}

function editcourse(id){
    var p = $('<div>').addClass('popup');
    p.appendTo('#main');
    p.html("<p>Course Name<p><input id='name'><p>ID<p><input id='id'><p>Description<p><textarea id='desc'></textarea><p>Grade Level<p><input id='grade'><p>Image Link</p><input id='image'><p>G-Drive Link</p><input id='drive'>");
    db.collection('courses').doc(id).get().then((doc)=>{
        $('#name').val(doc.data().name);
        $('#id').val(doc.id);
        $('#desc').val(doc.data().desc);
        $('#grade').val(doc.data().grade);
        $('#image').val(doc.data().image);
        $('#drive').val(doc.data().drive);
    });
    $('<button>').text('Delete').appendTo('.popup').click(()=>{
        db.collection("courses").doc(id).delete().then(function() {
            renderCourseList();
            $('.popup').remove();
        })
    })
    addcoursebtn();
};


function addcoursebtn(id){
    $('<button>').text("submit").appendTo('.popup').click(()=>{
        data = {
            name: $('#name').val(),
            desc: $('#desc').val(),
            grade: $('#grade').val(),
            image: $('#image').val(),
            drive: $('#drive').val(),
        }
        console.log(data);
        var id = $('#id').val();
        console.log(id);
        db.collection('courses').doc(id).set(data).then(function() {
            console.log("Document successfully written!");
            renderCourseList();
            $('.popup').remove();
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    })
}


function verifyUser(id){
    db.collection('users').doc(id).get().then((snap)=>{
        var p = $('<div>').addClass('popup').attr('id','userinfo');
        p.appendTo('#main');
        displayVerification(snap.id, snap.data(), p);
    }
    );
}

function displayVerification(id, data, con) {
    $("<button>").text("Cancel").appendTo(con).click(()=>{con.remove()});
    $("<button>").text("Verify").appendTo(con).click(()=>{verify(id, con)});
    $("<button>").text("Delete").appendTo(con).click(()=>{
        db.collection("users").doc(id).delete().then(function() {
            alert("Document successfully deleted!");
            renderCourseList();
        }).catch(function(error) {
            alert("Error removing document: ", error);
        });
    });
    var flex = $('<div>').css('display','flex').appendTo(con);
    var con1 = $('<div>').appendTo(flex);
    var con2 = $('<div>').appendTo(flex).css({'width':'700px','margin-left':'100px'});
    make("2",con1,data.general.name);
    make("p",con1,"Email: "+data.general.email);
    make("p",con1,"ID: "+data.general.id);
    $('<img>').attr('src',data.picture).addClass('tutorpic').appendTo(con1);
    make("p",con2,"Grade: "+data.grade);
    make("p",con2,"School: "+data.school);
    make("p",con2,"Profile: "+data.profile);
}

function verify(id, con){
    db.collection('users').doc(id).update({
        verified: true
    }).then(()=>{
        con.remove;
        alert('Successfully verified user '+ id);
        renderCourseList();
    })
}


function make(el,con,text){
    "2"==el&&$("<h2>").appendTo(con).text(text),"3"==el&&$("<h3>").appendTo(con).text(text),"p"==el?$("<p>").appendTo(con).text(text):$(el).appendTo(con).text(text);
}