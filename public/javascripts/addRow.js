const addRowbutton = document.querySelector("#addRowButton");
const table = document.querySelector("#detailsTable");
if (campground) {
    count = campground.recommendedPlaces.length + 1
} else {
    count = 4
}


addRowbutton.addEventListener('click', function () {
    const trElement = document.createElement('tr');
    const tdElement1 = document.createElement('td');
    const thElement = document.createElement('th');

    const input1 = document.createElement('input');
    input1.setAttribute('class', 'form-control');
    input1.setAttribute('type', 'text');
    input1.setAttribute('required', 'true');
    input1.setAttribute('name', 'places')



    trElement.append(thElement)
    tdElement1.append(input1);
    trElement.append(tdElement1);
    thElement.innerHTML = count;
    table.append(trElement)
    count += 1;
})