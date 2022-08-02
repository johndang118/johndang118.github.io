let selectNganh = () =>
{
    selectedNganh = document.getElementById("selectedNganh").value;

    db.collection("students").get().then((querySnapshot) => {
        let students = [];
        querySnapshot.forEach((doc) => {
            students.push({
                id : doc.id,
                ...doc.data()
            });
        });
        readStudents(students, selectedNganh);
    });
}

let readStudents = (students, selectedNganh) => 
{
    document.getElementById('listOfStudents').innerHTML = "";
    let card = "";
    students.forEach((student) => {  

        if (`${student.nganh}, ${student.chidoan}` == selectedNganh)
        {
            let portraitBorderColor;

            switch(student.nganh)
            {
                case 'Au Nhi' : portraitBorderColor = 'green' 
                break;
                case 'Thieu Nhi' : portraitBorderColor = 'blue' 
                break;
                case 'Nghia Si' : portraitBorderColor = 'yellow' 
                break;
                case 'Hiep Si' : portraitBorderColor = 'brown' 
                break;

                default: portraitBorderColor = 'red'
            }

            const portraitFolderURL = 'https://github.com/johndang118/johndang118.github.io/blob/main/portraits/';
            card = 
            `<li id="${student.id.toString()}" class="list-unstyled col-sm-12 col-md-3 col-lg-3" style="margin:auto;">
                <div class="card col-sm-12" style="margin-left:auto;">

                    <div class="col-10 mx-auto mb-4" style="height:210px;">
                        <picture class="col-12 mx-auto" style="">           
                            <img id="${student.id}IMG" class="card-img-top" alt="picture of ${student.firstName}" style="height:100%;margin-left: auto; margin-top:10px;  overflow:hidden; border-width: 4px; border-style: solid; border-radius:50%; border-color: ${portraitBorderColor};">
                        </picture> 
                    </div>
                    <div class="input-group mt-0">
                        <input type="file" class="form-control" id="${student.id}Upload" name="${student.id}" accept="image/*">
                        <button type="button" class="input-group-text" id="uploadImgBtn" onclick="uploadBtnClicked('${student.id.toString()}')">Upload</button>
                    </div>
                    <div id="${student.id}uploadingInProgress" class="mt-1 mb-0" hidden>
                        <div class="alert alert-info">Uploading...</div>
                    </div>
                    <div class="card-body mt-0">
                        <h3 class="card-title">${student.firstName} ${student.lastName}</h3>
                        <h4 class="card-text">Id: ${student.id}</h4>
                        <p class="card-text">Nganh: <span style="float:right;">${student.nganh}, ${student.chidoan}</span></p>
                        
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Guardian: <span style="float:right;">${student.fatherName}</span></li>
                        <li class="list-group-item">Email: <span style="float:right;">${student.fatherEmail}</span></li>
                        <li class="list-group-item">Phone: <span style="float:right;">${student.fatherPhone}</span></li>
                        <li class="list-group-item">Notes: <span style="float:right;">${student.notes}</span></li>
                        <li class="list-group-item">Birthdate: <span style="float:right;">${student.dateOfBirth}</span></li>
                        <li class="list-group-item">Total Absences: <span style="float:right;">${student.absences}</span></li>
                    </ul>
                    <div class="card-body">
                        <button class="btn btn-primary col-5 ms-auto px-0" onclick="presentBtnClick('${student.id.toString()}')">Present</button>
                        <button class="btn btn-secondary col-5 ms-4 px-0" onclick="absentBtnClick('${student.id.toString()}', '${student.absences}')">Absent</button>
                    </div>
                </div><br>
            </li>`
            
            document.getElementById('listOfStudents').innerHTML += card;
            
            setTimeout(function(){
                getPortrait(student.id);
            }, 1000);
           
            
        }
    })

}

let returnCurrentDateString = () =>
{
    //const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date();
    //let day = date.getDay();
    //let dayOfWeek = daysOfWeek[day];

    //return `${dayOfWeek}, ${date.toDateString()}`;

    return date.toDateString();
}

let presentBtnClick = (studentId) =>
{
    var studentRef = db.collection("students").doc(studentId).collection("Attendance").doc(returnCurrentDateString());

    return studentRef.set({
        present: true
    }, {merge : true})
    .then(() => {
        console.log("Document successfully updated!");
        let studentCard = document.getElementById(studentId);
        studentCard.setAttribute('hidden', '');

    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

let absentBtnClick = (studentId, absences) =>
{
    let parseAbsences = parseInt(absences);

    var studentRef = db.collection("students").doc(studentId).collection("Attendance").doc(returnCurrentDateString());

    let studentDocRef = db.collection("students");

    studentDocRef.doc(studentId).set({
       absences : parseAbsences + 1 
    }, {merge : true})
    .then((docRef) => {

        console.log("Absence successfully Incremented! ", docRef);

    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    return studentRef.set({
        present: false
    }, {merge : true})
    .then(() => {

        console.log("Absence successfully Logged!");
        let studentCard = document.getElementById(studentId);
        studentCard.setAttribute('hidden', '');

    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}


let uploadBtnClicked = (studentid) =>
{
    let fileInput = document.getElementById(`${studentid}Upload`);
    let selectedFile = fileInput.files[0];
    console.log(selectedFile)
    
    if (selectedFile != undefined)
    {
        document.getElementById(`${studentid}uploadingInProgress`).removeAttribute("hidden");
        setTimeout(handleUpload(selectedFile, fileInput.name), 10);
        
    }
    else
    {
        console.log("no file chosen");
        alert("No File Chosen");
    }
    
}

//handle uploads
let handleUpload = (selectedFile, studentid) =>
{
    let storageRef = storage.ref();

    let studentPortraitsFolderRef = storageRef.child(`portraits/${studentid}.jpg`);

    studentPortraitsFolderRef.put(selectedFile).then((snapshot) => {
        console.log('Uploading Image: ', studentid);
        setTimeout(function(){
            getPortrait(studentid);
        }, 100);

        alert("Successfully uploaded");     
        //document.getElementById("uploadImg").value = "";
        document.getElementById(`${studentid}uploadingInProgress`).setAttribute('hidden', 'hidden'); 
    });    
    
    
}

let getPortrait = (studentid) =>
{

    let storageRef = storage.ref();

    let studentPortraitRef = storageRef.child(`portraits/${studentid}.jpg`);

    studentPortraitRef.getDownloadURL()
    .then((url) => {
        console.log("image found for: ", studentid);
        console.log(url.toString());
        document.getElementById(`${studentid}IMG`).setAttribute("src", url.toString());              

    })
    .catch((error) => {
        
        switch (error.code) {
            case 'storage/object-not-found':
                console.log("no image found");
                document.getElementById(`${studentid}IMG`).setAttribute("src", 'https://firebasestorage.googleapis.com/v0/b/tntthdfroster.appspot.com/o/portraits%2Fplaceholderimg.jpg?alt=media&token=13c39dc3-ab16-4881-aeb5-89fbf673b14a'); 
                break;
            case 'storage/unauthorized':

              break;
            case 'storage/canceled':

              break;

            case 'storage/unknown':

              break;
          }

          
    });


    //return (imgUrl != '') ? imgUrl : 'https://firebasestorage.googleapis.com/v0/b/tntthdfroster.appspot.com/o/portraits%2Fplaceholderimg.jpg?alt=media&token=13c39dc3-ab16-4881-aeb5-89fbf673b14a';
}