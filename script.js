let currentUser = null;

var rows = 0;
var cols = 0;


function createUserObject(name, surname, email, phone, age) {
    currentUser = {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        age: age,
        role: "admin",
        selectedSeats: [],
        totalAmount: 0
    };
}


function setUpSeating(rows, columns) {
    const cinemaSeats = document.getElementById('cinemaSeats');
    cinemaSeats.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        const rowLabel = getRowLabel(i);

        for (let j = 1; j <= columns; j++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.textContent = `${rowLabel}${j}`;
            seat.dataset.row = rowLabel;
            seat.dataset.column = j;
            seat.addEventListener('click', function() {
                if (!seat.classList.contains('reserved')) {
                    if (!seat.classList.contains('selected')) {
                        selectSeat(seat);
                    } else {
                        cancelSeatReservation(seat);
                    }
                    displayReservationDetails();
                }
            });
            row.appendChild(seat);
        }

        cinemaSeats.appendChild(row);
    }
}

function getRowLabel(index) {
    let label = '';
    while (index >= 0) {
        label = String.fromCharCode(index % 26 + 65) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label;
}






function calculateSeatPrice(age) {
    if (age < 18) {
        return 10;
    } else if (age < 26) {
        return 15;
    } else if (age < 65) {
        return 25;
    } else {
        return 10;
    }
}


function calculateTotalPrice(age) {
    let totalPrice = 0;
    currentUser.selectedSeats.forEach(seat => {
        const [row, column] = seat.split('-');
        const seatAge = calculateSeatPrice(age);
        totalPrice += seatAge;
    });
    return totalPrice;
}


function selectSeat(seat) {
    currentUser.selectedSeats.push(`${seat.dataset.row}${seat.dataset.column}`);
    currentUser.totalAmount += calculateSeatPrice(currentUser.age);
    seat.classList.add('selected');
    displayReservationDetails();
}


function cancelSeatReservation(seat) {
    currentUser.selectedSeats = currentUser.selectedSeats.filter(s => s !== `${seat.dataset.row}-${seat.dataset.column}`);
    currentUser.totalAmount -= calculateSeatPrice(currentUser.age);
    seat.classList.remove('selected');
    displayReservationDetails();
}



function displayReservationDetails() {
    const reservationDetails = document.getElementById('reservationDetails');
    const totalPrice = calculateTotalPrice(currentUser.age);
    reservationDetails.innerHTML = `
        <div class="reDetails"><p>Name: ${currentUser.name}</p>
        <p>Surname: ${currentUser.surname}</p>
        <p>Selected Seats: ${currentUser.selectedSeats.join(', ')}</p>
        <p>Total Price: $${totalPrice}</p>
        <button onclick="confirmReservation()">Confirm</button></div>
    `;
}


function confirmReservation() {
    alert(`Reservation confirmed! \nDetails: \nName: ${currentUser.name} \nSurname: ${currentUser.surname} \nSelected Seats: ${currentUser.selectedSeats.join(', ')} \nTotal Price: $${currentUser.totalAmount}`);
}

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;



    document.getElementById('adminInterface').style.display = 'block';

    createUserObject(name, surname, email, phone, age);
    setUpSeating(rows, cols);
    displayReservationDetails();
});

document.getElementById('adminForm').addEventListener('submit', function(event) {
    event.preventDefault();
    rows = document.getElementById('rows').value;
    cols = document.getElementById('cols').value;

    document.getElementById('adminInterface').style.display = 'block';


    setUpSeating(rows, cols);
    displayReservationDetails();
})
