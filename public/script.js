$(document).ready(function () {

    let homeCount = localStorage.getItem('homeCounter');
    let viewCount = localStorage.getItem('viewCounter');
    let makeCount = localStorage.getItem('makeCounter');

    $("#home-btn").on("click", function (event) {
        if (homeCount === null) { homeCount = 0; } else { homeCount++; }
        localStorage.setItem("homeCounter", homeCount);
        homeCount = localStorage.getItem("homeCounter");
    });
    $('#home-counter').text(homeCount);

    $("#view-btn").on("click", function () {
        if (viewCount === null) { viewCount = 0; } else { viewCount++; }
        localStorage.setItem("viewCounter", viewCount);
        viewCount = localStorage.getItem("viewCounter")
    })
    $('#view-counter').text(viewCount);

    $("#make-btn").on("click", function () {
        if (makeCount === null) { makeCount = 1; } else { makeCount++; }
        localStorage.setItem("makeCounter", makeCount);
        makeCount = localStorage.getItem("makeCounter")
    })
    $('#make-counter').text(makeCount);

    $(document).on('click', '#submit', function (event) {

        event.preventDefault();

        if ($('#name').val() === '' || $('#phone').val() === '', $('#email').val() === '') {

            $('#confirmationModal').modal('show');
            $('#modal-message').text('Pease fill out all the fields');
            return false;
        }

        let newTable = {
            name: $('#name').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            unique_id: $('#unique-id').val()
        }

        $.post('/api/tables', newTable)
            .then(function (data) {

                $('#form').hide();

                if (data) {
                    $('#form-holder').html('<h3>Your reservation has been added</h3>');
                } else {
                    $('#form-holder').html('<h3>Your are waitlisted!</h3>');
                }
            })
    });

    $(document).on('click', '.check-off', function (event) {

        event.preventDefault();

        let thisIndex = $(this).attr('data-index');

        $.ajax({
            url: `/api/tables/${thisIndex}`,
            type: 'DELETE'
        });


        $.get('/api/waitlist', function (data) {

            if (data.length > 0) {
                $.post('api/tables', data[0]);
            }

        })
            .then(function (data) {

                if (data.length > 0) {
                    $.ajax({
                        url: '/api/waitlist/0',
                        type: 'DELETE'
                    })
                } else {
                    $('#waitlist-message').html('The waitlist is empty');
                }
            })
            .then(function () {
                displayTables();
                displayWaitlist();
            })



    });

    $(document).on('click', '.send-email', function (event) {
        event.preventDefault();
        let emailTo = $(this).attr('data-email');
        let name = $(this).attr('data-name');

        let obj = {
            to: emailTo,
            subject: 'Your table is ready',
            text: `Hello, ${name}! Your table at Dolce Vita Italian Restaurant is ready now!`
        }

        $('#confirmationModal').modal('show');

        $('#modal-message').text('Sending email... Please wait');

        $.get('/send', obj, function (data) {

            if (data === 'sent') {
                $('#modal-message')
                    .empty()
                    .html(`Email has been sent at ${emailTo}!`);
            }

        });
    })

    $(document).on('click', '.send-txt', function (event) {
        event.preventDefault();
        let phone = '+1' + $(this).attr('data-txt');
        let name = $(this).attr('data-name');

        let obj = {
            body: `Hello, ${name}! Your table at Dolce Vita Italian Restaurant is ready now!`,
            to: phone
        }

        $('#confirmationModal').modal('show');

        $('#modal-message').text('Sending text... Please wait');

        $.get('/send-txt', obj, function (data) {

            if (data === 'sent') {
                $('#modal-message')
                    .empty()
                    .html(`Txt has been sent at ${phone}!`);
            }

        });
    })

    //view tables data
    function displayTables() {
        $('#reservations').empty();
        $.get('/api/tables', function (data) {
            if (data.length > 0) {
                data.forEach((element, index) => {
                    let holderDiv = $('<div>');
                    let tableNum = $('<h4>');
                    let hr1 = $('<hr>');
                    let hr2 = $('<hr>');
                    let tableName = $('<p>');
                    let tablePhone = $('<p>');
                    let tableEmail = $('<p>');
                    let tableId = $('<p>');
                    let checkOffBtn = $('<button>');

                    holderDiv.addClass('col-md-auto');
                    tableNum.html(`Table #${index + 1}`);
                    tableName.html(`<i class="fas fa-user"></i> ${element.name}`);
                    tablePhone.html(`<i class="fas fa-phone"></i> ${element.phone}`);
                    tableEmail.html(`<i class="fas fa-at"></i> ${element.email}`);
                    tableId.html(`<i class="fas fa-hashtag"></i> ${element.unique_id}`);
                    checkOffBtn.addClass('btn btn-warning check-off');
                    checkOffBtn.attr('data-index', index);
                    checkOffBtn.attr('data-id', element.unique_id);
                    checkOffBtn.html('<i class="fas fa-chair"></i> Sit at the table');

                    holderDiv.append(tableNum);
                    holderDiv.append(hr1);
                    holderDiv.append(tableName);
                    holderDiv.append(tablePhone);
                    holderDiv.append(tableEmail);
                    holderDiv.append(tableId);
                    holderDiv.append(checkOffBtn);
                    holderDiv.append(hr2);
                    $('#reservations').append(holderDiv);

                });

            } else {
                console.log('no data!');
                $("#reservations").html('<h2 class="text-center">We don\'t have any reservations at the moment</h2>');
            }
        });
    }

    //view wait list data
    function displayWaitlist() {
        $('#waitlist').empty();
        $.get('/api/waitlist', function (data) {
            if (data) {
                data.forEach((element, index) => {
                    let holderDiv = $('<div>');
                    let tableNum = $('<h4>');
                    let hr1 = $('<hr>');
                    let hr2 = $('<hr>');
                    let tableName = $('<p>');
                    let tablePhone = $('<p>');
                    let tableEmail = $('<p>');
                    let tableId = $('<p>');
                    let mailBtn = $('<button>');
                    let txtBtn = $('<button>');

                    holderDiv.addClass('col-md-auto');
                    tableNum.html(`Table #${index + 1}`);
                    tableName.html(`<i class="fas fa-user"></i> ${element.name}`);
                    tablePhone.html(`<i class="fas fa-phone"></i> ${element.phone}`);
                    tableEmail.html(`<i class="fas fa-at"></i> ${element.email}`);
                    tableId.html(`<i class="fas fa-hashtag"></i> ${element.unique_id}`);
                    mailBtn.addClass('btn btn-warning send-email');
                    mailBtn.attr('data-email', element.email);
                    mailBtn.attr('data-name', element.name);
                    mailBtn.html('<i class="fas fa-envelope"></i> Send email');
                    txtBtn.addClass('btn btn-danger send-txt m-2');
                    txtBtn.attr('data-txt', element.phone);
                    txtBtn.attr('data-name', element.name);
                    txtBtn.html('<i class="fas fa-sms"></i> Send text');

                    holderDiv.append(tableNum);
                    holderDiv.append(hr1);
                    holderDiv.append(tableName);
                    holderDiv.append(tablePhone);
                    holderDiv.append(tableEmail);
                    holderDiv.append(tableId);
                    holderDiv.append(mailBtn);
                    holderDiv.append(txtBtn);
                    holderDiv.append(hr2);
                    $('#waitlist').append(holderDiv);

                });

            } else {
                console.log('no data!');
                $('#reservations').html('<h2 class="text-center">We don\'t have any reservations at the moment</h2>');
            }
        });
    }


    displayTables();
    displayWaitlist();




})