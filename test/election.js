var Election = artifacts.require("./Election.sol")

contract("Election", function(accounts){
    var electionInstance;

    it("initializes with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    it("initializer candidates with correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "contains the correct id")
            assert.equal(candidate[1], "aash", "contains the correct name")
            assert.equal(candidate[2], 0, "contains the correct voters count")
            return electionInstance.candidates(2)
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "contains the correct id")
            assert.equal(candidate[1], "viraj", "contains the correct name")
            assert.equal(candidate[2], 0, "contains the correct voters count")
        });
    });

    it("allows voter to cast a vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert.equal(voted, true, "the voter has been marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "Increments the candidates' votecount")
        })
    })

    it("throws an exception for invalid candidates", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
      });

      it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 2;
          electionInstance.vote(candidateId, { from: accounts[1] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
      });

    // it("throws and exception for invalid candidates", function(){
    //     return Election.deployed().then(function(instance){
    //         electionInstance = instance
    //         return electionInstance.vote(99, {from: accounts[0]})
    //     }).then(assert.fail).catch(function(error){
    //         assert.equal(error.message.indexOf('revert') >= 0, true, "error message must include revert")
    //         var voted_voter = electionInstance.voters(accounts[1])
    //         assert.equal(voted_voter, false, "dd")
    //         return electionInstance.vote(1, {from: accounts[1]})
    //     }).then(function(receipt){
    //         voted_voter = electionInstance.voters(accounts[1])
    //         assert(voted_voter, true, "He should have voted")
    //     })
    //     // then(function(receipt){
    //     //     return electionInstance.vote(2, {from: accounts[0]})
    //     // }).then(assert.fail).catch(function(error){
    //     //     assert.equal(error.message.indexOf('revert') >= 0, true, "error message must include revert")
    //     // })
    // })
});
