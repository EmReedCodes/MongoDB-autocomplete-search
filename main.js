$(document).ready(function () {
    $('#title').autocomplete({ //built in command
        source: async function(req, res){
            let data = await fetch(`http://localhost:8002/search?query=${req.term}`)
            .then(results => results.json())
            //now mapping the results from json to an object
            .then(results => results.map(result => {
                return {
                    label: result.title,
                    value: result.title,
                    id: result._id
                }
            }))
            res(data)
        },
        minLength: 2,
        select: function(event, ui){
            //will get db id and pass it up to the server
            console.log(ui.item.id)
            fetch(`http://localhost:8002/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    $('#cast').empty()
                    result.cast.forEach(cast =>
                        {
                            $(cast).append(`<li>${cast}</li>`)
                        })
                        //drop movie poster in as well
                        $('img').attr('src', result.poster)
                })
        }
    }) 
})