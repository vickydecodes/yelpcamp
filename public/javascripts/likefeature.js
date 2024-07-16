const allCampgrounds = campgroundsForMaps;
const campgroundIds = allCampgrounds.map(camp => camp.id)
const heartButtons = document.querySelectorAll('#heartButton');
const unlikeButtons = document.querySelectorAll('#unlikeButton');
const totalLikes1 = document.querySelectorAll('.totalLikesForLikes');
const totalLikes2 = document.querySelectorAll('.totalLikesForUnlikes');
const theme = sessionStorage.getItem('theme');


console.log(heartButtons);
console.log(unlikeButtons);
console.log(totalLikes1);
console.log(totalLikes2);


if(theme == 'dark'){
    unlikeButtons.forEach(btn => {
        btn.classList.add('dark');
        btn.classList.remove('light')
    });
}else{
    heartButtons.forEach(btn => {
        btn.classList.add('light');
        btn.classList.remove('dark')
    });
}




allCampgrounds.forEach((camp, index) => {
    if (camp.likes.likedBy.some(user2 => user2 == user)) {
        unlikeButtons[index].classList.remove('d-none');
    } else {
        heartButtons[index].classList.remove('d-none')
    }
})

heartButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        console.log('clicked')
        const data = {
            user: user,
            campground: campgroundIds[index]
        }
        socket.emit('addLike', data);
        unlikeButtons[index].classList.remove('d-none')
        heartButtons[index].classList.add('d-none')
    });
})

unlikeButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        console.log('unliked');
        const data = {
            user: user,
            campground: campgroundIds[index]
        }
        socket.emit('dislike', data)
        heartButtons[index].classList.remove('d-none');
        unlikeButtons[index].classList.add('d-none')
    })
})



socket.on('likeCount', data => {
    const { id, likecount } = data;
    allCampgrounds.forEach((camp, index) => {
        if (camp.id == id) {
            totalLikes1[index].innerText = likecount;
            totalLikes2[index].innerText = likecount;
        }
    })

})
