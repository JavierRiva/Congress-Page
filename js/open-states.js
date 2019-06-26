var app = new Vue({
    el: '#app',
    data: {
        legislators: [],
        states: [],
        statesNavbar: [],
        checkedNames: ["Republican", "Democratic", "Independent"],
        selected: "All",
    },
});

app.selected = getParameterByName('state');

cachedFetch("https://openstates.org/api/v1/metadata/?apikey=225db207-b4ea-4cfe-a924-069bc1018a28").then(resp => resp.json()).then(function(myJson) { getLegislatorsInfo(myJson) });

function cachedFetch(url, cacheKey = url) {
    let cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) {
        return Promise.resolve(new Response(new Blob([cached])));
    }
    return fetch(url).then(response => {
        if (response.status === 200) {
            response.clone().text().then(content => {
                sessionStorage.setItem(cacheKey, content);
            })
        }
        return response;
    })
};


function getLegislatorsInfo(array) {
    app.legislators = getChamberTitle(addField(members.filter(function(elm) { return elm.active == true })), array);
    app.states = sortStates(array.map(elm => elm.id).sort());
    app.statesNavbar = array.sort(function(a, b) { if (a.name > b.name) { return 1 } else return -1 });
};


function getChamberTitle(member, data) {
    for (i = 0; i < member.length; i++)
        for (a = 0; a < data.length; a++)
            if (member.map(elm => elm.state)[i] == data.map(elm => elm.id)[a])
                if (member.map(elm => elm.chamber)[i] == "upper") {
                    member[i].chamberTitle = data.map(elm => elm.chambers)[a].upper.title;
                } else if (member.map(elm => elm.chamber)[i] == "lower") {
        member[i].chamberTitle = data.map(elm => elm.chambers)[a].lower.title;
    } else { member[i].chamberTitle = "Undefined" };
    return member;
}


function addField(member) {
    member.map(elm => elm.chamberTitle = "");
    return member;
}


function sortStates(Array) {
    var newList = [];
    for (i = 0; i < Array.length; i++)
        if (newList.indexOf(Array[i]) == -1)
            newList.push(Array[i]);
    return newList
};


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};