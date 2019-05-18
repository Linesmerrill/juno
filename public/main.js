// var update = document.getElementById('update')
// var del = document.getElementById('delete')

// update.addEventListener('click', function () {
//   fetch('person', {
//     method: 'put',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       'firstName': 'Darth Vader',
//       'lastName': 'I find your lack of faith disturbing.',
//       'birthday': '12-10-1991'
//     })
//   })
//   .then(res => {
//     if (res.ok) return res.json()
//   })
//   .then(data => {
//     console.log(data)
//   })
// })

// del.addEventListener('click', function () {
//   console.log(del.firstName)
//   console.log("FIRST *********************************")
//   console.log("del.getAttributeNames: ", del.getAttribute("name"))
//   fetch('person', {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       'ID': del.getAttribute("name")
//     })
//   })
//   .then(res => {
//     if (res.ok) return res.json()
//   }).
//   then(data => {
//     console.log(data)
//     window.location.reload(false)
//   })
// })


