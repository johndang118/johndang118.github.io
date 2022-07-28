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
            card = 
            `<li id="${student.id.toString()}" class="list-unstyled col-sm-12 col-md-3 col-lg-3" style="margin:auto">
                <div class="card">
                    <img src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png" class="card-img-top" alt="..." style="max-height: 450px; margin-top:10px; padding-left:20px; padding-right:20px; overflow:hidden; border-radius:50%;">
                    <div class="card-body">
                        <h3 class="card-title">${student.firstName} ${student.lastName}</h3>
                        <h4 class="card-text">Student Id: ${student.id}</h4>
                        <p class="card-text">Nganh: <span style="float:right;">${student.nganh}, ${student.chidoan}</span></p>
                        
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Guardian: <span style="float:right;">${student.fatherName}</span></li>
                        <li class="list-group-item">Email: <span style="float:right;">${student.fatherEmail}</span></li>
                        <li class="list-group-item">Phone: <span style="float:right;">${student.fatherPhone}</span></li>
                        <li class="list-group-item">Notes: <span style="float:right;">${student.notes}</span></li>
                        <li class="list-group-item">Birthdate: <span style="float:right;">${student.dateOfBirth}</span></li>
                    </ul>
                    <div class="card-body">
                        <button class="btn btn-primary col-5 ms-auto px-0" onclick="presentBtnClick('${student.id.toString()}')">Present</button>
                        <button class="btn btn-secondary col-5 ms-4 px-0" onclick="absentBtnClick('${student.id.toString()}')">Absent</button>
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

let absentBtnClick = (studentId) =>
{
    var studentRef = db.collection("students").doc(studentId).collection("Attendance").doc(returnCurrentDateString());

    return studentRef.set({
        present: false
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
