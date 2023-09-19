import { getDatabase, ref, set, child, update, remove, push, get } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";

const firebaseConfig = {
    // firebase configuration here

};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase();
const dbRef = ref(getDatabase());

_getExistingRecord();

const dialog = document.getElementById('dialog-container');
const itemList = document.getElementById('item-list');
const addForm = document.getElementById('addForm');
let descriptionInput = document.getElementById('description');
let startTimeInput = document.getElementById('startTime');
let endTimeInput = document.getElementById('endTime');
let taskTypeInputs = document.getElementsByName('taskType');


let list = [];
let editMode = false;
let editIndex = null;
let selectedKey = ''
document.addEventListener('submit', handleSubmit);
document.getElementById('cancel').addEventListener('click', handleCancel);

function handleSubmit(event) {
    event.preventDefault();
    const desc = descriptionInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const type = Array.from(taskTypeInputs).find((input) => input.checked)?.value || '';

    const obj = { desc: desc, startTime: startTime, endTime: endTime, type: type };
    if (editMode) {
        update(ref(db, `posts/task/${selectedKey}`), obj).then(() => {
            alert('Data Updated successfully')
            generateList();
            _getExistingRecord();
        }).catch(err => {
            alert(err)
        })
    } else {
        push(ref(db, 'posts/task'), obj).then(() => {
            alert('Data saved successfully')
            generateList();
            _getExistingRecord()
        }).catch(err => {
            alert(err)
        })

    }
    dialog.style.display = 'none';
    backgroundContent.classList.remove('blur');
    addForm.reset();
}

function handleCancel() {
    dialog.style.display = 'none';
    backgroundContent.classList.remove('blur');
    addForm.reset();
}


function generateList() {
    itemList.innerHTML = '';
    Object.values(list).forEach((data, i) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <div class='flex'>
            <div>
              <strong>Description:</strong> ${data.desc}<br>
              <strong>For:</strong> ${data.type} &nbsp;
              <strong>Start Time:</strong> ${data.startTime} &nbsp;
              <strong>End Time:</strong> ${data.endTime}
            </div>
            <div>
              <button class='edit' id='submit' >Edit</button>
              <button class='remove' id='cancel'>Remove</button>
            </div>
          </div>
        `;
        itemList.appendChild(listItem);
    });
    const removeButtons = document.querySelectorAll('.remove');
    const editButtons = document.querySelectorAll('.edit');
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {

            const key = Object.keys(list)
            removeData(key[index]);
        });
    });
    editButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const values = Object.values(list)
            const Key = Object.keys(list)
            editData(values[index], Key[index]);
        });
    });
}


function _getExistingRecord() {
    get(child(dbRef, 'posts/task')).then((snapShot) => {
        if (snapShot.exists()) {
            list = snapShot.val()
            Object.values(list).map(data => {
                let datetime = new Date(data.startTime);
                data.startTime = `${datetime.getFullYear()}-${padZero(datetime.getMonth() + 1)}-${padZero(datetime.getDate())} ${padZero(datetime.getHours())}:${padZero(datetime.getMinutes())} ${getAMPM(datetime)}`;
                datetime = new Date(data.endTime);
                data.endTime = `${datetime.getFullYear()}-${padZero(datetime.getMonth() + 1)}-${padZero(datetime.getDate())} ${padZero(datetime.getHours())}:${padZero(datetime.getMinutes())} ${getAMPM(datetime)}`;

            })
            generateList();
        } else {
            console.log('No Data available')
        }

    }).catch(err => {
        alert(err)
    })
}



function padZero(number) {
    return number.toString().padStart(2, '0');
}

function getAMPM(datetime) {
    const hours = datetime.getHours();
    return hours >= 12 ? 'PM' : 'AM';
}
function removeData(index) {

    remove(ref(db, `posts/task/${index}`)).then(() => {
        alert('Data removed successfully')
        _getExistingRecord();
        generateList();

    }).catch((err) => {
        console.log(err)
    })

}
function editData(data, key) {
    selectedKey = key;
    dialog.style.display = 'block';
    descriptionInput.value = data.desc;
    startTimeInput.value = convertToISOFormat(data.startTime);
    endTimeInput.value = convertToISOFormat(data.endTime);

    for (let i = 0; i < taskTypeInputs.length; i++) {
        if (taskTypeInputs[i].value === data.type) {
            taskTypeInputs[i].checked = true;
        }
    }
    editMode = true;
}
function convertToISOFormat(dateTimeString) {

    const [datePart, timePart] = dateTimeString.split(' ');

    const [time, ampm] = timePart.split(' ');

    const [hours, minutes] = time.split(':');

    const militaryHours = (ampm === 'PM' ? parseInt(hours) + 12 : parseInt(hours)).toString();

    const isoDateTime = `${datePart}T${militaryHours}:${minutes}`;
    return isoDateTime;
}



