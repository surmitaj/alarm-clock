const setAlarmBtn=document.getElementById("setAlarm")
const cancelAlarmBtn = document.getElementById("cancelAlarm");
const stopAlarmBtn = document.getElementById("stopAlarm");
const timeFormatSelect = document.getElementById("timeFormat");
const amPmContainer = document.querySelector(".time-inputs #amPm");
const timeLeftDiv = document.getElementById("timeLeft");

//audio when alarm rings
var audio = new Audio('./AlarmTone.mp3');

var alarmTimeout;

//flag to check if alarm is set
let isAlarmSet = false;

//default format selected to 24-hours
timeFormatSelect.value = '24';
toggleAmPmOptions();


//event listners for buttons and dropdowns
setAlarmBtn.addEventListener('click', setAlarm)
cancelAlarmBtn.addEventListener('click', cancelAlarm);
stopAlarmBtn.addEventListener('click', stopAlarm);
timeFormatSelect.addEventListener('change', toggleAmPmOptions);

function setAlarm(e) {
    e.preventDefault()

    var hours = document.getElementById("timeInHours").value;
    var minutes = document.getElementById("timeInMinutes").value;
    var timeFormat = timeFormatSelect.value;

    //validation for empty input boxes for hour and minute
    if (hours == '' || minutes == ''){
        alert('Please enter time...')
        return
    }

    //parse the values entered to base 10
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if ((timeFormat === '24' && (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60)) ||
        (timeFormat === '12' && ((hours < 1 || hours > 12) || (minutes < 0 || minutes >= 60)))) {
        alert('Invalid time values. Please enter valid values.');
        return;
    }

    if (timeFormat === '12') {
        var amPm = document.getElementById("amPm").value;
        if ((amPm === 'AM' && (hours < 1 || hours > 12)) || (amPm === 'PM' && (hours < 1 || hours > 12))) {
            alert('Invalid time values. Please enter valid values.');
            return;
        }

        hours = convertTo24HourFormat(hours, amPm);
    }

    //find the alarm time
    var alarmTime = new Date()
    alarmTime.setHours(parseInt(hours, 10))
    alarmTime.setMinutes(parseInt(minutes, 10))
    alarmTime.setSeconds(0)

    //get the current time
    var currentTime = new Date();

    //check if alarm time is in future or past
    if (alarmTime <= currentTime) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    //time difference
    var timeDiff = alarmTime - currentTime;

    //show the time after which alarm will ring
    timeLeftDiv.textContent = `Alarm will ring in ${formatTimeDifference(timeDiff)}.`;

    //disable input boxes and dropdowns when alarm is set
    document.getElementById("timeInHours").disabled = true;
    document.getElementById("timeInMinutes").disabled = true;
    if(timeFormat === '12'){
        document.getElementById("amPm").disabled=true
    }

    //Check if alarm is set
    if (!isAlarmSet) {
        
        setAlarmBtn.style.display = 'none';
        cancelAlarmBtn.style.display = 'inline-block';

        // Start the timer
        alarmTimeout = setTimeout(function () {
            //play the audio for alarm
            audio.play();
            timeLeftDiv.textContent = "Alarm is ringing now!";

            // Reset the alarm status
            isAlarmSet = false;

            // Hide cancel and set alarm button and show stop alarm button
            setAlarmBtn.style.display = 'none';
            cancelAlarmBtn.style.display = 'none';
            stopAlarmBtn.style.display = 'inline-block';

        }, timeDiff);

        // Update the alarm status
        isAlarmSet = true;
    }    
}

function stopAlarm() {
    audio.pause();
    audio.currentTime = 0;
    clearTimeout(alarmTimeout);
    timeLeftDiv.textContent = "Alarm stopped.";

    // Reset the alarm status
    isAlarmSet = false;

    //enable the input fields and dropdowns
    document.getElementById("timeInHours").disabled = false;
    document.getElementById("timeInMinutes").disabled = false;
    if(timeFormatSelect.value === '12'){
        document.getElementById("amPm").disabled=false
    }

    //empty the input fields
    document.getElementById("timeInHours").value = "";
    document.getElementById("timeInMinutes").value = "";

    // Hide cancel and stop alarm button and show set alarm button
    setAlarmBtn.style.display = 'inline-block';
    cancelAlarmBtn.style.display = 'none';
    stopAlarmBtn.style.display = 'none';
}

function cancelAlarm() {
    audio.pause();
    audio.currentTime = 0;

    //clear timer
    clearTimeout(alarmTimeout);
    timeLeftDiv.textContent = "Alarm canceled.";

    // Reset the alarm status
    isAlarmSet = false;

    //enable the input fields and dropdowns
    document.getElementById("timeInHours").disabled = false;
    document.getElementById("timeInMinutes").disabled = false;
    if(timeFormatSelect.value === '12'){
        document.getElementById("amPm").disabled=false;
    }

    //empty the input fields
    document.getElementById("timeInHours").value = "";
    document.getElementById("timeInMinutes").value = "";

    // Hide cancel and stop alarm button and show set alarm button
    setAlarmBtn.style.display = 'inline-block';
    cancelAlarmBtn.style.display = 'none';
    stopAlarmBtn.style.display = 'none';
}

//find the time difference between alarm and current time
function formatTimeDifference(timeDiff) {
    var hours = Math.floor(timeDiff / (1000 * 60 * 60));
    var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

//display the dropdown only for 12-hour format
function toggleAmPmOptions() {
    const selectedFormat = timeFormatSelect.value;
    amPmContainer.style.display = (selectedFormat === '12') ? 'block' : 'none';
}

//if 12-hour format is selected, then find the correct hour value 
function convertTo24HourFormat(hours, amPm) {
    if (amPm === 'PM' && hours < 12) {
        hours = parseInt(hours, 10) + 12;
    } else if (amPm === 'AM' && hours === 12) {
        hours = 0;
    }
    return hours;
}
