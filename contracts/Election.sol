pragma solidity 0.5.12;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    event votedEvent (
        uint indexed _candidateId
    );

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    uint public candidatesCount;

    constructor() public {
        addCandidate("aash");
        addCandidate("viraj");
    }

    function addCandidate(string memory name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote(uint _candidateId) public{
        require(!voters[msg.sender], "something is wrong");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "something is again wrong");

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount ++;

        emit votedEvent(_candidateId);
        // Election.deployed().then(function(instance){app=instance})
        // app.vote(1, {from: accounts[0]})
    }

}
