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
let listheader = "<tr><th>Name</th><th>Birthdate</th><th>Nganh</th><th>Cap</th>";

let sundayDates = getSundays();
sundayDates.forEach((sunday) => {
   listheader += `<th>${sunday.toLocaleDateString()}</th>` 
});

listheader += '</tr>';
document.getElementById("studenttableheader").innerHTML = listheader;

students.forEach((student) => {  

    studentdata = 
    `<tr id="${student.id}Data">
        <td>${student.firstName} ${student.lastName}</td>
        <td>${student.dateOfBirth}</td>
        <td>${student.nganh}</td>
        <td>${student.chidoan}</td>`;

    db.collection("students").doc(student.id).collection("Attendance").get().then((querySnapshot) => {
        let attendanceDates = [];
        querySnapshot.forEach((attendanceDate) => {
            attendanceDates.push({
                studentid: student.id,
                date: attendanceDate.id,
                ...attendanceDate.data()
            });    
        });

        //let sortedAttendanceDates = attendanceDates.sort((a, b) => new Date(b.id) < new Date(a.id) ? 1: -1);
        let sortedAttendanceDates = attendanceDates.sort((a, b) => new Date(b.date) < new Date(a.date) ? 1: -1);
        let sundayDates = getSundays();
        sundayDates.forEach((sunday) => {
            console.log( sortedAttendanceDates);
            let addEmptyCell = true
            sortedAttendanceDates.forEach((date) => {
                if(new Date(date.date).toLocaleDateString() == new Date(sunday).toLocaleDateString()){
                    document.getElementById(`${student.id}Data`).innerHTML += `<td name="${student.id}">${date.present ? "Present" : "Absent"}</td>`;
                    console.log('Added: ' + date.studentid + ' ' + new Date(date.date).toLocaleDateString() + ' || Sunday: ' + new Date(sunday).toLocaleDateString());
                    addEmptyCell = false
                }
            });
           
            if(addEmptyCell)
            {
                document.getElementById(`${student.id}Data`).innerHTML += `<td name="${student.id}"></td>`;
            }
           // document.getElementById(`${student.id}Data`).innerHTML += `<td name="${student.id}">X</td>`;
        });

        
        
    });

    studentdata += '</tr>';

    console.log(studentdata);
    document.getElementById('studenttablebody').innerHTML += studentdata;
    reloadCss();
});

}

let getSundays = () =>
{       
    let sundays = []
    
    let currentYear = 2022; //change this line to current year every year
    let startDate = new Date(currentYear, 8, 25);
    let endDate = new Date(currentYear+1, 6, 1);
    
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

var links = document.getElementsByTagName("link");

function reloadCss()
{
    var links = document.getElementsByTagName("link");
    for (var cl in links)
    {
        var link = links[cl];
        if (link.rel === "stylesheet")
            link.href += "";
    }
}