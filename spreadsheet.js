db.collection("students").get().then((querySnapshot) => {
    let students = [];
    querySnapshot.forEach((doc) => {
        students.push({
            id : doc.id,
            ...doc.data()
        });
    });
    displayStudents(students);
});

let displayStudents = (students) =>
{

document.getElementById('studenttable').innerHTML = "";
let studentdata = "";
students.forEach((student) => {  

    studentdata = 
    `<tr id="${student.id}Data">
        <td>${student.firstName}</td>`;

    db.collection("students").doc(student.id).collection("Attendance").get().then((querySnapshot) => {
        let attendanceDates = [];
        querySnapshot.forEach((attendanceDate) => {
            attendanceDates.push({
                id: attendanceDate.id,
                ...attendanceDate.data()
            });    
        });


        //Need to add code here to get array of Sunday Dates. Create a loop to test sortedAttendanceDates against sunday dates and display if true

        let sortedAttendanceDates = attendanceDates.sort((a, b) => new Date(b.id) < new Date(a.id) ? 1: -1);

        sortedAttendanceDates.forEach((date) => {
            document.getElementById(`${student.id}Data`).innerHTML += `<td>${new Date(date.id).toLocaleDateString()}<br> ${date.present ? "Present" : "Absent"}</td>`;
        });
    });

    

    studentdata += '</tr>';

    document.getElementById('studenttable').innerHTML += studentdata;
    
});

}