let dialog = document.getElementById('dialog')
let itemList = document.getElementById('item-list')
let list = []
let editMode = false
let editIndex;
document.addEventListener('submit', ($event) => {
    $event.preventDefault();
    if (editMode) {
        const data = list[editIndex]
        data.desc = document.getElementById('description').value;
        data.startTime = document.getElementById('startTime').value;
        data.endTime = document.getElementById('endTime').value;

        for (let i = 0; i < 3; i++) {
            if (document.getElementsByName('taskType')[i].checked) {
                data.type = document.getElementsByName('taskType')[i].value
            }
        }
        editMode = false;
        editIndex = null;
        dialog.style.display = 'none'
        generateList();

    } else {
        let desc = document.getElementById('description').value;
        let startTime = document.getElementById('startTime').value;
        let endTime = document.getElementById('endTime').value;
        let type;
        for (let i = 0; i < 3; i++) {
            if (document.getElementsByName('taskType')[i].checked) {
                type = document.getElementsByName('taskType')[i].value
            }
        }
        const obj = {
            desc: desc,
            startTime: startTime,
            endTime: endTime,
            type: type
        }

        list.push(obj)
        generateList();
    }
    dialog.style.display = 'none'
    addForm.reset();

})
document.getElementById('cancel').addEventListener('click', () => {
    dialog.style.display = 'none'
    addForm.reset()
})
dialog.style.display = 'none'
function addItem() {
    dialog.style.display = 'block'

}

function edit(i) {
    dialog.style.display = 'block'
    document.getElementById('description').value = list[i].desc;
    document.getElementById('startTime').value = list[i].startTime;
    document.getElementById('endTime').value = list[i].endTime
    for (let j = 0; j < 3; j++) {
        if (document.getElementsByName('taskType')[j].value == list[i].type) {
            document.getElementsByName('taskType')[j].checked = true
        }
    }
    editIndex = i
    editMode = true;
}
function remove(index) {
    list.splice(index, 1)
    generateList();
}
function generateList() {

    itemList.innerHTML = '';
    list.forEach((data, i) => {
        const listItem = document.createElement('li')
        listItem.innerHTML = `
        <div class='flex'>
        <div>
        <strong>Description:</strong> ${data.desc}<br>
        <strong>For:</strong> ${data.type} &nbsp;
        <strong>Start Time:</strong> ${data.startTime} &nbsp;
        <strong>End Time:</strong> ${data.endTime}
        </div>
        <div>
        <button class='edit' id='submit' onclick='edit(${i})'>Edit</button>
        <button class='remove' id='cancel' onClick='remove(${i})'>Remove</button>
        </div>
        </div>
        `
        itemList.appendChild(listItem)
    })
}