module.exports = {
    getTotalVotes : getTotalVotes
}

function getTotalVotes(cuisines) {
    var totalVotes = 0;

    for(var i = 0; i < cuisines.length; i++) {
        totalVotes += cuisines[i].votes;
    }

    return totalVotes;
}