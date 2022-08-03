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

//display date headers
let studentdata = "";

let sundayDates = getSundays();
sundayDates.forEach((sunday) => {
    document.getElementById("studenttableheader").innerHTML += `<th>${sunday.toLocaleDateString()}</th>`;
});

students.forEach((student) => {  

    studentdata = 
    `<tr id="${student.id}Data">
        <td>${student.firstName} ${student.lastName}</td>
        <td>${student.dateOfBirth}`;

    db.collection("students").doc(student.id).collection("Attendance").get().then((querySnapshot) => {
        let attendanceDates = [];
        querySnapshot.forEach((attendanceDate) => {
            attendanceDates.push({
                id: attendanceDate.id,
                ...attendanceDate.data()
            });    
        });

        let sortedAttendanceDates = attendanceDates.sort((a, b) => new Date(b.id) < new Date(a.id) ? 1: -1);

        sundayDates.forEach((sunday) => {
                sortedAttendanceDates.forEach((date) => {
                console.log(new Date(date.id).toLocaleDateString());
                console.log(new Date(sunday).toLocaleDateString());
                if(new Date(date.id).toLocaleDateString() == new Date(sunday).toLocaleDateString()){
                    document.getElementById(`${student.id}Data`).innerHTML += `<td>${date.present ? "Present" : "Absent"}</td>`;
                }
            });

            
        });

        
        
    });

    studentdata += '</tr>';

    console.log(studentdata);
    document.getElementById('studenttable').innerHTML += studentdata;
    
});

}

let getSundays = () =>
{       
    let sundays = []

    let startDate = new Date(new Date().getFullYear(), 8, 1);
    let endDate = new Date(new Date().getFullYear()+1, 6, 1);
    
    while(startDate.getDay() != 0)
    {
        startDate.setDate(startDate.getDate() + 1);
        
    }

    sundays.push(new Date(startDate));

    while(startDate < endDate)
    {            
        startDate.setDate(startDate.getDate()+7);
        sundays.push(new Date(startDate));
    }



    return sundays;
 
}

