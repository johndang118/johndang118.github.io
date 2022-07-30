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
                    <picture style="margin-left:auto;text-align:center">
                        <source alt="Special Days" srcset="${portraitFolderURL}placeholderimg.jpg?raw=true">
                        <source alt="Special Days" srcset="${portraitFolderURL}placeholderimg.png?raw=true">                  
                        <img src="${portraitFolderURL}placeholderimg.jpg?raw=true" class="card-img-top mx-0=auto" alt="picture of ${student.firstName}" style="min-width:60%; max-width:60%; max-height: 500px; margin-left: auto; margin-top:10px;  overflow:hidden; border-width: 4px; border-style: solid; border-radius:50%; border-color: ${portraitBorderColor};">
                    </picture> 
                    <div class="input-group mt-2">
                        <input type="file" class="form-control" id="${student.id}Upload" name="${student.id}" accept="image/*">
                        <button type="button" class="input-group-text" id="uploadImgBtn" onclick="uploadBtnClicked('${student.id.toString()}')">Upload</button>
                    </div>
                    <div class="card-body">
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

//Check for portrait
let portraitExists = (fileName) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://github.com/johndang118/johndang118.github.io/blob/main/portraits/${fileName}?raw=true`, false);
    xhr.send();
     
    if (xhr.status != "200") {
        return false;
    } else {
        return true;
    }

}


let uploadBtnClicked = (studentid) =>
{
    let fileInput = document.getElementById(`${studentid}Upload`);
    let selectedFile = fileInput.files[0];
    console.log(selectedFile)

    if (selectedFile != undefined)
    {
        handleUpload(selectedFile, fileInput.name);
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
        console.log('Uploaded Image: ', studentid);

        document.getElementById("uploadImg").value = "";
    });
}