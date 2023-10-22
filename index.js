//Read
let readQuestion = () => {
    let questions = db.collection("Questions").doc(document.getElementById("question").getAttribute('name'));

    questions.get().then(doc => {
    if (doc.exists && !doc.data().claimed)
    {
        document.getElementById('question').innerHTML = '<h1>' + doc.data().question + '</h1>';
        console.log(doc.data().question);
    }
    else
    {
        document.getElementById('question').innerHTML = '<h1>This question has been claimed by Team ' + doc.data().claimedby + '</h1>';
    }
    })
    .catch(error => console.log("error getting doc", error));
}

//Update
let claimQuestion = () => {
    if (document.getElementById("TeamName").value.trim().length < 1)
    {
        document.getElementById('question').innerHTML = '<div class="alert alert-danger">Must Enter Team Name</div>';
        alert("Missing Team Name");
    }
    else
    {
        let questionRef = db.collection("Questions").doc(document.getElementById("question").getAttribute('name'));

        questionRef.get().then(doc => {
            if (doc.exists && !doc.data().claimed)
            {
                questionRef.update({claimed: true, claimedby: document.getElementById("TeamName").value})
                .then(() => {
                    readQuestion();
                    alert("You have successfully claimed this question!");
                })
                .catch(error => {console.error("Error Updating Data: ", error);})
            }
            else
            {
                alert("Question's already claimed");
                readQuestion();
            }
        })
        .catch(error => console.log("error getting doc", error));
    }
};

//Load Question on Page Load
window.onload = readQuestion();
