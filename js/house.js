var app = new Vue({
    el: '#app',
    data: {
        congressmen: [],
        states: [],
        congComplete: [],
        checkedNames: ["R", "D", "I"],
        statesNavbar: [],
        selected: "All",
    },
});

app.statesNavbar = data.sort(function(a, b) { if (a.name > b.name) { return 1 } else return -1 });


var myHeaders = new Headers();
myHeaders.append("X-API-Key", "KcdM6Mh6P913os9PHtO91NkGmlPopyQCwHdumxUd");

$(function() {
    fetch("https://api.propublica.org/congress/v1/115/house/members.json", {
        method: "GET",
        headers: myHeaders,
    }).then(function(response) {
        return response.json();
    }).then(function(myJson) {
        app.congressmen = myJson.results[0].members;
        app.congComplete = myJson.results[0].members;
        app.states = sortStates(myJson.results[0].members.map(elm => elm.state).sort());
    });
});


function sortStates(Array) {
    var newList = [];
    for (i = 0; i < Array.length; i++)
        if (newList.indexOf(Array[i]) == -1)
            newList.push(Array[i]);
    return newList
};