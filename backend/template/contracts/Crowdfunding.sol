// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/zContract.sol";
import "@zetachain/toolkit/contracts/OnlySystem.sol";

contract Crowdfunding is zContract, OnlySystem {

    SystemContract public systemContract;

    struct Campaign {
        uint8 id;                // Campaign ID
        address payable admin;   // Campaign admin
        string name;             // Campaign name
        string[] tags;           // Campaign tags
        uint64 amount_required;  // Amount required for the campaign
        bool donation_complete;  // Is the donation complete?
        string description;      // Campaign description
        uint64 amount_donated;   // Amount donated so far
    }

    struct UserProfile {
        address userAddress;
        string username;
        string email;
        string bio;
        string[] socialLinks;
    }

    mapping(uint8 => Campaign) public campaigns;
    uint8 public campaignCount;
    uint256 public userCount;
    mapping(uint8 => mapping(address => uint64)) public pledgedAmount;
    mapping(address => uint8[]) public userCampaigns;
    mapping(address => UserProfile) public userProfiles;
    address[] public userAddresses;


     event Launch(uint8 id, address indexed admin, string name, string description, uint64 amount_required, string[] tags);
    event Pledge(uint8 indexed id, address indexed pledger, uint64 amount);
    event Unpledge(uint8 indexed id, address indexed pledger, uint64 amount);
    event Claim(uint8 id);
    event Refund(uint8 id, address indexed pledger, uint64 amount);
    event UserProfileUpdated(address indexed userAddress, string username, string email, string bio, string[] socialLinks);

    constructor(address systemContractAddress) {
        systemContract = SystemContract(systemContractAddress);
    }
    

    function create(string memory name, string memory description, uint64 amount_required, string[] memory tags) external {
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            admin: payable(msg.sender),
            name: name,
            tags: tags,
            amount_required: amount_required,
            donation_complete: false,
            description: description,
            amount_donated: 0
        });
        userCampaigns[msg.sender].push(campaignCount);

        emit Launch(campaignCount, msg.sender, name, description, amount_required, tags);
    }

    // Function to pledge funds to a campaign
    function donate(uint8 id) external payable {
        Campaign storage campaign = campaigns[id];
        require(!campaign.donation_complete, "donation complete");

        campaign.amount_donated += uint64(msg.value);
        pledgedAmount[id][msg.sender] += uint64(msg.value);

        emit Pledge(id, msg.sender, uint64(msg.value));
    }

    // Get all campaigns
    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint8 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        return allCampaigns;
    }

    // Get a specific campaign
    function getCampaign(uint8 campaignId) external view returns (Campaign memory) {
        require(campaignId > 0 && campaignId <= campaignCount, "Campaign does not exist");
        return campaigns[campaignId];
    }

    // // Get campaigns by user
    // function getUserCampaigns(address user) external view returns (Campaign[] memory) {
    //     uint8[] memory userCampaignIds = userCampaigns[user];
    //     Campaign[] memory userCampaignsList = new Campaign[](userCampaignIds.length);

    //     for (uint256 i = 0; i < userCampaignIds.length; i++) {
    //         userCampaignsList[i] = campaigns[userCampaigns[i]];
    //     }

    //     return userCampaignsList;
    // }

     // Manage user profile
    function updateUserProfile(
        string memory username,
        string memory email,
        string memory bio,
        string[] memory socialLinks
    ) external {
        if (userProfiles[msg.sender].userAddress == address(0)) {
            userCount++;
            userAddresses.push(msg.sender);
        }

        userProfiles[msg.sender] = UserProfile({
            userAddress: msg.sender,
            username: username,
            email: email,
            bio: bio,
            socialLinks: socialLinks
        });

        emit UserProfileUpdated(msg.sender, username, email, bio, socialLinks);
    }

    // Get a specific user profile
    function getUserProfile(address userAddress) external view returns (UserProfile memory) {
        require(userProfiles[userAddress].userAddress != address(0), "User does not exist");
        return userProfiles[userAddress];
    }

    // Get all users
    function getAllUsers() external view returns (UserProfile[] memory) {
        UserProfile[] memory allUsers = new UserProfile[](userCount);
        for (uint256 i = 0; i < userCount; i++) {
            allUsers[i] = userProfiles[userAddresses[i]];
        }
        return allUsers;
    }

    // Function for the campaign admin to claim the funds if the goal is met
    function claim(uint8 id) external {
        Campaign storage campaign = campaigns[id];
        require(msg.sender == campaign.admin, "not admin");
        require(campaign.amount_donated >= campaign.amount_required, "donated < required");
        require(!campaign.donation_complete, "donation complete");

        campaign.donation_complete = true;
        campaign.admin.transfer(campaign.amount_donated);

        emit Claim(id);
    }


    function onCrossChainCall(
        zContext calldata context,
        address zrc20,
        uint256 amount,
        bytes calldata message
    ) external virtual override onlySystem(systemContract) {
        // TODO: implement the logic
    }
}
