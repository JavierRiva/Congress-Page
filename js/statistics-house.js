var app = new Vue({
    el: '#app',
    data: {
        numberRep: "",
        numberDem: "",
        numberInd: "",
        numberTotal: "",
        averageVotingDem: "",
        averageVotingRep: "",
        averageVotingInd: "",
        averageVotingTotal: "",
        leastEngaged: [],
        mostEngaged: [],
        leastLoyal: [],
        mostLoyal: [],
        statesNavbar: [],
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
        getStatistics(myJson.results[0].members);
    });
});


function getStatistics(members) {
    app.numberRep = members.filter(function(member) { return member.party == "R" }).length;
    app.numberDem = members.filter(function(member) { return member.party == "D" }).length;
    app.numberInd = members.filter(function(member) { return member.party == "I" }).length;
    app.numberTotal = app.numberRep + app.numberDem + app.numberInd;
    app.averageVotingRep = (members.filter(function(member) { return member.party == "R" }).map(elm => (elm.votes_with_party_pct || 0)).reduce(function(total, elm) { return total + elm }) / app.numberRep).toFixed(2);
    app.averageVotingDem = (members.filter(function(member) { return member.party == "D" }).map(elm => (elm.votes_with_party_pct || 0)).reduce(function(total, elm) { return total + elm }) / app.numberDem).toFixed(2);
    app.averageVotingInd = averageZero(members);
    app.averageVotingTotal = (members.map(elm => (elm.votes_with_party_pct || 0)).reduce(function(total, elm) { return total + elm }) / app.numberTotal).toFixed(2);
    app.leastEngaged = compareArray((members).sort(function(a, b) { return (b.missed_votes_pct || 0) - (a.missed_votes_pct || 0) }));
    app.mostEngaged = compareArray((members).sort(function(a, b) { return (a.missed_votes_pct || 100) - (b.missed_votes_pct || 100) }));
    app.leastLoyal = compareLoyal((members).sort(function(a, b) { return (a.votes_with_party_pct || 100) - (b.votes_with_party_pct || 100) }));
    app.mostLoyal = compareLoyal((members).sort(function(a, b) { return (b.votes_with_party_pct || 0) - (a.votes_with_party_pct || 0) }));
};

function averageZero(elm) {
    if (app.numberInd == 0) {
        return 0
    } else {
        return (elm.filter(function(member) { return member.party == "I" }).map(elm => (elm.votes_with_party_pct || 0)).reduce(function(total, elm) { return total + elm }) / app.numberInd).toFixed(2);
    };
};


function compareArray(elm) {
    var tenPercent = Math.round(app.numberTotal * 0.1);
    var array = elm.slice(0, tenPercent);
    for (i = tenPercent; i < elm.length; i++)
        if (elm[tenPercent - 1].missed_votes_pct == elm[i].missed_votes_pct)
            array.push(elm[i]);
    return array;
};


function compareLoyal(elm) {
    var tenPercent = Math.round(app.numberTotal * 0.1);
    var array = elm.slice(0, tenPercent);
    for (i = tenPercent; i < elm.length; i++)
        if (elm[tenPercent - 1].votes_with_party_pct == elm[i].votes_with_party_pct)
            array.push(elm[i]);
    return array;
};